const roles = {
  SUPER_ADMIN: "/super-admin",
  APPLICATION_ADMIN: "/application-admin",
  VEHICLE_ADMIN: "/vehicle",
  USER: "/applicant",
};
export function getRoleRoute(role) {
  return roles[role];
}
