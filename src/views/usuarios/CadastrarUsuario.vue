<template>
  <div>
    <div class="tw:container tw:mx-auto tw:py-[20px] tw:px-4 tw:sm:px-6 tw:lg:px-8">
      <div class="tw:flex tw:items-center tw:gap-4">
        <q-btn flat dense color="blue-6" to="/usuarios">
          <Icon icon="tabler:chevron-left" class="tw:text-3xl" />
        </q-btn>

        <div>
          <p class="q-mb-none tw:text-[30px] tw:font-bold">Novo Usuário</p>
          <p class="q-mb-none tw:text-[16px] tw:leading-[24px]">Cadastre um novo usuário</p>
        </div>
      </div>

      <div
        class="tw:mt-4 tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-4 tw:dark:bg-[#1F2A37] tw:dark:border-0"
      >
        <p class="q-mb-none tw:text-[20px] tw:font-bold tw:text-[#292a2e] tw:dark:text-[#bfc1c4]">
          Informações do Usuário
        </p>

        <q-form style="margin: 12px 0" @submit.prevent="Cadastrar" ref="formRef">
          <div class="row q-col-gutter-md tw:my-4">
            <div class="col-6">
              <label class="tw:text-gray-500 tw:dark:text-gray-200">Nome *</label>
              <q-input
                v-model="form.name"
                placeholder="Digite o nome do usuário"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo obrigatório']"
                hide-bottom-space
                lazy-rules="ondemand"
              />
            </div>

            <div class="col-6">
              <label class="tw:text-gray-500 tw:dark:text-gray-200">Email *</label>
              <q-input
                v-model="form.email"
                placeholder="email@example.com"
                outlined
                dense
                type="email"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                hide-bottom-space
                lazy-rules="ondemand"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md tw:my-4">
            <div class="col-6">
              <label class="tw:text-gray-500 tw:dark:text-gray-200">Senha *</label>
              <q-input
                v-model="form.senha"
                placeholder="Digite a senha"
                type="password"
                outlined
                dense
                :rules="[
                  (val) => !!val || 'Campo obrigatório',
                  (val) => val.length >= 8 || 'A senha deve ter pelo menos 8 caracteres'
                ]"
                hide-bottom-space
                lazy-rules="ondemand"
              />
            </div>

            <div class="col-6">
              <label class="tw:text-gray-500 tw:dark:text-gray-200">Nível de acesso</label>
              <q-select
                v-model="form.access_level"
                placeholder="Selecione o nível de acesso"
                :options="[
                  { label: 'Administrador', value: 'ADM' },
                  { label: 'Usuário', value: 'USER' }
                ]"
                map-options
                emit-value
                outlined
                dense
                :rules="[(val) => !!val || 'Campo obrigatório']"
                hide-bottom-space
                lazy-rules="ondemand"
              />
            </div>
          </div>

          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn label="Cancelar" flat to="/usuarios" />
            <q-btn label="Cadastrar" color="primary" type="submit" outlined :loading="cadastrando" icon="check" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import { api } from "@/boot/axios";
import { Icon } from "@iconify/vue";

const router = useRouter();
const formRef = ref(null);
const cadastrando = ref(false);
const form = ref({
  name: "",
  email: "",
  senha: "",
  access_level: "USER"
});

async function Cadastrar() {
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
    await api.post("usuarios", form.value);
    router.push("/usuarios");
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    Notify.create({
      message: error?.response?.data?.message || "Não foi possível cadastrar o usuário",
      color: "negative",
      position: "top",
      timeout: 4000
    });
  }
}
</script>
