using PulseDesk.Core.Enums;

namespace PulseDesk.Core.DTOs;

public class TicketResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TicketPriority Priority { get; set; }
    public TicketStatus Status { get; set; }
    public string RequesterEmail { get; set; } = string.Empty;
    public string? AssignedAgentEmail { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? SlaDeadlineUtc { get; set; }
    public DateTime? ResolvedAtUtc { get; set; }
    public bool IsSlaBreached => SlaDeadlineUtc.HasValue 
        && Status != TicketStatus.Resolved 
        && Status != TicketStatus.Closed 
        && DateTime.UtcNow > SlaDeadlineUtc.Value;
}
