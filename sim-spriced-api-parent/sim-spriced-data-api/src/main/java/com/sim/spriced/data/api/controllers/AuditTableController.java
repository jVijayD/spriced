package com.sim.spriced.data.api.controllers;

import com.sim.spriced.data.service.impl.AuditTrialService;
import com.sim.spriced.framework.annotations.CriteriaParam;
import com.sim.spriced.framework.data.filters.Criteria;
import io.micrometer.core.annotation.Timed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/audit-trial")
@CrossOrigin(origins = "*")
public class AuditTableController {
    @Autowired
    AuditTrialService auditTrialService;

    @Timed(value = "data.getAll.time", description = "Time taken to return all audits of the entity")
    @GetMapping("")
    public ResponseEntity<List<Map<String, Object>>> get(@CriteriaParam(required = false) Criteria searchCriteria){
        var result = this.auditTrialService.getAllAuditsOfEntity(searchCriteria);
        return new ResponseEntity(result, HttpStatus.OK);
    }
}
