# Competency Reassessment Expiry System (SOA Architecture)

![Java 17+](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot 3.2](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-RESTful_SOA-1E40AF?style=for-the-badge)
![License](https://img.shields.io/badge/KLH_University-Team_18-B91C1C?style=for-the-badge)

A **Service-Oriented Architecture (SOA)** web application designed to automate workforce competency lifecycle tracking, proactive expiration alerting (`VALID`, `EXPIRING_SOON`, `EXPIRED`), criticality tier classification, and one-click reassessment renewals with immutable audit history logging.

---

## 👥 Project Team (Team-18) — KLH University
* **K. Srimaan** — `2420030418` *(Team Lead)*
* **Jai Vardhan** — `2420090104`
* **S. Abhinav** — `2420090058`
* **Project Guide:** **Venkateshwari Ketineni** *(Department of CSE / CSIT, K L Deemed to be University)*

---

## 🚀 Key Features (Maxed-Out Edition)

1. **Automated Expiry Lifecycle Engine (`CompetencyService.java`)**
   * Dynamically evaluates every employee's `lastAssessedDate + validityMonths` against the current system date.
   * Classifies records into **VALID** (`> 30 days`), **EXPIRING SOON** (`0 to 30 days`), or **EXPIRED** (`< 0 days`) and sorts the ledger by urgency.
2. **Decoupled RESTful SOA Microservice (`CompetencyController.java`)**
   * Clean JSON over HTTP API supporting filtering by status, department, and search keywords, plus real-time workforce compliance analytics (`/api/competencies/analytics`).
3. **Interactive Reassessment & Audit History Modal**
   * Evaluators can log new reassessment scores, apply quick grading rubrics, extend validity durations (`6`, `12`, or `24` months), and inspect the complete historical reassessment trail for each record.
4. **Dual-Mode Deployment (Spring Boot + Autonomous Static Cloud Engine)**
   * Runs as a unified **Spring Boot 3.2** service on `http://localhost:8080` (or Docker/Render/Railway) AND includes an autonomous client-side SOA simulation engine in `docs/` so the live interactive dashboard works immediately on **GitHub Pages**, **Vercel**, or **Netlify** with zero backend configuration required.
5. **Enterprise Compliance Tooling**
   * Real-time KPI summary cards, Compliance Readiness SLA gauge, Department coverage chips, One-Click CSV Audit Export, Printable Audit View, and Dark/Light Theme toggle.

---

## 📂 Project Structure

```text
Competency-Reassessment-Expiry-SOA/
├── pom.xml                                      # Maven Spring Boot 3.2.5 Configuration
├── Dockerfile                                   # Multi-stage Docker build for Cloud Deployment
├── docker-compose.yml                           # Local Docker Compose orchestration
├── render.yaml                                  # 1-Click Render.com Cloud Blueprint
├── .github/workflows/ci-deploy.yml              # GitHub Actions CI (JUnit 5) + GitHub Pages CD
├── docs/                                        # Standalone Frontend for GitHub Pages / Vercel
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── src/
    ├── main/
    │   ├── java/com/klh/soa/competency/
    │   │   ├── CompetencyExpiryApplication.java # Spring Boot Main Application
    │   │   ├── config/CorsConfig.java           # Cross-Origin Resource Sharing (CORS)
    │   │   ├── controller/CompetencyController.java # RESTful SOA Endpoints
    │   │   ├── model/CompetencyRecord.java      # Core Competency Domain Model
    │   │   ├── model/AssessmentHistory.java     # Audit Trail Entry Model
    │   │   └── service/CompetencyService.java   # Expiry Calculation & Business Logic
    │   └── resources/
    │       ├── application.properties           # Server & Actuator Configuration
    │       └── static/                          # Embedded Web Dashboard served at :8080/
    │           ├── index.html
    │           ├── styles.css
    │           └── app.js
    └── test/
        └── java/com/klh/soa/competency/
            └── CompetencyServiceTest.java       # JUnit 5 Unit Tests for Expiry & Reassessment
```

---

## 🔌 RESTful SOA API Specification

| HTTP Method | Endpoint URI | Request Body / Query Params | Response Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/competencies` | Optional: `?status=`, `?department=`, `?search=` | Returns JSON array of competencies sorted by urgency (`daysRemaining`). |
| `GET` | `/api/competencies/{id}` | Path variable: `id` | Returns a single competency record with its full reassessment audit history. |
| `GET` | `/api/competencies/analytics` | None | Returns aggregated KPI metrics, compliance SLA %, and department counts. |
| `POST` | `/api/competencies` | `employeeId`, `employeeName`, `department`, `competencyName`, `criticalityTier`, `score`, `lastAssessedDate`, `validityMonths`, `evaluatorName` | Computes initial `expiryDate`, `daysRemaining`, and `status`, stores record, and returns created object. |
| `PUT` | `/api/competencies/{id}/reassess` | `newScore`, `validityMonths`, `evaluatorName`, `remarks` | Resets `lastAssessedDate` to today, recalculates `expiryDate`, appends audit log, and sets status to `VALID`. |
| `DELETE` | `/api/competencies/{id}` | Path variable: `id` | Deletes the specified competency record from the repository. |

---

## 🛠️ How to Run Locally & Deploy

### Option 1: Run Full-Stack with Maven & Spring Boot
```bash
mvn spring-boot:run
```
Then open **[http://localhost:8080](http://localhost:8080)** in your browser. Both the interactive dashboard and `/api/competencies` REST endpoints are served on port `8080`.

### Option 2: Run with Docker
```bash
docker compose up --build
```

### Option 3: Deploy to GitHub & Cloud in 2 Minutes
1. Create a new repository on GitHub and push all files in this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Competency Reassessment Expiry SOA System (Team-18)"
   git branch -M main
   git remote add origin https://github.com/<your-username>/competency-reassessment-expiry-soa.git
   git push -u origin main
   ```
2. **Instant Live Demo via GitHub Pages**:
   * Go to your GitHub repository **Settings → Pages**.
   * Under **Build and deployment**, select **GitHub Actions** (automatically configured via `.github/workflows/ci-deploy.yml`) or select **Deploy from a branch** → `main` → `/docs`.
3. **Full Java Backend Deployment (Render / Railway)**:
   * Connect your GitHub repository to **Render.com** or **Railway.app** — the included `Dockerfile` and `render.yaml` automatically build and expose the Spring Boot 3.2 service.
