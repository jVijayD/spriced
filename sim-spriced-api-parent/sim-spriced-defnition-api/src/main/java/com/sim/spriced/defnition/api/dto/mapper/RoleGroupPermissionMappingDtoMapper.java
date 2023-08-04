package com.sim.spriced.defnition.api.dto.mapper;

import com.sim.spriced.defnition.api.dto.RoleGroupPermissionMappingDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import com.sim.spriced.framework.models.RoleGroupPermissionMapping;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.WARN)
public interface RoleGroupPermissionMappingDtoMapper {

    @Mapping(target = "permission", expression = "java(com.sim.spriced.framework.constants.ModelConstants.ModelPermission.valueOf(accessDto.getPermission()))")
    RoleGroupPermissionMapping toRoleGroupPermissionMapping(RoleGroupPermissionMappingDto accessDto);

    RoleGroupPermissionMappingDto toRoleGroupPermissionMappingDto(RoleGroupPermissionMapping groupPermission);

}
