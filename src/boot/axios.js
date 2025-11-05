import { Dialog, Loading } from "quasar";
import router from "@/router";
import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_APIURL });

let isSessionExpired = false;

function mostrarDialogTokenExpirou() {
  Loading.hide();

  Dialog.create({
    title: "Sua sessão expirou",
    message: "Para continuar utilizando o sistema, faça login novamente.",
    ok: {
      label: "IR PARA LOGIN",
      color: "primary"
    },
    dark: true,
    "backdrop-filter": "blur(4px)",
    style: {
      boxShadow: "none"
    },
    persistent: true
  }).onOk(() => {
    router.push("/login");
  });
}

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    isSessionExpired = false;
    return response;
  },
  function (error) {
    if (error.response.data.status == "errtoken") {
      if (!isSessionExpired) {
        isSessionExpired = true;
        console.error("Token invalido!");
        mostrarDialogTokenExpirou();
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export { api };
