package com.sim.spriced.defnition.data.service.impl;

import com.sim.spriced.defnition.data.repo.impl.RolePermissionRepo;
import com.sim.spriced.defnition.data.service.IRolePermissionService;
import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.exceptions.data.CreateEntityException;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.models.RoleEntityPermissionMapping;
import com.sim.spriced.framework.models.RoleGroupPermissionMapping;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author mukil.manohar_simadv
 */
@Service
public class RolePermissionService implements IRolePermissionService {

    @Autowired
    RolePermissionRepo rolePermissionRepo;

    @Transactional
    @Override
    public int saveRoleEntityAccessPermissions(RoleGroupPermissionMapping groupPermission, List<RoleEntityPermissionMapping> entityPermissions) {

        RoleGroupPermissionMapping deleteGroup = new RoleGroupPermissionMapping();
        deleteGroup.setRole(groupPermission.getRole());
        deleteGroup.setGroupId(groupPermission.getGroupId());

        rolePermissionRepo.delete(deleteGroup);
        int status = rolePermissionRepo.create(groupPermission);
        if (status > 0) {
        }
        if (entityPermissions.size() > 0) {
            RoleEntityPermissionMapping deleteEnitty = new RoleEntityPermissionMapping();

            deleteEnitty.setRole(groupPermission.getRole());
            deleteEnitty.setGroupId(groupPermission.getGroupId());

            rolePermissionRepo.delete(deleteEnitty);
            status = rolePermissionRepo.create(entityPermissions);

        }
        if (status < 1) {
            throw new CreateEntityException("insertion failed at some point");
        }
        return status;
    }

    @Override
    public EntityDefnition applyPermission(EntityDefnition entityDefnition) {
        return applyPermission(entityDefnition, null);
    }

    @Override
    public EntityDefnition applyPermission(EntityDefnition entityDefnition, String[] roles) {
        //Fetching group permissions from DB
        List<RoleGroupPermissionMapping> groupPermissions = null;
        groupPermissions = rolePermissionRepo.fetchRoleGroupMapping(entityDefnition.getGroupId(), roles);
        // if there are multiple permissions are assigned for the same group 
        // choose least permission that has least priority
        ModelConstants.ModelPermission permission = getLeastPermission(groupPermissions.stream()
                .map(gp -> gp.getPermission())
                .distinct()
                .collect(Collectors.toList())
        );

        if (permission == ModelConstants.ModelPermission.PARTIAL) {
            // if group level permission is partial fetch entity level permission
            final List<RoleEntityPermissionMapping> entityPermissions = rolePermissionRepo.fetchRoleEntityMapping(entityDefnition.getId(), roles);
            permission = getLeastPermission(entityPermissions.stream()
                    .map((t) -> t.getPermission())
                    .collect(Collectors.toList())
            );
            // if entity level permission is partial then we have to check attribute level permissions
            if (permission == ModelConstants.ModelPermission.PARTIAL) {
                // loop through attributes in entity definition and check for permissions and select permission with least priority
                entityDefnition.getAttributes().stream()
                        .forEach(t -> t.setPermission(getLeastAttributePermissionById(entityPermissions, t.getId())));
                return (entityDefnition);
            }
        }
        ModelConstants.ModelPermission finalPermission = permission;
        entityDefnition.getAttributes().stream()
                .forEach(a -> a.setPermission(finalPermission));
        return (entityDefnition);
    }

    public EntityDefnition applyPermission(EntityDefnition entityDefnition, boolean filterAttributeByPermission) {
        return filterAttributeByPermission
                ? getAuthorizedEntity(applyPermission(entityDefnition))
                : applyPermission(entityDefnition);
    }

    @Override
    public List<EntityDefnition> applyPermission(List<EntityDefnition> entityDefnitions) {
        return entityDefnitions.stream()
                .map(e -> applyPermission(e))
                .collect(Collectors.toList());
    }

    @Override
    public List<EntityDefnition> applyPermission(List<EntityDefnition> entityDefnitions, String[] roles) {
        return entityDefnitions.stream()
                .map(e -> applyPermission(e, roles))
                .collect(Collectors.toList());
    }

    private ModelConstants.ModelPermission getLeastAttributePermissionById(List<RoleEntityPermissionMapping> entityPermissions, String id) {
        return getLeastPermission(
                entityPermissions.stream()
                        .filter(e -> e.getPermission() == ModelConstants.ModelPermission.PARTIAL)
                        .<ModelConstants.ModelPermission>mapMulti((a, c) -> {
                            Optional<ModelConstants.ModelPermission> opt = a.getAttributeDetails()
                                    .stream()
                                    .filter(fa -> fa.getId().equals(id))
                                    .map(aa -> aa.getPermission())
                                    .findAny();
                            if (!opt.isEmpty()) {
                                c.accept(opt.get());
                            }
                        }).collect(Collectors.toList())
        );
    }

    private ModelConstants.ModelPermission getLeastPermission(List<ModelConstants.ModelPermission> permissions) {
        if (permissions.isEmpty()) {
            return ModelConstants.ModelPermission.DENY;
        }
        return permissions
                .stream()
                .reduce(ModelConstants.ModelPermission.UPDATE, (t, u) -> t.getPriority() > u.getPriority() ? u : t);
    }

    private EntityDefnition getAuthorizedEntity(EntityDefnition entityDefnition) {
        entityDefnition.getAttributes().removeAll(entityDefnition
                .getAttributes()
                .stream()
                .filter(a1 -> a1.getPermission() == ModelConstants.ModelPermission.DENY)
                .collect(Collectors.toList())
        );
        return entityDefnition;
    }
}
