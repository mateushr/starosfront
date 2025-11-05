<template>
  <div
    class="tw:p-6 tw:bg-white tw:dark:bg-[#1F2A37] tw:rounded-lg tw:border tw:border-[#e5e7eb] tw:dark:border-[#2D3748]"
  >
    <p class="tw:text-xl tw:font-bold tw:text-gray-900 tw:dark:text-white">Descrição</p>

    <p class="q-mb-none tw:text-sm tw:text-gray-500 tw:dark:text-[#A0AEC0]">
      {{ props?.ticket?.description || "N/D" }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  ticket: {
    type: Object,
    default: () => ({})
  }
});
</script>
