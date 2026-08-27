import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar">
      <div class="nav-brand">
        <span class="logo-badge">PD</span>
        <div>
          <h2>PulseDesk</h2>
          <small>IT Service Desk & SLA Manager</small>
        </div>
      </div>
      <div class="nav-user">
        <span class="agent-tag">Agente: LorenRF</span>
        <span class="status-dot"></span>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #1e293b;
      border-bottom: 1px solid #334155;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .logo-badge {
      background: linear-gradient(135deg, #38bdf8, #6366f1);
      color: #0f172a;
      font-weight: 800;
      padding: 0.5rem 0.8rem;
      border-radius: 8px;
      font-size: 1.1rem;
    }
    .nav-brand h2 {
      font-size: 1.25rem;
      color: #f8fafc;
      margin: 0;
    }
    .nav-brand small {
      color: #94a3b8;
      font-size: 0.8rem;
    }
    .nav-user {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background-color: #0f172a;
      padding: 0.4rem 1rem;
      border-radius: 20px;
      border: 1px solid #334155;
    }
    .agent-tag {
      font-size: 0.85rem;
      color: #cbd5e1;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }
  `]
})
export class NavbarComponent {}
