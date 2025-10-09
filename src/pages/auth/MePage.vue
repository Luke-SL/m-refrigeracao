<template>
  <q-page class="bg-grey-2 q-pa-md">
    <div v-if="isAdmin" class="q-mb-xl">
      <div class="text-h5 text-bold text-center q-mb-lg">Painel Administrativo</div>
      <div class="row q-col-gutter-md q-mb-xl">
        <div class="col-12 col-sm-6">
          <q-btn
            label="Administração"
            color="secondary"
            class="full-width q-pa-md"
            icon="mdi-shield-account"
            :to="{ name: 'cadastrar-produto' }"
            unelevated
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-btn
            label="Área do Cliente"
            color="primary"
            class="full-width q-pa-md"
            icon="mdi-account-circle"
            :to="{ name: 'meusDados' }"
            unelevated
          />
        </div>
      </div>
    </div>

    <div class="text-h5 text-bold text-center q-mb-lg">Minha Conta</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-4">
        <q-btn
          label="Meus Pedidos"
          color="primary"
          class="full-width q-pa-md"
          icon="mdi-package-variant-closed"
          :to="{ name: 'meusPedidos' }"
          unelevated
        />
      </div>

      <div class="col-12 col-sm-4">
        <q-btn
          label="Meus Dados"
          color="primary"
          class="full-width q-pa-md"
          icon="mdi-account"
          :to="{ name: 'meus-dados' }"
          unelevated
        />
      </div>

      <div class="col-12 col-sm-4">
        <q-btn
          label="Carteira"
          color="primary"
          class="full-width q-pa-md"
          icon="mdi-wallet"
          :to="{ name: 'carteira' }"
          unelevated
        />
      </div>

      <div class="col-12 col-sm-4">
        <q-btn
          label="Protocolos"
          color="primary"
          class="full-width q-pa-md"
          icon="mdi-file-document-outline"
          :to="{ name: 'protocolos' }"
          unelevated
        />
      </div>

      <div class="col-12 col-sm-4">
        <q-btn
          label="Avaliações"
          color="primary"
          class="full-width q-pa-md"
          icon="mdi-star-outline"
          :to="{ name: 'avaliacoes' }"
          unelevated
        />
      </div>

      <div class="col-12 col-sm-4">
        <q-btn
          label="Favoritos"
          color="primary"
          class="full-width q-pa-md"
          icon="mdi-heart-outline"
          :to="{ name: 'favoritos' }"
          unelevated
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import useAuthUser from 'src/composables/UseAuthUser'

const { isAdmin } = useAuthUser()
</script>
