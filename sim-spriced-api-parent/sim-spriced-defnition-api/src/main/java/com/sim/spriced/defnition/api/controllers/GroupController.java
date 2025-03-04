package com.sim.spriced.defnition.api.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.defnition.api.dto.GroupDto;
import com.sim.spriced.defnition.api.dto.GroupUpdateDto;
import com.sim.spriced.defnition.api.dto.mapper.GroupDtoMapper;
import com.sim.spriced.defnition.data.service.IGroupService;
import com.sim.spriced.framework.models.Group;

import io.micrometer.core.annotation.Timed;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Controller for managing the model
 * 
 * @author shabeeb
 *
 */
@RestController()
@RequestMapping("/models")
@CrossOrigin(origins = "*")
public class GroupController {

	@Autowired
	private IGroupService grpService;

	@Autowired
	private GroupDtoMapper mapper;

        @Timed(value = "group.getAll.time", description = "Time taken to return groups")
        @GetMapping()
        public ResponseEntity<List<GroupDto>> get(@RequestParam(required = false) String roleName) {
            return new ResponseEntity<>(
                    mapper.toGroupDtoList(
                            this.grpService.fetchAllByRole(false, roleName != null ? roleName.split(",") : null)),
                            HttpStatus.OK
                    );
        }

	@Timed(value = "group.get.time", description = "Time taken to return group")
	@GetMapping("/{id}")
	public ResponseEntity<GroupDto> get(@PathVariable int id) {
		return new ResponseEntity<>(mapper.toGroupDto(this.grpService.fetch(id, false)), HttpStatus.OK);
	}

	@Timed(value = "group.create.time", description = "Time taken to create group")
	@PostMapping
	public ResponseEntity<GroupDto> create(@Valid @RequestBody GroupDto group) {
		Group grp = mapper.toGroup(group);
		// while creating the group, it will be always enabled.
		grp.setIsDisabled(false);
		grp = this.grpService.create(grp);
		return new ResponseEntity<>(mapper.toGroupDto(grp), HttpStatus.CREATED);
	}

	@Timed(value = "group.change.time", description = "Time taken to change group")
	@PatchMapping("/{id}")
	public ResponseEntity<GroupDto> update(@Valid @RequestBody GroupUpdateDto group,@PathVariable int id) {
		
		Group grp = this.grpService.changeName(id, group.getDisplayName());
		return new ResponseEntity<>(mapper.toGroupDto(grp), HttpStatus.CREATED);

	}

	@Timed(value = "group.delete.time", description = "Time taken to delete group")
	@DeleteMapping("/{id}")
	public ResponseEntity<Integer> remove(@PathVariable int id) {
		return new ResponseEntity<>(this.grpService.delete(id), HttpStatus.OK);
	}
}
