/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.sim.spriced.defnition.data.repo.impl;

import com.sim.spriced.defnition.data.repo.IRolePermissionRepo;
import com.sim.spriced.framework.models.RoleEntityPermissionMapping;
import com.sim.spriced.framework.models.RoleGroupPermissionMapping;
import com.sim.spriced.framework.repo.BaseRepo;
import java.util.Arrays;
import java.util.List;
import org.jooq.Condition;
import org.springframework.stereotype.Repository;

/**
 *
 * @author mukil.manohar_simadv
 */
@Repository
public class RolePermissionRepo extends BaseRepo implements IRolePermissionRepo {

    private static final String ROLE_ENTITY_PERMISSION_TABLE = "roleentitypermissionmapping";
    private static final String ROLE_GRPUP_PERMISSION_TABLE = "rolegrouppermissionmapping";

//    public List<RoleEntityPermissionMapping> create(List<RoleEntityPermissionMapping> entityPermissions) {
//        return context.insertInto(DBUtils.getTable(ROLE_ENTITY_PERMISSION_TABLE))
//                .values(entityPermissions.get(0))
//                .returning(DSL.asterisk())
//                .fetch()
//                .into(RoleEntityPermissionMapping.class);
//    }
    public int create(RoleGroupPermissionMapping groupPermissions) {
        return createWithoutReturn(groupPermissions);
    }

    public int create(List<RoleEntityPermissionMapping> entityPermissions) {
        int status = 0;
        int index = 0;
        do {
            status = createWithoutReturn(entityPermissions.get(index));
            index++;

        } while (status > 0 && index < entityPermissions.size());
        return status;
    }

    @Override
    public List<RoleGroupPermissionMapping> fetchRoleGroupMapping(int group_id, String roles[]) {
        if (roles == null || roles.length == 0) {
            roles = contextManager.getRequestContext().getRoles();
        }
        Condition roleCondition = column("role").in(Arrays.asList(roles));
        Condition groupCondition = column("group_id").eq(group_id);

        return super.fetchAll(RoleGroupPermissionMapping.TABLE, roleCondition.and(groupCondition), RoleGroupPermissionMapping.class);
    }

    @Override
    public List<RoleEntityPermissionMapping> fetchRoleEntityMappings(int group_id, String roles[]) {
        if (roles == null || roles.length == 0) {
            roles = contextManager.getRequestContext().getRoles();
        }
        Condition roleCondition = column("role").in(Arrays.asList(roles));
        Condition groupCondition = column("group_id").eq(group_id);

        return super.fetchAll(RoleEntityPermissionMapping.TABLE, roleCondition.and(groupCondition), RoleEntityPermissionMapping.class);
    }

    @Override
    public List<RoleEntityPermissionMapping> fetchRoleEntityMapping(int entity_id, String roles[]) {
        if (roles == null || roles.length == 0) {
            roles = contextManager.getRequestContext().getRoles();
        }
        Condition roleCondition = column("role").in(Arrays.asList(roles));
        Condition entityCondition = column("entity_id").eq(entity_id);
        return super.fetchAll(RoleEntityPermissionMapping.TABLE, roleCondition.and(entityCondition), RoleEntityPermissionMapping.class);
    }

}
