/**
 * Central Axios instance for all real API calls.
 *
 * HOW TO ACTIVATE:
 *   1. Set VITE_API_BASE_URL in frontend/.env (e.g. http://localhost:8080/api/v1)
 *   2. Replace `mockResponse` calls in each *.api.ts file with the named exports
 *      below (get, post, put, del).
 *
 * The client automatically:
 *   - Attaches the Bearer token from localStorage/Zustand auth-storage.
 *   - Converts response keys from snake_case → camelCase (backend → frontend).
 *   - Converts request body keys from camelCase → snake_case (frontend → backend).
 *   - Normalises every successful response into { data, success, message }.
 *   - Normalises every error response into { data: null, success: false, message }.
 */

import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { ApiResponse } from "./apiUtils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const toSnake = (s: string) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

function transformKeys<T>(obj: unknown, transform: (key: string) => string): T {
    if (Array.isArray(obj)) return obj.map((v) => transformKeys(v, transform)) as unknown as T;
    if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [transform(k), transformKeys(v, transform)])
        ) as T;
    }
    return obj as T;
}

function snakeToCamel<T>(obj: unknown): T {
    return transformKeys<T>(obj, toCamel);
}

function camelToSnake<T>(obj: unknown): T {
    return transformKeys<T>(obj, toSnake);
}

// ─── Token accessor ───────────────────────────────────────────────────────────

function getToken(): string | null {
    try {
        const raw = localStorage.getItem("auth-storage");
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.state?.token ?? null;
    } catch {
        return null;
    }
}

// ─── Axios instance ───────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

export const axiosClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
});

// Request interceptor — attach token + convert body to snake_case
axiosClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
        config.data = camelToSnake(config.data);
    }
    return config;
});

// Response interceptor — normalise envelope + convert to camelCase
axiosClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse<ApiResponse<unknown>> => {
        const camel = snakeToCamel<Record<string, unknown>>(response.data);
        // Backend may return raw object or wrapped { data, message, success }
        if ("success" in camel) {
            response.data = camel;
        } else {
            response.data = { data: camel, success: true };
        }
        return response;
    },
    (error) => {
        const message =
            error?.response?.data?.message ??
            error?.message ??
            "An unexpected error occurred";
        return Promise.resolve({
            data: { data: null, success: false, message },
        });
    }
);

// ─── Typed wrappers ───────────────────────────────────────────────────────────

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const res = await axiosClient.get<ApiResponse<T>>(url, { params });
    return res.data;
}

export async function apiPost<T>(
    url: string,
    body?: Record<string, unknown> | FormData
): Promise<ApiResponse<T>> {
    const res = await axiosClient.post<ApiResponse<T>>(url, body);
    return res.data;
}

export async function apiPut<T>(url: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const res = await axiosClient.put<ApiResponse<T>>(url, body);
    return res.data;
}

export async function apiDel<T>(url: string): Promise<ApiResponse<T>> {
    const res = await axiosClient.delete<ApiResponse<T>>(url);
    return res.data;
}

/**
 * Send raw binary data (e.g., audio Blob) to an endpoint.
 * Bypasses the JSON camelCase→snake_case body transformation.
 * The `Content-Type` must be provided explicitly (e.g., "audio/webm").
 */
export async function apiPostRaw<T>(
    url: string,
    blob: Blob,
    contentType: string,
    params?: Record<string, string>
): Promise<ApiResponse<T>> {
    const token = (() => {
        try {
            const raw = localStorage.getItem("auth-storage");
            if (!raw) return null;
            return JSON.parse(raw)?.state?.token ?? null;
        } catch {
            return null;
        }
    })();

    const res = await axiosClient.post<ApiResponse<T>>(url, blob, {
        headers: {
            "Content-Type": contentType,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params,
        // Prevent the request interceptor from treating blob as JSON object
        transformRequest: [(data) => data],
    });
    return res.data;
}
