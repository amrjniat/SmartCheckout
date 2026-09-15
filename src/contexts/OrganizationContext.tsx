/* eslint-disable react-refresh/only-export-components */
import { useContext, useEffect, useState, type ReactNode } from 'react';
import sessionService from '../services/sessionService';
import { organizationContext } from './organizationContextValue';
import type { CurrentContext } from './organizationTypes';
import {
  getCurrentBranchId,
  getCurrentUserId,
  getCurrentUserRole,
  getCurrentWarehouseId,
} from '../services/tokenUtils';

function readPositiveNumber(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function readUserNumber(user: Record<string, unknown>, keys: string[], nestedKey: string): number | null {
  for (const key of keys) {
    const value = readPositiveNumber(user[key]);
    if (value !== null) return value;
  }

  const nestedValue = user[nestedKey];
  if (nestedValue && typeof nestedValue === 'object') {
    return readPositiveNumber((nestedValue as Record<string, unknown>).id);
  }
  return null;
}

function getCurrentContext(): CurrentContext | null {
  const user = sessionService.getUser();
  const userId = readPositiveNumber(user?.userId ?? user?.UserId ?? user?.id ?? user?.Id) ?? getCurrentUserId();
  const branchId =
    (user && readUserNumber(user, ['branchId', 'BranchId', 'branchID', 'BranchID'], 'branch')) ??
    getCurrentBranchId();
  const warehouseId =
    (user && readUserNumber(
      user,
      ['warehouseId', 'WarehouseId', 'warehouseID', 'WarehouseID', 'defaultWarehouseId', 'DefaultWarehouseId'],
      'warehouse'
    )) ??
    getCurrentWarehouseId() ??
    undefined;
  const userRole = user?.role ?? user?.Role;
  const role = typeof userRole === 'string' ? userRole : getCurrentUserRole();

  if (userId === null || branchId === null || !role) return null;
  return { userId, role, branchId, warehouseId };
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<CurrentContext | null>(() => getCurrentContext());

  useEffect(() => {
    const refreshContext = () => setContext(getCurrentContext());

    window.addEventListener('pos-session-changed', refreshContext);
    window.addEventListener('storage', refreshContext);

    return () => {
      window.removeEventListener('pos-session-changed', refreshContext);
      window.removeEventListener('storage', refreshContext);
    };
  }, []);

  return (
    <organizationContext.Provider value={context}>
      {children}
    </organizationContext.Provider>
  );
}

export function useOrganization(): CurrentContext | null {
  return useContext(organizationContext);
}
