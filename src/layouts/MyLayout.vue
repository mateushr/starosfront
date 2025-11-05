<template>
  <q-layout view="lHh lpR lFf" class="layout-container tw:font-system-ui">
    <q-header bordered :class="isDark ? 'bg-header text-white' : 'bg-white text-black'">
      <q-toolbar>
        <q-btn dense flat @click="drawerOpen = !drawerOpen" :title="drawerOpen ? 'Esconder menu' : 'Mostrar menu'">
          <Icon :icon="drawerOpen ? 'tabler:caret-left' : 'tabler:caret-right'" class="tw:text-xl" />
        </q-btn>

        <q-space />
        <div class="tw:flex tw:gap-2">
          <q-btn dense flat @click="toggleDarkMode" :title="isDark ? 'Modo Claro' : 'Modo Escuro'">
            <Icon :icon="isDark ? 'tabler:sun' : 'tabler:moon'" class="tw:text-xl" />
          </q-btn>

          <q-btn dense flat @click="logout" title="Sair">
            <Icon icon="tabler:door-exit" class="tw:text-xl" />
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="drawerOpen" style="background-color: #0f1629; color: #fff" :width="255" bordered>
      <div class="tw:h-[50px] tw:flex tw:items-center tw:gap-2 tw:pl-6 tw:border-b tw:border-[#1f2c3d]">
        <img :src="LogoBrancoStar" alt="Logo STAR OS" class="tw:h-[20px]" />
        <p class="q-mb-none tw:text-lg tw:font-semibold tw:text-[20px] tw:leading-[28px]">STAR OS</p>
      </div>

      <div class="tw:p-4">
        <div
          class="tw:px-2 tw:py-2 tw:rounded-md tw:cursor-pointer"
          :class="[isRouteActive('/') ? 'tw:bg-[#3C83F6] tw:hover:bg-[#3C83F6]' : 'tw:hover:bg-[#1a233a]']"
          @click="$router.push('/')"
        >
          <div class="tw:items-center tw:gap-3 tw:flex">
            <Icon icon="tabler:home" class="tw:text-2xl" />
            <p class="q-mb-none tw:font-medium tw:leading-[20px]" :class="{ 'tw:font-semibold': isRouteActive('/') }">
              Dashboard
            </p>
          </div>
        </div>

        <div
          class="tw:px-2 tw:py-2 tw:rounded-md tw:cursor-pointer"
          :class="[isRouteActive('/tickets') ? 'tw:bg-[#3C83F6] tw:hover:bg-[#3C83F6]' : 'tw:hover:bg-[#1a233a]']"
          @click="$router.push('/tickets')"
        >
          <div class="tw:items-center tw:gap-3 tw:flex">
            <Icon icon="tabler:ticket" class="tw:text-2xl" />
            <p
              class="q-mb-none tw:font-medium tw:leading-[20px]"
              :class="{ 'tw:font-semibold': isRouteActive('/tickets') }"
            >
              Tickets
            </p>
          </div>
        </div>

        <div
          class="tw:px-2 tw:py-2 tw:rounded-md tw:cursor-pointer"
          :class="[isRouteActive('/clientes') ? 'tw:bg-[#3C83F6] tw:hover:bg-[#3C83F6]' : 'tw:hover:bg-[#1a233a]']"
          @click="$router.push('/clientes')"
        >
          <div class="tw:items-center tw:gap-3 tw:flex">
            <Icon icon="tabler:building" class="tw:text-2xl" />
            <p
              class="q-mb-none tw:font-medium tw:leading-[20px]"
              :class="{ 'tw:font-semibold': isRouteActive('/clientes') }"
            >
              Clientes
            </p>
          </div>
        </div>

        <div
          class="tw:px-2 tw:py-2 tw:rounded-md tw:cursor-pointer"
          :class="[isRouteActive('/usuarios') ? 'tw:bg-[#3C83F6] tw:hover:bg-[#3C83F6]' : 'tw:hover:bg-[#1a233a]']"
          @click="$router.push('/usuarios')"
          v-if="AuthStore.getAccessLevel() === 'ADM'"
        >
          <div class="tw:items-center tw:gap-3 tw:flex">
            <Icon icon="tabler:user" class="tw:text-2xl" />
            <p
              class="q-mb-none tw:font-medium tw:leading-[20px]"
              :class="{ 'tw:font-semibold': isRouteActive('/usuarios') }"
            >
              Usuários
            </p>
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import LogoBrancoStar from "@/assets/images/LogoBranco.png";
import { useAuthStore } from "@/stores/authStore";
import { Icon } from "@iconify/vue";

const AuthStore = useAuthStore();

const $q = useQuasar();
const router = useRouter();

const isDark = computed(() => $q.dark.isActive);
const toggleDarkMode = () => {
  $q.dark.toggle();
  localStorage.setItem("darkMode", isDark.value ? "enabled" : "disabled");
};

onMounted(() => {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    $q.dark.set(true);
  } else {
    $q.dark.set(false);
  }
});

const drawerOpen = ref(true);

const logout = () => {
  AuthStore.logout();
  router.push("/login");
};

const isRouteActive = (routePath) => {
  const currentPath = router.currentRoute.value.path;
  if (routePath === "/") {
    return currentPath === routePath;
  }
  return currentPath.startsWith(routePath);
};
</script>

<style scoped>
.layout-container {
  height: 100dvh;
}

.page-container {
  max-height: 100%;
  overflow-y: auto;
}

.body--dark .layout-container {
  background-color: #0f1629;
}

.bg-header {
  background-color: #1f2a37;
}
</style>
