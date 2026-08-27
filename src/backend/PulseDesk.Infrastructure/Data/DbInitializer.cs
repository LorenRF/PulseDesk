using Microsoft.EntityFrameworkCore;
using PulseDesk.Core.Entities;
using PulseDesk.Core.Enums;

namespace PulseDesk.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        var now = DateTime.UtcNow;

        var sampleTickets = new List<Ticket>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Caída de servicio de autenticación LDAP / Active Directory",
                Description = "Los usuarios de la sucursal principal no pueden iniciar sesión en sus estaciones de trabajo ni acceder a carpetas compartidas.",
                Priority = TicketPriority.Critical,
                Status = TicketStatus.Open,
                RequesterEmail = "soporte.infra@empresa.com",
                AssignedAgentEmail = "LorenRF",
                CreatedAtUtc = now.AddHours(-6),
                SlaDeadlineUtc = now.AddHours(-2), // Vencido a propósito
                ResolvedAtUtc = null
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Lentitud crítica en módulo de transacciones y facturación ERP",
                Description = "Se reportan timeouts recurrentes de más de 30 segundos al procesar órdenes de compra en la base de datos principal.",
                Priority = TicketPriority.High,
                Status = TicketStatus.InProgress,
                RequesterEmail = "operaciones@empresa.com",
                AssignedAgentEmail = "LorenRF",
                CreatedAtUtc = now.AddHours(-10),
                SlaDeadlineUtc = now.AddHours(-2), // Vencido
                ResolvedAtUtc = null
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Falla de conectividad en túnel VPN - Personal remoto",
                Description = "Colaboradores en modalidad remota reportan desconexiones continuas cada 10 minutos al usar el cliente FortiClient.",
                Priority = TicketPriority.High,
                Status = TicketStatus.InProgress,
                RequesterEmail = "carlos.mendoza@empresa.com",
                AssignedAgentEmail = "LorenRF",
                CreatedAtUtc = now.AddHours(-3),
                SlaDeadlineUtc = now.AddHours(5),
                ResolvedAtUtc = null
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Solicitud de aprovisionamiento de permisos de lectura en SQL Server",
                Description = "Se requiere acceso de solo lectura (db_datareader) en la base de datos de auditoría para el equipo de BI.",
                Priority = TicketPriority.Medium,
                Status = TicketStatus.PendingUser,
                RequesterEmail = "analitica.bi@empresa.com",
                AssignedAgentEmail = null,
                CreatedAtUtc = now.AddHours(-5),
                SlaDeadlineUtc = now.AddHours(19),
                ResolvedAtUtc = null
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Reemplazo de cargador y batería inflada para laptop Dell Latitude",
                Description = "El equipo de trabajo presenta batería hinchada y el trackpad no responde adecuadamente por la presión.",
                Priority = TicketPriority.Low,
                Status = TicketStatus.Open,
                RequesterEmail = "rrhh.asistente@empresa.com",
                AssignedAgentEmail = null,
                CreatedAtUtc = now.AddHours(-2),
                SlaDeadlineUtc = now.AddHours(46),
                ResolvedAtUtc = null
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Desbloqueo de credenciales de correo corporativo",
                Description = "Usuario bloqueado tras 3 intentos fallidos de inicio de sesión.",
                Priority = TicketPriority.Low,
                Status = TicketStatus.Resolved,
                RequesterEmail = "finanzas.director@empresa.com",
                AssignedAgentEmail = "LorenRF",
                CreatedAtUtc = now.AddDays(-1),
                SlaDeadlineUtc = now.AddHours(24),
                ResolvedAtUtc = now.AddHours(-23)
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Error 500 al exportar reportes contables a formato Excel",
                Description = "El backend arrojaba OutOfMemoryException con archivos de más de 50,000 filas. Se optimizó con streaming IAsyncEnumerable.",
                Priority = TicketPriority.Medium,
                Status = TicketStatus.Closed,
                RequesterEmail = "contabilidad@empresa.com",
                AssignedAgentEmail = "LorenRF",
                CreatedAtUtc = now.AddDays(-3),
                SlaDeadlineUtc = now.AddDays(-2),
                ResolvedAtUtc = now.AddDays(-2).AddHours(4)
            }
        };

        // Obtenemos los títulos que ya existen para no duplicar si reinicias la app
        var existingTitles = await context.Tickets.Select(t => t.Title).ToListAsync();
        var ticketsToInsert = sampleTickets.Where(t => !existingTitles.Contains(t.Title)).ToList();

        if (ticketsToInsert.Count > 0)
        {
            await context.Tickets.AddRangeAsync(ticketsToInsert);
            await context.SaveChangesAsync();
        }
    }
}
