import { ApiClient } from "@cloudflarebook.com/core/api";

let apiClient: ApiClient | null = null;


export function createApiClient(): ApiClient {
  apiClient = new ApiClient();
  return apiClient;
}

export function useApiClient(): ApiClient {
  if (!apiClient) {
  throw new Error('apiClient should be created before using it');
  }
  return apiClient!;
}
