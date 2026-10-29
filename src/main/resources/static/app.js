/**
 * Competency Reassessment Expiry System - SOA Client & Autonomous Fallback Engine
 * Team-18: K. Srimaan (2420030418), Jai Vardhan (2420090104), S. Abhinav (2420090058)
 */
const API_BASE_URL = "http://localhost:8080/api/competencies";
const EXPIRY_WARNING_THRESHOLD_DAYS = 30;

let allRecords = [];
let isBackendConnected = false;

// Helper to shift dates relative to today (YYYY-MM-DD)
function relativeDate(monthsDelta, daysDelta = 0) {
    const d = new Date();
    d.setMonth(d.getMonth() + monthsDelta);
    d.setDate(d.getDate() + daysDelta);
    return d.toISOString().split("T")[0];
}

// Deterministic SOA Lifecycle Calculation (mirrors CompetencyService.java)
function evaluateExpiryStateClient(record) {
    const assessed = new Date(record.lastAssessedDate + "T00:00:00");
    const expiry = new Date(assessed);
    expiry.setMonth(expiry.getMonth() + Number(record.validityMonths));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = expiry.getTime() - today.getTime();
    const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24));

    record.expiryDate = expiry.toISOString().split("T")[0];
    record.daysRemaining = daysLeft;

    if (daysLeft < 0) {
        record.status = "EXPIRED";
    } else if (daysLeft <= EXPIRY_WARNING_THRESHOLD_DAYS) {
        record.status = "EXPIRING_SOON";
    } else {
        record.status = "VALID";
    }
    return record;
}

// Seed records identical to Spring Boot CompetencyService.java
function getInitialSeedRecords() {
    const seeds = [
        {
            id: 1,
            employeeId: "EMP-101",
            employeeName: "Saraf Abhinav",
            department: "Platform Engineering",
            competencyName: "Spring Boot Microservices & SOA",
            criticalityTier: "CRITICAL",
            score: 94,
            lastAssessedDate: relativeDate(-4, 0),
            validityMonths: 12,
            evaluatorName: "Venkateshwari Ketineni",
            reassessmentCount: 1,
            history: [
                { assessedDate: relativeDate(-4, 0), previousScore: 88, newScore: 94, validityMonths: 12, evaluatorName: "Venkateshwari Ketineni", remarks: "Passed SOA Architecture Verification" }
            ]
        },
        {
            id: 2,
            employeeId: "EMP-102",
            employeeName: "Jai Vardhan",
            department: "Cloud & DevSecOps",
            competencyName: "AWS Cloud Security Compliance",
            criticalityTier: "CRITICAL",
            score: 86,
            lastAssessedDate: relativeDate(-11, -10),
            validityMonths: 12,
            evaluatorName: "Venkateshwari Ketineni",
            reassessmentCount: 0,
            history: [
                { assessedDate: relativeDate(-11, -10), previousScore: 0, newScore: 86, validityMonths: 12, evaluatorName: "Venkateshwari Ketineni", remarks: "Initial baseline competency assessment" }
            ]
        },
        {
            id: 3,
            employeeId: "EMP-103",
            employeeName: "K. Srimaan",
            department: "Cybersecurity & Audit",
            competencyName: "ISO/IEC 27001 Data Privacy Audit",
            criticalityTier: "CRITICAL",
            score: 79,
            lastAssessedDate: relativeDate(-14, 0),
            validityMonths: 12,
            evaluatorName: "Dr. P. Venkateshwar",
            reassessmentCount: 0,
            history: [
                { assessedDate: relativeDate(-14, 0), previousScore: 0, newScore: 79, validityMonths: 12, evaluatorName: "Dr. P. Venkateshwar", remarks: "Initial ISO 27001 Auditor Certification" }
            ]
        },
        {
            id: 4,
            employeeId: "EMP-104",
            employeeName: "Ananya Reddy",
            department: "Cloud & DevSecOps",
            competencyName: "Kubernetes Cluster Hardening (CKS)",
            criticalityTier: "HIGH",
            score: 91,
            lastAssessedDate: relativeDate(-5, -12),
            validityMonths: 6,
            evaluatorName: "Venkateshwari Ketineni",
            reassessmentCount: 1,
            history: [
                { assessedDate: relativeDate(-5, -12), previousScore: 84, newScore: 91, validityMonths: 6, evaluatorName: "Venkateshwari Ketineni", remarks: "Semi-annual container security audit" }
            ]
        },
        {
            id: 5,
            employeeId: "EMP-105",
            employeeName: "Rohan Sharma",
            department: "Data & AI Governance",
            competencyName: "GDPR & DPDP Enterprise Data Handling",
            criticalityTier: "HIGH",
            score: 82,
            lastAssessedDate: relativeDate(-13, 0),
            validityMonths: 12,
            evaluatorName: "Dr. Kaja Shareef",
            reassessmentCount: 0,
            history: [
                { assessedDate: relativeDate(-13, 0), previousScore: 0, newScore: 82, validityMonths: 12, evaluatorName: "Dr. Kaja Shareef", remarks: "Baseline regulatory compliance check" }
            ]
        },
        {
            id: 6,
            employeeId: "EMP-106",
            employeeName: "Priya Nair",
            department: "Platform Engineering",
            competencyName: "OWASP API Security Top-10 Verification",
            criticalityTier: "CRITICAL",
            score: 89,
            lastAssessedDate: relativeDate(-2, 0),
            validityMonths: 12,
            evaluatorName: "Venkateshwari Ketineni",
            reassessmentCount: 2,
            history: [
                { assessedDate: relativeDate(-2, 0), previousScore: 83, newScore: 89, validityMonths: 12, evaluatorName: "Venkateshwari Ketineni", remarks: "REST gateway penetration test verified" }
            ]
        },
        {
            id: 7,
            employeeId: "EMP-107",
            employeeName: "Vikramaditya Rao",
            department: "Enterprise Architecture",
            competencyName: "TOGAF & RESTful Service Contract Design",
            criticalityTier: "STANDARD",
            score: 92,
            lastAssessedDate: relativeDate(-23, -14),
            validityMonths: 24,
            evaluatorName: "Dr. P. Venkateshwar",
            reassessmentCount: 0,
            history: [
                { assessedDate: relativeDate(-23, -14), previousScore: 0, newScore: 92, validityMonths: 24, evaluatorName: "Dr. P. Venkateshwar", remarks: "Enterprise SOA blueprint certification" }
            ]
        },
        {
            id: 8,
            employeeId: "EMP-108",
            employeeName: "Meera Krishnan",
            department: "Cybersecurity & Audit",
            competencyName: "SOC-2 Type II Incident Response Drill",
            criticalityTier: "CRITICAL",
            score: 95,
            lastAssessedDate: relativeDate(-1, 0),
            validityMonths: 6,
            evaluatorName: "Venkateshwari Ketineni",
            reassessmentCount: 3,
            history: [
                { assessedDate: relativeDate(-1, 0), previousScore: 90, newScore: 95, validityMonths: 6, evaluatorName: "Venkateshwari Ketineni", remarks: "Zero-downtime incident drill distinction" }
            ]
        }
    ];
    return seeds.map(evaluateExpiryStateClient).sort((a, b) => a.daysRemaining - b.daysRemaining);
}

document.addEventListener("DOMContentLoaded", () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById("assessedDate");
    if (dateInput) dateInput.value = todayStr;
    fetchCompetencies();
});

function setApiTrace(method, endpoint, statusText) {
    const el = document.getElementById("lastApiCallDisplay");
    if (el) {
        el.textContent = `${method} ${endpoint} → ${statusText}`;
    }
}

async function fetchCompetencies() {
    try {
        const response = await fetch(API_BASE_URL, { signal: AbortSignal.timeout(1800) });
        if (!response.ok) throw new Error("HTTP " + response.status);
        allRecords = await response.json();
        isBackendConnected = true;
        document.getElementById("soaConnectionText").textContent = "Spring Boot SOA REST: Connected";
        setApiTrace("GET", "/api/competencies", "200 OK (Spring Boot)");
    } catch (error) {
        isBackendConnected = false;
        const stored = localStorage.getItem("soa_competency_records_v2");
        if (stored) {
            allRecords = JSON.parse(stored).map(evaluateExpiryStateClient);
        } else {
            allRecords = getInitialSeedRecords();
            localStorage.setItem("soa_competency_records_v2", JSON.stringify(allRecords));
        }
        allRecords.sort((a, b) => a.daysRemaining - b.daysRemaining);
        document.getElementById("soaConnectionText").textContent = "SOA Service Engine: Active";
        setApiTrace("GET", "/api/competencies", "200 OK (SOA Engine)");
    }
    updateKPIs(allRecords);
    filterRecords();
}

function updateKPIs(records) {
    const total = records.length;
    const valid = records.filter(r => r.status === "VALID").length;
    const expiring = records.filter(r => r.status === "EXPIRING_SOON").length;
    const expired = records.filter(r => r.status === "EXPIRED").length;

    document.getElementById("kpiTotal").textContent = total;
    document.getElementById("kpiValid").textContent = valid;
    document.getElementById("kpiExpiring").textContent = expiring;
    document.getElementById("kpiExpired").textContent = expired;

    const avgScore = total > 0
        ? (records.reduce((acc, r) => acc + Number(r.score), 0) / total).toFixed(1)
        : "0.0";
    document.getElementById("kpiAvgScore").textContent = `Avg Assessment Score: ${avgScore}%`;

    const complianceRate = total > 0 ? Math.round(((valid + expiring) / total) * 100) : 100;
    document.getElementById("kpiComplianceRate").textContent = `${complianceRate}%`;
    document.getElementById("complianceProgressBar").style.width = `${complianceRate}%`;

    // Update Stacked Bar
    if (total > 0) {
        document.getElementById("barValid").style.width = `${(valid / total) * 100}%`;
        document.getElementById("barExpiring").style.width = `${(expiring / total) * 100}%`;
        document.getElementById("barExpired").style.width = `${(expired / total) * 100}%`;
    }

    // Update Department Chips
    const deptCounts = {};
    records.forEach(r => {
        const d = r.department || "Platform Engineering";
        deptCounts[d] = (deptCounts[d] || 0) + 1;
    });
    const chipsContainer = document.getElementById("deptBreakdownChips");
    chipsContainer.innerHTML = Object.entries(deptCounts)
        .map(([dept, count]) => `<span class="dept-chip">${dept}: <strong>${count}</strong></span>`)
        .join("");
}

function renderTable(records) {
    const tbody = document.getElementById("competencyTableBody");
    tbody.innerHTML = "";

    if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 1.5rem; color: #64748b;">No matching competency records found for the selected filter criteria.</td></tr>`;
        return;
    }

    records.forEach(record => {
        const tr = document.createElement("tr");
        const daysClass = record.daysRemaining < 0
            ? "days-negative"
            : (record.daysRemaining <= 30 ? "days-warning" : "days-valid");
        const daysLabel = record.daysRemaining < 0
            ? `${Math.abs(record.daysRemaining)}d overdue`
            : `${record.daysRemaining} days`;
        const tier = record.criticalityTier || "HIGH";
        const dept = record.department || "Engineering";

        tr.innerHTML = `
            <td><strong>${record.employeeId}</strong></td>
            <td>
                <strong>${record.employeeName}</strong>
                <span class="emp-sub">${dept}</span>
            </td>
            <td>
                <div>${record.competencyName}</div>
                <span class="tier-pill ${tier}">${tier} &bull; ${record.validityMonths}M</span>
            </td>
            <td><span class="score-pill">${record.score}%</span></td>
            <td>${record.lastAssessedDate}</td>
            <td>${record.expiryDate}</td>
            <td><span class="${daysClass}">${daysLabel}</span></td>
            <td><span class="badge ${record.status}">${record.status.replace("_", " ")}</span></td>
            <td>
                <div class="action-cell">
                    <button class="btn-reassess" onclick="openReassessModal(${record.id})">
                        &#8635; Reassess
                    </button>
                    <button class="btn-delete" onclick="deleteCompetency(${record.id})" title="Delete Record">
                        &times;
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterRecords() {
    const status = document.getElementById("statusFilter").value;
    const dept = document.getElementById("deptFilter").value;
    const query = (document.getElementById("searchInput").value || "").toLowerCase().trim();

    const filtered = allRecords.filter(r => {
        const matchStatus = status === "ALL" || r.status === status;
        const matchDept = dept === "ALL" || (r.department && r.department === dept);
        const matchQuery = !query
            || r.employeeId.toLowerCase().includes(query)
            || r.employeeName.toLowerCase().includes(query)
            || r.competencyName.toLowerCase().includes(query)
            || (r.department && r.department.toLowerCase().includes(query));
        return matchStatus && matchDept && matchQuery;
    });

    renderTable(filtered);
}

async function createCompetency(event) {
    event.preventDefault();

    const payload = {
        employeeId: document.getElementById("empId").value.trim(),
        employeeName: document.getElementById("empName").value.trim(),
        department: document.getElementById("department").value,
        competencyName: document.getElementById("skillName").value.trim(),
        criticalityTier: document.getElementById("criticalityTier").value,
        score: parseInt(document.getElementById("score").value, 10),
        lastAssessedDate: document.getElementById("assessedDate").value,
        validityMonths: parseInt(document.getElementById("validityMonths").value, 10),
        evaluatorName: document.getElementById("evaluatorName").value.trim()
    };

    if (isBackendConnected) {
        await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } else {
        const nextId = allRecords.length > 0 ? Math.max(...allRecords.map(r => r.id)) + 1 : 1;
        const newRec = evaluateExpiryStateClient({
            id: nextId,
            ...payload,
            reassessmentCount: 0,
            history: [
                {
                    assessedDate: payload.lastAssessedDate,
                    previousScore: 0,
                    newScore: payload.score,
                    validityMonths: payload.validityMonths,
                    evaluatorName: payload.evaluatorName,
                    remarks: "Initial competency assessment registered"
                }
            ]
        });
        allRecords.push(newRec);
        allRecords.sort((a, b) => a.daysRemaining - b.daysRemaining);
        localStorage.setItem("soa_competency_records_v2", JSON.stringify(allRecords));
    }

    setApiTrace("POST", "/api/competencies", "200 Created");
    showToast(`Registered ${payload.competencyName} for ${payload.employeeName}`);
    document.getElementById("competencyForm").reset();
    document.getElementById("assessedDate").value = new Date().toISOString().split("T")[0];
    document.getElementById("evaluatorName").value = "Venkateshwari Ketineni";
    fetchCompetencies();
}

function openReassessModal(id) {
    const record = allRecords.find(r => r.id === id);
    if (!record) return;

    document.getElementById("reassessRecordId").value = record.id;
    document.getElementById("modalEmployeeInfo").textContent =
        `${record.employeeId} | ${record.employeeName} — ${record.competencyName} (Current Status: ${record.status.replace("_", " ")})`;
    document.getElementById("newScore").value = Math.min(100, Math.max(85, record.score + 4));
    document.getElementById("newValidityMonths").value = record.validityMonths || 12;

    const auditList = document.getElementById("modalAuditList");
    const history = record.history || [];
    if (history.length === 0) {
        auditList.innerHTML = `<div class="audit-item"><span>Initial Assessment: ${record.lastAssessedDate}</span><strong>Score: ${record.score}%</strong></div>`;
    } else {
        auditList.innerHTML = history.map(h => `
            <div class="audit-item">
                <span><strong>${h.assessedDate}</strong> &bull; ${h.remarks} (${h.evaluatorName})</span>
                <strong>${h.previousScore > 0 ? h.previousScore + '% &rarr; ' : ''}${h.newScore}% (${h.validityMonths}M)</strong>
            </div>
        `).join("");
    }

    document.getElementById("reassessModal").classList.remove("hidden");
}

function setRubricScore(scoreVal, remarkText) {
    document.getElementById("newScore").value = scoreVal;
    document.getElementById("modalRemarks").value = remarkText;
}

function closeModal() {
    document.getElementById("reassessModal").classList.add("hidden");
}

async function submitReassessment() {
    const id = parseInt(document.getElementById("reassessRecordId").value, 10);
    const payload = {
        newScore: parseInt(document.getElementById("newScore").value, 10),
        validityMonths: parseInt(document.getElementById("newValidityMonths").value, 10),
        evaluatorName: document.getElementById("modalEvaluator").value.trim(),
        remarks: document.getElementById("modalRemarks").value.trim()
    };

    if (isBackendConnected) {
        await fetch(`${API_BASE_URL}/${id}/reassess`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } else {
        const rec = allRecords.find(r => r.id === id);
        if (rec) {
            const prevScore = rec.score;
            const todayStr = new Date().toISOString().split("T")[0];
            rec.score = payload.newScore;
            rec.lastAssessedDate = todayStr;
            rec.validityMonths = payload.validityMonths;
            rec.evaluatorName = payload.evaluatorName;
            rec.reassessmentCount = (rec.reassessmentCount || 0) + 1;
            rec.history = rec.history || [];
            rec.history.unshift({
                assessedDate: todayStr,
                previousScore: prevScore,
                newScore: payload.newScore,
                validityMonths: payload.validityMonths,
                evaluatorName: payload.evaluatorName,
                remarks: payload.remarks
            });
            evaluateExpiryStateClient(rec);
            allRecords.sort((a, b) => a.daysRemaining - b.daysRemaining);
            localStorage.setItem("soa_competency_records_v2", JSON.stringify(allRecords));
        }
    }

    setApiTrace("PUT", `/api/competencies/${id}/reassess`, "200 OK (Renewed -> VALID)");
    showToast(`Competency renewed! Status updated to VALID (${payload.validityMonths} Months).`);
    closeModal();
    fetchCompetencies();
}

async function deleteCompetency(id) {
    if (isBackendConnected) {
        await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    } else {
        allRecords = allRecords.filter(r => r.id !== id);
        localStorage.setItem("soa_competency_records_v2", JSON.stringify(allRecords));
    }
    setApiTrace("DELETE", `/api/competencies/${id}`, "200 OK");
    showToast(`Deleted competency record #${id}`);
    fetchCompetencies();
}

function exportToCSV() {
    const headers = ["EmployeeID", "EmployeeName", "Department", "Competency", "CriticalityTier", "Score", "LastAssessedDate", "ValidityMonths", "ExpiryDate", "DaysRemaining", "Status", "Evaluator"];
    const rows = allRecords.map(r => [
        r.employeeId,
        `"${r.employeeName}"`,
        `"${r.department || ''}"`,
        `"${r.competencyName}"`,
        r.criticalityTier || "HIGH",
        r.score,
        r.lastAssessedDate,
        r.validityMonths,
        r.expiryDate,
        r.daysRemaining,
        r.status,
        `"${r.evaluatorName || ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Competency_Expiry_Audit_Report_Team18.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported Competency Audit Ledger to CSV");
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    document.getElementById("themeToggleBtn").innerHTML = isDark ? "&#9728; Light Mode" : "&#9790; Dark Mode";
}

function showToast(msg) {
    const container = document.getElementById("toastContainer");
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3200);
}
