import { CreateBlogInput, GetPageInput, LoginInput, Routes, SignupInput, UserApi } from "./api";
import { Blog, Page } from "./entities";

const networkErrorMessage = 'Network error';

export type ApiResponse<T> = {
  data: T;
  error: ApiError | null;
};

export type ApiError = {
  message: string;
  code: string;
};

export class ApiClient {
  public apiBaseUrl: string;

  constructor(apiBaseUrl: string = '/api') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async post(route: string, data?: any): Promise<any> {
    const url = `${this.apiBaseUrl}${route}`;
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
    const url = `${this.apiBaseUrl}${route}`;
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
    const apiReponse = await response.json() as ApiResponse<any>;

    if (apiReponse.error !== null) {
      throw new Error(apiReponse.error.message);
    }

    return apiReponse.data;
  }
}

export async function getPage(client: ApiClient, input: GetPageInput): Promise<Page> {
  const page: Page = await client.post(Routes.Page, input);
  return page;
}

export async function login(client: ApiClient, input: LoginInput): Promise<UserApi> {
  const user: UserApi = await client.post(Routes.Login, input);
  return user;
}

export async function signup(client: ApiClient, input: SignupInput): Promise<UserApi> {
  const user: UserApi = await client.post(Routes.Signup, input);
  return user;
}

export async function getBlogs(client: ApiClient): Promise<Blog[]> {
  const blogs: Blog[] = await client.post(Routes.Blogs, {});
  return blogs;
}

export async function createBlog(client: ApiClient, input: CreateBlogInput): Promise<Blog> {
  const blog: Blog = await client.post(Routes.CreateBlog, input);
  return blog;
}
