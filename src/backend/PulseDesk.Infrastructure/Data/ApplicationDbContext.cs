using Microsoft.EntityFrameworkCore;
using PulseDesk.Core.Entities;

namespace PulseDesk.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Ticket> Tickets => Set<Ticket>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(t => t.Id);

            entity.Property(t => t.Title)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(t => t.Description)
                .IsRequired()
                .HasMaxLength(2000);

            entity.Property(t => t.RequesterEmail)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(t => t.AssignedAgentEmail)
                .HasMaxLength(150);

            entity.Property(t => t.Priority)
                .IsRequired();

            entity.Property(t => t.Status)
                .IsRequired();
        });
    }
}
