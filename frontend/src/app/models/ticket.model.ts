export enum TicketPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

export enum TicketStatus {
  Open = 1,
  InProgress = 2,
  PendingUser = 3,
  Resolved = 4,
  Closed = 5
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  requesterEmail: string;
  assignedAgentEmail?: string;
  createdAtUtc: string;
  slaDeadlineUtc?: string;
  resolvedAtUtc?: string;
  isSlaBreached: boolean;
}

export interface CreateTicketDto {
  title: string;
  description: string;
  priority: TicketPriority;
  requesterEmail: string;
}

export interface UpdateTicketDto {
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgentEmail?: string;
}
