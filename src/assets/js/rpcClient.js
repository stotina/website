import axios from "./axios/index";

export class RpcClient {
  url;
  pendingRequests = 0;
  maxRequests;
  interval;
  api;

  constructor(
    url,
    methods = undefined,
    maxRequests = undefined,
    interval = undefined
  ) {
    this.api = axios.create({});
    this.url = url;

    this.maxRequests = maxRequests || 10;
    this.interval = interval || 10;

    if (methods) {
      methods.forEach((method) => {
        this[method] = (params) => this.call(method.toLowerCase(), params);
        this[method + "Stream"] = (params) =>
          this.callStream(method.toLowerCase(), params);
        this[method + "Batch"] = (params) =>
          this.callBatch(method.toLowerCase(), params);
        this[method + "BatchStream"] = (params) =>
          this.callBatchStream(method.toLowerCase(), params);
        this[method + "BatchStreamCallback"] = (params, callback) =>
          this.callBatchStreamCallback(method.toLowerCase(), params, callback);
      });
    }

    // Set up request interceptor
    this.api.interceptors.request.use((config) => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (this.pendingRequests < this.maxRequests) {
            this.pendingRequests++;
            clearInterval(interval);
            resolve(config);
          }
        }, this.interval);
      });
    });

    // Set up response interceptor
    this.api.interceptors.response.use(
      (response) => {
        this.pendingRequests = Math.max(0, this.pendingRequests - 1);
        return Promise.resolve(response);
      },
      (error) => {
        this.pendingRequests = Math.max(0, this.pendingRequests - 1);
        return Promise.reject(error);
      }
    );
  }

  call(method, params = []) {
    return this.api
      .post(
        this.url,
        { method, params },
        { validateStatus: (status) => status === 200 }
      )
      .then((r) => r.data);
  }

  callStream(method, params = []) {
    return this.api
      .post(
        this.url,
        { method, params },
        { validateStatus: (status) => status === 200, responseType: "stream" }
      )
      .then((r) => r.data);
  }

  callBatch(method, params = []) {
    return this.api
      .post(
        this.url,
        params.map((param, index) => ({ method, params: param, id: index })),
        {
          validateStatus: (status) => status === 200,
        }
      )
      .then((r) => r.data);
  }

  callBatchStream(method, params = []) {
    return this.api
      .post(
        this.url,
        params.map((param, index) => ({ method, params: param, id: index })),
        {
          validateStatus: (status) => status === 200,
          responseType: "stream",
        }
      )
      .then((r) => r.data);
  }
}
