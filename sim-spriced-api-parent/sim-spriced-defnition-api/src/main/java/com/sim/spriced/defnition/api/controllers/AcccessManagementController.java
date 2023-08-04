package com.sim.spriced.defnition.api.controllers;


import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.defnition.api.dto.RoleGroupPermissionMappingDto;
import com.sim.spriced.defnition.api.dto.mapper.RoleGroupPermissionMappingDtoMapper;
import com.sim.spriced.defnition.data.service.IRolePermissionService;
import com.sim.spriced.framework.models.RoleGroupPermissionMapping;

import io.micrometer.core.annotation.Timed;

/**
 * Controller for managing the model
 *
 * @author shabeeb
 *
 */
@RestController()
@RequestMapping("/accessmanagement")
@CrossOrigin(origins = "*")
public class AcccessManagementController {

    @Autowired
    private IRolePermissionService accessMngmntService;

    @Autowired
    private RoleGroupPermissionMappingDtoMapper mapper;

    @Timed(value = "modelaccess.create.time", description = "Time taken to create modelaccess")
    @PostMapping
    public ResponseEntity<RoleGroupPermissionMappingDto> create(@Valid @RequestBody RoleGroupPermissionMappingDto groupPermissionDTO) {
        RoleGroupPermissionMapping grp = mapper.toRoleGroupPermissionMapping(groupPermissionDTO);
        int status = this.accessMngmntService.saveRoleEntityAccessPermissions(grp,groupPermissionDTO.getEntityPermissions());
        if(status>0){
        return new ResponseEntity<>(
                mapper.toRoleGroupPermissionMappingDto(grp),
                HttpStatus.CREATED
        );
        }else{
          return new ResponseEntity<>(
                mapper.toRoleGroupPermissionMappingDto(grp),
                HttpStatus.NOT_MODIFIED
        );}
        
    }
}
