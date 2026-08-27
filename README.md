# ⚡ PulseDesk — IT Service Desk & SLA Management Platform

PulseDesk es una solución corporativa full-stack diseñada para la gestión de incidentes técnicos, seguimiento de acuerdos de nivel de servicio (SLA) y auditoría de tiempos de respuesta en tiempo real.

![.NET 9](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC292B?logo=microsoftsqlserver&logoColor=white)
![Entity Framework Core](https://img.shields.io/badge/EF_Core-ORM-512BD4)

---

## 🏛️ Arquitectura del Sistema

El proyecto implementa una arquitectura desacoplada basada en Clean Architecture y principios SOLID:

PulseDesk/
├── src/
│   └── backend/
│       ├── PulseDesk.Core/           # Capa de Dominio (Entidades, Enums, DTOs)
│       ├── PulseDesk.Infrastructure/ # Capa de Persistencia (EF Core, DbContext, Migrations, Seeders)
│       └── PulseDesk.Api/            # Capa de Exposición (REST API Controllers, Swagger, Middlewares)
└── frontend/                         # Cliente SPA Angular (Standalone Components, Signals/RxJS)


🚀 Características Principales
Cálculo Automático de SLA: Asignación dinámica de horas límite de resolución según la criticidad del incidente (Crítica: 4h, Alta: 8h, Media: 24h, Baja: 48h).

Detección de Brechas de SLA: Identificación visual e indicadores en tiempo real para tickets con tiempo de respuesta vencido.

Métricas y Resumen Ejecutivo: Tarjetas de estado con conteos en vivo (Total, Vencidos, En Progreso, Resueltos).

Filtrado Avanzado: Consultas dinámicas por estado del ticket y nivel de prioridad.

Persistencia Robusta: Modelado relacional en Microsoft SQL Server con Code-First Migrations y Data Seeding automatizado.

Frontend Reactivo: Interfaz moderna desarrollada con componentes Standalone de Angular, control de estados y diseño responsivo.

🛠️ Stack Tecnológico
Backend
C# / .NET 9 Web API

Entity Framework Core 9.0 (SQL Server Provider)

LINQ & Async/Await para consultas optimizadas no bloqueantes

Swagger / OpenAPI para documentación interactiva de endpoints

Frontend
Angular (Standalone Components, TypeScript, RxJS, HttpClient)

CSS Moderno (Diseño Dark Mode con variables CSS nativas)

Base de Datos
Microsoft SQL Server

⚙️ Puesta en Marcha Local
Prerrequisitos
.NET 9 SDK

Node.js (LTS)

SQL Server (LocalDB o Express)

⚡imagenes

<img width="1604" height="790" alt="image" src="https://github.com/user-attachments/assets/94550d1d-f88c-4b86-a834-d83f33544c72" />
<img width="638" height="555" alt="image" src="https://github.com/user-attachments/assets/94ca84c8-1c81-41e0-b28a-341dc0d6f994" />
