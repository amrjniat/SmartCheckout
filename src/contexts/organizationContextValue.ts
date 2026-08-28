import { createContext } from 'react';
import type { CurrentContext } from './organizationTypes';

export const organizationContext = createContext<CurrentContext | null>(null);