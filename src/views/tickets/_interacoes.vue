<template>
  <div
    class="tw:p-6 tw:bg-white tw:dark:bg-[#1F2A37] tw:rounded-lg tw:border tw:border-[#e5e7eb] tw:dark:border-[#2D3748]"
  >
    <p class="tw:text-xl tw:font-bold tw:text-gray-900 tw:dark:text-white">Interações</p>

    <div
      v-for="(int, index) in interacoes"
      :key="int.id"
      class="tw:flex tw:items-start tw:gap-3 tw:py-4"
      :class="{ 'tw:border-b tw:border-gray-200 tw:dark:border-gray-600': index < interacoes.length - 1 }"
    >
      <div
        class="tw:w-[32px] tw:h-[32px] tw:rounded-full tw:bg-[#eef4fe] tw:dark:bg-[#22334E] tw:flex tw:items-center tw:justify-center tw:flex-shrink-0"
      >
        <p class="q-mb-none tw:text-center tw:font-semibold tw:text-[12px] tw:text-[#3c83f6]">
          {{ int.usuario_nome?.substring(0, 2)?.toUpperCase() || "ND" }}
        </p>
      </div>

      <div class="tw:flex-1 tw:min-w-0">
        <div class="tw:flex tw:justify-between tw:items-start tw:mb-2">
          <div class="tw:flex tw:items-center tw:gap-2">
            <p class="q-mb-none tw:text-sm tw:font-medium tw:text-gray-900 tw:dark:text-white">
              {{ int.usuario_nome || "Usuário não identificado" }}
            </p>
            <p class="q-mb-none tw:text-xs tw:text-gray-500 tw:dark:text-gray-400">
              {{ AjustarData(int.date) || "Data não disponível" }}
            </p>
          </div>

          <p
            class="q-mb-none tw:text-sm tw:font-medium tw:text-gray-600 tw:dark:text-white tw:bg-gray-100 tw:dark:bg-[#2D3748] tw:px-2 tw:rounded-md"
          >
            {{ int.status_nome || "Status não disponível" }}
          </p>
        </div>

        <div v-if="int.description">
          <p class="q-mb-none tw:text-sm tw:font-medium tw:text-[#65758b] tw:dark:text-gray-300">
            {{ int.description }}
          </p>
        </div>
      </div>
    </div>

    <div class="tw:mt-12">
      <div class="tw:border-b tw:border-gray-200 tw:dark:border-gray-600 tw:mb-3" />

      <p class="q-mb-none tw:text-sm tw:font-semibold tw:text-gray-600 tw:dark:text-white">Adicionar interação</p>

      <q-form @submit.prevent="AdicionarInteracao" ref="formRef">
        <q-input
          :input-style="{
            resize: 'none'
          }"
          v-model="form.description"
          placeholder="Digite seu comentário aqui..."
          dense
          outlined
          type="textarea"
          color="grey-5"
          :rows="5"
          :maxlength="2048"
          style="margin: 8px 0; flex: 1; resize: none"
          :rules="[(val) => !!val || 'Campo obrigatório']"
          hide-bottom-space
        />

        <div class="tw:flex tw:items-start tw:gap-3 tw:mt-3">
          <div class="tw:flex-1">
            <q-select
              v-model="form.status_id"
              :options="statusTickets"
              label="Status do Ticket"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              dense
              outlined
              color="grey-5"
              class="tw:w-full"
            />
          </div>

          <q-btn label="Enviar" color="blue-6" no-caps type="submit" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { Loading, Notify } from "quasar";
import { api } from "@/boot/axios";
import { useTicketStore } from "@/stores/ticket";
import moment from "moment";

const TicketStore = useTicketStore();

const ticketId = computed(() => TicketStore?.getTicketSelecionado?.id || null);

const formRef = ref(null);
const interacoes = ref([]);
const statusTickets = ref([]);

const form = ref({
  description: "",
  status_id: null
});

onMounted(async () => {
  await BuscaInteracoes();
  await BuscaStatusTickets();
});

watch(
  () => ticketId.value,
  async (id) => {
    if (!id) {
      interacoes.value = [];
      return;
    }
    await BuscaInteracoes();
  }
);

async function BuscaInteracoes() {
  try {
    if (!ticketId.value) return;
    const response = await api.get(`/tickets/${ticketId.value}/interacoes`);
    interacoes.value = response.data;
  } catch (error) {
    console.log(error);
    Notify.create({
      message: error.response?.data?.message || "Erro ao buscar interações",
      color: "negative",
      position: "top"
    });
  }
}

async function BuscaStatusTickets() {
  try {
    const response = await api.get("/status_tickets");
    statusTickets.value = response.data;
  } catch (error) {
    console.log(error);
    Notify.create({
      message: error.response?.data?.message || "Erro ao buscar status do ticket",
      color: "negative",
      position: "top"
    });
  }
}

async function AdicionarInteracao() {
  try {
    if (!form.value.description || !form.value.status_id) {
      Notify.create({
        message: "Preencha todos os campos obrigatórios",
        color: "negative",
        position: "top"
      });
      return;
    }

    if (formRef.value && typeof formRef.value.validate === "function") {
      const isValid = await formRef.value.validate();
      if (!isValid) return;
    }

    Loading.show({ message: "Adicionando interação..." });

    await api.post(`/tickets/${ticketId.value}/interacoes`, form.value);

    await BuscaInteracoes();

    await AtualizaTicket();

    if (formRef.value && typeof formRef.value.validate === "function") {
      form.value.description = "";
      form.value.status_id = null;

      await formRef.value.reset();
      await formRef.value.resetValidation();
    }

    Notify.create({
      message: "Interação adicionada com sucesso!",
      color: "positive",
      position: "top"
    });
  } catch (error) {
    console.log(error);
    Notify.create({
      message: error.response?.data?.message || "Erro ao adicionar interação",
      color: "negative",
      position: "top"
    });
  } finally {
    Loading.hide();
  }
}

async function AtualizaTicket() {
  try {
    const response = await api.get(`/tickets/${ticketId.value}`);
    TicketStore.setTicketSelecionado(response.data);
  } catch (error) {
    console.log(error);
    Notify.create({
      message: error.response?.data?.message || "Erro ao atualizar ticket",
      color: "negative",
      position: "top"
    });
  }
}

function AjustarData(data) {
  return moment(data).format("DD/MM/YYYY HH:mm:ss");
}
</script>
