package com.sim.spriced.data.repo;

import com.sim.spriced.framework.data.filters.Criteria;
import org.springframework.data.domain.Page;

public interface IAuditTableRepo {
    Page getAllAuditsOfEntity(Criteria searchCriteria);
}
