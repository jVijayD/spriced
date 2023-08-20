package com.sim.spriced.user.access.service.impl;

import java.util.List;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sim.spriced.user.access.keycloak.KeycloakClientConfig;
import com.sim.spriced.user.access.service.IRoleManagementService;

@Service
public class RoleManagementService implements IRoleManagementService {

	@Autowired
	KeycloakClientConfig clientConfig;
	
	@Autowired
	Keycloak keycloak;

	@Override
	public void addRole(String roleName) {
		RoleRepresentation role = new RoleRepresentation();
		role.setName(roleName);
		this.keycloak.realm(clientConfig.getRealm()).roles().create(role);
	}

	@Override
	public void deleteRole(String roleName) {
		this.keycloak.realm(clientConfig.getRealm()).roles().deleteRole(roleName);
	}

	@Override
	public List<String> getRoles() {
		List<RoleRepresentation> roles = this.keycloak.realm(clientConfig.getRealm()).roles().list(false);
		return roles.stream().filter(item->item.getAttributes()!=null && item.getAttributes().containsKey("spriced")).map(item->item.getName()).toList();
	}

}
