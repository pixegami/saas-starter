import axios, { AxiosRequestConfig } from "axios";

class BaseApi {
  public static async makeRequest() {
    const requestConfig: AxiosRequestConfig = {
      url: "http://google.com",
      method: "GET",
    };

    try {
      const response = await axios.request(requestConfig);
      console.log("Response Received");
      console.log(response.status);
      return response.status;
    } catch (error: any) {
      console.log("Error Received");
      console.log(error);
      return "500";
    }
  }
}

export default BaseApi;
