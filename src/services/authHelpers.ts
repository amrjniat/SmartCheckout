import { getCurrentBranchId, getCurrentWarehouseId } from './tokenUtils';

export const getBranchIdFromToken = (): number | null => getCurrentBranchId();

export const getWarehouseIdFromToken = (): number | null => getCurrentWarehouseId();