import axios from "axios";
import requestApi from "./apiConfig";
import type { requestApiProps } from "./apiConfig";

const getInfoDashboard = async () => {
  const request: requestApiProps = {
    endpoint: "admin/getInfoDashboard",
    method: "POST",
    params: undefined,
    body: {},
    responseType: undefined,
  };
  const response = await requestApi(request);
  return response.data;
};
const sendNotification = async (
  clientToken: string,
  bodyContent: string,
  title: string,
  image: string
) => {
  const endpoint = process.env.FIREBASE_URL || "";
  const body = {
    to: clientToken,
    notification: {
      body: bodyContent,
      title: title,
      image: image,
    },
    data: { navigationId: "orders" },
  };

  console.log(body);

  const response = await axios.post(endpoint, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: process?.env?.FIREBASE_KEY || "",
    },
  });
  return response;
};

export { getInfoDashboard, sendNotification };
