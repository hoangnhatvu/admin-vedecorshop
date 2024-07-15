import requestApi from "./apiConfig";
import type { requestApiProps } from "./apiConfig";

const getCategories = async () => {
  const request: requestApiProps = {
    endpoint: "categories?page=1&limit=20",
    method: "GET",
    params: undefined,
    body: {},
    responseType: undefined,
  };
  const response = await requestApi(request);
  return response.data;
};

export { getCategories };
