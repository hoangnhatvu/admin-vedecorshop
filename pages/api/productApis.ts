import { IFilterForm } from "pages/admin/products";
import requestApi from "./apiConfig";
import type { requestApiProps } from "./apiConfig";

const getProducts = async (page: number, limit: number, body?: IFilterForm) => {
  const request: requestApiProps = {
    endpoint: `products/searchForAdmin?page=${page}&limit=${limit}`,
    method: "POST",
    params: undefined,
    body: body || {},
    responseType: undefined,
  };
  const response = await requestApi(request);
  return response.data;
};

const createProduct = async (data: FormData) => {
  const request: requestApiProps = {
    endpoint: "products/create",
    method: "POST",
    params: undefined,
    body: data,
    responseType: undefined,
    isFormData: true,
  };
  const response = await requestApi(request);
  return response.data;
};

export { getProducts, createProduct };
