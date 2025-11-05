import { defineStore } from "pinia";

export const useTicketStore = defineStore("TicketStore", {
  state: () => ({
    ticketSelecionado: null
  }),
  getters: {
    getTicketSelecionado: (state) => state.ticketSelecionado
  },
  actions: {
    setTicketSelecionado(ticket) {
      this.ticketSelecionado = ticket;
    }
  }
});
