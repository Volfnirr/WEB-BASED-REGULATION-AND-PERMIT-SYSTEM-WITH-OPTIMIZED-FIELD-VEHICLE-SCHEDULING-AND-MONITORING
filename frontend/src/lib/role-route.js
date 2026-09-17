const roles = {
  SUPER_ADMIN: "/super-admin/dashboard",
  APPLICATION_ADMIN: "/application-admin/dashboard",
  VEHICLE_ADMIN: "/vehicle/dashboard",
  USER: "/applicant/my-applications",
};
export function getRoleRoute(role) {
  return roles[role];
}
