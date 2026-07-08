# Competency Certificate Management System — Complete Analysis

> **Analysis Date:** July 8, 2026  
> **Analyzed By:** AI Code Auditor  
> **Project:** Competency Certificate Management System (CMRL)

---

## Project Overview

This is a **Competency Certificate Management System** for an organization (appears to be **CMRL — Chennai Metro Rail Limited**) built with:

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend API** | ASP.NET Core Web API | .NET 8.0 |
| **ORM** | Entity Framework Core (SQL Server) | 9.0.6 ⚠️ |
| **Frontend** | Angular (Standalone Components) | 17.3 |
| **Styling** | Bootstrap 5 + TailwindCSS 3 | Mixed |
| **Charts** | Chart.js (CDN) | — |
| **PDF Gen** | html2pdf.js (client-side) | 0.10.3 |
| **Auth** | JWT Bearer + BCrypt | — |
| **Database** | SQL Server | — |

> ⚠️ **EF Core version mismatch**: The project targets `.NET 8.0` but uses `EntityFrameworkCore 9.0.6` packages, which are designed for .NET 9. This can cause runtime compatibility issues.

### System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Angular 17 Frontend                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────────┐ │
│  │ Login    │ │ HR Dash  │ │ Employee │ │ Certificate     │ │
│  │ (4 comp) │ │ + Charts │ │ Mgmt     │ │ Workflow        │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────────────┘ │
└───────────────────────┬──────────────────────────────────────┘
                        │ HTTPS / JWT
                        ▼
┌──────────────────────────────────────────────────────────────┐
│              ASP.NET Core 8 API                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ UserController (53 endpoints) + JWT Auth Middleware     │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────────────┘
                        │ EF Core
                        ▼
┌──────────────────────────────────────────────────────────────┐
│              SQL Server (odooDb — 9 tables)                   │
└──────────────────────────────────────────────────────────────┘
```

### Workflow

```
HR Adds Employee → Employee Record Created → HR Initiates Certificate
                                                      │
                                                      ▼
                          Employee Views/Downloads ← PDF Uploaded to DB ← HR Generates Certificate
                                Certificate                                (Client-Side PDF)
```

---

## 📊 Database Schema

### Entity-Relationship Diagram

```
Department (PK: DepartmentName NVARCHAR(60))
├── DepartmentCode NVARCHAR(60)
├── 1:N → SubDeparment [typo — missing 't']
└── 1:N → Employee

SubDeparment (PK: SubDepartmentName NVARCHAR(60))
├── FK DepartmentName → Department (nullable)
└── 1:N → Employee

Designation (PK: Designation_Name NVARCHAR(60))
├── designation_type INT (Executive=0, NonExecutive=1)
├── DesignationCode NVARCHAR(60)
└── 1:N → Employee

Contractor (PK: ContractorName NVARCHAR(60))
├── Logo VARBINARY(MAX)
└── 1:N → Employee (optional)

Employee (PK: Employee_id NVARCHAR(60))
├── Employee_name NVARCHAR(60) [Required]
├── Employee_type INT (Executive/NonExecutive) [Required]
├── CategoryName INT (CMRLEmployee/NonCMRLEmployee) [Required]
├── DOB DATE [Required]
├── JoiningDate DATE [Required]
├── AadharNo NVARCHAR(12) [Required]
├── EPF_UAN_NO, ESA_NO, BankName, BankAccountNumber NVARCHAR(60) [Required]
├── BloodGroup NVARCHAR(60) [Required]
├── Status INT (Inservice/Terminated/Discharged/ReturnedBack)
├── Photo VARBINARY(MAX) + PhotoBase64 NVARCHAR(MAX) [duplicate storage ⚠️]
├── Passbook VARBINARY(MAX) + PassbookBase64 NVARCHAR(MAX) [duplicate storage ⚠️]
├── FK ContractorName → Contractor [nullable]
├── FK DepartmentName → Department [nullable]
├── FK SubDepartmentName → SubDeparment [nullable]
├── FK Designation_Name → Designation [nullable]
├── 1:1 → EmployeeLogin (cascade delete)
├── 1:1 → Generated (cascade delete)
└── 1:1 → Initiate (cascade delete)

EmployeeLogin (PK/FK: employee_id → Employee)
└── Password NVARCHAR(60) [BCrypt hash ⚠️ column too short]

HRLogin (PK: employee_id NVARCHAR(60))
├── Password NVARCHAR(60) [BCrypt hash ⚠️ column too short]
└── Designation NVARCHAR(60) [default: "HR"]

Generated (PK/FK: EmployeeId → Employee)
├── CompetencyCertificate VARBINARY(MAX) [Required]
└── Validity NVARCHAR(60) [nullable]

Initiate (PK/FK: employee_id → Employee)
└── (only PK/FK column)
```

> ⚠️ **Table name typo**: `SubDeparment` (missing 't') is used throughout the DbContext and migrations. This is permanently baked into the database schema.

---

## 🔴 Security Vulnerabilities

### CRITICAL Severity

| # | Vulnerability | Files | Description |
|---|-------------|-------|-------------|
| 1 | **Hardcoded Secrets in Source Control** | `appsettings.json` | JWT secret (`your-super-secret-jwt-key...` — looks like a never-replaced placeholder), DB credentials (`frienduser`/`StrongPassword123!`), internal server IP (`192.168.192.105`) all committed to Git. |
| 2 | **No Role-Based Access Control** | `MasterDataManagementController.cs` | JWT tokens contain no role claims. Any authenticated user (Employee OR HR) can call ALL 52 protected endpoints — including `AddHRLogin` (privilege escalation!), `DeleteEmployee`, and all admin operations. |
| 3 | **Client-Side Certificate Forgery** | Frontend `GenerateCertificateComponent` | Certificates are rendered as HTML in the browser, converted to PDF via `html2pdf.js`, then uploaded as base64. Users can modify the HTML/data in DevTools before generation, creating forged certificates with arbitrary content. |
| 4 | **Password Column Too Short** | `EmployeeLogin.cs`, `HRLogin.cs` | `NVARCHAR(60)` for password columns. BCrypt hashes are exactly 60 characters — this may truncate hashes depending on BCrypt implementation, causing auth failures or weakened security. Should be `NVARCHAR(100)+`. |
| 5 | **Trivially Bypassable Auth Guards** | `auth.guard.ts` | Guards only check `!!localStorage.getItem('loginUser')`. Running `localStorage.setItem('loginUser', 'anything')` in the browser console bypasses ALL route protection. No JWT decode, no expiry check. |
| 6 | **Sensitive Data Leakage in Login Response** | `MasterDataManagementController.cs` | The login endpoint returns full employee details including **Aadhar number, bank account number, and BCrypt password hash** in the response body. |
| 7 | **Open HR Registration** | `/api/User/AddHRLogin` endpoint | The `AddHRLogin` endpoint requires JWT auth, but since there's no RBAC, any employee with a valid token can create HR accounts — **full privilege escalation**. |
| 8 | **Unguarded Critical Routes** | `app.routes.ts` | 6 routes lack auth guards entirely: `HomeComponent`, `certificate-initiate`, `certificate-hod-department`, `approve-page` (+ `cmrl-certificate` child), `reports-certificate` — these are accessible without any authentication. |
| 9 | **Password Algorithm Exposed in Client Code** | `employee-form.component.ts` | Default password generation formula `"CMRL" + designationCode + dob.slice(0,6)` is visible in client-side source code, revealing the password creation algorithm. |

### HIGH Severity

| # | Vulnerability | Location | Description |
|---|-------------|----------|-------------|
| 10 | **JWT Issuer/Audience Validation Disabled** | `Program.cs` L98-99 | `ValidateIssuer = false`, `ValidateAudience = false` — tokens from other applications sharing the same signing key would be accepted. |
| 11 | **Interceptor Token Mismatch** | `custom.interceptor.ts` | Interceptor always reads `loginUser` from localStorage. Employee routes store tokens as `employeeLogin`. **Employee API calls either go unauthenticated or send `Bearer null`**. |
| 12 | **No Rate Limiting** | Login endpoint | No rate limiting, no account lockout, no CAPTCHA. Brute-force attacks on login are unrestricted. |
| 13 | **localStorage Token Storage** | All frontend services | Tokens in `localStorage` are accessible to any JavaScript on the page. A single XSS vulnerability leaks all auth tokens. |
| 14 | **No File Upload Validation** | `AddEmployee`, `EditContractor` | No file type checking, no size limits, no content inspection on photo/passbook/logo uploads. Malicious files could be uploaded. |
| 15 | **Unencrypted Database Traffic** | `appsettings.json` L10 | `Encrypt=False` in connection string — all SQL traffic (including sensitive employee data) travels unencrypted. |
| 16 | **Exception Message Leakage** | Controller `catch` blocks | `ex.Message` returned to client in error responses — leaks internal implementation details (EF Core errors, SQL exceptions). |
| 17 | **`bypassSecurityTrustResourceUrl` Usage** | `employee-edit.component.ts` | Used for passbook PDF preview. If an attacker injects malicious content into stored `passbookBase64`, it could be rendered unsanitized. |
| 18 | **Debugger Statements in Production Code** | `login.component.ts`, `home.component.ts`, `department-report.component.ts`, others | Multiple `debugger` statements left in source code — causes execution to pause when DevTools is open. |

### MEDIUM Severity

| # | Vulnerability | Location | Description |
|---|-------------|----------|-------------|
| 19 | **No Input Validation (Backend)** | All models | No `[Required]`, `[StringLength]`, `[RegularExpression]` annotations enforced at API level. ModelState is checked on some endpoints but not others. |
| 20 | **No Input Validation (Frontend)** | All form components | Template-driven forms with no validators. Employee form submit button is **outside the `<form>` tag**, completely bypassing HTML5 validation. |
| 21 | **`RequireHttpsMetadata = false`** | `Program.cs` L95 | JWT middleware doesn't require HTTPS for metadata discovery. |
| 22 | **`secure: false` in Proxy Config** | `proxy.conf.json` | SSL certificate verification disabled for dev proxy. |
| 23 | **No Content Security Policy** | `index.html` | No CSP meta tag or headers. Chart.js loaded from CDN without integrity hash. External CDN resources (Font Awesome, TailwindCSS, Google Fonts) loaded in component templates, not bundled. |
| 24 | **Employee Data Accessible by ID Manipulation** | `EmployeeDashboardComponent` | Employee fetches their data using `empUserId` from localStorage. Modifying this value accesses another employee's data (backend doesn't validate token-to-ID match). |
| 25 | **No Token Refresh Mechanism** | All auth services | 30-minute token expiry with no refresh flow. Users are silently logged out with no warning. |
| 26 | **Sensitive Data Not Masked in UI** | Add/Edit Employee forms | Aadhar number, bank account number displayed in plain text in forms. |
| 27 | **Console.log Leaks Sensitive Data** | Multiple components | `console.log` statements throughout the codebase print tokens, employee data, and other sensitive information to the browser console. |

---

## 🟡 Architectural Gaps

### Backend Architecture

| Gap | Current State | Best Practice |
|-----|--------------|---------------|
| **Monolithic Controller** | Single `UserController` with 53 endpoints in 771 lines | Split: `AuthController`, `EmployeeController`, `DepartmentController`, `CertificateController`, `MasterDataController` |
| **No Service Layer** | All business logic directly in controller actions | Extract services: `AuthService`, `EmployeeService`, `CertificateService` |
| **No Repository Pattern** | Direct `_context` (DbContext) calls in controllers | Repository abstraction for testability |
| **No DTOs** | EF entities returned directly in API responses | Response/Request DTOs to control data exposure |
| **No Pagination** | All list endpoints return full datasets | `Skip`/`Take` with `TotalCount` for large datasets |
| **File/Class Name Mismatch** | File: `MasterDataManagementController.cs`, Class: `UserController` | Consistent naming |
| **Duplicate Endpoints** | `GetGenerated` and `GetAllGenerated` are identical; same for department variants | Remove duplicates |
| **Sync DB Calls** | Most database operations are synchronous | Use `async`/`await` throughout |
| **No API Versioning** | Unversioned API | `/api/v1/`, `/api/v2/` versioning |
| **No Health Checks** | No health/readiness endpoints | `/health`, `/ready` endpoints |
| **No Logging** | `Console.WriteLine` used for debugging | Structured logging with Serilog |
| **Boilerplate Code** | `WeatherForecast.cs` + controller still present | Remove template scaffolding |
| **No Unit Tests** | Zero test coverage | xUnit/NUnit test project |
| **Redundant Data Updates** | `UpdateEmployee` uses `SetValues()` then manually overwrites same properties | Remove duplicate assignments |
| **DeleteInitiate Type Bug** | `DeleteInitiate` accepts `int id` but PK is `string employee_id` after migration | Fix parameter type |

### Frontend Architecture

| Gap | Current State | Best Practice |
|-----|--------------|---------------|
| **Hardcoded API URL** | `apiUrl = 'https://localhost:7269/api/User'` in every component | Use Angular `environment.ts` files |
| **No State Management** | Fresh API calls on every component load, 6+ calls per dashboard load | NgRx or Signal-based state management with caching |
| **Duplicate Login Components** | 4 login components with overlapping logic | Unified auth component with role selection |
| **Dual Auth Systems** | Separate token storage, guards, and interceptors for HR vs Employee | Unified auth with role-based routing |
| **No Shared Components** | UI patterns (modals, tables, forms, confirm dialogs) duplicated across 31 pages | Shared component library |
| **Template-Driven Forms** | `ngModel` binding with no validators | Reactive forms for complex validation |
| **Chart.js from CDN** | `declare var Chart: any` — loaded via `<script>` tag | Install `chart.js` + `ng2-charts` as npm dependencies |
| **No Lazy Loading** | All routes loaded eagerly | `loadChildren` for feature modules |
| **No Error Handling UI** | `alert()` for errors, `console.error()` for failures | Toast notifications, inline form errors |
| **No Loading States** | No spinners/skeletons during API calls | Loading indicators for UX |
| **No 401 Interception** | Expired tokens cause silent failures | Auto-logout on 401 response |
| **No Accessibility** | Missing ARIA labels, keyboard navigation | WCAG 2.1 compliance |
| **No i18n** | English only, hardcoded strings | Angular i18n |
| **Mixed CSS Frameworks** | Both Bootstrap 5 AND TailwindCSS 3 included | Choose one |
| **Code Duplication** | `logout()`, `viewProfile()`, `toggleSideMenu()`, `showErrorMessages()` duplicated across 20+ components | Shared base class or service |
| **`location.reload()`** | Used instead of Angular router/state updates after form submissions | Proper Angular navigation |
| **Login Template Invalid HTML** | Full `<html>`, `<head>`, `<body>` tags inside component template | Component-only HTML |

### Database & Data Integrity

| Gap | Description |
|-----|-------------|
| **No Audit Trail** | No `CreatedAt`, `UpdatedAt`, `CreatedBy`, `ModifiedBy` fields on any entity |
| **No Soft Delete** | Hard deletes permanently lose data (with cascade deletes removing login, initiate, generated records) |
| **Duplicate Data Storage** | `Photo` (binary) + `PhotoBase64` (string) stored side-by-side, doubling storage for every employee |
| **No Concurrency Control** | No `RowVersion` / `ConcurrencyToken` — simultaneous edits will silently overwrite |
| **No Indexes** | No explicit indexes beyond primary keys — queries on `DepartmentName`, `SubDepartmentName`, `Status` will table-scan |
| **1:1 vs 1:N Mismatch** | `Generated` has PK = FK to Employee (1:1), but `Employee` model declares `List<Generated>` (1:N) |
| **Table Typo** | `SubDeparment` (missing 't') permanently in schema |
| **No Data Seeding** | No initial master data for departments, designations, contractors |
| **PII Not Encrypted at Rest** | Aadhar numbers, bank account numbers stored as plaintext in DB |

### DevOps & Infrastructure

| Gap | Description |
|-----|-------------|
| **No CI/CD Pipeline** | No GitHub Actions, Azure DevOps, or other CI/CD configuration |
| **No Dockerfile** | No containerization support |
| **No Environment Management** | Single `appsettings.json` with production secrets |
| **No Monitoring** | No Application Insights, Prometheus, or health checks |
| **No Backup Strategy** | No documented database backup procedures |

---

## 🤖 AI Integration Opportunities

### 1. Server-Side Certificate Generation with AI Anti-Forgery

> **⚠️ IMPORTANT:** This is the **highest-priority AI integration** because the current client-side generation is fundamentally insecure.

```
HR Triggers Certificate
        │
        ▼
Server Fetches Employee Data
        │
        ▼
Server-Side PDF Generation (QuestPDF / IronPDF)
        │
        ▼
AI Watermark Embedding (invisible steganography)
        │
        ▼
Digital Signature + QR Code (contains verification URL + hash)
        │
        ▼
Store in DB with SHA-256 hash
        │
        ▼
Public Verification Portal ◄── External Verifier (Scans QR / Enters ID)
        │
        ▼
AI analyzes document for tampering → Tamper Detection AI
```

| Component | Technology |
|-----------|------------|
| PDF Generation | QuestPDF (open-source) or IronPDF |
| Digital Signature | X.509 certificates |
| QR Code | QRCoder library |
| Tamper Detection | Azure AI Vision / custom CNN model |
| Hash Verification | SHA-256 fingerprinting |

### 2. Intelligent Competency Assessment Engine

```
Employee Profile ──┐
Training History ──┤──► AI Assessment Engine ──► Skill Gap Analysis
Past Certifications┘                        ──► Adaptive Test Generation
                                            ──► Certification Readiness Score
                                            ──► Personalized Learning Path
```

| Feature | Description | Technology |
|---------|-------------|------------|
| **Skills Analyzer** | NLP-based analysis of competency records and training history | Azure OpenAI / GPT-4 |
| **Adaptive Assessment** | AI-generated tests that adapt difficulty based on responses | Custom ML model |
| **Gap Analysis** | Identifies skill gaps across departments and recommends training | Clustering + classification |
| **Predictive Readiness** | Predicts when employees will be ready for certification | Time-series forecasting |

### 3. Smart Document Processing

| Use Case | Input | Output | Technology |
|----------|-------|--------|------------|
| Auto-fill employee profiles | Uploaded resume / ID card | Pre-populated form fields | Azure Document Intelligence |
| Parse external training certificates | Uploaded certificate images | Extracted training data + validity | OCR + NLP entity extraction |
| Validate Aadhar / PAN | Uploaded ID document | Verified identity fields | Azure AI Vision + Regex |
| Classify uploaded documents | Any employee document | Categorized and tagged | Text classification ML |

### 4. AI-Powered Analytics Dashboard

**Current State:**
- Basic count cards
- Static Chart.js charts

**AI-Enhanced:**
- Predictive Forecasting (certification demand trends)
- Anomaly Detection (mass certifications, expired employees)
- Department Health Scores (composite ML metrics)
- Natural Language Queries ("Show uncertified engineers who joined before 2024")
- AI Chatbot (employee self-service)

### 5. Automated Compliance Monitoring

| Feature | Description |
|---------|-------------|
| **Expiry Prediction** | ML model predicts which certificates will expire soon and auto-schedules renewals |
| **Regulatory Mapping** | AI maps organizational certifications to regulatory requirements |
| **Risk Scoring** | Per-department compliance risk score based on certification coverage |
| **Auto-Reporting** | AI generates compliance reports in natural language for auditors |
| **Smart Notifications** | ML-optimized notification timing based on employee engagement patterns |

### 6. AI Chatbot for Employee Self-Service

| Capability | Example Query |
|-----------|--------------|
| Certificate Status | "What's the status of my competency certificate?" |
| Expiry Information | "When does my certificate expire?" |
| Policy Questions | "What are the requirements for certification renewal?" |
| Document Help | "What documents do I need to upload?" |
| Process Guidance | "How do I request a new certificate?" |

**Technology Stack**: Azure Bot Service + Azure OpenAI (RAG over company policies) + Angular integration via WebSocket/REST.

---

## 🚀 System Expansion Roadmap

### Phase 1: Security Hardening (Immediate — 2-4 weeks)

> **⛔ CAUTION:** These MUST be addressed before any expansion. The current system has exploitable vulnerabilities that allow privilege escalation and data forgery.

- [ ] **Move all secrets to environment variables** — JWT key, DB credentials out of `appsettings.json`
- [ ] **Fix password column size** — Migrate `NVARCHAR(60)` → `NVARCHAR(100)` for BCrypt hashes
- [ ] **Implement RBAC** — Add role claims (`HR`, `Employee`, `Admin`) to JWT tokens; add `[Authorize(Roles = "HR")]` to admin endpoints
- [ ] **Server-side certificate generation** — Move PDF generation from client to server using QuestPDF
- [ ] **Fix auth guard** — Decode JWT and check expiry in Angular guards
- [ ] **Fix interceptor** — Handle both `loginUser` and `employeeLogin` tokens
- [ ] **Add missing route guards** — Protect HomeComponent, certificate-initiate, approve-page, reports-certificate
- [ ] **Stop leaking sensitive data** — Remove password hashes and unnecessary PII from login responses
- [ ] **Remove debugger statements** — Clean all `debugger` and sensitive `console.log` statements
- [ ] **Add rate limiting** — `AspNetCoreRateLimit` on login endpoint
- [ ] **Input validation** — FluentValidation on backend; reactive form validators on frontend
- [ ] **File upload validation** — Whitelist file types, enforce size limits, scan content
- [ ] **Encrypt DB traffic** — Set `Encrypt=True` in connection string
- [ ] **Add Content Security Policy** headers

### Phase 2: Architecture Refactoring (2-4 weeks)

- [ ] **Split monolithic controller** into domain controllers
- [ ] **Add service layer** — Business logic extracted from controllers
- [ ] **Add DTOs** — Request/Response models separated from EF entities
- [ ] **Add repository pattern** — Abstracted data access
- [ ] **Async/await throughout** — All DB operations async
- [ ] **Pagination** — All list endpoints return paged results
- [ ] **Remove duplicate endpoints** and fix naming inconsistencies
- [ ] **Unified auth system** — Single login flow with role-based routing
- [ ] **Environment files** — Angular `environment.ts` for API URLs
- [ ] **Shared component library** — Reusable modals, tables, forms
- [ ] **Global error handling** — Toast notifications, 401 auto-logout
- [ ] **Structured logging** — Serilog with correlation IDs
- [ ] **Unit tests** — xUnit for backend, Jasmine for frontend
- [ ] **Fix form submit button placement** — Move inside `<form>` tags
- [ ] **Remove duplicate code** — Extract shared logic into services/base classes

### Phase 3: Feature Expansion (1-2 months)

- [ ] **Multi-level approval workflow** — Employee → Supervisor → HR Manager → Director
- [ ] **Email notifications** — SendGrid/SMTP for cert issuance, expiry alerts, status updates
- [ ] **Certificate expiry & renewal** — Track validity periods, auto-flag expirations, renewal workflow
- [ ] **Bulk operations** — CSV/Excel import for employees, bulk certificate issuance
- [ ] **Comprehensive audit log** — Track all CRUD operations with user, timestamp, old/new values
- [ ] **Report generation** — Downloadable PDF/Excel compliance and analytics reports
- [ ] **Admin panel** — Superuser dashboard for system configuration, user management
- [ ] **Encrypt PII at rest** — AES-256 encryption for Aadhar, bank account numbers in DB
- [ ] **Forgot password flow** — Email-based password reset
- [ ] **Public verification portal** — QR-scan or ID-based certificate verification page
- [ ] **Mobile-responsive UI** — PWA support with offline viewing

### Phase 4: AI-Powered Intelligence (2-4 months)

- [ ] **AI competency assessment** — Adaptive testing with Azure OpenAI / GPT
- [ ] **Smart document processing** — OCR pipeline for auto-populating employee data
- [ ] **Predictive analytics dashboard** — ML-powered forecasting and anomaly detection
- [ ] **AI chatbot** — Employee self-service for certificate status, policy questions
- [ ] **Natural language report builder** — "Show all uncertified engineers in Operations"
- [ ] **Automated compliance monitoring** — AI-driven expiry prediction and risk scoring

### Phase 5: Enterprise Scale (4-6 months)

- [ ] **Multi-tenant architecture** — Support multiple organizations/business units
- [ ] **SSO integration** — Azure AD / Okta / LDAP authentication
- [ ] **API gateway** — Ocelot/YARP for API management, throttling, monitoring
- [ ] **Microservices migration** — Split into: Auth, Employee, Certificate, Notification services
- [ ] **Event-driven architecture** — RabbitMQ/Azure Service Bus for async operations
- [ ] **Containerization** — Docker + Kubernetes deployment
- [ ] **CI/CD pipeline** — GitHub Actions / Azure DevOps for automated testing & deployment
- [ ] **Third-party integrations** — SAP SuccessFactors, Workday, Oracle HCM
- [ ] **Training/LMS integration** — Link certifications to training completion
- [ ] **Mobile app** — Native iOS/Android with push notifications

---

## Summary Scorecard

| Dimension | Current State | Score | Target State |
|-----------|--------------|-------|-------------|
| **Authentication** | JWT + BCrypt, but no RBAC, bypassable guards | 🔴 3/10 | SSO + RBAC + MFA |
| **Authorization** | Employee can escalate to HR | 🔴 2/10 | Fine-grained RBAC |
| **Secrets Management** | Hardcoded in source control | 🔴 1/10 | Azure Key Vault / env vars |
| **Certificate Integrity** | Client-generated, trivially forgeable | 🔴 1/10 | Server-generated, digitally signed |
| **Data Protection** | PII stored plaintext, unencrypted DB traffic | 🔴 2/10 | Encrypted at rest and in transit |
| **Input Validation** | Minimal to none | 🔴 2/10 | FluentValidation + reactive forms |
| **Architecture** | Monolithic, no layers, 53 endpoints in 1 file | 🟡 3/10 | Clean Architecture / Microservices |
| **Testing** | Zero coverage | 🔴 0/10 | 80%+ unit + integration tests |
| **CI/CD** | None | 🔴 0/10 | Automated pipeline |
| **UX/Accessibility** | Functional but basic, no a11y | 🟡 4/10 | Modern, accessible, mobile-ready |
| **AI/ML** | None | ⚪ 0/10 | Assessment, analytics, document processing |
| **Scalability** | Single instance, no containerization | 🔴 2/10 | Containerized, load-balanced, multi-tenant |

> **⚠️ IMMEDIATE ACTION ITEMS** (before any expansion): Fix secrets management (#1), implement RBAC (#2), move certificate generation server-side (#3), fix password column (#4), fix auth guards (#5), and protect unguarded routes (#8). These represent exploitable vulnerabilities in the current system.
