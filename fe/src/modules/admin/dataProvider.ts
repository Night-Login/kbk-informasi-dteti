import {
  DataProvider,
  HttpError,
  fetchUtils,
  type Identifier,
  type RaRecord,
} from "react-admin";
import { API_URL, getApiAssetUrl } from "@/lib/api";
import { getAdminToken } from "./authProvider";

interface ApiRecord extends RaRecord {
  slug?: string;
  [key: string]: unknown;
}

type RelationLike = {
  tag_id?: unknown;
  lecturer_id?: unknown;
  tag?: { id?: unknown };
  lecturer?: { id?: unknown };
};

type ImportSummary = {
  imported?: number;
  updated?: number;
  errors?: number;
};

export type AdminDataProvider = DataProvider & {
  restore: (resource: string, id: Identifier) => Promise<{ data: ApiRecord }>;
  importItems: (
    resource: string,
    items: Record<string, unknown>[],
  ) => Promise<ImportSummary>;
  getResearchSummary: () => Promise<Record<string, unknown>>;
};

function resourceWithoutTrash(resource: string): string {
  return resource.replace(/^trash\//, "");
}

function getResourcePath(resource: string, isPaginated = false): string {
  if (resource.startsWith("trash/")) {
    return `${resourceWithoutTrash(resource)}/trash`;
  }

  if (
    isPaginated &&
    [
      "lecturers",
      "projects",
      "publications",
      "research/clusters",
      "research/tags",
    ].includes(resource)
  ) {
    return `${resource}/paginated`;
  }

  return resource;
}

async function httpClient(url: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const isFormData = options.body instanceof FormData;
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(!isFormData && options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const json = await response.json().catch(() => null);

  if (!response.ok || json?.success === false) {
    throw new HttpError(
      json?.message || `API request failed with status ${response.status}`,
      response.status,
      json,
    );
  }

  return { json, headers: response.headers };
}

function recordId(record: Record<string, unknown>, fallback?: Identifier): Identifier {
  return (record.id || record.slug || fallback) as Identifier;
}

function normalizeRecord<RecordType extends RaRecord = ApiRecord>(
  resource: string,
  raw: Record<string, unknown>,
): RecordType {
  const baseResource = resourceWithoutTrash(resource);
  const record: Record<string, unknown> = {
    ...raw,
    id: recordId(raw),
  };

  if (baseResource === "lecturers") {
    const relations = Array.isArray(raw.research_tags) ? raw.research_tags : [];
    record.tag_ids = relations
      .map((relation) => {
        const item = relation as RelationLike;
        return item.tag_id || item.tag?.id;
      })
      .filter(Boolean);
    record.photo_preview = getApiAssetUrl(raw.photo_url as string | null | undefined);
  }

  if (baseResource === "projects") {
    const tagRelations = Array.isArray(raw.research_tags) ? raw.research_tags : [];
    const participantRelations = Array.isArray(raw.participants) ? raw.participants : [];
    record.tag_ids = tagRelations
      .map((relation) => {
        const item = relation as RelationLike;
        return item.tag_id || item.tag?.id;
      })
      .filter(Boolean);
    record.participant_ids = participantRelations
      .map((relation) => {
        const item = relation as RelationLike;
        return item.lecturer_id || item.lecturer?.id;
      })
      .filter(Boolean);
  }

  if (baseResource === "publications") {
    const relations = Array.isArray(raw.lecturers) ? raw.lecturers : [];
    record.lecturer_ids = relations
      .map((relation) => {
        const item = relation as RelationLike;
        return item.lecturer_id || item.lecturer?.id;
      })
      .filter(Boolean);
  }

  return record as unknown as RecordType;
}

function rawFile(value: unknown): File | undefined {
  if (value instanceof File) return value;
  if (value && typeof value === "object" && "rawFile" in value) {
    const file = (value as { rawFile?: unknown }).rawFile;
    return file instanceof File ? file : undefined;
  }
  return undefined;
}

function preparePayload(
  resource: string,
  input: Record<string, unknown>,
): { payload: Record<string, unknown>; photo?: File } {
  const data = { ...input };
  const photo = rawFile(data.photo);

  [
    "id",
    "created_at",
    "updated_at",
    "deleted_at",
    "createdAt",
    "deletedAt",
    "research_tags",
    "participants",
    "lecturers",
    "lead_lecturer",
    "publications",
    "cluster",
    "_count",
    "photo",
    "photo_preview",
  ].forEach((key) => delete data[key]);

  if (resource === "projects") {
    const participantIds = Array.isArray(data.participant_ids)
      ? data.participant_ids.filter(
          (lecturerId): lecturerId is string => typeof lecturerId === "string",
        )
      : [];
    data.participants = participantIds.map((lecturerId) => ({
      lecturer_id: lecturerId,
    }));
    delete data.participant_ids;
  }

  if (resource === "publications") {
    const lecturerIds = Array.isArray(data.lecturer_ids)
      ? data.lecturer_ids.filter(
          (lecturerId): lecturerId is string => typeof lecturerId === "string",
        )
      : [];
    data.lecturers = lecturerIds.map(
      (lecturerId, index) => ({
        lecturer_id: lecturerId,
        author_order: index + 1,
      }),
    );
    delete data.lecturer_ids;
  }

  if (resource === "admins" && data.password === "") {
    delete data.password;
  }

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });

  return { payload: data, photo };
}

async function uploadLecturerPhoto(id: Identifier, photo: File) {
  const form = new FormData();
  form.append("photo", photo);
  const { json } = await httpClient(`${API_URL}/lecturers/${id}/photo`, {
    method: "PUT",
    body: form,
  });
  return json.data || json;
}

const baseProvider: DataProvider = {
  supportAbortSignal: true,

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
    const url = `${API_URL}/${getResourcePath(resource, true)}?${fetchUtils.queryParameters(query)}`;
    const { json } = await httpClient(url, { signal: params.signal });
    const responseData = json.data || json;

    if (
      responseData &&
      Array.isArray(responseData.data) &&
      typeof responseData.total === "number"
    ) {
      return {
        data: responseData.data.map((item: Record<string, unknown>) =>
          normalizeRecord(resource, item),
        ),
        total: responseData.total,
      };
    }

    if (Array.isArray(responseData)) {
      return {
        data: responseData.map((item: Record<string, unknown>) =>
          normalizeRecord(resource, item),
        ),
        total: responseData.length,
      };
    }

    return { data: [], total: 0 };
  },

  getOne: async (resource, params) => {
    const { json } = await httpClient(`${API_URL}/${resource}/${params.id}`, {
      signal: params.signal,
    });
    return { data: normalizeRecord(resource, json.data || json) };
  },

  getMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map((id) =>
        httpClient(`${API_URL}/${resource}/${id}`, { signal: params.signal }),
      ),
    );
    return {
      data: responses.map(({ json }) => normalizeRecord(resource, json.data || json)),
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
    const { json } = await httpClient(
      `${API_URL}/${getResourcePath(resource, true)}?${fetchUtils.queryParameters(query)}`,
      { signal: params.signal },
    );
    const responseData = json.data || json;
    const data = Array.isArray(responseData.data) ? responseData.data : responseData;
    return {
      data: Array.isArray(data)
        ? data.map((item: Record<string, unknown>) => normalizeRecord(resource, item))
        : [],
      total:
        typeof responseData.total === "number"
          ? responseData.total
          : Array.isArray(data)
            ? data.length
            : 0,
    };
  },

  update: async (resource, params) => {
    const { payload, photo } = preparePayload(resource, params.data);
    const { json } = await httpClient(`${API_URL}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    let updated = json.data || json;
    if (resource === "lecturers" && photo) {
      updated = await uploadLecturerPhoto(params.id, photo);
    }
    return { data: normalizeRecord(resource, updated) };
  },

  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) => {
        const { payload } = preparePayload(resource, params.data);
        return httpClient(`${API_URL}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }),
    );
    return { data: params.ids };
  },

  create: async (resource, params) => {
    const { payload, photo } = preparePayload(resource, params.data);
    const { json } = await httpClient(`${API_URL}/${resource}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    let created = json.data || json;
    if (resource === "lecturers" && photo) {
      created = await uploadLecturerPhoto(recordId(created), photo);
    }
    return { data: normalizeRecord(resource, created) };
  },

  delete: async (resource, params) => {
    const { json } = await httpClient(`${API_URL}/${resource}/${params.id}`, {
      method: "DELETE",
    });
    return {
      data: params.previousData || json.data || { id: params.id },
    };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        httpClient(`${API_URL}/${resource}/${id}`, { method: "DELETE" }),
      ),
    );
    return { data: params.ids };
  },
};

export const dataProvider = Object.assign(baseProvider, {
  restore: async (resource: string, id: Identifier) => {
    const { json } = await httpClient(`${API_URL}/${resource}/${id}/restore`, {
      method: "PATCH",
      body: JSON.stringify({}),
    });
    return {
      data: normalizeRecord(resource, json.data || { id }),
    };
  },

  importItems: async (
    resource: string,
    items: Record<string, unknown>[],
  ): Promise<ImportSummary> => {
    const { json } = await httpClient(`${API_URL}/${resource}/import`, {
      method: "POST",
      body: JSON.stringify({ items }),
    });
    return json.data || json;
  },

  getResearchSummary: async () => {
    const { json } = await httpClient(`${API_URL}/research`);
    return json.data || json;
  },
}) as AdminDataProvider;
