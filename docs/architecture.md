# System Architecture Document
## Multi-Tenant SaaS Platform – Project & Task Management System

---

## 1. System Architecture Diagram

The system follows a three-tier architecture consisting of a client layer, application layer, and data layer.

### Components:
- **Client (Browser):** End users access the system via a web browser.
- **Frontend Application:** A React-based single-page application responsible for UI rendering and API communication.
- **Backend API Server:** A Node.js (Express) REST API that handles authentication, business logic, and data access.
- **Database:** PostgreSQL database used for persistent data storage.
- **Authentication Flow:** JWT-based authentication is used for securing API endpoints.

### Authentication Flow:
- User submits login credentials via the frontend.
- Backend validates credentials and issues a JWT.
- Frontend stores JWT and attaches it to all protected API requests.
- Backend validates JWT and enforces role-based access control.

**Diagram Location:**  
`docs/images/system-architecture.png`

---

## 2. Database Schema Design (ERD)

The database follows a shared schema multi-tenant design where all tenant data is stored in shared tables and isolated using a `tenant_id` column.

### Tables Overview:

- **tenants**
  - id (PK)
  - name
  - subdomain (UNIQUE)
  - plan
  - created_at

- **users**
  - id (PK)
  - tenant_id (FK, nullable for Super Admin)
  - email
  - password_hash
  - role
  - created_at

- **projects**
  - id (PK)
  - tenant_id (FK)
  - name
  - created_at

- **tasks**
  - id (PK)
  - tenant_id (FK)
  - project_id (FK)
  - title
  - status
  - created_at

- **audit_logs**
  - id (PK)
  - tenant_id (FK)
  - user_id (FK)
  - action
  - created_at

### Relationships:
- One tenant can have many users
- One tenant can have many projects
- One project can have many tasks
- One user can have many audit logs

Indexes are applied on all `tenant_id` columns to improve query performance and ensure efficient data isolation.

**ERD Image Location:**  
`docs/images/database-erd.png`

---

## 3. API Architecture

### Authentication Module

- **POST /api/auth/register-tenant**  
  Auth Required: No  
  Roles: Public  

- **POST /api/auth/login**  
  Auth Required: No  
  Roles: Public  

- **POST /api/auth/logout**  
  Auth Required: Yes  
  Roles: All authenticated users

---

### Tenant Module

- **GET /api/tenant/me**  
  Auth Required: Yes  
  Roles: Tenant Admin  

- **GET /api/tenants**  
  Auth Required: Yes  
  Roles: Super Admin  

- **PATCH /api/tenant/plan**  
  Auth Required: Yes  
  Roles: Super Admin

---

### User Module

- **POST /api/users**  
  Auth Required: Yes  
  Roles: Tenant Admin  

- **GET /api/users**  
  Auth Required: Yes  
  Roles: Tenant Admin  

- **GET /api/users/:id**  
  Auth Required: Yes  
  Roles: Tenant Admin  

- **DELETE /api/users/:id**  
  Auth Required: Yes  
  Roles: Tenant Admin 

---

### Project Module

- **POST /api/projects**  
  Auth Required: Yes  
  Roles: Tenant Admin  

- **GET /api/projects**  
  Auth Required: Yes  
  Roles: Tenant Admin, User  

- **GET /api/projects/:id**  
  Auth Required: Yes  
  Roles: Tenant Admin, End User  

- **DELETE /api/projects/:id**  
  Auth Required: Yes  
  Roles: Tenant Admin

---

### Task Module

- **POST /api/tasks**  
  Auth Required: Yes  
  Roles: Tenant Admin, User  

- **GET /api/tasks**  
  Auth Required: Yes  
  Roles: Tenant Admin, User  

- **GET /api/tasks/:id**  
  Auth Required: Yes  
  Roles: Tenant Admin, End User  

- **PATCH /api/tasks/:id**  
  Auth Required: Yes  
  Roles: Tenant Admin, End User

---

### System Module

- **GET /api/health**  
  Auth Required: No  
  Roles: Public  

- **GET /api/audit-logs**  
  Auth Required: Yes  
  Roles: Super Admin, Tenant Admin
