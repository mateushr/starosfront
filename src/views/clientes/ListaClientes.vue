<template>
  <div>
    <div class="tw:container tw:mx-auto tw:py-[20px] tw:px-4 tw:sm:px-6 tw:lg:px-8">
      <div class="tw:flex tw:items-center tw:justify-between">
        <div>
          <p class="q-mb-none tw:text-[30px] tw:font-bold">Clientes</p>
          <p class="q-mb-none tw:text-[16px] tw:leading-[24px]">Gerencie os clientes cadastrados</p>
        </div>

        <q-btn label="Novo Cliente" color="blue-6" to="/clientes/cadastrar" />
      </div>

      <div class="tw:my-4">
        <q-table
          bordered
          flat
          :style="isDark ? 'border: none; background-color: #1F2A37' : ''"
          style="border-radius: 12px"
          :rows="clientes"
          :columns="columns"
          :loading="CarregandoDados"
          binary-state-sort
          no-data-label="Nenhum cliente encontrado"
        >
          <template v-slot:body-cell-Acoes="props">
            <q-td :props="props">
              <q-btn flat color="primary" :to="`/clientes/${props.row.id}/editar`">
                <Icon icon="hugeicons:license-draft" class="q-mr-sm" /> Editar
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { Dark } from "quasar";
import { api } from "@/boot/axios";
import { Icon } from "@iconify/vue";

const isDark = computed(() => Dark.isActive);

const clientes = ref([]);
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
    name: "Nome",
    required: true,
    label: "Nome",
    align: "left",
    field: (row) => row.nome
  },
  {
    name: "Descrição",
    required: true,
    label: "Descrição",
    align: "left",
    field: (row) => row.description
  },
  {
    name: "Telefone",
    required: true,
    label: "Telefone",
    align: "left",
    field: (row) => row.telefone
  },
  {
    name: "Email",
    required: true,
    label: "Email",
    align: "left",
    field: (row) => row.email
  },
  {
    name: "Acoes",
    label: "",
    align: "left"
  }
]);

onMounted(async () => {
  try {
    CarregandoDados.value = true;

    const response = await api.get(`/clientes`);
    clientes.value = response.data;
  } catch (err) {
    console.error("Erro ao buscar cliente:", err);
  } finally {
    CarregandoDados.value = false;
  }
});
</script>
