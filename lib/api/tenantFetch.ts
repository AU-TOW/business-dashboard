/**
 * Tenant-aware fetch utilities
 * Wraps fetch calls with X-Tenant-Slug header for multi-tenant API access
 */

interface TenantFetchOptions extends RequestInit {
  tenantSlug: string;
}

/**
 * Fetch wrapper that includes tenant slug header
 */
export async function tenantFetch(
  url: string,
  options: TenantFetchOptions
): Promise<Response> {
  const { tenantSlug, headers, ...rest } = options;

  return fetch(url, {
    ...rest,
    headers: {
      ...headers,
      'X-Tenant-Slug': tenantSlug,
    },
  });
}

/**
 * Create a tenant-scoped API client with tenant headers
 * Auth is handled via httpOnly session cookies
 */
export function createTenantApi(tenantSlug: string) {
  const getHeaders = (): HeadersInit => {
    return {
      'Content-Type': 'application/json',
      'X-Tenant-Slug': tenantSlug,
    };
  };

  return {
    get: (url: string) => fetch(url, { headers: getHeaders() }),

    post: (url: string, body: any) => fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }),

    put: (url: string, body: any) => fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }),

    // Note: Many routes use POST for delete operations
    delete: (url: string, body?: any) => fetch(url, {
      method: body ? 'POST' : 'DELETE',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    }),
  };
}
