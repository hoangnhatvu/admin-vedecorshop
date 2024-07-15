import { IFilterForm } from "pages/admin/templates";
import requestApi from "./apiConfig";
import type { requestApiProps } from "./apiConfig";

const getTemplates = async (page: number, limit: number, body: IFilterForm) => {
  const request: requestApiProps = {
    endpoint: `templates/getAllForAdmin?page=${page}&limit=${limit}`,
    method: "POST",
    params: undefined,
    body: body,
    responseType: undefined,
  };
  const response = await requestApi(request);
  return response.data;
};

const createTemplate = async (data: FormData) => {
  const request: requestApiProps = {
    endpoint: "templates/create",
    method: "POST",
    params: undefined,
    body: data,
    responseType: undefined,
    isFormData: true,
  };
  const response = await requestApi(request);
  return response.data;
};

export { getTemplates, createTemplate };
