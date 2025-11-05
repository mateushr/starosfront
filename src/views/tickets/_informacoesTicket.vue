<template>
  <div
    class="tw:p-6 tw:bg-white tw:dark:bg-[#1F2A37] tw:rounded-lg tw:border tw:border-[#e5e7eb] tw:dark:border-[#2D3748]"
  >
    <p class="tw:text-xl tw:font-bold tw:text-gray-900 tw:dark:text-white">Informações</p>

    <div>
      <div class="tw:flex tw:items-center tw:gap-1 tw:mb-1">
        <Icon icon="tabler:building" class="tw:text-lg tw:text-gray-600 tw:dark:text-white" />
        <p class="q-mb-none tw:text-[14px] tw:leading-[24px] tw:text-gray-600 tw:dark:text-white">Cliente</p>
      </div>

      <p class="q-mb-none tw:text-sm tw:text-gray-600 tw:dark:text-[#A0AEC0] tw:font-semibold">
        {{ ticket?.cliente?.nome || "N/D" }}
      </p>
      <p
        v-if="ticket?.cliente?.email"
        class="q-mb-none tw:text-sm tw:text-gray-600 tw:dark:text-[#A0AEC0] tw:font-semibold"
      >
        Email: {{ ticket?.cliente.email || "N/D" }}
      </p>
    </div>

    <q-separator spaced />

    <div>
      <div class="tw:flex tw:items-center tw:gap-1 tw:mb-1">
        <Icon icon="tabler:calendar-event" class="tw:text-lg tw:text-gray-600 tw:dark:text-white" />
        <p class="q-mb-none tw:text-[14px] tw:leading-[24px] tw:text-gray-600 tw:dark:text-white">Data de Abertura</p>
      </div>

      <p class="q-mb-none tw:text-sm tw:text-gray-600 tw:dark:text-[#A0AEC0] tw:font-semibold">
        {{ formatarData(ticket?.data_created) || "N/D" }}
      </p>
    </div>

    <q-separator spaced />

    <div>
      <div class="tw:flex tw:items-center tw:gap-1 tw:mb-1">
        <Icon icon="tabler:flag" class="tw:text-lg tw:text-gray-600 tw:dark:text-white" />
        <p class="q-mb-none tw:text-[14px] tw:leading-[24px] tw:text-gray-600 tw:dark:text-white">Status</p>
      </div>

      <q-badge
        :color="getStatusColor(ticket?.status_ticket?.id)"
        :label="ticket?.status_ticket?.name || 'N/D'"
        class="tw:text-xs"
        style="font-weight: 500"
        dense
      />
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import moment from "moment";

defineProps({
  ticket: {
    type: Object,
    default: () => ({})
  }
});

function formatarData(data) {
  return moment(data).format("DD/MM/YYYY, HH:mm");
}

function getStatusColor(statusId) {
  const statusColors = {
    1: "blue",
    2: "orange",
    3: "yellow",
    4: "grey",
    5: "purple",
    6: "red"
  };

  return statusColors[statusId] || "grey";
}
</script>
