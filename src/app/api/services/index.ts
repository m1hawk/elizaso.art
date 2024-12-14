// lib/axios.ts
import axios, {AxiosInstance, AxiosError, AxiosRequestConfig} from 'axios';

// 定义响应数据的基础接口
interface BaseResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 创建自定义错误类
class ApiError extends Error {
  constructor(
          public code: number,
          public message: string,
          public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 创建axios实例
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 600000, // 15秒超时
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
          (config) => {
            // 可以在这里添加token
            // const token = getToken();
            // if (token) {
            //   config.headers.Authorization = `Bearer ${token}`;
            // }

            return config;
          },
          (error) => {
            return Promise.reject(error);
          }
  );

  // 响应拦截器
  instance.interceptors.response.use(
          (response) => {
            const {data} = response;

            // 这里假设后端返回的数据格式为 { success, data, message }
            if (!data.success) {
              throw new ApiError(9001, data.message, data.data);
            }

            return data;
          },
          (error: AxiosError) => {
            if (error.response) {
              // 服务器返回错误状态码
              const {status, data} = error.response;
              throw new ApiError(
                      status,
                      'Server Error',
                      data
              );
            } else if (error.request) {
              // 请求发出但没有收到响应
              throw new ApiError(
                      500,
                      'No response from server:' + error.request._options.port,
                      error.request
              );
            } else {
              // 请求配置出错
              throw new ApiError(
                      500,
                      error.message || 'Request failed',
                      error
              );
            }
          }
  );

  return instance;
};

// 创建实例
const apiClient = createAxiosInstance(process.env.ELIZA_APP_HOST || 'http://localhost:61000');

// 封装通用请求方法
export const apiRequest = {
  async get<T>(
          url: string,
          config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.get<BaseResponse<T>>(url, config);
    return response.data as any;
  },

  async post<T = any>(
          url: string,
          data?: any,
          config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.post<BaseResponse<T>>(url, data, config);
    return response.data as any;
  },

  async put<T = any>(
          url: string,
          data?: any,
          config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.put<BaseResponse<T>>(url, data, config);
    return response.data as any;
  },

  async delete<T = any>(
          url: string,
          config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.delete<BaseResponse<T>>(url, config);
    return response.data as any;
  },
};

// 导出错误类供使用方处理错误
export {ApiError};

