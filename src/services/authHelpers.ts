import sessionService from './sessionService';
import { decodeToken } from './tokenUtils';

export const getBranchIdFromToken = (): number | null => {
  const token = sessionService.getToken();
  if (!token) return null;

  try {
    const decoded = decodeToken(token);
    const branchId = decoded?.BranchId;
    if (typeof branchId !== 'string') return null;
    return parseInt(branchId, 10);
  } catch (err) {
    console.error('فشل فك التوكن:', err);
    return null;
  }
};