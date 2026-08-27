import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, CreateTicketDto, UpdateTicketDto, TicketStatus, TicketPriority } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly http = inject(HttpClient);
  // Ajusta el puerto si tu API corre en un puerto diferente (ej: 5000 / 5123)
  private readonly apiUrl = 'https://localhost:7001/api/tickets';

  getTickets(status?: TicketStatus, priority?: TicketPriority): Observable<Ticket[]> {
    let params = new HttpParams();
    if (status !== undefined && status !== null) {
      params = params.set('status', status.toString());
    }
    if (priority !== undefined && priority !== null) {
      params = params.set('priority', priority.toString());
    }
    return this.http.get<Ticket[]>(this.apiUrl, { params });
  }

  getTicketById(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  createTicket(dto: CreateTicketDto): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, dto);
  }

  updateTicket(id: string, dto: UpdateTicketDto): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, dto);
  }

  deleteTicket(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
