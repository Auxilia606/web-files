export type UnwrapApiResponse<T> = T extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any
) => Promise<ApiResponse<infer R>>
  ? R
  : never;

export type ApiResponse<ResponseObject> = {
  message: string;
} & ResponseObject;
