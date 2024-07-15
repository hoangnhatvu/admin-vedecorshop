import requestApi from "./apiConfig";
import type { requestApiProps } from "./apiConfig";

const createOption = async (data: FormData) => {
  const request: requestApiProps = {
    endpoint: "options/create",
    method: "POST",
    params: undefined,
    body: data,
    responseType: undefined,
    isFormData: true,
  };
  const response = await requestApi(request);
  return response.data;
};

export { createOption };
