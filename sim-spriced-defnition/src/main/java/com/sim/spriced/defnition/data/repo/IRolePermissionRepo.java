/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.sim.spriced.defnition.data.repo;

import com.sim.spriced.framework.models.RoleEntityPermissionMapping;
import com.sim.spriced.framework.models.RoleGroupPermissionMapping;
import java.util.List;
 
/**
 *
 * @author mukil.manohar_simadv
 */
public interface IRolePermissionRepo {

    List<RoleGroupPermissionMapping> fetchRoleGroupMapping(List<Integer> group_ids,String roles[]);
    List<RoleEntityPermissionMapping> fetchRoleEntityMappings(int group_id,String roles[]);
    List<RoleEntityPermissionMapping> fetchRoleEntityMapping(int entity_id,String roles[]);

}
