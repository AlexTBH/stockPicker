import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logout, setToken } from "./authSlice";
import type { RootState } from "./store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5045/api",
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set(
        "authorization",
        `Bearer ${token}`
      );
    }

    return headers;
  },
});

const baseQueryWithReauth = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  let result = await baseQuery(
    args,
    api,
    extraOptions
  );

  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        credentials: "include", 
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newToken = (refreshResult.data as any).accessToken;

      api.dispatch(setToken(newToken));

      result = await baseQuery(
        args,
        api,
        extraOptions
      );
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "Portfolio",
    "Stocks",
    "Transactions",
  ],

  endpoints: () => ({}),
});