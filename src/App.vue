<template>
  <component :is="$route.meta.layout || 'loginLayout'">
    <router-view />
  </component>
</template>

<script>
import { api } from "@/boot/axios";
import loginLayout from "@/layouts/login.vue";
import MyLayout from "@/layouts/MyLayout.vue";
import { useAuthStore } from "@/stores/authStore";

export default {
  components: {
    MyLayout,
    loginLayout
  },
  async beforeCreate() {
    await this.AuthStore.init();
    const token = this.AuthStore.getToken();
    if (!token) {
      api.defaults.headers.common.Authorization = "";
      this.DirecionaLogin();
    }
  },
  methods: {
    DirecionaLogin() {
      this.$router.push("/login");
    }
  },
  setup() {
    const AuthStore = useAuthStore();

    return { AuthStore };
  }
};
</script>
