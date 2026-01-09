import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../../queryKeys";
import {
  SupportTicket,
  SupportTicketComment,
  SupportTicketAttachment,
} from "../../db/schema";
import { NotificationService } from "../../services/notificationService";

// Query to get user's support tickets
export const useSupportTickets = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.support.tickets.user(userId || ""),
    queryFn: async (): Promise<SupportTicket[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("support_tickets")
        .select(
          `
          *,
          support_categories (
            id,
            name,
            icon
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

// Query to get ticket by ID
export const useSupportTicket = (id: string) => {
  return useQuery({
    queryKey: queryKeys.support.tickets.detail(id),
    queryFn: async (): Promise<SupportTicket | null> => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select(
          `
          *,
          support_categories (
            id,
            name,
            icon
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Query to get ticket comments
export const useTicketComments = (ticketId: string) => {
  return useQuery({
    queryKey: queryKeys.support.tickets.comments(ticketId),
    queryFn: async (): Promise<SupportTicketComment[]> => {
      const { data, error } = await supabase
        .from("support_ticket_comments")
        .select(
          `
          *,
          users (
            id,
            display_name,
            email,
            role
          )
        `
        )
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!ticketId,
  });
};

// Query to get ticket attachments
export const useTicketAttachments = (ticketId: string) => {
  return useQuery({
    queryKey: queryKeys.support.tickets.attachments(ticketId),
    queryFn: async (): Promise<SupportTicketAttachment[]> => {
      const { data, error } = await supabase
        .from("support_ticket_attachments")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!ticketId,
  });
};

// Mutation to create a new support ticket
export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticket: {
      subject: string;
      description: string;
      category_id?: string;
      priority?: "low" | "normal" | "high" | "urgent";
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user.id,
          subject: ticket.subject,
          description: ticket.description,
          category_id: ticket.category_id,
          priority: ticket.priority || "normal",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newTicket) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.tickets.user(newTicket.user_id),
      });

      // Send ticket created notification
      NotificationService.sendTicketCreatedNotification(
        newTicket.id,
        newTicket.subject,
        newTicket.priority,
        newTicket.user_id
      );
    },
  });
};

// Mutation to add comment to ticket
export const useAddTicketComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      content,
      isInternal = false,
    }: {
      ticketId: string;
      content: string;
      isInternal?: boolean;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Get ticket info for notification
      const { data: ticket, error: ticketError } = await supabase
        .from("support_tickets")
        .select("subject, user_id, assigned_to")
        .eq("id", ticketId)
        .single();

      if (ticketError) throw ticketError;

      const { data, error } = await supabase
        .from("support_ticket_comments")
        .insert({
          ticket_id: ticketId,
          user_id: user.id,
          content,
          is_internal: isInternal,
        })
        .select()
        .single();

      if (error) throw error;

      // Update ticket's last_reply_at timestamp
      await supabase
        .from("support_tickets")
        .update({ last_reply_at: new Date().toISOString() })
        .eq("id", ticketId);

      return { comment: data, ticket };
    },
    onSuccess: (result, variables) => {
      const { comment, ticket } = result;

      queryClient.invalidateQueries({
        queryKey: queryKeys.support.tickets.comments(variables.ticketId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.tickets.detail(variables.ticketId),
      });

      // Determine recipient and send notification
      const isAdminComment = comment.user_id !== ticket.user_id; // Assuming admin user IDs are different
      const recipientId = isAdminComment
        ? ticket.user_id
        : ticket.assigned_to || ticket.user_id;

      if (recipientId && recipientId !== comment.user_id) {
        NotificationService.sendTicketCommentNotification(
          variables.ticketId,
          comment.id,
          ticket.subject,
          comment.user_id,
          recipientId,
          isAdminComment
        );
      }
    },
  });
};

// Mutation to upload attachment to ticket
export const useUploadTicketAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      file,
      filename,
    }: {
      ticketId: string;
      file: File;
      filename: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `support-tickets/${ticketId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("support-ticket-attachments")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create attachment record
      const { data, error } = await supabase
        .from("support_ticket_attachments")
        .insert({
          ticket_id: ticketId,
          filename,
          original_filename: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.tickets.attachments(ticketId),
      });
    },
  });
};

// Admin mutations for ticket management
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      status,
      resolution,
    }: {
      ticketId: string;
      status: string;
      resolution?: string;
    }) => {
      // First get the current ticket to capture old status
      const { data: currentTicket, error: fetchError } = await supabase
        .from("support_tickets")
        .select("status, subject, user_id")
        .eq("id", ticketId)
        .single();

      if (fetchError) throw fetchError;

      const updates: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === "resolved") {
        updates.resolved_at = new Date().toISOString();
        if (resolution) updates.resolution = resolution;
      }

      const { data, error } = await supabase
        .from("support_tickets")
        .update(updates)
        .eq("id", ticketId)
        .select()
        .single();

      if (error) throw error;
      return { ...data, oldStatus: currentTicket.status };
    },
    onSuccess: (result, variables) => {
      const { oldStatus, ...updatedTicket } = result;

      queryClient.invalidateQueries({
        queryKey: queryKeys.support.tickets.detail(updatedTicket.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.tickets.user(updatedTicket.user_id),
      });

      // Send status change notification if status actually changed
      if (variables.status !== oldStatus) {
        NotificationService.sendTicketStatusNotification(
          updatedTicket.id,
          updatedTicket.subject,
          variables.status,
          oldStatus,
          updatedTicket.user_id
        );
      }
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      assignedTo,
    }: {
      ticketId: string;
      assignedTo: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("support_tickets")
        .update({
          assigned_to: assignedTo,
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId)
        .select()
        .single();

      if (error) throw error;
      return { ticket: data, assignedBy: user.id };
    },
    onSuccess: (result) => {
      const { ticket, assignedBy } = result;

      queryClient.invalidateQueries({
        queryKey: queryKeys.support.tickets.detail(ticket.id),
      });

      // Send assignment notification
      NotificationService.sendTicketAssignedNotification(
        ticket.id,
        ticket.subject,
        ticket.assigned_to,
        assignedBy
      );
    },
  });
};
