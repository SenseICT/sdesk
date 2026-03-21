from __future__ import annotations

from types import SimpleNamespace
from unittest import mock
from decimal import Decimal
from datetime import datetime, timedelta

from django.test import SimpleTestCase, TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone

from tenant.serializers.MailValidationSerializer import (
    MailCredentialValidationSerializer,
)
from tenant.services.ai.intent_analyzer import IntentAnalyzer
from tenant.services.ai.context_builder import ContextBuilder
from util.mail.oauth import sign_oauth_state, verify_oauth_state
from util.mail.ingestion import MailIntegrationIngestionService

User = get_user_model()


class EmbeddingServiceTests(SimpleTestCase):
    @mock.patch("tenant.services.ai.embedding_service.genai.configure")
    @mock.patch("tenant.services.ai.embedding_service.genai.embed_content")
    def test_embed_text_returns_vector(self, mock_embed, mock_configure):
        mock_embed.return_value = {"embedding": [0.1, 0.2, 0.3]}

        def fake_config(key, default=None, cast=None, **kwargs):
            overrides = {
                "GEMINI_API_KEY": "local-test-key",
                "EMBEDDING_MODEL": "gemini-embedding-001",
                "EMBEDDING_OUTPUT_DIM": 1536,
            }
            return overrides.get(key, default)

        with mock.patch(
            "tenant.services.ai.embedding_service.config", side_effect=fake_config
        ):
            from tenant.services.ai.embedding_service import EmbeddingService

            service = EmbeddingService()
            vector = service._embed_text("Hello world")

        self.assertEqual(vector, [0.1, 0.2, 0.3])
        mock_configure.assert_called_once_with(api_key="local-test-key")


class AIPipelineSmokeTests(SimpleTestCase):
    def test_intent_analyzer_returns_valid_structure(self):
        """Intent analyzer should return intent, confidence, and entities."""
        analyzer = IntentAnalyzer()
        result = analyzer.analyze("Hi team, please create a ticket for broken Wi-Fi")

        self.assertIn("intent", result)
        self.assertIn("confidence", result)
        self.assertIn("entities", result)
        self.assertIsInstance(result["confidence"], float)

    def test_context_builder_produces_prompts(self):
        """Context builder should produce system and user prompts."""
        builder = ContextBuilder()

        system_prompt = builder.build_system_prompt()
        self.assertIn("support agent", system_prompt.lower())

        user_prompt = builder.build_user_prompt(
            message="Help me with my internet",
            kb_results=[{"title": "Wi-Fi Fix", "content": "Restart router"}],
            history=[{"role": "user", "content": "Hello"}],
        )
        self.assertIn("Help me with my internet", user_prompt)
        self.assertIn("Wi-Fi Fix", user_prompt)


class MailOAuthUtilsTests(SimpleTestCase):
    def test_state_round_trip(self):
        payload = {"integration_id": 7, "provider": "google"}
        state = sign_oauth_state(payload)
        decoded = verify_oauth_state(state)
        self.assertEqual(decoded["integration_id"], 7)
        self.assertEqual(decoded["provider"], "google")

    def test_invalid_state_returns_none(self):
        result = verify_oauth_state("invalid-state-string")
        self.assertIsNone(result)

    def test_malformed_state_returns_none(self):
        result = verify_oauth_state("not-a-valid-base64-signature!!!")
        self.assertIsNone(result)


class MailValidationSerializerTests(SimpleTestCase):
    def test_requires_imap_or_smtp(self):
        serializer = MailCredentialValidationSerializer(data={})
        self.assertFalse(serializer.is_valid())
        self.assertIn("non_field_errors", serializer.errors)

    def test_accepts_imap_only(self):
        serializer = MailCredentialValidationSerializer(
            data={
                "imap_host": "imap.example.com",
                "imap_username": "user",
                "imap_password": "pass",
            }
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_accepts_smtp_only(self):
        serializer = MailCredentialValidationSerializer(
            data={
                "smtp_host": "smtp.example.com",
                "smtp_username": "user",
                "smtp_password": "pass",
            }
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_validates_port_range(self):
        serializer = MailCredentialValidationSerializer(
            data={
                "imap_host": "imap.example.com",
                "imap_username": "user",
                "imap_password": "pass",
                "imap_port": 99999,
            }
        )
        self.assertFalse(serializer.is_valid())


class MailIngestionHelpersTests(SimpleTestCase):
    def test_extract_ticket_code(self):
        code = MailIntegrationIngestionService._extract_ticket_code(
            "Re: [#INC123AB] Issue"
        )
        self.assertEqual(code, "INC123AB")

    def test_extract_ticket_code_no_match(self):
        code = MailIntegrationIngestionService._extract_ticket_code(
            "Regular subject line"
        )
        self.assertIsNone(code)

    def test_extract_message_ids(self):
        header = "<abc@example.com> <def@example.com>"
        ids = list(MailIntegrationIngestionService._extract_message_ids(header))
        self.assertEqual(ids, ["<abc@example.com>", "<def@example.com>"])


class IntentAnalyzerTests(SimpleTestCase):
    def setUp(self):
        self.analyzer = IntentAnalyzer()

    def test_detect_create_ticket_intent(self):
        result = self.analyzer.analyze("I'm having an issue with my laptop")
        self.assertEqual(result["intent"], "create_ticket")

    def test_detect_greeting_intent(self):
        result = self.analyzer.analyze("Hello there!")
        self.assertEqual(result["intent"], "greeting")

    def test_detect_search_kb_intent(self):
        result = self.analyzer.analyze("How to configure email?")
        self.assertEqual(result["intent"], "search_kb")

    def test_detect_general_question_intent(self):
        result = self.analyzer.analyze("What are your business hours?")
        self.assertEqual(result["intent"], "general_question")

    def test_empty_input_returns_general_question(self):
        result = self.analyzer.analyze("")
        self.assertEqual(result["intent"], "general_question")
        self.assertEqual(result["confidence"], 0.0)

    def test_broken_infrastructure_triggers_create_ticket(self):
        result = self.analyzer.analyze("The server is broken and not working")
        self.assertEqual(result["intent"], "create_ticket")


class ContextBuilderTests(SimpleTestCase):
    def setUp(self):
        self.builder = ContextBuilder()

    def test_build_system_prompt_contains_role(self):
        prompt = self.builder.build_system_prompt()
        self.assertIn("support agent", prompt.lower())

    def test_build_user_prompt_includes_message(self):
        prompt = self.builder.build_user_prompt(
            message="Test message", kb_results=[], history=[]
        )
        self.assertIn("Test message", prompt)

    def test_build_user_prompt_includes_kb_results(self):
        kb_results = [{"title": "Test Article", "content": "Test content"}]
        prompt = self.builder.build_user_prompt(
            message="Help", kb_results=kb_results, history=[]
        )
        self.assertIn("Test Article", prompt)
        self.assertIn("Test content", prompt)

    def test_build_user_prompt_includes_history(self):
        history = [{"role": "user", "content": "Previous message"}]
        prompt = self.builder.build_user_prompt(
            message="New message", kb_results=[], history=history
        )
        self.assertIn("Previous message", prompt)

    def test_build_messages_returns_list(self):
        messages = self.builder.build_messages(
            history=[{"role": "user", "content": "Hi"}],
            user_message="Help me",
            kb_results=[],
        )
        self.assertIsInstance(messages, list)
        self.assertTrue(len(messages) > 0)
