const ListaUsuarios = () => import("@/views/usuarios/ListaUsuarios.vue");
const CadastrarUsuarios = () => import("@/views/usuarios/CadastrarUsuario.vue");
const EditarUsuario = () => import("@/views/usuarios/EditarUsuario.vue");

export const usuariosRoutes = [
  {
    path: "/usuarios",
    component: ListaUsuarios,
    meta: {
      access_level: "ADM",
      layout: "MyLayout",
      requiresAuth: true
    }
  },
  {
    path: "/usuarios/cadastrar",
    component: CadastrarUsuarios,
    meta: {
      access_level: "ADM",
      layout: "MyLayout",
      requiresAuth: true
    }
  },
  {
    path: "/usuarios/:id/editar",
    component: EditarUsuario,
    meta: {
      access_level: "ADM",
      layout: "MyLayout",
      requiresAuth: true
    }
  }
];
