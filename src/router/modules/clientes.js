const ListaClientes = () => import("@/views/clientes/ListaClientes.vue");
const CadastrarCliente = () => import("@/views/clientes/CadastrarCliente.vue");
const EditarCliente = () => import("@/views/clientes/EditarCliente.vue");

export const clientesRoutes = [
  {
    path: "/clientes",
    component: ListaClientes,
    meta: {
      layout: "MyLayout",
      requiresAuth: true
    }
  },
  {
    path: "/clientes/cadastrar",
    component: CadastrarCliente,
    meta: {
      layout: "MyLayout",
      requiresAuth: true
    }
  },
  {
    path: "/clientes/:id/editar",
    component: EditarCliente,
    meta: {
      layout: "MyLayout",
      requiresAuth: true
    }
  }
];
