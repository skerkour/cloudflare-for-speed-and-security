
const networkErrorMessage = 'Network error';

export type ApiResponse = {
  data: any;
  error: ApiError | null;
};

export type ApiError = {
  message: string;
  code: string;
};

export class ApiClient {
  public apiBaseURL: string;

  constructor(apiBaseUrl: string = '/api') {
    this.apiBaseURL = apiBaseUrl;
  }

  async post(route: string, data?: any): Promise<any> {
    const url = `${this.apiBaseURL}${route}`;
    data = data ?? {};
    let response: any = null;
    const headers = new Headers();

    headers.set('Content-Type', 'application/json');

    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        // For cross-origin requests, such as to an api.xx.com subdomain
        // credentials: 'include',
        body: JSON.stringify(data),
      });
    } catch (err: any) {
      throw new Error(networkErrorMessage);
    }

    const responseData = await this.unwrapApiResponse(response);

    return responseData;
  }

  async upload(route: string, data: FormData): Promise<any> {
    const url = `${this.apiBaseURL}${route}`;
    let response: any = null;
    let headers = new Headers();

    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        // For cross-origin requests, such as to an api.xx.com subdomain
        // credentials: 'include',
        body: data,
      });
    } catch (err) {
      throw new Error(networkErrorMessage);
    }

    const responseData = await this.unwrapApiResponse(response);

    return responseData;
  }

  private async unwrapApiResponse(response: Response): Promise<any>  {
    const apiReponse = await response.json() as ApiResponse;

    if (apiReponse.error !== null) {
      throw new Error(apiReponse.error.message);
    }

    return apiReponse.data;
  }
}
