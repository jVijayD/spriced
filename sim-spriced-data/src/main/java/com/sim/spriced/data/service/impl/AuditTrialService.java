package com.sim.spriced.data.service.impl;

import com.sim.spriced.data.repo.impl.AuditTableRepo;
import com.sim.spriced.data.service.IAuditTableService;
import com.sim.spriced.framework.data.filters.Criteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class AuditTrialService implements IAuditTableService {
    @Autowired
    AuditTableRepo auditTableRepo;

    @Override
    public Page getAllAuditsOfEntity(Criteria searchCriteria) {
        return this.auditTableRepo.getAllAuditsOfEntity(searchCriteria);
    }
}
