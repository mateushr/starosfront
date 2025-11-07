<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:dark:bg-[#0F1629]">
    <div
      v-if="TicketStore?.getTicketSelecionado?.id"
      class="tw:container tw:mx-auto tw:py-[20px] tw:px-4 tw:sm:px-6 tw:lg:px-8"
    >
      <div class="tw:flex tw:items-center tw:gap-4">
        <q-btn flat dense color="blue-6" to="/tickets">
          <Icon icon="tabler:chevron-left" class="tw:text-3xl" />
        </q-btn>

        <div>
          <p class="q-mb-none tw:text-[30px] tw:font-bold">{{ TicketStore?.getTicketSelecionado?.title || "N/D" }}</p>
          <p class="q-mb-none tw:text-[16px] tw:leading-[24px]">
            Ticket #{{ TicketStore?.getTicketSelecionado?.id || "0" }}
          </p>
        </div>
      </div>

      <div class="tw:mt-4 tw:flex tw:flex-row tw:gap-4 tw:flex-1 tw:min-h-0 tw:overflow-hidden">
        <div class="tw:w-full tw:md:w-[60%] tw:flex tw:flex-col tw:gap-4">
          <descricaoTicket :ticket="TicketStore?.getTicketSelecionado" />

          <interacoesTicket />
        </div>

        <div class="tw:w-full tw:md:w-[40%]">
          <informacoesTicket :ticket="TicketStore?.getTicketSelecionado" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Loading, Notify } from "quasar";
import { api } from "@/boot/axios";
import { useTicketStore } from "@/stores/ticket";
import descricaoTicket from "@/views/tickets/_descricaoTicket.vue";
import informacoesTicket from "@/views/tickets/_informacoesTicket.vue";
import interacoesTicket from "@/views/tickets/_interacoes.vue";
import { Icon } from "@iconify/vue";

const router = useRouter();
const route = useRoute();
const TicketStore = useTicketStore();

onMounted(async () => {
  Loading.show({
    message: "Carregando dados do ticket..."
  });
  const ticketId = route.params.id;

  await BuscaDadosDoTicket(ticketId);

  Loading.hide();
});

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) return;
    Loading.show({ message: "Carregando dados do ticket..." });
    await BuscaDadosDoTicket(newId);
    Loading.hide();
  }
);

async function BuscaDadosDoTicket(ticket_id) {
  try {
    const response = await api.get(`/tickets/${ticket_id}`);
    TicketStore.setTicketSelecionado(response.data);
  } catch (error) {
    router.push("/tickets");
    console.log(error);
    Notify.create({
      message: error.response?.data?.message || "Erro ao atualizar ticket",
      color: "negative",
      position: "top"
    });
  }
}
</script>
