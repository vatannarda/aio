import type { TenantSlug } from '@/types';

export const DEFAULT_TENANT_SLUG: TenantSlug =
  import.meta.env.VITE_DEFAULT_TENANT_SLUG || 'aio-default';
export const TENANT_STORAGE_KEY = 'aio-active-tenant';

let inMemoryTenantSlug: TenantSlug | null = null;

const normalizeSlug = (slug?: string | null): TenantSlug => {
  if (!slug) return DEFAULT_TENANT_SLUG;
  const trimmed = slug.trim();
  return (trimmed.length > 0 ? trimmed : DEFAULT_TENANT_SLUG) as TenantSlug;
};

const readFromStorage = (): TenantSlug | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(TENANT_STORAGE_KEY);
    return stored ? normalizeSlug(stored) : null;
  } catch {
    return null;
  }
};

export const getInitialTenantSlug = (): TenantSlug => {
  if (inMemoryTenantSlug) return inMemoryTenantSlug;
  const stored = readFromStorage();
  if (stored) {
    inMemoryTenantSlug = stored;
    return stored;
  }
  inMemoryTenantSlug = DEFAULT_TENANT_SLUG;
  return inMemoryTenantSlug;
};

export const getActiveTenantSlug = (): TenantSlug => {
  return inMemoryTenantSlug ?? getInitialTenantSlug();
};

export const setActiveTenantSlug = (slug: TenantSlug): TenantSlug => {
  const resolved = normalizeSlug(slug);
  inMemoryTenantSlug = resolved;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(TENANT_STORAGE_KEY, resolved);
    } catch {
      // noop
    }
  }
  return resolved;
};

export const clearStoredTenantSlug = () => {
  inMemoryTenantSlug = DEFAULT_TENANT_SLUG;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(TENANT_STORAGE_KEY);
    } catch {
      // noop
    }
  }
};
