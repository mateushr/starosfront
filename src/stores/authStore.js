import { Notify } from "quasar";
import { api } from "@/boot/axios";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("AuthStore", {
  state: () => ({
    me: {},
    token: "",
    isAuthenticated: false
  }),
  getters: {
    getMe: (state) => () => {
      return state.me;
    },
    getAccessLevel: (state) => () => {
      return state.me.access_level;
    },
    getToken: (state) => () => {
      return state.token;
    },
    getIsAuthenticated: (state) => () => {
      return state.isAuthenticated;
    }
  },
  actions: {
    async doLogin(payload) {
      return await api
        .post("usuarios/login", payload)
        .then(async (response) => {
          const { token, usuario } = response.data;
          this.token = token;
          this.me = usuario;
          this.access_level = usuario.access_level;
          this.isAuthenticated = true;
          api.defaults.headers.common.Authorization = "Bearer " + token;
          localStorage.setItem("access_level", JSON.stringify(usuario.access_level));
          localStorage.setItem("token", JSON.stringify(token));
          return true;
        })
        .catch((error) => {
          console.error(error);
          Notify.create({
            message: error?.response?.data?.message || "Não foi possível realizar o login.",
            color: "negative",
            position: "top"
          });
          return false;
        });
    },

    logout() {
      api.defaults.headers.common.Authorization = "";
      this.token = "";
      this.me = {};
      this.isAuthenticated = false;
      this.removeItemsLocalStorage();
    },

    async getUsuario() {
      return await api
        .get("usuarios/dados-usuario")
        .then((response) => {
          this.me = response.data.usuario;
          this.access_level = response.data.usuario.access_level;
        })
        .catch(() => {
          this.token = "";
          this.isAuthenticated = false;
          this.removeItemsLocalStorage();
        });
    },

    async init() {
      const token = JSON.parse(localStorage.getItem("token"));
      if (token) {
        this.token = token;
        api.defaults.headers.common.Authorization = "Bearer " + token;
        this.isAuthenticated = true;
      }
      await this.getUsuario(token);
    },

    removeItemsLocalStorage() {
      localStorage.removeItem("token");
    }
  }
});
