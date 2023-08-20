package com.sim.spriced.user.access.service;

import java.util.List;

public interface IRoleManagementService {
	void addRole(String roleName);
	void deleteRole(String roleName);
	List<String> getRoles();
	
}
