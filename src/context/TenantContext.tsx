import React,
  {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
  } from 'react';
import { useLocation } from 'react-router-dom';
import { tenantService } from '@/services/api';
import type { TenantInfo, TenantProfile, TenantUsage, TenantSlug } from '@/types';
import {
  DEFAULT_TENANT_SLUG,
  getInitialTenantSlug,
  setActiveTenantSlug,
  setActiveTenantId,
} from '@/lib/tenantIdentity';

interface TenantContextValue {
  tenant: TenantInfo | null;
  tenantProfile: TenantProfile | null;
  usage: TenantUsage | null;
  tenantSlug: TenantSlug;
  availableTenants: TenantInfo[];
  isLoading: boolean;
  error: string | null;
  setTenant: (tenant: TenantInfo | null) => void;
  switchTenant: (slug: TenantSlug) => void;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [tenantSlug, setTenantSlug] = useState<TenantSlug>(getInitialTenantSlug);
  const [tenantProfile, setTenantProfile] = useState<TenantProfile | null>(null);
  const [usage, setUsage] = useState<TenantUsage | null>(null);
  const [availableTenants, setAvailableTenants] = useState<TenantInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const switchTenant = useCallback(
    (slug: TenantSlug) => {
      const resolved = setActiveTenantSlug(slug);
      setTenantSlug(resolved);
    },
    []
  );

  const setTenant = useCallback(
    (nextTenant: TenantInfo | null) => {
      if (!nextTenant) {
        switchTenant(DEFAULT_TENANT_SLUG);
        return;
      }
      switchTenant(nextTenant.slug);
    },
    [switchTenant]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const slugFromQuery = params.get('tenant');
    if (slugFromQuery && slugFromQuery !== tenantSlug) {
      switchTenant(slugFromQuery as TenantSlug);
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
      setActiveTenantId(profile.tenant.id);
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
      const exists = prev.some((tenantItem) => tenantItem.slug === tenantProfile.tenant.slug);
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
      setTenant,
      switchTenant,
      refreshTenant,
    }),
    [
      tenantProfile,
      usage,
      tenantSlug,
      availableTenants,
      isLoading,
      error,
      setTenant,
      switchTenant,
      refreshTenant,
    ]
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
