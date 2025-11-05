const ListaTickets = () => import("@/views/tickets/ListaTickets.vue");
const CadastrarTicket = () => import("@/views/tickets/CadastrarTicket.vue");
const EditarTicket = () => import("@/views/tickets/EditarTicket.vue");
const InteracoesTicket = () => import("@/views/tickets/InteracoesTicket.vue");

export const ticketsRoutes = [
  {
    path: "/tickets/cadastrar",
    component: CadastrarTicket,
    meta: {
      layout: "MyLayout",
      requiresAuth: true
    }
  },
  {
    path: "/tickets",
    component: ListaTickets,
    meta: {
      layout: "MyLayout",
      requiresAuth: true
    }
  },
  {
    path: "/tickets/:id/editar",
    component: EditarTicket,
    meta: {
      layout: "MyLayout",
      requiresAuth: true
    }
  },
  {
    path: "/tickets/:id/interacoes",
    component: InteracoesTicket,
    meta: {
      layout: "MyLayout",
      requiresAuth: true
    }
  }
];
