using PulseDesk.Core.Enums;

namespace PulseDesk.Core.Entities;

public class Ticket
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TicketPriority Priority { get; set; } = TicketPriority.Medium;
    public TicketStatus Status { get; set; } = TicketStatus.Open;
    public string RequesterEmail { get; set; } = string.Empty;
    public string? AssignedAgentEmail { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? SlaDeadlineUtc { get; set; }
    public DateTime? ResolvedAtUtc { get; set; }
}
