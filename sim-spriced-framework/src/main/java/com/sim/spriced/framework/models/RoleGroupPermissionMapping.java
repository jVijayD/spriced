package com.sim.spriced.framework.models;

import javax.persistence.Column;
import javax.persistence.Table;

import com.sim.spriced.framework.annotations.ExtraColumnData;
import com.sim.spriced.framework.annotations.IDType;
import com.sim.spriced.framework.constants.ModelConstants;
import javax.persistence.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Component(value = "role_group_permission_mapping")
@Getter
@Setter
@NoArgsConstructor
@Table(name = "role_group_permission_mapping")
public class RoleGroupPermissionMapping extends BaseEntity {

    public static final String TABLE = "role_group_permission_mapping";
    @ExtraColumnData(isPrimaryKey = true, id = IDType.AUTO)
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "group_id")
    private Integer groupId;

    @Column(name = "role")
    private String role;

    @Column(name = "permission")
    private ModelConstants.ModelPermission permission;
    

    public RoleGroupPermissionMapping(String role) {
        this.role = role;
    }

    @Override
    public boolean validate() {

        return true;
    }
}
