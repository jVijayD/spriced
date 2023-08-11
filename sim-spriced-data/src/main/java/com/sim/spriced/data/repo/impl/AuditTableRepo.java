package com.sim.spriced.data.repo.impl;

import com.sim.spriced.data.repo.IAuditTableRepo;
import com.sim.spriced.framework.data.filters.Criteria;
import com.sim.spriced.framework.models.AuditTable;
import com.sim.spriced.framework.repo.BaseRepo;
import org.jooq.Field;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Repository;

import javax.persistence.Column;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AuditTableRepo extends BaseRepo implements IAuditTableRepo {

    @Override
    public Page getAllAuditsOfEntity(Criteria searchCriteria) {
       return this.fetchRecordsByCriteriaPage("audit_table", searchCriteria, this.getColumns());
    }

    private List<Field<Object>> getColumns() {
        List<Field<Object>> allFields = new ArrayList<>();
        Class<?> clazz = AuditTable.class;
        for (java.lang.reflect.Field field : clazz.getDeclaredFields()) {
            Column col = field.getAnnotation(Column.class);
            if (col != null) {
                String colName = col.name().toLowerCase();
                Field<Object> colField = column(colName);
                allFields.add(colField);
            }
        }
        return allFields;
    }

}
