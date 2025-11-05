<template>
  <div>
    <div class="tw:container tw:mx-auto tw:py-[20px] tw:px-4 tw:sm:px-6 tw:lg:px-8">
      <div class="tw:flex tw:items-center tw:justify-between">
        <div>
          <p class="q-mb-none tw:text-[30px] tw:font-bold">Ticket</p>
          <p class="q-mb-none tw:text-[16px] tw:leading-[24px]">Gerencie todos os tickets de suporte</p>
        </div>

        <q-btn label="Novo Ticket" color="blue-6" to="/tickets/cadastrar" />
      </div>

      <div class="tw:my-4">
        <div class="row q-col-gutter-md tw:my-4">
          <div class="col-3">
            <label class="tw:text-gray-500 tw:dark:text-gray-200">Selecione o cliente</label>
            <q-select
              v-model="clienteSelecionado"
              :options="opcoesClientes"
              label="Filtrar por cliente"
              outlined
              dense
              clearable
              class="tw:w-full sm:tw:w-64"
              :dark="isDark"
              option-label="nome"
              option-value="id"
              emit-value
              map-options
              use-input
              @filter="filtrarClientes"
            />
          </div>
        </div>
        <q-table
          :bordered="!isDark"
          flat
          style="border-radius: 12px"
          :style="isDark ? 'border: none; background-color: #1F2A37' : ''"
          :rows="tickets"
          :columns="columns"
          :loading="CarregandoDados"
          no-data-label="Nenhum ticket encontrado"
        >
          <template v-slot:body-cell-DataCriado="props">
            <q-td :props="props">
              <p class="q-mb-none">{{ AjustarData(props.row.data_created) }}</p>
            </q-td>
          </template>

          <template v-slot:body-cell-StatusTicket="props">
            <q-td :props="props">
              <q-badge :color="getStatusColor(props.row.status_ticket)">
                <p class="q-mb-none tw:font-semibold">{{ getStatusName(props.row.status_ticket) }}</p>
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-Acoes="props">
            <q-td :props="props">
              <div class="tw:flex tw:gap-2">
                <q-btn
                  flat
                  color="blue-6"
                  :to="`/tickets/${props.row.id}/editar`"
                  :disable="props.row.usuario_id !== AuthStore.getMe().id"
                >
                  <Icon icon="hugeicons:license-draft" class="q-mr-sm" /> Editar
                </q-btn>
                <q-btn flat color="blue-6" @click="AbrirInteracoesTicket(props.row)">
                  <Icon icon="hugeicons:message-02" class="q-mr-sm" /> Interações
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Dark } from "quasar";
import { api } from "@/boot/axios";
import { useAuthStore } from "@/stores/authStore";
import { Icon } from "@iconify/vue";
import moment from "moment";

const AuthStore = useAuthStore();
const isDark = computed(() => Dark.isActive);

const router = useRouter();
const tickets = ref([]);
const clientes = ref([]);
const opcoesClientes = ref([]);
const clienteSelecionado = ref(null);
const CarregandoDados = ref(false);

const columns = ref([
  {
    name: "Id",
    required: true,
    label: "# ID",
    align: "left",
    field: (row) => row.id
  },
  {
    name: "Titulo",
    required: true,
    label: "Titulo",
    align: "left",
    field: (row) => row.title
  },
  {
    name: "Descrição",
    required: true,
    label: "Descrição",
    align: "left",
    field: (row) => row.description
  },
  {
    name: "Cliente",
    required: true,
    label: "Cliente",
    align: "left",
    field: (row) => row?.cliente?.nome || ""
  },
  {
    name: "CriadoPor",
    required: true,
    label: "Criado Por",
    align: "left",
    field: (row) => row.usuario.name
  },
  {
    name: "DataCriado",
    required: true,
    label: "Data criado",
    align: "left",
    field: (row) => row.data_created
  },
  {
    name: "StatusTicket",
    required: true,
    label: "Status",
    align: "left",
    field: (row) => row.status_ticket
  },
  {
    name: "Acoes",
    label: "",
    align: "left"
  }
]);

onMounted(async () => {
  await buscarTickets();
  await buscarClientes();
});

async function buscarTickets() {
  try {
    CarregandoDados.value = true;
    const params = {};
    if (clienteSelecionado.value) {
      params.cliente_id = clienteSelecionado.value;
    }
    const response = await api.get(`/tickets`, { params });
    tickets.value = response.data;
  } catch (err) {
    console.error("Erro ao buscar ticket:", err);
  } finally {
    CarregandoDados.value = false;
  }
}

async function buscarClientes() {
  try {
    const response = await api.get("/clientes");
    clientes.value = response.data;
    opcoesClientes.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
  }
}

function filtrarClientes(val, update) {
  if (val === "") {
    update(() => {
      opcoesClientes.value = clientes.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcoesClientes.value = clientes.value.filter(
      (v) => v.nome.toLowerCase().indexOf(needle) > -1
    );
  });
}

watch(clienteSelecionado, () => {
  buscarTickets();
});

function AjustarData(data) {
  if (!data) return "";
  return moment(data).format("lll");
}

function getStatusName(statusObj) {
  return statusObj && statusObj.name ? statusObj.name : "Desconhecido";
}

function getStatusColor(statusObj) {
  if (!statusObj || !statusObj.id) return "grey";

  switch (statusObj.id) {
    case 1:
      return "orange";
    case 2:
      return "green";
    case 3:
      return "blue";
    default:
      return "grey";
  }
}

function AbrirInteracoesTicket(dadosTicket) {
  router.push(`/tickets/${dadosTicket.id}/interacoes`);
}
</script>
