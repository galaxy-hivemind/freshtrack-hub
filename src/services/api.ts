import { queryOptions } from '@tanstack/react-query';
import { mockService } from './mock';
import type { FoodSafetyService } from './types';
// Deliberately demo-only. Supply a Python API adapter implementing FoodSafetyService
// before enabling live mode. Merely setting a URL must not imply a connection.
export const apiConfig = { baseUrl: import.meta.env['VITE_API_BASE_URL'] || '', mode: 'demo' as const };
export const service: FoodSafetyService = mockService;
export const dashboardQuery = queryOptions({queryKey:['dashboard'],queryFn:()=>service.getDashboardSummary()});
export const productsQuery = queryOptions({queryKey:['products'],queryFn:()=>service.getProducts()});
export const scansQuery = queryOptions({queryKey:['scans'],queryFn:()=>service.getScanHistory()});
export const settingsQuery = queryOptions({queryKey:['settings'],queryFn:()=>service.getSettings()});
