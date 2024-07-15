import requestApi from "./apiConfig";
import type { requestApiProps } from "./apiConfig";

const getReviews = async () => {
  const request: requestApiProps = {
    endpoint: "reviews?page=1&limit=20",
    method: "GET",
    params: undefined,
    body: {},
    responseType: undefined,
  };
  const response = await requestApi(request);
  return response.data;
};

const updateReviews = async (data: any, reviewid: string) => {
    const request: requestApiProps = {
      endpoint: "reviews/update",
      method: "PUT",
      params: { id: reviewid },
      body: data,
      responseType: undefined,
    };
    const response = await requestApi(request);
    return response.data;
  };

export { getReviews, updateReviews };
