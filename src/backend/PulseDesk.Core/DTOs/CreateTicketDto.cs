using System.ComponentModel.DataAnnotations;
using PulseDesk.Core.Enums;

namespace PulseDesk.Core.DTOs;

public class CreateTicketDto
{
    [Required(ErrorMessage = "El título es obligatorio.")]
    [StringLength(150, ErrorMessage = "El título no puede exceder los 150 caracteres.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "La descripción es obligatoria.")]
    [StringLength(2000, ErrorMessage = "La descripción no puede exceder los 2000 caracteres.")]
    public string Description { get; set; } = string.Empty;

    [Required]
    public TicketPriority Priority { get; set; } = TicketPriority.Medium;

    [Required(ErrorMessage = "El correo del solicitante es obligatorio.")]
    [EmailAddress(ErrorMessage = "Formato de correo inválido.")]
    public string RequesterEmail { get; set; } = string.Empty;
}
