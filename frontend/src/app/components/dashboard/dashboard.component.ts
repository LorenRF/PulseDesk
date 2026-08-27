import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket, TicketPriority, TicketStatus, CreateTicketDto } from '../../models/ticket.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      
      <!-- Panel de Métricas Rápidas -->
      <section class="metrics-grid">
        <div class="metric-card">
          <h4>Total Tickets</h4>
          <span class="metric-number">{{ tickets.length }}</span>
        </div>
        <div class="metric-card alert">
          <h4>SLA Vencidos</h4>
          <span class="metric-number text-danger">{{ breachedSlaCount }}</span>
        </div>
        <div class="metric-card">
          <h4>En Progreso</h4>
          <span class="metric-number text-warning">{{ inProgressCount }}</span>
        </div>
        <div class="metric-card">
          <h4>Resueltos</h4>
          <span class="metric-number text-success">{{ resolvedCount }}</span>
        </div>
      </section>

      <!-- Barra de Filtros y Creación -->
      <section class="action-bar">
        <div class="filter-controls">
          <select [(ngModel)]="selectedStatus" (change)="loadTickets()" class="custom-select">
            <option [ngValue]="null">Todos los Estados</option>
            <option [ngValue]="TicketStatus.Open">Abierto</option>
            <option [ngValue]="TicketStatus.InProgress">En Progreso</option>
            <option [ngValue]="TicketStatus.PendingUser">Pendiente Usuario</option>
            <option [ngValue]="TicketStatus.Resolved">Resuelto</option>
            <option [ngValue]="TicketStatus.Closed">Cerrado</option>
          </select>

          <select [(ngModel)]="selectedPriority" (change)="loadTickets()" class="custom-select">
            <option [ngValue]="null">Todas las Prioridades</option>
            <option [ngValue]="TicketPriority.Low">Baja</option>
            <option [ngValue]="TicketPriority.Medium">Media</option>
            <option [ngValue]="TicketPriority.High">Alta</option>
            <option [ngValue]="TicketPriority.Critical">Crítica</option>
          </select>
        </div>

        <button class="btn btn-primary" (click)="openCreateModal()">
          + Nuevo Ticket
        </button>
      </section>

      <!-- Tabla de Tickets -->
      <section class="table-card">
        <div *ngIf="loading" class="loading-state">Cargando tickets...</div>
        
        <table *ngIf="!loading && tickets.length > 0" class="tickets-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Solicitante</th>
              <th>Vencimiento SLA</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of tickets">
              <td>
                <div class="ticket-title">{{ t.title }}</div>
                <small class="ticket-desc">{{ t.description }}</small>
              </td>
              <td>
                <span [ngClass]="getPriorityBadgeClass(t.priority)" class="badge">
                  {{ getPriorityLabel(t.priority) }}
                </span>
              </td>
              <td>
                <span [ngClass]="getStatusBadgeClass(t.status)" class="badge">
                  {{ getStatusLabel(t.status) }}
                </span>
              </td>
              <td>
                <span class="requester-text">{{ t.requesterEmail }}</span>
              </td>
              <td>
                <div class="sla-col">
                  <span>{{ t.slaDeadlineUtc | date:'short' }}</span>
                  <span *ngIf="t.isSlaBreached" class="sla-breach-badge">¡SLA VENCIDO!</span>
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button *ngIf="t.status !== TicketStatus.Resolved && t.status !== TicketStatus.Closed" 
                          (click)="quickResolve(t)" 
                          class="btn btn-sm btn-secondary" 
                          title="Marcar como Resuelto">
                    ✓ Resolver
                  </button>
                  <button (click)="deleteTicket(t.id)" 
                          class="btn btn-sm btn-danger" 
                          title="Eliminar">
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="!loading && tickets.length === 0" class="empty-state">
          No hay tickets registrados con los filtros seleccionados.
        </div>
      </section>

      <!-- Modal de Creación de Ticket -->
      <div *ngIf="showModal" class="modal-backdrop">
        <div class="modal-box">
          <h3>Crear Nuevo Incidente</h3>
          <form (ngSubmit)="submitCreateTicket()">
            <div class="form-group">
              <label>Título del Incidente</label>
              <input type="text" [(ngModel)]="newTicket.title" name="title" required placeholder="Ej: Falla en VPN corporativa" class="form-control" />
            </div>

            <div class="form-group">
              <label>Descripción detallada</label>
              <textarea [(ngModel)]="newTicket.description" name="description" required rows="3" placeholder="Detalle los síntomas del problema..." class="form-control"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Prioridad</label>
                <select [(ngModel)]="newTicket.priority" name="priority" class="form-control">
                  <option [ngValue]="TicketPriority.Low">Baja (48h)</option>
                  <option [ngValue]="TicketPriority.Medium">Media (24h)</option>
                  <option [ngValue]="TicketPriority.High">Alta (8h)</option>
                  <option [ngValue]="TicketPriority.Critical">Crítica (4h)</option>
                </select>
              </div>

              <div class="form-group">
                <label>Correo del Solicitante</label>
                <input type="email" [(ngModel)]="newTicket.requesterEmail" name="requesterEmail" required placeholder="usuario@empresa.com" class="form-control" />
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeCreateModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary">Registrar Ticket</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .metric-card {
      background-color: #1e293b;
      padding: 1.25rem;
      border-radius: 12px;
      border: 1px solid #334155;
    }
    .metric-card h4 {
      color: #94a3b8;
      font-size: 0.85rem;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .metric-number {
      font-size: 2rem;
      font-weight: 700;
      color: #f8fafc;
    }
    .text-danger { color: #ef4444; }
    .text-warning { color: #f59e0b; }
    .text-success { color: #10b981; }

    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .filter-controls {
      display: flex;
      gap: 1rem;
    }
    .custom-select {
      background-color: #1e293b;
      color: #f8fafc;
      border: 1px solid #334155;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
    }

    .table-card {
      background-color: #1e293b;
      border-radius: 12px;
      border: 1px solid #334155;
      overflow-x: auto;
    }
    .tickets-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .tickets-table th {
      background-color: #0f172a;
      padding: 1rem;
      color: #94a3b8;
      font-size: 0.85rem;
      text-transform: uppercase;
    }
    .tickets-table td {
      padding: 1rem;
      border-bottom: 1px solid #334155;
      vertical-align: middle;
    }
    .ticket-title {
      font-weight: 600;
      color: #f8fafc;
    }
    .ticket-desc {
      color: #94a3b8;
      display: block;
      max-width: 350px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .badge {
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      display: inline-block;
    }
    .badge-open { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid #3b82f6; }
    .badge-progress { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid #f59e0b; }
    .badge-pending { background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid #a855f7; }
    .badge-resolved { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #10b981; }
    .badge-closed { background: rgba(100, 116, 139, 0.2); color: #94a3b8; border: 1px solid #64748b; }

    .badge-low { background: #064e3b; color: #6ee7b7; }
    .badge-med { background: #0c4a6e; color: #7dd3fc; }
    .badge-high { background: #7c2d12; color: #fdba74; }
    .badge-crit { background: #7f1d1d; color: #fca5a5; }

    .sla-col {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      font-size: 0.85rem;
    }
    .sla-breach-badge {
      background-color: #ef4444;
      color: white;
      font-size: 0.65rem;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-weight: bold;
      width: fit-content;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    .requester-text {
      color: #94a3b8;
      font-size: 0.85rem;
    }
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    .loading-state, .empty-state {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }

    /* Estilos del Modal */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-box {
      background: #1e293b;
      padding: 2rem;
      border-radius: 12px;
      width: 100%;
      max-width: 500px;
      border: 1px solid #334155;
    }
    .modal-box h3 {
      margin-bottom: 1.5rem;
      color: #f8fafc;
    }
    .form-group {
      margin-bottom: 1.2rem;
    }
    .form-group label {
      display: block;
      font-size: 0.85rem;
      color: #cbd5e1;
      margin-bottom: 0.4rem;
    }
    .form-control {
      width: 100%;
      padding: 0.6rem;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      color: #fff;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly ticketService = inject(TicketService);

  tickets: Ticket[] = [];
  loading = false;
  showModal = false;

  TicketStatus = TicketStatus;
  TicketPriority = TicketPriority;

  selectedStatus: TicketStatus | null = null;
  selectedPriority: TicketPriority | null = null;

  newTicket: CreateTicketDto = {
    title: '',
    description: '',
    priority: TicketPriority.Medium,
    requesterEmail: ''
  };

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getTickets(
      this.selectedStatus ?? undefined, 
      this.selectedPriority ?? undefined
    ).subscribe({
      next: (data) => {
        this.tickets = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener tickets:', err);
        this.loading = false;
      }
    });
  }

  get breachedSlaCount(): number {
    return this.tickets.filter(t => t.isSlaBreached).length;
  }

  get inProgressCount(): number {
    return this.tickets.filter(t => t.status === TicketStatus.InProgress).length;
  }

  get resolvedCount(): number {
    return this.tickets.filter(t => t.status === TicketStatus.Resolved || t.status === TicketStatus.Closed).length;
  }

  openCreateModal(): void {
    this.newTicket = {
      title: '',
      description: '',
      priority: TicketPriority.Medium,
      requesterEmail: ''
    };
    this.showModal = true;
  }

  closeCreateModal(): void {
    this.showModal = false;
  }

  submitCreateTicket(): void {
    if (!this.newTicket.title || !this.newTicket.requesterEmail) return;

    this.ticketService.createTicket(this.newTicket).subscribe({
      next: () => {
        this.closeCreateModal();
        this.loadTickets();
      },
      error: (err) => console.error('Error creando ticket:', err)
    });
  }

  quickResolve(ticket: Ticket): void {
    this.ticketService.updateTicket(ticket.id, {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: TicketStatus.Resolved,
      assignedAgentEmail: 'LorenRF'
    }).subscribe({
      next: () => this.loadTickets(),
      error: (err) => console.error('Error actualizando ticket:', err)
    });
  }

  deleteTicket(id: string): void {
    if (confirm('¿Está seguro de eliminar este ticket?')) {
      this.ticketService.deleteTicket(id).subscribe({
        next: () => this.loadTickets(),
        error: (err) => console.error('Error al eliminar ticket:', err)
      });
    }
  }

  getPriorityLabel(p: TicketPriority): string {
    switch(p) {
      case TicketPriority.Low: return 'Baja';
      case TicketPriority.Medium: return 'Media';
      case TicketPriority.High: return 'Alta';
      case TicketPriority.Critical: return 'Crítica';
      default: return 'Desconocida';
    }
  }

  getPriorityBadgeClass(p: TicketPriority): string {
    switch(p) {
      case TicketPriority.Low: return 'badge-low';
      case TicketPriority.Medium: return 'badge-med';
      case TicketPriority.High: return 'badge-high';
      case TicketPriority.Critical: return 'badge-crit';
      default: return '';
    }
  }

  getStatusLabel(s: TicketStatus): string {
    switch(s) {
      case TicketStatus.Open: return 'Abierto';
      case TicketStatus.InProgress: return 'En Progreso';
      case TicketStatus.PendingUser: return 'Pendiente Usuario';
      case TicketStatus.Resolved: return 'Resuelto';
      case TicketStatus.Closed: return 'Cerrado';
      default: return 'Desconocido';
    }
  }

  getStatusBadgeClass(s: TicketStatus): string {
    switch(s) {
      case TicketStatus.Open: return 'badge-open';
      case TicketStatus.InProgress: return 'badge-progress';
      case TicketStatus.PendingUser: return 'badge-pending';
      case TicketStatus.Resolved: return 'badge-resolved';
      case TicketStatus.Closed: return 'badge-closed';
      default: return '';
    }
  }
}
