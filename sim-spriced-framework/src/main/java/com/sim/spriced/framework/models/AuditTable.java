package com.sim.spriced.framework.models;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Table;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "audit_table")
public class AuditTable extends BaseEntity{

    @Column(name = "id")
    private Integer id;

    @Column(name = "entity_name")
    private String entityName;

    @Column(name = "column_name")
    private String columnName;

    @Column(name = "prior_value")
    private String priorValue;

    @Column(name = "new_value")
    private String newValue;

    @Column(name = "action")
    private String action;

    @Column(name = "transaction_type")
    private String transactionType;


    @Override
    boolean validate() {
        return true;
    }
}
