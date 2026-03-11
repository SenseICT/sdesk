import { describe, it, expect, beforeEach } from "vitest";
import { useTicketStore } from "../stores/ticketStore";

describe("ticketStore", () => {
  beforeEach(() => {
    useTicketStore.setState({
      tickets: [],
      isLoading: false,
      error: null,
    });
  });

  describe("initial state", () => {
    it("should have empty tickets array", () => {
      const state = useTicketStore.getState();
      expect(state.tickets).toEqual([]);
    });

    it("should have isLoading false", () => {
      const state = useTicketStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it("should have null error", () => {
      const state = useTicketStore.getState();
      expect(state.error).toBeNull();
    });
  });

  describe("fetchTickets", () => {
    it("should fetch tickets and update state", async () => {
      const { fetchTickets } = useTicketStore.getState();
      await fetchTickets();

      const state = useTicketStore.getState();
      expect(state.tickets.length).toBeGreaterThan(0);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should set isLoading during fetch", async () => {
      const { fetchTickets } = useTicketStore.getState();
      const fetchPromise = fetchTickets();

      expect(useTicketStore.getState().isLoading).toBe(true);

      await fetchPromise;

      expect(useTicketStore.getState().isLoading).toBe(false);
    });
  });

  describe("createTicket", () => {
    it("should add a new ticket", async () => {
      const newTicket = {
        title: "New Test Ticket",
        description: "Test Description",
        priority: "high" as const,
        category: "Technical Support",
      };

      const { createTicket } = useTicketStore.getState();
      await createTicket(newTicket);

      const state = useTicketStore.getState();
      expect(state.tickets.length).toBeGreaterThan(0);
      const createdTicket = state.tickets.find((t) => t.title === "New Test Ticket");
      expect(createdTicket).toBeDefined();
      expect(createdTicket?.status).toBe("open");
    });
  });

  describe("updateTicket", () => {
    it("should update existing ticket", async () => {
      const { updateTicket, fetchTickets } = useTicketStore.getState();
      await fetchTickets();
      const tickets = useTicketStore.getState().tickets;
      const ticketId = tickets[0].id;

      await updateTicket(ticketId, {
        title: "Updated Title",
      });

      const state = useTicketStore.getState();
      const updated = state.tickets.find((t) => t.id === ticketId);
      expect(updated?.title).toBe("Updated Title");
    });
  });

  describe("deleteTicket", () => {
    it("should remove ticket from array", async () => {
      const { deleteTicket, fetchTickets } = useTicketStore.getState();
      await fetchTickets();
      const initialCount = useTicketStore.getState().tickets.length;
      const ticketId = useTicketStore.getState().tickets[0].id;

      await deleteTicket(ticketId);

      const state = useTicketStore.getState();
      expect(state.tickets.length).toBe(initialCount - 1);
      expect(state.tickets.find((t) => t.id === ticketId)).toBeUndefined();
    });
  });

  describe("assignTicket", () => {
    it("should assign ticket to user", async () => {
      const { assignTicket, fetchTickets } = useTicketStore.getState();
      await fetchTickets();
      const ticketId = useTicketStore.getState().tickets[0].id;

      await assignTicket(ticketId, "2");

      const state = useTicketStore.getState();
      const assigned = state.tickets.find((t) => t.id === ticketId);
      expect(assigned?.assigneeId).toBe("2");
      expect(assigned?.assignee).toBeDefined();
    });
  });

  describe("clearError", () => {
    it("should clear error state", () => {
      useTicketStore.setState({ error: "Something went wrong" });

      const { clearError } = useTicketStore.getState();
      clearError();

      expect(useTicketStore.getState().error).toBeNull();
    });
  });
});
