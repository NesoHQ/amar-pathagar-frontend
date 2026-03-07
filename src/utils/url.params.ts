/**
 * Utility functions for managing URL query parameters
 * Reusable across the application for filter state management
 */

export interface FilterParams {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Sync filters to URL query parameters
 */
export const syncFiltersToUrl = (filters: FilterParams, router: any, pathname: string) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });
  
  const queryString = params.toString();
  const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
  
  router.push(newUrl, { scroll: false });
};

/**
 * Get filters from URL query parameters
 */
export const getFiltersFromUrl = (searchParams: URLSearchParams): FilterParams => {
  const filters: FilterParams = {};
  
  searchParams.forEach((value, key) => {
    filters[key] = value;
  });
  
  return filters;
};

/**
 * Clear all filters from URL
 */
export const clearFiltersFromUrl = (router: any, pathname: string) => {
  router.push(pathname, { scroll: false });
};

/**
 * Update a single filter in URL
 */
export const updateFilterInUrl = (
  key: string,
  value: string | number | boolean | null,
  router: any,
  pathname: string,
  currentParams: URLSearchParams
) => {
  const params = new URLSearchParams(currentParams);
  
  if (value !== null && value !== undefined && value !== '') {
    params.set(key, String(value));
  } else {
    params.delete(key);
  }
  
  const queryString = params.toString();
  const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
  
  router.push(newUrl, { scroll: false });
};
