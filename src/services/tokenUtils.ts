
import { jwtDecode } from 'jwt-decode';
import sessionService from './sessionService';

// أسماء الـ Claims الكاملة كما يرسلها الباك إند (JwtService.cs)
// ClaimTypes.NameIdentifier و ClaimTypes.Role بيتحولوا تلقائياً لهذا الشكل الطويل من .NET
const CLAIM_NAME_IDENTIFIER = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const CLAIM_ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const CLAIM_NAME = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
// "FullName" أُرسلت كـ Claim بسيط بدون schema، فبتضل زي ما هي
const CLAIM_FULL_NAME = 'FullName';

export interface DecodedToken {
  exp: number;
  [key: string]: unknown;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
}

export function getValidDecodedToken(token = sessionService.getToken()): DecodedToken | null {
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  const isExpired = decoded.exp * 1000 < Date.now();
  if (isExpired) return null;

  return decoded;
}

// الدالة الأساسية المطلوبة للخطوة الحالية
export function getCurrentUserId(): number | null {
  const decoded = getValidDecodedToken();
  if (!decoded) return null;

  const userId = decoded[CLAIM_NAME_IDENTIFIER];
  if (typeof userId === 'number') return userId;
  return typeof userId === 'string' ? parseInt(userId, 10) : null;
}

// دوال إضافية جاهزة لاستخدام لاحق (نفس المصدر، بلا تكرار كود)
export function getCurrentUserRole(): string | null {
  const decoded = getValidDecodedToken();
  const role = decoded?.[CLAIM_ROLE];
  return typeof role === 'string' ? role : null;
}

export function getCurrentUsername(): string | null {
  const decoded = getValidDecodedToken();
  const username = decoded?.[CLAIM_NAME];
  return typeof username === 'string' ? username : null;
}

export function getCurrentUserFullName(): string | null {
  const decoded = getValidDecodedToken();
  const fullName = decoded?.[CLAIM_FULL_NAME];
  return typeof fullName === 'string' ? fullName : null;
}