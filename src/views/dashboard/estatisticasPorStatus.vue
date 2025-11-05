<template>
  <div class="tw:container tw:mx-auto tw:py-[20px]">
    <div
      class="tw:rounded-lg tw:border tw:bg-white tw:border-gray-200 tw:shadow-sm tw:dark:bg-[#1F2A37] tw:dark:border-0 tw:dark:shadow-lg tw:p-4"
    >
      <div class="tw:flex tw:items-center tw:justify-between tw:mb-4">
        <p class="q-mb-none tw:text-[20px] tw:font-bold tw:text-[#292a2e] tw:dark:text-[#bfc1c4]">Tickets por Status</p>
      </div>

      <div v-if="carregando" class="tw:flex tw:items-center tw:justify-center tw:py-8">
        <q-spinner color="blue-6" size="2em" />
      </div>

      <div v-else>
        <div v-if="erro" class="tw:text-red-500 tw:dark:text-red-400 tw:py-2">{{ erro }}</div>

        <div v-else class="tw:flex tw:flex-col tw:gap-3">
          <div v-for="item in dados" :key="item.status_id" class="tw:flex tw:items-center tw:gap-3">
            <div class="tw:w-48 tw:text-sm tw:text-gray-700 tw:dark:text-gray-200">{{ item.status_nome }}</div>
            <div class="tw:flex-1 tw:h-4 tw:bg-gray-200 tw:rounded tw:dark:bg-[#111827]">
              <div
                class="tw:h-4 tw:rounded"
                :style="{
                  width: calculaLargura(item.total),
                  backgroundColor: getCor(item.status_id)
                }"
              ></div>
            </div>
            <div class="tw:w-12 tw:text-right tw:text-sm tw:text-gray-700 tw:dark:text-gray-200">{{ item.total }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { Notify } from "quasar";
import { api } from "@/boot/axios";

const dados = ref([]);
const carregando = ref(false);
const erro = ref("");

const statusBase = [
  { id: 1, nome: "Aberto" },
  { id: 2, nome: "Em execução" },
  { id: 3, nome: "Aguardando cliente" },
  { id: 4, nome: "Encerrado" },
  { id: 5, nome: "Reaberto" },
  { id: 6, nome: "Cancelado" }
];

const maiorTotal = computed(() => {
  if (!dados.value.length) return 1;
  return Math.max(...dados.value.map((d) => d.total));
});

function calculaLargura(valor) {
  const max = maiorTotal.value || 1;
  const perc = Math.round((valor / max) * 100);
  return perc + "%";
}

function getCor(statusId) {
  const mapa = {
    1: "#F59E0B",
    2: "#10B981",
    3: "#3B82F6",
    4: "#6366F1",
    5: "#F43F5E",
    6: "#9CA3AF"
  };
  return mapa[statusId] || "#3C83F6";
}

onMounted(async () => {
  try {
    carregando.value = true;
    const { data } = await api.get("/estatisticas/tickets_por_status");
    const arr = Array.isArray(data) ? data : [];
    const mapa = new Map(arr.map((d) => [d.status_id, d]));
    dados.value = statusBase.map((s) => ({
      status_id: s.id,
      status_nome: s.nome,
      total: mapa.get(s.id)?.total || 0
    }));
  } catch (error) {
    erro.value = error?.response?.data?.message || "Não foi possível carregar as estatísticas.";
    Notify.create({
      message: erro.value,
      color: "negative",
      position: "top"
    });
  } finally {
    carregando.value = false;
  }
});
</script>
