<template>
  <div>
    <div class="tw:container tw:mx-auto tw:py-[20px] tw:px-4 tw:sm:px-6 tw:lg:px-8">
      <div class="tw:flex tw:items-center tw:justify-between">
        <div>
          <p class="q-mb-none tw:text-[30px] tw:font-bold">Usuários</p>
          <p class="q-mb-none tw:text-[16px] tw:leading-[24px]">Gerencie todos os usuários</p>
        </div>

        <q-btn label="Novo Usuário" color="blue-6" to="/usuarios/cadastrar" />
      </div>

      <div class="tw:my-4">
        <q-table
          bordered
          flat
          style="border-radius: 12px"
          :rows="usuarios"
          :columns="columns"
          :loading="CarregandoDados"
          :style="isDark ? 'border: none; background-color: #1F2A37' : ''"
          binary-state-sort
          no-data-label="Nenhum usuário encontrado"
        >
          <template v-slot:body-cell-Acesso="props">
            <q-td :props="props">
              <p class="q-mb-none">{{ props.row.access_level === "ADM" ? "Administrador" : "Usuário" }}</p>
            </q-td>
          </template>

          <template v-slot:body-cell-CriadoEm="props">
            <q-td :props="props">
              <p class="q-mb-none">{{ AjustarData(props.row.created_at) }}</p>
            </q-td>
          </template>

          <template v-slot:body-cell-AtualizadoEm="props">
            <q-td :props="props">
              <p class="q-mb-none">{{ AjustarData(props.row.updated_at) }}</p>
            </q-td>
          </template>

          <template v-slot:body-cell-Acoes="props">
            <q-td :props="props">
              <q-btn flat color="primary" :to="`/usuarios/${props.row.id}/editar`">
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
import moment from "moment";

const isDark = computed(() => Dark.isActive);

const usuarios = ref([]);
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
    field: (row) => row.name
  },
  {
    name: "Email",
    required: true,
    label: "E-mail",
    align: "left",
    field: (row) => row.email
  },
  {
    name: "Acesso",
    required: true,
    label: "Acesso",
    align: "left",
    field: (row) => row.access_level
  },
  {
    name: "CriadoEm",
    required: true,
    label: "Criado em",
    align: "left",
    field: (row) => row.created_at
  },
  {
    name: "AtualizadoEm",
    required: true,
    label: "Atualizado em",
    align: "left",
    field: (row) => row.updated_at
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

    const response = await api.get(`/usuarios`);
    usuarios.value = response.data;
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
  } finally {
    CarregandoDados.value = false;
  }
});

function AjustarData(data) {
  if (!data) return "";
  return moment(data).format("lll");
}
</script>
