package com.klh.soa.competency.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class CompetencyRecord {
    private Long id;
    private String employeeId;
    private String employeeName;
    private String department;
    private String competencyName;
    private String criticalityTier; // CRITICAL, HIGH, STANDARD
    private int score;
    private LocalDate lastAssessedDate;
    private int validityMonths;
    private LocalDate expiryDate;
    private long daysRemaining;
    private String status; // VALID, EXPIRING_SOON, EXPIRED
    private String evaluatorName;
    private int reassessmentCount;
    private List<AssessmentHistory> history = new ArrayList<>();

    public CompetencyRecord() {}

    public CompetencyRecord(Long id, String employeeId, String employeeName,
                            String department, String competencyName, String criticalityTier,
                            int score, LocalDate lastAssessedDate, int validityMonths,
                            String evaluatorName) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.department = department;
        this.competencyName = competencyName;
        this.criticalityTier = criticalityTier;
        this.score = score;
        this.lastAssessedDate = lastAssessedDate;
        this.validityMonths = validityMonths;
        this.evaluatorName = evaluatorName;
        this.reassessmentCount = 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCompetencyName() { return competencyName; }
    public void setCompetencyName(String competencyName) { this.competencyName = competencyName; }

    public String getCriticalityTier() { return criticalityTier; }
    public void setCriticalityTier(String criticalityTier) { this.criticalityTier = criticalityTier; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public LocalDate getLastAssessedDate() { return lastAssessedDate; }
    public void setLastAssessedDate(LocalDate lastAssessedDate) { this.lastAssessedDate = lastAssessedDate; }

    public int getValidityMonths() { return validityMonths; }
    public void setValidityMonths(int validityMonths) { this.validityMonths = validityMonths; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public long getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(long daysRemaining) { this.daysRemaining = daysRemaining; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEvaluatorName() { return evaluatorName; }
    public void setEvaluatorName(String evaluatorName) { this.evaluatorName = evaluatorName; }

    public int getReassessmentCount() { return reassessmentCount; }
    public void setReassessmentCount(int reassessmentCount) { this.reassessmentCount = reassessmentCount; }

    public List<AssessmentHistory> getHistory() { return history; }
    public void setHistory(List<AssessmentHistory> history) { this.history = history; }
}
