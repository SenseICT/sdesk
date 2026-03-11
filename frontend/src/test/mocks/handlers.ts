import { http, HttpResponse, delay } from "msw";

const API_URL = "http://localhost:8000/api/v1";

export const handlers = [
  http.post(`${API_URL}/auth/login/`, async () => {
    await delay(50);
    return HttpResponse.json({
      access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcl9pZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiZmlyc3RfbmFtZSI6IlRlc3QiLCJsYXN0X25hbWUiOiJVc2VyIiwiYnVzaW5lc3MiOnsiaWQiOjEsIm5hbWUiOiJUZXN0IENvIn0sImV4cCI6OTk5OTk5OTk5OX0.test",
      sessionKey: "test-session-key",
    });
  }),

  http.post(`${API_URL}/auth/express-login/`, async () => {
    await delay(50);
    return HttpResponse.json({
      access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcl9pZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiZmlyc3RfbmFtZSI6IlRlc3QiLCJsYXN0X25hbWUiOiJVc2VyIiwiYnVzaW5lc3MiOnsiaWQiOjEsIm5hbWUiOiJUZXN0IENvIn0sImV4cCI6OTk5OTk5OTk5OX0.test",
    });
  }),

  http.post(`${API_URL}/auth/verify-otp/`, async () => {
    await delay(50);
    return HttpResponse.json({
      access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcl9pZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiZmlyc3RfbmFtZSI6IlRlc3QiLCJsYXN0X25hbWUiOiJVc2VyIiwiYnVzaW5lc3MiOnsiaWQiOjEsIm5hbWUiOiJUZXN0IENvIn0sImV4cCI6OTk5OTk5OTk5OX0.test",
    });
  }),

  http.post(`${API_URL}/auth/resend-otp/`, async () => {
    await delay(50);
    return HttpResponse.json({ success: true });
  }),

  http.post(`${API_URL}/auth/request-reset-password/`, async () => {
    await delay(50);
    return HttpResponse.json({ success: true });
  }),

  http.post(`${API_URL}/auth/reset-password/`, async () => {
    await delay(50);
    return HttpResponse.json({ success: true });
  }),

  http.post(`${API_URL}/businesses/`, async () => {
    await delay(50);
    return HttpResponse.json({
      message: "Business created successfully",
      site_url: "http://test.safaridesk.io",
    });
  }),

  http.get(`${API_URL}/users/me/`, async () => {
    await delay(50);
    return HttpResponse.json({
      id: 1,
      email: "test@example.com",
      first_name: "Test",
      last_name: "User",
      phone_number: "+254700000000",
      avatar_url: null,
    });
  }),

  http.get(`${API_URL}/tickets/`, async () => {
    await delay(50);
    return HttpResponse.json({
      results: [
        {
          id: 1,
          subject: "Test Ticket",
          description: "Test Description",
          status: "open",
          priority: "medium",
          created_at: "2024-01-01T00:00:00Z",
        },
      ],
      count: 1,
    });
  }),

  http.post(`${API_URL}/tickets/`, async () => {
    await delay(50);
    return HttpResponse.json({
      id: 2,
      subject: "New Ticket",
      description: "New Description",
      status: "open",
      priority: "medium",
    });
  }),

  http.get(`${API_URL}/tasks/`, async () => {
    await delay(50);
    return HttpResponse.json({
      results: [
        {
          id: 1,
          title: "Test Task",
          description: "Test Description",
          status: "pending",
          created_at: "2024-01-01T00:00:00Z",
        },
      ],
      count: 1,
    });
  }),
];
