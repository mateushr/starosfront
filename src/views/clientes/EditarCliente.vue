<template>
  <div>
    <div class="tw:container tw:mx-auto tw:py-[20px] tw:px-4 tw:sm:px-6 tw:lg:px-8">
      <div class="tw:flex tw:items-center tw:gap-4">
        <q-btn flat dense color="blue-6" to="/clientes">
          <Icon icon="tabler:chevron-left" class="tw:text-3xl" />
        </q-btn>

        <div>
          <p class="q-mb-none tw:text-[30px] tw:font-bold">Editar Cliente</p>
          <p class="q-mb-none tw:text-[16px] tw:leading-[24px]">Edite as informações do cliente</p>
        </div>
      </div>

      <div class="tw:mt-4 tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-4">
        <p class="q-mb-none tw:text-[20px] tw:font-bold tw:text-[#292a2e] tw:dark:text-[#bfc1c4]">
          Informações do Cliente
        </p>

        <q-form style="margin: 12px 0" @submit.prevent="Editar" ref="formRef">
          <div class="row q-col-gutter-md tw:my-4">
            <div class="col-6">
              <label class="tw:text-gray-500 tw:dark:text-gray-200">Nome *</label>
              <q-input
                v-model="form.nome"
                placeholder="Digite o nome do cliente"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo obrigatório']"
                hide-bottom-space
              />
            </div>

            <div class="col-6">
              <label class="tw:text-gray-500 tw:dark:text-gray-200">Telefone</label>
              <q-input
                v-model="form.telefone"
                placeholder="(00) 00000-0000"
                outlined
                dense
                hide-bottom-space
                mask="(##) #####-####"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md tw:my-4">
            <div class="col-12">
              <label class="tw:text-gray-500 tw:dark:text-gray-200">Email</label>
              <q-input
                v-model="form.email"
                placeholder="Digite o email"
                outlined
                dense
                :rules="[
                  (val) => !val || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Email inválido'
                ]"
                hide-bottom-space
              />
            </div>
          </div>

          <div class="row q-col-gutter=md tw:my-4">
            <div class="col-12">
              <label class="tw:text-gray-500 tw:dark:text-gray-200">Descrição *</label>
              <q-input
                :input-style="{
                  resize: 'none'
                }"
                v-model="form.description"
                placeholder="Informe uma descrição..."
                dense
                outlined
                type="textarea"
                color="grey-5"
                :rows="5"
                :maxlength="2048"
                style="margin: 8px 0; flex: 1; resize: none"
                hide-bottom-space
              />
            </div>
          </div>

          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn label="Cancelar" flat to="/clientes" />
            <q-btn label="Salvar" color="primary" type="submit" outlined :loading="cadastrando" icon="check" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Notify } from "quasar";
import { api } from "@/boot/axios";
import { Icon } from "@iconify/vue";

const route = useRoute();
const router = useRouter();
const formRef = ref(null);
const cadastrando = ref(false);
const form = ref({
  nome: "",
  description: "",
  telefone: "",
  email: ""
});

onMounted(async () => {
  try {
    const id = route.params.id;

    if (!id || isNaN(id)) {
      Notify.create({
        type: "negative",
        message: "ID do cliente inválido!",
        position: "top"
      });
      router.push("/clientes");
      return;
    }

    const { data } = await api.get(`/clientes/${id}`);
    form.value = data;
  } catch (error) {
    console.error("Erro ao carregar cliente:", error);
  }
});

async function Editar() {
  if (cadastrando.value) return;

  const isValid = await formRef.value.validate();
  if (!isValid) {
    Notify.create({
      type: "negative",
      message: "Preencha os campos obrigatórios corretamente!",
      position: "top"
    });
    return;
  }

  try {
    await api.put(`/clientes/${form.value.id}`, form.value);
    router.push("/clientes");
  } catch (err) {
    console.error("Erro ao editar cliente:", err);
    Notify.create({
      message: "Não foi possível editar o cliente",
      color: "negative",
      position: "top",
      timeout: 4000
    });
  }
}
</script>
