import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
};

export const ac = createAccessControl(statement);

export const USER = ac.newRole({});
export const APPLICATION_ADMIN = ac.newRole({});
export const VEHICLE_ADMIN = ac.newRole({});

export const superAdmin = ac.newRole({
  ...adminAc.statements,
});
