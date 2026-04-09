/** Profesor o administrador: sin ciclo de recompra ni pérdida de plan por fecha. */
export function isTeacherOrAdminRole(rol: string | null | undefined): boolean {
  return rol === 'teacher' || rol === 'admin';
}
