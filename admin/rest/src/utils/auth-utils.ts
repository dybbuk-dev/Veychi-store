import Cookie from 'js-cookie';
import SSRCookie from 'cookie';
import {
  AUTH_CRED,
  PERMISSIONS,
  STAFF,
  STORE_OWNER,
  SUPER_ADMIN,
  TOKEN,
  MARKETING,
  SHAREHOLDER,
  CEO,
  MANAGER_RH,
  MANAGEMENT,
  LEGAL,
} from './constants';

export const allowedRoles = [
  SUPER_ADMIN,
  STORE_OWNER,
  STAFF,
  MARKETING,
  SHAREHOLDER,
  CEO,
  MANAGER_RH,
  MANAGEMENT,
  LEGAL,
];
export const adminAndOwnerOnly = [
  SUPER_ADMIN,
  STORE_OWNER,
  SHAREHOLDER,
  CEO,
  MANAGER_RH,
  MANAGEMENT,
  LEGAL,
];
export const adminOwnerAndStaffOnly = [
  SUPER_ADMIN,
  STORE_OWNER,
  STAFF,
  MARKETING,
  SHAREHOLDER,
  CEO,
  MANAGER_RH,
  MANAGEMENT,
  LEGAL,
];
export const adminOnly = [
  SUPER_ADMIN,
  MARKETING,
  SHAREHOLDER,
  CEO,
  MANAGER_RH,
  MANAGEMENT,
  LEGAL,
];
export const ownerOnly = [STORE_OWNER];

export function setAuthCredentials(token: string, permissions: any) {
  Cookie.set(AUTH_CRED, JSON.stringify({ token, permissions }));
}

export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: string[] | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED];
  } else {
    authCred = Cookie.get(AUTH_CRED);
  }
  if (authCred) {
    return JSON.parse(authCred);
  }
  return { token: null, permissions: null };
}

export function parseSSRCookie(context: any) {
  return SSRCookie.parse(context.req.headers.cookie ?? '');
}

export function hasAccess(
  _allowedRoles: string[],
  _userPermissions: string[] | undefined | null
) {
  if (_userPermissions) {
    return Boolean(
      _allowedRoles?.find((aRole) => _userPermissions.includes(aRole))
    );
  }
  return false;
}
export function isAuthenticated(_cookies: any) {
  return (
    !!_cookies[TOKEN] &&
    Array.isArray(_cookies[PERMISSIONS]) &&
    !!_cookies[PERMISSIONS].length
  );
}
