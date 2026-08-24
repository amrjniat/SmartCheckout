import { jwtDecode } from 'jwt-decode';
import sessionService from './sessionService';

const CLAIM_NAME_IDENTIFIER =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const CLAIM_ROLE =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const CLAIM_NAME =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const CLAIM_FULL_NAME = 'FullName';
const CLAIM_BRANCH_ID = ['branchId', 'BranchId'];
const CLAIM_WAREHOUSE_ID = ['warehouseId', 'WarehouseId'];

export interface DecodedToken {
  exp: number;
  [key: string]: unknown;
}

function readStringClaim(decoded: DecodedToken, key: string): string | null {
  const value = decoded[key];
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}

function readNumericClaim(decoded: DecodedToken, keys: string[]): number | null {
  for (const key of keys) {
    const value = decoded[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number.parseInt(value, 10);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
}

export function getValidDecodedToken(
  token = sessionService.getToken(),
): DecodedToken | null {
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded || typeof decoded.exp !== 'number') return null;

  if (decoded.exp * 1000 < Date.now()) return null;

  const role = readStringClaim(decoded, CLAIM_ROLE);
  const userId = readNumericClaim(decoded, [CLAIM_NAME_IDENTIFIER]);
  if (!role || userId === null) return null;

  return decoded;
}

export function getCurrentUserId(): number | null {
  const decoded = getValidDecodedToken();
  return decoded ? readNumericClaim(decoded, [CLAIM_NAME_IDENTIFIER]) : null;
}

export function getCurrentUserRole(): string | null {
  const decoded = getValidDecodedToken();
  return decoded ? readStringClaim(decoded, CLAIM_ROLE) : null;
}

export function getCurrentUsername(): string | null {
  const decoded = getValidDecodedToken();
  return decoded ? readStringClaim(decoded, CLAIM_NAME) : null;
}

export function getCurrentUserFullName(): string | null {
  const decoded = getValidDecodedToken();
  return decoded ? readStringClaim(decoded, CLAIM_FULL_NAME) : null;
}

export function getCurrentBranchId(): number | null {
  const decoded = getValidDecodedToken();
  return decoded ? readNumericClaim(decoded, CLAIM_BRANCH_ID) : null;
}

export function getCurrentWarehouseId(): number | null {
  const decoded = getValidDecodedToken();
  return decoded ? readNumericClaim(decoded, CLAIM_WAREHOUSE_ID) : null;
}