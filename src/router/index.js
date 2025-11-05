import { createRouter, createWebHistory } from "vue-router";
import { Notify } from "quasar";

import { authRoutes } from "./modules/auth.js";
import { clientesRoutes } from "./modules/clientes.js";
import { dashboardRoutes } from "./modules/dashboard.js";
import { ticketsRoutes } from "./modules/tickets.js";
import { usuariosRoutes } from "./modules/usuarios.js";

const routes = [
  {
    path: "/",
    component: () => import("@/views/dashboard/Home.vue"),
    meta: {
      layout: "MyLayout",
      requiresAuth: true
    }
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/"
  },
  ...authRoutes,
  ...clientesRoutes,
  ...ticketsRoutes,
  ...dashboardRoutes,
  ...usuariosRoutes
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const nivelAcesso = JSON.parse(localStorage.getItem("access_level"));
  const tokenUsuario = localStorage.getItem("token");

  const vrotas = to.matched.some((record) => record.meta.requiresAuth);

  if (vrotas) {
    if (!tokenUsuario) {
      return next("/login");
    } else if (to.meta.access_level === "ADM" && nivelAcesso !== "ADM") {
      Notify.create({
        message: "Você não tem permissão para acessar essa página!",
        position: "top"
      });
      return next("/");
    }
  }
  next();
});

export default router;
