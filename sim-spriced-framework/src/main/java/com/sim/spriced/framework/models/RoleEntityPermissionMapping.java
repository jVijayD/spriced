package com.sim.spriced.framework.models;

import javax.persistence.Column;
import javax.persistence.Table;

import com.sim.spriced.framework.annotations.ExtraColumnData;
import com.sim.spriced.framework.annotations.IDType;
import com.sim.spriced.framework.constants.ModelConstants;
import java.util.List;
import javax.persistence.Id;
import lombok.Data;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Component(value = "role_entity_permission_mapping")
@Getter
@Setter
@NoArgsConstructor
@Data
@Table(name = "role_entity_permission_mapping")
public class RoleEntityPermissionMapping extends BaseEntity {

    @Getter
    @Setter
    @NoArgsConstructor
    public static class AttributePermission {

        String id;
        ModelConstants.ModelPermission permission;
    }

    public static final String TABLE = "role_entity_permission_mapping";
    @ExtraColumnData(isPrimaryKey = true, id = IDType.AUTO)
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "entity_id")
    private Integer entityId;

    @Column(name = "group_id")
    private Integer groupId;

    @Column(name = "role")
    private String role;

    @Column(name = "permission")
    private ModelConstants.ModelPermission permission;

    @Column(name = "attribute_details")
    @ExtraColumnData(convertToJson = true, exclude = false)
    private List<AttributePermission> attributeDetails;

    public RoleEntityPermissionMapping(String role) {
        this.role = role;
    }

    @Override
    public boolean validate() {
        return true;
    }
}
