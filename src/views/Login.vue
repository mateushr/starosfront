<template>
  <div
    class="tw:h-screen tw:w-full tw:bg-gray-100 tw:dark:bg-[#0F1629] tw:flex tw:items-center tw:justify-center tw:p-2 sm:tw:p-4 tw:font-sans"
  >
    <div class="tw:w-full tw:max-w-md tw:flex tw:justify-center tw:items-center">
      <div class="tw:bg-white tw:dark:bg-[#1F2A37] tw:rounded-lg tw:p-6 tw:sm:p-10 tw:w-full tw:shadow-lg tw:dark:shadow-lg tw:border tw:border-gray-200 tw:dark:border-0">
        <div class="tw:text-center tw:mb-6 tw:sm:mb-8">
          <p class="tw:text-2xl tw:font-semibold tw:text-gray-800 tw:dark:text-[#fff]">Sistema de Tickets</p>
          <p class="tw:text-sm tw:text-gray-600 tw:dark:text-[#bfc1c4]">Entre com suas credenciais para acessar o sistema</p>
        </div>

        <q-form @submit.prevent="login" ref="formLogin" class="tw:flex tw:flex-col tw:gap-6">
          <div class="tw:flex tw:flex-col tw:gap-2">
            <label class="tw:text-gray-500 tw:dark:text-gray-200">Email *</label>
            <q-input
              v-model="form.email"
              placeholder="Digite o email"
              outlined
              dense
              type="email"
              :dark="isDark"
              :bg-color="isDark ? 'grey-9' : 'white'"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              hide-bottom-space
              lazy-rules="ondemand"
            />
          </div>

          <div class="tw:flex tw:flex-col tw:gap-2">
            <label class="tw:text-gray-500 tw:dark:text-gray-200">Senha *</label>
            <q-input
              v-model="form.senha"
              placeholder="Digite a senha"
              outlined
              dense
              type="password"
              :dark="isDark"
              :bg-color="isDark ? 'grey-9' : 'white'"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              hide-bottom-space
              lazy-rules="ondemand"
            />
          </div>

          <q-btn type="submit" color="primary"> Entrar </q-btn>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading, Notify, Dark } from "quasar";
import { computed } from "vue";
import LogoStar from "@/assets/images/logo.png";
import { useAuthStore } from "@/stores/authStore";

export default {
  data() {
    return {
      form: {
        email: "",
        senha: ""
      },
      LogoStar
    };
  },
  methods: {
    async login() {
      const isValid = await this.$refs?.formLogin?.validate();
      if (!isValid) {
        return;
      }

      Loading.show({
        message: "Realizando login..."
      });

      const response = await this.AuthStore.doLogin(this.form);
      Loading.hide();
      if (response) {
        const toPath = this.$route.query.to || "/dashboard1";
        this.$router.push(toPath);

        Notify.create({
          message: "Login realizado com sucesso!",
          color: "positive",
          position: "top",
          timeout: 3000
        });
      }
    }
  },
  setup() {
    const AuthStore = useAuthStore();
    const isDark = computed(() => Dark.isActive);
    return { AuthStore, isDark };
  }
};
</script>
