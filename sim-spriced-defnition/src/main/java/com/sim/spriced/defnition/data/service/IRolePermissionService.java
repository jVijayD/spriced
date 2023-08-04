/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.sim.spriced.defnition.data.service;

import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.models.RoleEntityPermissionMapping;
import com.sim.spriced.framework.models.RoleGroupPermissionMapping;
import java.util.List;

/**
 *
 * @author mukil.manohar_simadv
 */
public interface IRolePermissionService {

//    public RoleGroupPermissionMapping saveRoleEntityAccessPermissions(RoleGroupPermissionMapping groupPermissions);
    public int saveRoleEntityAccessPermissions(RoleGroupPermissionMapping groupPermissions,List<RoleEntityPermissionMapping> entityDefnitions);

    public EntityDefnition applyPermission(EntityDefnition entityDefnition);

    public List<EntityDefnition> applyPermission(List<EntityDefnition> entityDefnitions);
    
    public EntityDefnition applyPermission(EntityDefnition entityDefnition,String[] roles);

    public List<EntityDefnition> applyPermission(List<EntityDefnition> entityDefnitions,String[] roles);
}
