export type ApiResponse = {
  data: any;
  error: ApiError | null;
};

export type ApiError = {
  message: string;
  code: string;
};

export type Page = {

}
