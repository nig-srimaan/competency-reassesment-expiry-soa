package com.klh.soa.competency.controller;

import com.klh.soa.competency.model.CompetencyRecord;
import com.klh.soa.competency.service.CompetencyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/competencies")
@CrossOrigin(origins = "*")
public class CompetencyController {

    private final CompetencyService competencyService;

    public CompetencyController(CompetencyService competencyService) {
        this.competencyService = competencyService;
    }

    @GetMapping
    public ResponseEntity<List<CompetencyRecord>> getAllCompetencies(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(competencyService.getAllRecords(status, department, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompetencyRecord> getCompetencyById(@PathVariable Long id) {
        return ResponseEntity.ok(competencyService.getRecordById(id));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(competencyService.getComplianceAnalytics());
    }

    @PostMapping
    public ResponseEntity<CompetencyRecord> createCompetency(@RequestBody CompetencyRecord record) {
        return ResponseEntity.ok(competencyService.saveRecord(record));
    }

    @PutMapping("/{id}/reassess")
    public ResponseEntity<CompetencyRecord> reassessCompetency(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        int newScore = payload.containsKey("newScore") ? Integer.parseInt(payload.get("newScore").toString()) : 85;
        int validityMonths = payload.containsKey("validityMonths") ? Integer.parseInt(payload.get("validityMonths").toString()) : 12;
        String evaluatorName = payload.containsKey("evaluatorName") ? payload.get("evaluatorName").toString() : "Venkateshwari Ketineni";
        String remarks = payload.containsKey("remarks") ? payload.get("remarks").toString() : "Periodic SOA Reassessment Verified";
        return ResponseEntity.ok(competencyService.reassessCompetency(id, newScore, validityMonths, evaluatorName, remarks));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCompetency(@PathVariable Long id) {
        competencyService.deleteRecord(id);
        return ResponseEntity.ok(Map.of("message", "Competency record deleted successfully", "id", id.toString()));
    }
}
