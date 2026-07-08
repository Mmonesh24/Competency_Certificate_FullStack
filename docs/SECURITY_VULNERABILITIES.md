# Security Vulnerability Report

> **Report Date:** July 8, 2026  
> **Severity Classification:** CRITICAL / HIGH / MEDIUM  
> **Project:** Competency Certificate Management System (CMRL)  
> **Total Vulnerabilities Found:** 27

---

## Executive Summary

The Competency Certificate Management System contains **9 CRITICAL**, **9 HIGH**, and **9 MEDIUM** severity security vulnerabilities. The most urgent issues are:

1. **Hardcoded secrets** (JWT key, database credentials) committed to Git
2. **No role-based access control** — any authenticated user can escalate to HR privileges
3. **Client-side certificate forgery** — certificates can be trivially forged via browser DevTools
4. **Multiple unguarded routes** — critical pages accessible without authentication
5. **Sensitive data leakage** — login responses include password hashes and PII

**Risk Assessment: HIGH** — The system is vulnerable to privilege escalation, data forgery, and unauthorized data access in its current state.

---

## CRITICAL Vulnerabilities (9)

### VULN-001: Hardcoded Secrets in Source Control
- **File:** `CompetencyCertificate2/CompetencyCertificate2/appsettings.json`
- **CVSS Score:** 9.8 (Critical)
- **Description:** JWT secret key, database server IP, username, and password are hardcoded in the configuration file and committed to Git.
- **Exposed Secrets:**
  - JWT Secret: `your-super-secret-jwt-key-that-is-at-least-32-characters-long-for-security`
  - DB Server: `192.168.192.105`
  - DB User: `frienduser`
  - DB Password: `StrongPassword123!`
- **Impact:** Any developer or anyone with repository access can extract these credentials. If the repository is public, full database compromise is possible.
- **Remediation:**
  1. Rotate all exposed credentials immediately
  2. Use environment variables or Azure Key Vault for secrets
  3. Add `appsettings.json` to `.gitignore` (use `appsettings.template.json` instead)
  4. Use `dotnet user-secrets` for local development

### VULN-002: No Role-Based Access Control (RBAC)
- **File:** `CompetencyCertificate2/CompetencyCertificate2/Controllers/MasterDataManagementController.cs`
- **CVSS Score:** 9.1 (Critical)
- **Description:** JWT tokens contain no role claims. The `[Authorize]` attribute only checks for a valid token, not for specific roles. Any authenticated user (Employee or HR) can call all 52 protected endpoints.
- **Impact:** An employee can:
  - Create HR accounts via `AddHRLogin` (privilege escalation)
  - Delete other employees via `DeleteEmployee`
  - Modify any department, designation, or contractor data
  - Access all generated certificates
- **Remediation:**
  1. Add role claims to JWT tokens during login
  2. Use `[Authorize(Roles = "HR")]` for HR-only endpoints
  3. Use `[Authorize(Roles = "Admin")]` for administrative endpoints
  4. Validate role permissions in service layer as defense-in-depth

### VULN-003: Client-Side Certificate Forgery
- **File:** Frontend `GenerateCertificateComponent` / `ApprovePageComponent`
- **CVSS Score:** 9.0 (Critical)
- **Description:** Competency certificates are generated entirely in the browser using `html2pdf.js`. The HTML template is rendered client-side, converted to PDF, then uploaded as base64 to the server. The server performs no validation of the certificate content.
- **Impact:** Any user can:
  - Modify the HTML in browser DevTools before PDF generation
  - Create certificates with arbitrary names, dates, or qualifications
  - Upload forged certificates that appear legitimate
- **Remediation:**
  1. Move certificate generation to the server using QuestPDF or IronPDF
  2. Server should fetch employee data from DB, never trust client input
  3. Add digital signatures and verification hashes
  4. Implement QR codes linking to a verification portal

### VULN-004: Password Column Too Short for BCrypt
- **Files:** `Models/EmployeeLogin.cs`, `Models/HRLogin.cs`
- **CVSS Score:** 8.5 (Critical)
- **Description:** Password columns are defined as `NVARCHAR(60)`. BCrypt hashes are exactly 60 characters. Depending on the BCrypt implementation and SQL Server's handling of string boundaries, hashes may be truncated, causing authentication failures or weakened security.
- **Impact:** Truncated hashes could match multiple passwords, weakening the security of the hashing algorithm.
- **Remediation:** Migrate password columns to `NVARCHAR(128)` or `NVARCHAR(MAX)`.

### VULN-005: Trivially Bypassable Auth Guards
- **File:** `LoginAngular (2)/src/app/shared/auth.guard.ts`
- **CVSS Score:** 8.2 (Critical)
- **Description:** Auth guards only check `!!localStorage.getItem('loginUser')`. They do not decode the JWT, check its expiry, or validate its signature.
- **Impact:** Running `localStorage.setItem('loginUser', 'anything')` in the browser console bypasses all route protection immediately.
- **Remediation:**
  1. Decode JWT in guards and check expiry (`exp` claim)
  2. Use a proper JWT decoding library (`jwt-decode`)
  3. Implement a `TokenValidationService` that verifies token structure and expiry

### VULN-006: Sensitive Data Leakage in Login Response
- **File:** `Controllers/MasterDataManagementController.cs` (Login endpoint)
- **CVSS Score:** 7.5 (Critical)
- **Description:** The login endpoint returns the full employee entity including Aadhar number, bank account number, and BCrypt password hash.
- **Impact:** Sensitive PII and password hashes are exposed to the client and logged in browser network tabs.
- **Remediation:**
  1. Create a `LoginResponseDTO` containing only: token, userId, displayName, role
  2. Never return password hashes to the client
  3. Mask sensitive fields (Aadhar: `****-****-1234`)

### VULN-007: Privilege Escalation via Open HR Registration
- **File:** `Controllers/MasterDataManagementController.cs` (`AddHRLogin` endpoint)
- **CVSS Score:** 9.1 (Critical)
- **Description:** The `AddHRLogin` endpoint requires JWT auth but has no role restriction. Since there's no RBAC, any employee with a valid token can create new HR accounts, granting themselves full administrative access.
- **Impact:** Complete privilege escalation from employee to HR administrator.
- **Remediation:** Restrict `AddHRLogin` to `[Authorize(Roles = "Admin")]` only.

### VULN-008: Unguarded Critical Routes
- **File:** `LoginAngular (2)/src/app/app.routes.ts`
- **CVSS Score:** 8.0 (Critical)
- **Description:** 6 routes lack auth guards entirely:
  - `HomeComponent` (HR dashboard)
  - `certificate-initiate` (certificate initiation)
  - `certificate-hod-department` (HOD department view)
  - `approve-page` + `cmrl-certificate` child (certificate approval & generation)
  - `reports-certificate` (certificate reports)
- **Impact:** These pages are accessible without any authentication. An unauthenticated user can view the dashboard and potentially trigger certificate operations.
- **Remediation:** Add `canActivate: [authGuard]` to all protected routes.

### VULN-009: Password Algorithm Exposed in Client Code
- **File:** Frontend `employee-form.component.ts`
- **CVSS Score:** 7.0 (Critical)
- **Description:** The default password generation formula `"CMRL" + designationCode + dob.slice(0,6)` is visible in client-side JavaScript source code.
- **Impact:** Attackers can derive default passwords for any employee if they know the designation code and date of birth.
- **Remediation:**
  1. Generate random passwords server-side
  2. Send via email or require password change on first login
  3. Never embed password generation logic in client code

---

## HIGH Vulnerabilities (9)

### VULN-010: JWT Issuer/Audience Validation Disabled
- **File:** `Program.cs` Lines 98-99
- **Impact:** Tokens from other applications sharing the same signing key are accepted.
- **Remediation:** Set `ValidateIssuer = true`, `ValidateAudience = true` with proper values.

### VULN-011: Interceptor Token Mismatch
- **File:** `interceptor/custom.interceptor.ts`
- **Impact:** Employee API calls send `Bearer null` because the interceptor only reads `loginUser`, not `employeeLogin`.
- **Remediation:** Unified token management with a single localStorage key.

### VULN-012: No Rate Limiting
- **File:** Login endpoint
- **Impact:** Brute-force attacks on login are unrestricted. No account lockout.
- **Remediation:** Add `AspNetCoreRateLimit` middleware; implement account lockout after 5 failed attempts.

### VULN-013: localStorage Token Storage (XSS Risk)
- **File:** All frontend auth services
- **Impact:** Tokens accessible to any JavaScript on the page via XSS.
- **Remediation:** Use `httpOnly` cookies for token storage; implement CSP headers.

### VULN-014: No File Upload Validation
- **File:** `AddEmployee`, `EditContractor` endpoints
- **Impact:** Malicious files (executables, scripts) can be uploaded disguised as images.
- **Remediation:** Whitelist MIME types, enforce size limits (e.g., 5MB), validate file magic bytes.

### VULN-015: Unencrypted Database Traffic
- **File:** `appsettings.json` (connection string)
- **Impact:** All SQL traffic including PII travels unencrypted on the network.
- **Remediation:** Set `Encrypt=True;TrustServerCertificate=True` (dev) or use proper certificates (prod).

### VULN-016: Exception Message Leakage
- **File:** Controller catch blocks
- **Impact:** Internal error details (EF Core errors, SQL exceptions) returned to client.
- **Remediation:** Return generic error messages; log detailed errors server-side with Serilog.

### VULN-017: bypassSecurityTrustResourceUrl Usage
- **File:** `employee-edit.component.ts`
- **Impact:** Bypasses Angular's DomSanitizer for passbook PDF preview, potential XSS vector.
- **Remediation:** Validate base64 content is valid PDF before bypassing sanitizer.

### VULN-018: Debugger Statements in Production Code
- **Files:** `login.component.ts`, `home.component.ts`, `department-report.component.ts`, `view-department-for-edit.component.ts`, `contractor-view-for-edit.component.ts`
- **Impact:** Causes execution to pause when DevTools is open; reveals code flow to attackers.
- **Remediation:** Remove all `debugger` statements; add ESLint rule `no-debugger`.

---

## MEDIUM Vulnerabilities (9)

| # | Vulnerability | File | Remediation |
|---|-------------|------|-------------|
| 19 | No backend input validation | All models | Add FluentValidation |
| 20 | No frontend form validation (submit button outside `<form>`) | Employee form components | Use reactive forms, fix HTML structure |
| 21 | `RequireHttpsMetadata = false` | `Program.cs` | Set to `true` in production |
| 22 | `secure: false` in proxy config | `proxy.conf.json` | Set to `true` with proper certificates |
| 23 | No Content Security Policy | `index.html` | Add CSP meta tag and headers |
| 24 | Employee data accessible by ID manipulation | `EmployeeDashboardComponent` | Validate token-to-ID match on server |
| 25 | No token refresh mechanism | Auth services | Implement refresh token flow |
| 26 | Sensitive data not masked in UI | Add/Edit Employee forms | Mask Aadhar (****-****-1234), bank account numbers |
| 27 | Console.log leaks sensitive data | Multiple components | Remove all `console.log` with sensitive data; add ESLint rule |

---

## Remediation Priority

| Priority | Vulnerabilities | Timeline |
|----------|----------------|----------|
| **P0 — Immediate** | VULN-001, VULN-002, VULN-007, VULN-008 | This week |
| **P1 — Urgent** | VULN-003, VULN-005, VULN-006, VULN-009 | 1-2 weeks |
| **P2 — High** | VULN-010 through VULN-018 | 2-4 weeks |
| **P3 — Medium** | VULN-019 through VULN-027 | 1-2 months |
