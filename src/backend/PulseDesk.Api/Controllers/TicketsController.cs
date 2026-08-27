using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PulseDesk.Core.DTOs;
using PulseDesk.Core.Entities;
using PulseDesk.Core.Enums;
using PulseDesk.Infrastructure.Data;

namespace PulseDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TicketsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TicketResponseDto>>> GetAll(
        [FromQuery] TicketStatus? status,
        [FromQuery] TicketPriority? priority)
    {
        var query = _context.Tickets.AsNoTracking().AsQueryable();

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        if (priority.HasValue)
            query = query.Where(t => t.Priority == priority.Value);

        var tickets = await query
            .OrderByDescending(t => t.CreatedAtUtc)
            .Select(t => new TicketResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority,
                Status = t.Status,
                RequesterEmail = t.RequesterEmail,
                AssignedAgentEmail = t.AssignedAgentEmail,
                CreatedAtUtc = t.CreatedAtUtc,
                SlaDeadlineUtc = t.SlaDeadlineUtc,
                ResolvedAtUtc = t.ResolvedAtUtc
            })
            .ToListAsync();

        return Ok(tickets);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TicketResponseDto>> GetById(Guid id)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null)
            return NotFound(new { message = $"Ticket con ID {id} no fue encontrado." });

        return Ok(MapToResponseDto(ticket));
    }

    [HttpPost]
    public async Task<ActionResult<TicketResponseDto>> Create([FromBody] CreateTicketDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var now = DateTime.UtcNow;
        var ticket = new Ticket
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            Status = TicketStatus.Open,
            RequesterEmail = dto.RequesterEmail,
            CreatedAtUtc = now,
            SlaDeadlineUtc = CalculateSlaDeadline(dto.Priority, now)
        };

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = ticket.Id }, MapToResponseDto(ticket));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTicketDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null)
            return NotFound(new { message = $"Ticket con ID {id} no fue encontrado." });

        ticket.Title = dto.Title;
        ticket.Description = dto.Description;
        ticket.Priority = dto.Priority;
        ticket.AssignedAgentEmail = dto.AssignedAgentEmail;

        if ((dto.Status == TicketStatus.Resolved || dto.Status == TicketStatus.Closed) 
            && ticket.Status != dto.Status)
        {
            ticket.ResolvedAtUtc = DateTime.UtcNow;
        }
        else if (dto.Status != TicketStatus.Resolved && dto.Status != TicketStatus.Closed)
        {
            ticket.ResolvedAtUtc = null;
        }

        ticket.Status = dto.Status;

        await _context.SaveChangesAsync();
        return Ok(MapToResponseDto(ticket));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null)
            return NotFound(new { message = $"Ticket con ID {id} no fue encontrado." });

        _context.Tickets.Remove(ticket);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static DateTime CalculateSlaDeadline(TicketPriority priority, DateTime createdAt)
    {
        return priority switch
        {
            TicketPriority.Critical => createdAt.AddHours(4),
            TicketPriority.High => createdAt.AddHours(8),
            TicketPriority.Medium => createdAt.AddHours(24),
            TicketPriority.Low => createdAt.AddHours(48),
            _ => createdAt.AddHours(24)
        };
    }

    private static TicketResponseDto MapToResponseDto(Ticket ticket)
    {
        return new TicketResponseDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            Priority = ticket.Priority,
            Status = ticket.Status,
            RequesterEmail = ticket.RequesterEmail,
            AssignedAgentEmail = ticket.AssignedAgentEmail,
            CreatedAtUtc = ticket.CreatedAtUtc,
            SlaDeadlineUtc = ticket.SlaDeadlineUtc,
            ResolvedAtUtc = ticket.ResolvedAtUtc
        };
    }
}
