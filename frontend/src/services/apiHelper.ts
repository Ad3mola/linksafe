// @ts-nocheck

import { authAxios, authAxiosWithAnyURL } from "./authAxios";
import { clientRoute } from "./routesHelper";

let clientURL: Location | string = window.location;

export const protectedPost = async (route: string, payload: string) => {
  return authAxios
    .post(route, payload)
    .then((res: { data: Array<string> }) => {
      return res.data;
    })
    .catch((error: { response: { status: number } }) => {
      if (error.response && error.response.status === 401) {
        clientURL = `${clientRoute}/`;
      } else {
        return error;
      }
    });
};

export const protectedGet = async (route: string) => {
  return authAxios
    .get(route)
    .then((res: { data: Array<string> }) => {
      return res.data;
    })
    .catch((error: { response: { status: number } }) => {
      if (error.response && error.response.status === 401) {
        clientURL = `${clientRoute}/`;
      } else {
        return error;
      }
    });
};

export const protectedPut = async (route: string, payload: string) => {
  return authAxios
    .put(route, payload)
    .then((res: { data: Array<string> }) => {
      return res.data;
    })
    .catch((error: { response: { status: number } }) => {
      if (error.response && error.response.status === 401) {
        clientURL = `${clientRoute}/`;
      } else {
        return error;
      }
    });
};

export const protectedDelete = async (route: string) => {
  return authAxios
    .delete(route)
    .then((res: { data: any }) => {
      return res.data;
    })
    .catch((error: { response: { status: number } }) => {
      if (error.response && error.response.status === 401) {
        clientURL = `${clientRoute}/`;
      } else {
        return error;
      }
    });
};

export const unProtectedGet = async (route: string) => {
  return authAxiosWithAnyURL
    .get(route)
    .then((res: { data: Array<string> }) => {
      return res.data;
    })
    .catch((error: { response: { status: number } }) => {
      if (error.response && error.response.status === 401) {
        clientURL = `${clientRoute}/`;
      } else {
        return error;
      }
    });
};
