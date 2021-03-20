import { Method } from "axios";

interface ApiRequest {
  endpoint: string;
  method: Method;
  operation: string;
  payload: any;
  token?: string;
}

export default ApiRequest;
