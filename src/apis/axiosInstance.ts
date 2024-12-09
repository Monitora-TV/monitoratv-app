// custom-instance.ts

import axios, { type AxiosRequestConfig } from "axios";
import { getOidc } from "../oidc";
import { error } from "console";

var axiosInstance = axios.create({ baseURL: import.meta.env.VITE_TODOS_API_URL });

axiosInstance.interceptors.request.use(
    async config => {
        const oidc = await getOidc();

        if (oidc.isUserLoggedIn) {
            config.headers.Authorization = `Bearer ${oidc.getTokens().accessToken}`;
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
);


axiosInstance.interceptors.response.use((response) => {
    return response
}, function (error) {
    return Promise.reject(error);
});

export default axiosInstance;
/* `axiosInstance` is a custom Axios instance that is created with a base URL pointing
to the Todos API URL. It also includes an interceptor that adds an Authorization
header with a Bearer token obtained from the OIDC (OpenID Connect) authentication
service if the user is logged in. This custom Axios instance is then exported for use
in making HTTP requests to the Todos API. Additionally, there is a `fetch` function
exported that can be used to make HTTP requests using the `axiosInstance` with
additional configuration options. */



// NOTE: Meant to be used by orval generated client
/*
export const fetch = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> =>
    axiosInstance({
        ...config,
        ...options
    }).then(({ data }) => data);
*/


