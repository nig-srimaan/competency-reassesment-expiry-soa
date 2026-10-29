package com.klh.soa.competency.service;

import com.klh.soa.competency.model.AssessmentHistory;
import com.klh.soa.competency.model.CompetencyRecord;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class CompetencyService {

    private final Map<Long, CompetencyRecord> repository = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    private static final int EXPIRY_WARNING_THRESHOLD_DAYS = 30;

    public CompetencyService() {
        seedInitialData();
    }

    private void seedInitialData() {
        saveRecord(new CompetencyRecord(null, "EMP-101", "Saraf Abhinav", "Platform Engineering",
                "Spring Boot Microservices & SOA", "CRITICAL", 94, LocalDate.now().minusMonths(4), 12, "Venkateshwari Ketineni"));
        saveRecord(new CompetencyRecord(null, "EMP-102", "Jai Vardhan", "Cloud & DevSecOps",
                "AWS Cloud Security Compliance", "CRITICAL", 86, LocalDate.now().minusMonths(11).minusDays(10), 12, "Venkateshwari Ketineni"));
        saveRecord(new CompetencyRecord(null, "EMP-103", "K. Srimaan", "Cybersecurity & Audit",
                "ISO/IEC 27001 Data Privacy Audit", "CRITICAL", 79, LocalDate.now().minusMonths(14), 12, "Dr. P. Venkateshwar"));
        saveRecord(new CompetencyRecord(null, "EMP-104", "Ananya Reddy", "Cloud & DevSecOps",
                "Kubernetes Cluster Hardening (CKS)", "HIGH", 91, LocalDate.now().minusMonths(5).minusDays(12), 6, "Venkateshwari Ketineni"));
        saveRecord(new CompetencyRecord(null, "EMP-105", "Rohan Sharma", "Data & AI Governance",
                "GDPR & DPDP Enterprise Data Handling", "HIGH", 82, LocalDate.now().minusMonths(13), 12, "Dr. Kaja Shareef"));
        saveRecord(new CompetencyRecord(null, "EMP-106", "Priya Nair", "Platform Engineering",
                "OWASP API Security Top-10 Verification", "CRITICAL", 89, LocalDate.now().minusMonths(2), 12, "Venkateshwari Ketineni"));
        saveRecord(new CompetencyRecord(null, "EMP-107", "Vikramaditya Rao", "Enterprise Architecture",
                "TOGAF & RESTful Service Contract Design", "STANDARD", 92, LocalDate.now().minusMonths(23).minusDays(14), 24, "Dr. P. Venkateshwar"));
        saveRecord(new CompetencyRecord(null, "EMP-108", "Meera Krishnan", "Cybersecurity & Audit",
                "SOC-2 Type II Incident Response Drill", "CRITICAL", 95, LocalDate.now().minusMonths(1), 6, "Venkateshwari Ketineni"));
    }

    public List<CompetencyRecord> getAllRecords(String status, String department, String search) {
        List<CompetencyRecord> list = new ArrayList<>(repository.values());
        list.forEach(this::evaluateExpiryState);

        return list.stream()
                .filter(r -> status == null || status.equalsIgnoreCase("ALL") || r.getStatus().equalsIgnoreCase(status))
                .filter(r -> department == null || department.equalsIgnoreCase("ALL") || r.getDepartment().equalsIgnoreCase(department))
                .filter(r -> {
                    if (search == null || search.isBlank()) return true;
                    String q = search.toLowerCase();
                    return r.getEmployeeId().toLowerCase().contains(q)
                            || r.getEmployeeName().toLowerCase().contains(q)
                            || r.getCompetencyName().toLowerCase().contains(q)
                            || (r.getDepartment() != null && r.getDepartment().toLowerCase().contains(q));
                })
                .sorted(Comparator.comparingLong(CompetencyRecord::getDaysRemaining))
                .collect(Collectors.toList());
    }

    public CompetencyRecord getRecordById(Long id) {
        CompetencyRecord record = repository.get(id);
        if (record == null) {
            throw new NoSuchElementException("Competency record not found for ID: " + id);
        }
        evaluateExpiryState(record);
        return record;
    }

    public CompetencyRecord saveRecord(CompetencyRecord record) {
        if (record.getId() == null) {
            record.setId(idGenerator.getAndIncrement());
        }
        if (record.getDepartment() == null || record.getDepartment().isBlank()) {
            record.setDepartment("Platform Engineering");
        }
        if (record.getCriticalityTier() == null || record.getCriticalityTier().isBlank()) {
            record.setCriticalityTier("HIGH");
        }
        if (record.getEvaluatorName() == null || record.getEvaluatorName().isBlank()) {
            record.setEvaluatorName("Venkateshwari Ketineni");
        }
        if (record.getLastAssessedDate() == null) {
            record.setLastAssessedDate(LocalDate.now());
        }
        evaluateExpiryState(record);
        if (record.getHistory() == null || record.getHistory().isEmpty()) {
            List<AssessmentHistory> initHistory = new ArrayList<>();
            initHistory.add(new AssessmentHistory(
                    record.getLastAssessedDate(),
                    0,
                    record.getScore(),
                    record.getValidityMonths(),
                    record.getEvaluatorName(),
                    "Initial baseline competency assessment registered"
            ));
            record.setHistory(initHistory);
        }
        repository.put(record.getId(), record);
        return record;
    }

    public CompetencyRecord reassessCompetency(Long id, int newScore, int validityMonths, String evaluatorName, String remarks) {
        CompetencyRecord record = repository.get(id);
        if (record == null) {
            throw new NoSuchElementException("Competency record not found for ID: " + id);
        }
        int prevScore = record.getScore();
        String eval = (evaluatorName == null || evaluatorName.isBlank()) ? "Venkateshwari Ketineni" : evaluatorName;
        String note = (remarks == null || remarks.isBlank()) ? "Periodic SOA Reassessment Verified" : remarks;

        record.setScore(newScore);
        record.setLastAssessedDate(LocalDate.now());
        record.setValidityMonths(validityMonths);
        record.setEvaluatorName(eval);
        record.setReassessmentCount(record.getReassessmentCount() + 1);

        record.getHistory().add(0, new AssessmentHistory(
                LocalDate.now(),
                prevScore,
                newScore,
                validityMonths,
                eval,
                note
        ));

        evaluateExpiryState(record);
        return record;
    }

    public void deleteRecord(Long id) {
        if (!repository.containsKey(id)) {
            throw new NoSuchElementException("Competency record not found for ID: " + id);
        }
        repository.remove(id);
    }

    public Map<String, Object> getComplianceAnalytics() {
        List<CompetencyRecord> all = getAllRecords(null, null, null);
        long total = all.size();
        long valid = all.stream().filter(r -> "VALID".equals(r.getStatus())).count();
        long expiringSoon = all.stream().filter(r -> "EXPIRING_SOON".equals(r.getStatus())).count();
        long expired = all.stream().filter(r -> "EXPIRED".equals(r.getStatus())).count();
        double avgScore = all.stream().mapToInt(CompetencyRecord::getScore).average().orElse(0.0);
        double complianceRate = total > 0 ? Math.round(((double) (valid + expiringSoon) / total) * 1000.0) / 10.0 : 100.0;

        Map<String, Long> byDepartment = all.stream()
                .collect(Collectors.groupingBy(CompetencyRecord::getDepartment, Collectors.counting()));

        Map<String, Object> analytics = new LinkedHashMap<>();
        analytics.put("totalCompetencies", total);
        analytics.put("validCount", valid);
        analytics.put("expiringSoonCount", expiringSoon);
        analytics.put("expiredCount", expired);
        analytics.put("averageScore", Math.round(avgScore * 10.0) / 10.0);
        analytics.put("complianceRatePercent", complianceRate);
        analytics.put("departmentBreakdown", byDepartment);
        return analytics;
    }

    private void evaluateExpiryState(CompetencyRecord record) {
        LocalDate expiry = record.getLastAssessedDate().plusMonths(record.getValidityMonths());
        long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), expiry);
        record.setExpiryDate(expiry);
        record.setDaysRemaining(daysLeft);
        if (daysLeft < 0) {
            record.setStatus("EXPIRED");
        } else if (daysLeft <= EXPIRY_WARNING_THRESHOLD_DAYS) {
            record.setStatus("EXPIRING_SOON");
        } else {
            record.setStatus("VALID");
        }
    }
}
