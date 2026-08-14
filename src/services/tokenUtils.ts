// // أسماء الـ Claims الكاملة كما يرسلها الباك إند (JwtService.cs)
// // ClaimTypes.NameIdentifier و ClaimTypes.Role بيتحولوا تلقائياً لهذا الشكل الطويل من .NET
// const CLAIM_NAME_IDENTIFIER = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
// const CLAIM_ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
// const CLAIM_NAME = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
// // "FullName" أُرسلت كـ Claim بسيط بدون schema، فبتضل زي ما هي
// const CLAIM_FULL_NAME = 'FullName';

// interface DecodedToken {
//   exp: number;
//   [key: string]: any;
// }

// function decodeToken(token: string): DecodedToken | null {
//   try {
//     const payload = token.split('.')[1];
//     const decoded = JSON.parse(atob(payload));
//     return decoded;
//   } catch {
//     return null;
//   }
// }

// function getValidDecodedToken(): DecodedToken | null {
//   const token = sessionStorage.getItem('token'); // ⬅️ تغيير
//   if (!token) return null;

//   const decoded = decodeToken(token);
//   if (!decoded) return null;

//   const isExpired = decoded.exp * 1000 < Date.now();
//   if (isExpired) return null;

//   return decoded;
// }

// // الدالة الأساسية المطلوبة للخطوة الحالية
// export function getCurrentUserId(): number | null {
//   const decoded = getValidDecodedToken();
//   if (!decoded) return null;

//   const userId = decoded[CLAIM_NAME_IDENTIFIER];
//   return userId ? parseInt(userId, 10) : null;
// }

// // دوال إضافية جاهزة لاستخدام لاحق (نفس المصدر، بلا تكرار كود)
// export function getCurrentUserRole(): string | null {
//   const decoded = getValidDecodedToken();
//   return decoded ? decoded[CLAIM_ROLE] ?? null : null;
// }

// export function getCurrentUsername(): string | null {
//   const decoded = getValidDecodedToken();
//   return decoded ? decoded[CLAIM_NAME] ?? null : null;
// }

// export function getCurrentUserFullName(): string | null {
//   const decoded = getValidDecodedToken();
//   return decoded ? decoded[CLAIM_FULL_NAME] ?? null : null;
// }











// أسماء الـ Claims الكاملة كما يرسلها الباك إند (JwtService.cs)
// ClaimTypes.NameIdentifier و ClaimTypes.Role بيتحولوا تلقائياً لهذا الشكل الطويل من .NET
const CLAIM_NAME_IDENTIFIER = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const CLAIM_ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const CLAIM_NAME = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
// "FullName" أُرسلت كـ Claim بسيط بدون schema، فبتضل زي ما هي
const CLAIM_FULL_NAME = 'FullName';

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

function getValidDecodedToken(): DecodedToken | null {
  const token = localStorage.getItem('token'); // ✅ كان sessionStorage
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
  return userId ? parseInt(userId, 10) : null;
}

// دوال إضافية جاهزة لاستخدام لاحق (نفس المصدر، بلا تكرار كود)
export function getCurrentUserRole(): string | null {
  const decoded = getValidDecodedToken();
  return decoded ? decoded[CLAIM_ROLE] ?? null : null;
}

export function getCurrentUsername(): string | null {
  const decoded = getValidDecodedToken();
  return decoded ? decoded[CLAIM_NAME] ?? null : null;
}

export function getCurrentUserFullName(): string | null {
  const decoded = getValidDecodedToken();
  return decoded ? decoded[CLAIM_FULL_NAME] ?? null : null;
}