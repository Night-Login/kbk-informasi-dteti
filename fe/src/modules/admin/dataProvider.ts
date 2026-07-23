import { DataProvider, fetchUtils } from "react-admin";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token && options.headers instanceof Headers) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }
  return fetchUtils.fetchJson(url, options);
};

const getResourcePath = (resource: string, isPaginated: boolean = false): string => {
  if (isPaginated && ["lecturers", "projects", "publications", "research/clusters", "research/tags"].includes(resource)) {
    return `${resource}/paginated`;
  }
  return resource;
};

interface ApiRecord {
  id?: string | number;
  slug?: string;
  [key: string]: unknown;
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const { field, order } = params.sort || { field: "id", order: "ASC" };

    const query = {
      page: page.toString(),
      limit: perPage.toString(),
      sort_by: field,
      sort_order: order.toLowerCase(),
      ...fetchUtils.flattenObject(params.filter || {}),
    };

    const url = `${apiUrl}/${getResourcePath(resource, true)}?${fetchUtils.queryParameters(query)}`;
    const { json } = await httpClient(url);

    if (!json.success && json.success !== undefined) {
      throw new Error(json.message || "Failed to fetch list from API");
    }

    const responseData = json.data || json;

    if (responseData && Array.isArray(responseData.data) && typeof responseData.total === "number") {
      return {
        data: responseData.data.map((item: ApiRecord) => ({ ...item, id: item.id || item.slug })),
        total: responseData.total,
      };
    }

    if (Array.isArray(responseData)) {
      return {
        data: responseData.map((item: ApiRecord) => ({ ...item, id: item.id || item.slug })),
        total: responseData.length,
      };
    }

    return { data: [], total: 0 };
  },

  getOne: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { json } = await httpClient(url);

    const data = json.data || json;
    return {
      data: { ...data, id: data.id || data.slug || params.id },
    };
  },

  getMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map((id) => httpClient(`${apiUrl}/${resource}/${id}`))
    );
    return {
      data: responses.map(({ json }) => {
        const item = json.data || json;
        return { ...item, id: item.id || item.slug };
      }),
    };
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const { field, order } = params.sort || { field: "id", order: "ASC" };

    const query = {
      page: page.toString(),
      limit: perPage.toString(),
      sort_by: field,
      sort_order: order.toLowerCase(),
      [params.target]: params.id,
      ...fetchUtils.flattenObject(params.filter || {}),
    };

    const url = `${apiUrl}/${getResourcePath(resource, true)}?${fetchUtils.queryParameters(query)}`;
    const { json } = await httpClient(url);

    const responseData = json.data || json;

    if (responseData && Array.isArray(responseData.data) && typeof responseData.total === "number") {
      return {
        data: responseData.data.map((item: ApiRecord) => ({ ...item, id: item.id || item.slug })),
        total: responseData.total,
      };
    }

    if (Array.isArray(responseData)) {
      return {
        data: responseData.map((item: ApiRecord) => ({ ...item, id: item.id || item.slug })),
        total: responseData.length,
      };
    }

    return { data: [], total: 0 };
  },

  update: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { json } = await httpClient(url, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });

    const data = json.data || json;
    return {
      data: { ...data, id: data.id || data.slug || params.id },
    };
  },

  updateMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        })
      )
    );
    return {
      data: responses.map(({ json }) => json.data?.id || json.id),
    };
  },

  create: async (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    const { json } = await httpClient(url, {
      method: "POST",
      body: JSON.stringify(params.data),
    });

    const data = json.data || json;
    return {
      data: { ...data, id: data.id || data.slug },
    };
  },

  delete: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { json } = await httpClient(url, {
      method: "DELETE",
    });

    return {
      data: params.previousData || json.data || { id: params.id },
    };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "DELETE",
        })
      )
    );
    return { data: params.ids };
  },
};
