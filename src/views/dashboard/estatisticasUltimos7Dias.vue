<template>
  <div class="tw:container tw:mx-auto">
    <div
      class="tw:rounded-lg tw:border tw:bg-white tw:border-gray-200 tw:shadow-sm tw:dark:bg-[#1F2A37] tw:dark:border-0 tw:dark:shadow-lg tw:p-4"
    >
      <div class="tw:flex tw:items-center tw:justify-between tw:mb-4">
        <p class="q-mb-none tw:text-[20px] tw:font-bold tw:text-[#292a2e] tw:dark:text-[#bfc1c4]">
          Tickets nos últimos 7 dias
        </p>
      </div>

      <div class="tw:relative">
        <apexchart v-show="!erro" type="bar" height="260" :options="chartOptions" :series="series" />
        <div v-if="erro" class="tw:text-red-500 tw:dark:text-red-400 tw:py-2">{{ erro }}</div>
        <div v-if="carregando" class="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-white/50 tw:dark:bg-[#1F2A37]/50">
          <q-spinner color="blue-6" size="2em" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { Dark, Notify } from "quasar";
import { api } from "@/boot/axios";
import moment from "moment";

const carregando = ref(false);
const erro = ref("");
const dadosApi = ref([]);
const isDark = computed(() => Dark.isActive);

const dias = computed(() => {
  const hoje = moment();
  const lista = [];
  const mapa = new Map(dadosApi.value.map((d) => [d.dia, d.total]));
  for (let i = 6; i >= 0; i--) {
    const data = hoje.clone().subtract(i, "days").format("YYYY-MM-DD");
    lista.push({ data, total: mapa.get(data) || 0 });
  }
  return lista;
});

const series = computed(() => [{ name: "Tickets", data: dias.value.map((d) => d.total) }]);

const chartOptions = computed(() => {
  const textColor = isDark.value ? "#d1d5db" : "#374151";
  const gridColor = isDark.value ? "#334155" : "#e5e7eb";
  return {
    chart: {
      toolbar: { show: false },
      animations: { enabled: true },
      background: "transparent"
    },
    theme: { mode: isDark.value ? "dark" : "light" },
    plotOptions: {
      bar: { columnWidth: "50%", borderRadius: 6 }
    },
    dataLabels: { enabled: false },
    grid: { borderColor: gridColor, strokeDashArray: 4 },
    xaxis: {
      categories: dias.value.map((d) => formataLabel(d.data)),
      labels: { style: { colors: Array(dias.value.length).fill(textColor) } },
      axisBorder: { color: gridColor },
      axisTicks: { color: gridColor }
    },
    yaxis: {
      labels: { style: { colors: [textColor] } }
    },
    tooltip: {
      theme: isDark.value ? "dark" : "light"
    },
    colors: ["#3C83F6"]
  };
});

function formataLabel(data) {
  return moment(data).format("DD/MM");
}

onMounted(async () => {
  try {
    carregando.value = true;
    const { data } = await api.get("/estatisticas/tickets_por_dia");
    dadosApi.value = Array.isArray(data) ? data : [];
  } catch (error) {
    erro.value = error?.response?.data?.message || "Não foi possível carregar as estatísticas.";
    Notify.create({ message: erro.value, color: "negative", position: "top" });
  } finally {
    carregando.value = false;
  }
});
</script>
