<template>
  <div class="tw:bg-[#FAFAFA] tw:dark:bg-[#0F1629] tw:h-[calc(100dvh-64px)]">
    <div class="tw:container tw:mx-auto tw:py-[20px] tw:px-4 tw:sm:px-6 tw:lg:px-8">
      <div class="tw:flex tw:items-center tw:justify-between">
        <div>
          <p class="q-mb-none tw:text-[30px] tw:font-bold">Dashboard</p>
          <p class="q-mb-none tw:text-[16px] tw:leading-[24px]">Visão geral do sistema de tickets</p>
        </div>
      </div>

      <div class="tw:my-4">
        <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:lg:grid-cols-4 tw:gap-4">
          <div
            class="tw:rounded-lg tw:border tw:dark:border-0 tw:bg-white tw:dark:bg-[#1F2A37] tw:border-gray-200 tw:shadow-sm tw:p-6"
          >
            <div class="tw:flex tw:justify-between tw:items-center">
              <p class="q-mb-none tw:text-[14px] tw:font-medium tw:text-[#0f1729] tw:dark:text-[#fff]">
                Total de Tickets
              </p>

              <Icon icon="hugeicons:ticket-02" class="tw:text-blue-600" />
            </div>

            <p class="q-mb-none tw:text-[30px] tw:font-bold">{{ estatisticas.totalTickets }}</p>
          </div>

          <div
            class="tw:rounded-lg tw:border tw:dark:border-0 tw:bg-white tw:dark:bg-[#1F2A37] tw:border-gray-200 tw:shadow-sm tw:p-6"
          >
            <div class="tw:flex tw:justify-between tw:items-center">
              <p class="q-mb-none tw:text-[14px] tw:font-medium tw:text-[#0f1729] tw:dark:text-[#fff]">Em progresso</p>

              <Icon icon="hugeicons:clock-01" class="tw:text-orange-600" />
            </div>

            <p class="q-mb-none tw:text-[30px] tw:font-bold">
              {{ estatisticas.totalTicketsNaoEncerradosOuCancelados }}
            </p>
          </div>

          <div
            class="tw:rounded-lg tw:border tw:dark:border-0 tw:bg-white tw:dark:bg-[#1F2A37] tw:border-gray-200 tw:shadow-sm tw:p-6"
          >
            <div class="tw:flex tw:justify-between tw:items-center">
              <p class="q-mb-none tw:text-[14px] tw:font-medium tw:text-[#0f1729] tw:dark:text-[#fff]">
                Total de clientes
              </p>

              <Icon icon="tabler:building" class="tw:text-green-600" />
            </div>

            <p class="q-mb-none tw:text-[30px] tw:font-bold">{{ estatisticas.totalClientes }}</p>
          </div>

          <div
            class="tw:rounded-lg tw:border tw:dark:border-0 tw:bg-white tw:dark:bg-[#1F2A37] tw:border-gray-200 tw:shadow-sm tw:p-6"
          >
            <div class="tw:flex tw:justify-between tw:items-center">
              <p class="q-mb-none tw:text-[14px] tw:font-medium tw:text-[#0f1729] tw:dark:text-[#fff]">
                Total de usuários
              </p>

              <Icon icon="hugeicons:user-02" class="tw:text-blue-600" />
            </div>

            <p class="q-mb-none tw:text-[30px] tw:font-bold">{{ estatisticas.totalUsuarios }}</p>
          </div>
        </div>

        <estatisticasPorStatus />
        <estatisticasUltimos7Dias />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from "@/boot/axios";
import estatisticasPorStatus from "@/views/dashboard/estatisticasPorStatus.vue";
import estatisticasUltimos7Dias from "@/views/dashboard/estatisticasUltimos7Dias.vue";
import { Icon } from "@iconify/vue";

const estatisticas = ref({
  totalTickets: 0,
  totalTicketsNaoEncerradosOuCancelados: 0,
  totalClientes: 0,
  totalUsuarios: 0
});

onMounted(() => {
  BuscaEstatisticas();
});

async function BuscaEstatisticas() {
  try {
    const response = await api.get("/estatisticas");
    estatisticas.value = response.data;
  } catch (error) {
    console.error(error);
  }
}
</script>
