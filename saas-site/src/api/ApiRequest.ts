import { Method } from "axios";

interface ApiRequest {
  endpoint: string;
  method: Method;
  operation: string;
  token?: string;
  payload?: any;
}

export default ApiRequest;
