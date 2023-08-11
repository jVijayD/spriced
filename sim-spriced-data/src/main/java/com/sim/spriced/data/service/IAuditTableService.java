package com.sim.spriced.data.service;

import com.sim.spriced.framework.data.filters.Criteria;
import org.springframework.data.domain.Page;

public interface IAuditTableService {
    Page getAllAuditsOfEntity(Criteria searchCriteria);
}
