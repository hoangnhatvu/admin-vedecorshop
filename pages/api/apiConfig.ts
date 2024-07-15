import axios from "axios";
import { refresh, logout } from "app/redux/features/userSlice";
import { store } from "app/redux/store";
export type ResponseType =
  | "arraybuffer"
  | "blob"
  | "document"
  | "json"
  | "text"
  | "stream";
export type requestApiProps = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  params: Object | undefined;
  body: Object;
  responseType: ResponseType | undefined;
  isFormData?: Boolean;
};
export default function requestApi({
  endpoint,
  method,
  params,
  body,
  responseType,
  isFormData = false,
}: requestApiProps) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  if (isFormData) {
    headers["Content-Type"] = "multipart/form-data";
  } else {
    headers["Content-Type"] = "application/json";
  }
  const instance = axios.create({ headers });
  const token = store.getState().userReducer.token;
  instance.interceptors.request.use(
    (config) => {
      if (token && !config.headers?.Authorization) {
        if (config.headers) {
          config.headers["Authorization"] = `Bearer ${token.accessToken}`;
        } else {
          config.headers = { Authorization: `Bearer ${token.accessToken}` };
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalConfig = error.config;
      console.log("Access token expired");
      if (
        error.response &&
        error.response?.status === 401 &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true;
        try {
          console.log("call refresh token api");
          if (token) {
            const result = await instance.post(
              `${process.env.APP_API_URL}auth/refresh-token`,
              {
                refreshToken: token.refreshToken,
              }
            );
            store.dispatch(refresh(result.data));
            originalConfig.headers[
              "Authorization"
            ] = `Bearer ${result.data.accessToken}`;

            return instance(originalConfig);
          } else {
            window.location.href = "/admin/login";
          }
        } catch (err: any) {
          if (err.response && err.response.status === 400) {
            store.dispatch(logout());
            window.location.href = "/admin/login";
          }
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance.request({
    method: method,
    url: `${process.env.APP_API_URL}${endpoint}`,
    data: body,
    params: params,
    responseType: responseType,
  });
}
