package com.klh.soa.competency.model;

import java.time.LocalDate;

public class AssessmentHistory {
    private LocalDate assessedDate;
    private int previousScore;
    private int newScore;
    private int validityMonths;
    private String evaluatorName;
    private String remarks;

    public AssessmentHistory() {}

    public AssessmentHistory(LocalDate assessedDate, int previousScore, int newScore,
                             int validityMonths, String evaluatorName, String remarks) {
        this.assessedDate = assessedDate;
        this.previousScore = previousScore;
        this.newScore = newScore;
        this.validityMonths = validityMonths;
        this.evaluatorName = evaluatorName;
        this.remarks = remarks;
    }

    public LocalDate getAssessedDate() { return assessedDate; }
    public void setAssessedDate(LocalDate assessedDate) { this.assessedDate = assessedDate; }

    public int getPreviousScore() { return previousScore; }
    public void setPreviousScore(int previousScore) { this.previousScore = previousScore; }

    public int getNewScore() { return newScore; }
    public void setNewScore(int newScore) { this.newScore = newScore; }

    public int getValidityMonths() { return validityMonths; }
    public void setValidityMonths(int validityMonths) { this.validityMonths = validityMonths; }

    public String getEvaluatorName() { return evaluatorName; }
    public void setEvaluatorName(String evaluatorName) { this.evaluatorName = evaluatorName; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
