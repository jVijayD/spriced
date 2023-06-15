package com.sim.spriced.defnition.api.dto.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.sim.spriced.defnition.api.dto.GroupDto;
import com.sim.spriced.framework.models.Group;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface GroupDtoMapper {
	GroupDto toGroupDto(Group group);
	Group toGroup(GroupDto groupDto);
	List<GroupDto> toGroupDtoList(List<Group> groupList);
}
