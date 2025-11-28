import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import { tenantService } from '@/services/api';
import { TenantInfo, TenantProfile, TenantUsage } from '@/types';

interface TenantContextValue {
  tenant: TenantInfo | null;
  tenantProfile: TenantProfile | null;
  usage: TenantUsage | null;
  tenantSlug: string;
  availableTenants: TenantInfo[];
  isLoading: boolean;
  error: string | null;
  switchTenant: (slug: string) => void;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);
const STORAGE_KEY = 'aio-active-tenant';
const DEFAULT_TENANT_SLUG = import.meta.env.VITE_DEFAULT_TENANT_SLUG || 'aio-default';

const getInitialSlug = (): string => {
  if (typeof window === 'undefined') return DEFAULT_TENANT_SLUG;
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_TENANT_SLUG;
};

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [tenantSlug, setTenantSlug] = useState<string>(getInitialSlug);
  const [tenantProfile, setTenantProfile] = useState<TenantProfile | null>(null);
  const [usage, setUsage] = useState<TenantUsage | null>(null);
  const [availableTenants, setAvailableTenants] = useState<TenantInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const persistSlug = useCallback((slug: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, slug);
  }, []);

  const switchTenant = useCallback(
    (slug: string) => {
      setTenantSlug(slug);
      persistSlug(slug);
    },
    [persistSlug]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const slugFromQuery = params.get('tenant');
    if (slugFromQuery && slugFromQuery !== tenantSlug) {
      switchTenant(slugFromQuery);
    }
  }, [location.search, switchTenant, tenantSlug]);

  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        const list = await tenantService.listTenants();
        setAvailableTenants(list);
      } catch (err: unknown) {
        console.warn('Unable to load tenant list', err);
      }
    };

    fetchAvailable();
  }, []);

  const refreshTenant = useCallback(async () => {
    setIsLoading(true);
    try {
      const profile = await tenantService.getConfig(tenantSlug);
      setTenantProfile(profile);
      setError(null);

      const tenantUsage = await tenantService.getUsage(profile.tenant.id, profile.tenant.slug);
      setUsage(tenantUsage);
    } catch (err: unknown) {
      console.error('Failed to load tenant config', err);
      const message = err instanceof Error ? err.message : 'Tenant data could not be loaded';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [tenantSlug]);

  useEffect(() => {
    refreshTenant();
  }, [refreshTenant]);

  useEffect(() => {
    if (!tenantProfile) return;
    setAvailableTenants((prev) => {
      const exists = prev.some((tenant) => tenant.slug === tenantProfile.tenant.slug);
      return exists ? prev : [...prev, tenantProfile.tenant];
    });
  }, [tenantProfile]);

  const value = useMemo<TenantContextValue>(
    () => ({
      tenant: tenantProfile?.tenant || null,
      tenantProfile,
      usage,
      tenantSlug,
      availableTenants,
      isLoading,
      error,
      switchTenant,
      refreshTenant,
    }),
    [tenantProfile, usage, tenantSlug, availableTenants, isLoading, error, switchTenant, refreshTenant]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTenant = (): TenantContextValue => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
