# CMRL Competency Certificate Management System

This repository is a monorepo containing the frontend and backend components of the Competency Certificate Management System.

## Project Structure

- **`/backend`**: ASP.NET Core 8 Web API (C#) using Entity Framework Core & SQL Server.
- **`/frontend`**: Angular 17 Standalone application using TailwindCSS & Bootstrap.
- **`/docs`**: Comprehensive audit reports and development strategy:
  - [`PROJECT_ANALYSIS.md`](docs/PROJECT_ANALYSIS.md): Deep analysis of architecture, endpoints, database schema, gaps, and roadmap.
  - [`SECURITY_VULNERABILITIES.md`](docs/SECURITY_VULNERABILITIES.md): Security audit covering 27 vulnerabilities (CRITICAL/HIGH/MEDIUM) with prioritized remediation actions.
  - [`AI_INTEGRATION_AND_EXPANSION.md`](docs/AI_INTEGRATION_AND_EXPANSION.md): Detailed strategy for server-side PDF generation, AI anti-forgery, adaptive competency tests, OCR document intake, and cost/infrastructure analysis.

## Development Setup

### Backend (API)
1. Navigate to `/backend/CompetencyCertificate2`.
2. Ensure you have the .NET 8.0 SDK installed.
3. Configure your connection string in `appsettings.json` (ensure secrets are handled via Environment Variables or User Secrets in production).
4. Run `dotnet run` or open `CompetencyCertificate2.sln` in Visual Studio.

### Frontend (Angular)
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm start` (runs on `http://localhost:4200` with API proxy configured).
