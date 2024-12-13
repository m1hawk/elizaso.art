import axios from "axios";
import qs from 'qs';

const apiAxios = axios.create({
  baseURL: '/',
  withCredentials: true,
  paramsSerializer: {
    serialize: (params) => {
      return qs.stringify(params, {arrayFormat: 'repeat'});
    },
  },
});


apiAxios.interceptors.response.use(
        (response) => {
          if (response.status === 200 && response.data?.success) {
            return response.data.data;
          } else {
            return Promise.reject({
              code: response.data.status,
              message: response.data.msg,
              ...response.data,
            });
          }
        },
        (err) => {
          throw err;
        },
);

export default apiAxios