export interface BaseResponse<T> {
  errors: string[];
  data: T;
  status: boolean;
}
