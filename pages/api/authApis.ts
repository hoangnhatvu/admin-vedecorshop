import requestApi from "./apiConfig";
import type { requestApiProps } from "./apiConfig";

const logoutById = async () => {
  try {
    const request: requestApiProps = {
      endpoint: "auth/logout",
      method: "POST",
      params: undefined,
      body: {},
      responseType: undefined,
    };
    await requestApi(request);
    return true;
  } catch (error) {
    console.log(error);
  }
};

export { logoutById };
