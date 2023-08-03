/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.sim.spriced.defnition.api.dto;

import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.models.RoleEntityPermissionMapping;
import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.List;
import javax.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author mukil.manohar_simadv
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoleGroupPermissionMappingDto {

    public Integer id;
    public Integer group_id;
    public String role;
    public String permission;
    public OffsetDateTime updatedDate;
    public String updatedBy;

    public List<RoleEntityPermissionMapping> entityPermissions;
   

}
