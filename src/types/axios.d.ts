import 'axios';

declare module 'axios' {
  // 요청 시 .post(..., config) 의 타입
  interface AxiosRequestConfig<D = any> {
    meta?: {
      skipAuth?: boolean;
      onErrorHandled?: boolean;
      redirectOn403?: boolean;
      skipRefresh?: boolean;
    };
    _retry?: boolean;
  }

  // 인터셉터에서 받는 Config 타입
  interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
    meta?: {
      skipAuth?: boolean;
      onErrorHandled?: boolean;
      redirectOn403?: boolean;
      skipRefresh?: boolean;
    };
    _retry?: boolean;
  }
}
