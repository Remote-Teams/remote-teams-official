import axios from "axios";
// import { url } from "./actions/config";
// import Modal from "react-responsive-modal";
// import React from "react";
import store from "./store";
import { SET_ERROR_CODE, CLEAR_LOADER } from "./types";

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // console.log("asdad one", config);
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    // console.log("asdad two", error.config);
    Promise.reject(error);
  }
);

//Add a response interceptor

axios.interceptors.response.use(
  (response) => {
    // var data = JSON.parse(localStorage.getItem("Data"));
    // console.log(data);
    return response;
  },
  function(error) {
    // const originalRequest = error.config;
    // console.log(error.response.status);
    if (error.response.status === 405) {
      store.dispatch({
        type: SET_ERROR_CODE,
        payload: error.response.status,
      });
    } else if (
      error.response.status === 422 ||
      error.response.status === 500 ||
      error.response.status === 400
    ) {
      store.dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
      store.dispatch({
        type: SET_ERROR_CODE,
        payload: error.response.status,
      });
      // alert("Why dont you refresh it");
    }

    return Promise.reject(error);
  }
);
