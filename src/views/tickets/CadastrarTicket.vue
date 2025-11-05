<template>
  <div>
    <div class="tw:container tw:mx-auto tw:py-[20px] tw:px-4 tw:sm:px-6 tw:lg:px-8">
      <div class="tw:flex tw:items-center tw:gap-4">
        <q-btn flat dense color="blue-6" to="/tickets">
          <Icon icon="tabler:chevron-left" class="tw:text-3xl" />
        </q-btn>

        <div>
          <p class="q-mb-none tw:text-[30px] tw:font-bold">Novo Ticket</p>
          <p class="q-mb-none tw:text-[16px] tw:leading-[24px]">Cadastre um novo ticket de suporte</p>
        </div>
      </div>

      <div
        class="tw:mt-4 tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-4 tw:dark:bg-[#1F2A37] tw:dark:border-0"
      >
        <p class="q-mb-none tw:text-[20px] tw:font-bold tw:text-[#292a2e] tw:dark:text-[#bfc1c4]">
          Informações do Ticket
        </p>

        <q-form style="margin: 12px 0" @submit.prevent="Cadastrar" ref="formRef">
          <div class="row q-col-gutter-md tw:my-4">
            <div class="col-6">
              <label class="tw:text-gray-500 tw:dark:text-gray-200">Titulo *</label>
              <q-input
                v-model="form.title"
                placeholder="Digite o título do ticket"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo obrigatório']"
                hide-bottom-space
              />
            </div>

            <div class="col-6">
              <label class="tw:text-gray-500 tw:dark:text-gray-200">Cliente (opcional)</label>
              <q-select
                v-model="form.cliente_id"
                :options="clientes"
                option-label="nome"
                option-value="id"
                emit-value
                map-options
                dense
                outlined
                placeholder="Vincule a um cliente"
                no-option-found-label="Nenhum cliente encontrado"
                :loading="carregandoClientes"
                clearable
                use-input
                input-debounce="300"
                @filter="filtrarClientes"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      <div>
                        <div class="text-body2">Nenhum cliente encontrado</div>
                      </div>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <div class="row tw:my-4">
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
                :rules="[(val) => !!val || 'Campo obrigatório']"
                hide-bottom-space
              />
            </div>
          </div>

          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn label="Cancelar" flat to="/tickets" />
            <q-btn label="Cadastrar" color="primary" type="submit" outlined :loading="cadastrando" icon="check" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import { api } from "@/boot/axios";
import { Icon } from "@iconify/vue";

const router = useRouter();
const formRef = ref(null);
const cadastrando = ref(false);
const carregandoClientes = ref(false);
const clientes = ref([]);
const clientesOriginais = ref([]);
const form = ref({
  title: "",
  description: "",
  cliente_id: undefined
});

onMounted(async () => {
  await CarregarClientes();
});

async function CarregarClientes() {
  try {
    carregandoClientes.value = true;
    const response = await api.get("clientes");
    clientes.value = response.data;
    clientesOriginais.value = response.data;
  } catch (err) {
    console.error("Erro ao carregar clientes:", err);
    Notify.create({
      message: "Erro ao carregar clientes",
      color: "negative",
      position: "top"
    });
  } finally {
    carregandoClientes.value = false;
  }
}

function filtrarClientes(val, update) {
  update(() => {
    if (val === "") {
      clientes.value = clientesOriginais.value;
    } else {
      const needle = val.toLowerCase();
      clientes.value = clientesOriginais.value.filter((cliente) => cliente.nome.toLowerCase().indexOf(needle) > -1);
    }
  });
}

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
    await api.post("tickets", form.value);
    router.push("/tickets");
  } catch (err) {
    console.error("Erro ao criar ticket:", err);
    Notify.create({
      message: "Não foi possível cadastrar o ticket",
      color: "negative",
      position: "top",
      timeout: 4000
    });
  }
}
</script>
