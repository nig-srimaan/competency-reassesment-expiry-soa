package com.klh.soa.competency;

import com.klh.soa.competency.model.CompetencyRecord;
import com.klh.soa.competency.service.CompetencyService;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class CompetencyServiceTest {

    @Test
    void testExpiryStatusClassificationAndReassessment() {
        CompetencyService service = new CompetencyService();
        List<CompetencyRecord> initial = service.getAllRecords(null, null, null);
        assertTrue(initial.size() >= 3, "Initial seeded records should be present");

        // Create an expired competency record
        CompetencyRecord expiredRecord = new CompetencyRecord(
                null, "EMP-999", "Test Engineer", "Platform Engineering",
                "Zero Trust Architecture", "CRITICAL", 75,
                LocalDate.now().minusMonths(15), 12, "Venkateshwari Ketineni"
        );
        CompetencyRecord saved = service.saveRecord(expiredRecord);
        assertEquals("EXPIRED", saved.getStatus());
        assertTrue(saved.getDaysRemaining() < 0);

        // Reassess the expired record and verify renewal
        CompetencyRecord renewed = service.reassessCompetency(
                saved.getId(), 96, 12, "Venkateshwari Ketineni", "Passed Practical Lab"
        );
        assertEquals("VALID", renewed.getStatus());
        assertEquals(96, renewed.getScore());
        assertTrue(renewed.getDaysRemaining() > 300);
        assertEquals(1, renewed.getReassessmentCount());

        Map<String, Object> analytics = service.getComplianceAnalytics();
        assertNotNull(analytics.get("complianceRatePercent"));
    }
}
