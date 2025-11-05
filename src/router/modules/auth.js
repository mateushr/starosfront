const Login = () => import("@/views/Login.vue");

export const authRoutes = [
  {
    path: "/login",
    component: Login,
    meta: {
      requiresAuth: false,
      layout: "loginLayout"
    }
  }
];
