using System.ComponentModel.DataAnnotations;
using PulseDesk.Core.Enums;

namespace PulseDesk.Core.DTOs;

public class UpdateTicketDto
{
    [Required]
    [StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public TicketPriority Priority { get; set; }

    [Required]
    public TicketStatus Status { get; set; }

    [EmailAddress]
    public string? AssignedAgentEmail { get; set; }
}
