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
  const endpoint = "https://fcm.googleapis.com/fcm/send";
  const body = {
    to: clientToken,
    notification: {
      body: bodyContent,
      title: title,
      image: image,
    },
    data: {navigationId: "orders"}
  };

  console.log(body);

  const response = await axios.post(endpoint, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=AAAAdUpDSkQ:APA91bHkZHik6MAtRvMpLlpuFpdEIAeI_Xnm3YKAFqdpVke0npDkDJ4JErErqjhUz4myjiu2k7OUgE_hMzOBRK48hpjaEIo6f7x1suxxvPI3iB9R3VyUv8kadCK2c9fV9U6E1qMW31Vx`,
    },
  });
  return response;
};

export { getInfoDashboard, sendNotification };
