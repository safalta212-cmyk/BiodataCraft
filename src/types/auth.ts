/**
 * Admin Authentication & Authorization Types
 * Supports Role-Based Access Control (RBAC) for administration
 */

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export type AdminPermission =
  | 'manage_templates'
  | 'manage_categories'
  | 'view_analytics'
  | 'manage_blog'
  | 'manage_settings'
  | 'manage_admins';

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'manage_templates',
    'manage_categories',
    'view_analytics',
    'manage_blog',
    'manage_settings',
    'manage_admins'
  ],
  admin: [
    'manage_templates',
    'manage_categories',
    'view_analytics',
    'manage_blog',
    'manage_settings'
  ],
  editor: ['manage_templates', 'manage_categories', 'manage_blog'],
  viewer: ['view_analytics']
};

export interface AdminUser {
  uid: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  displayName?: string;
  photoURL?: string;
  lastLoginAt?: number;
}

/**
 * Checks if a specific role possesses a given permission
 */
export function hasPermission(role: AdminRole, permission: AdminPermission): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
}
