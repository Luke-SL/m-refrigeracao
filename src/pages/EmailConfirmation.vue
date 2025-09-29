<template>
  <q-page class="flex flex-center bg-grey-2 q-pa-md">
    <q-card class="q-pa-lg shadow-2 rounded-borders card-email-confirmation">
      <q-card-section class="text-center">
        <q-icon name="email" size="64px" color="primary" />
        <div class="text-h6 q-mt-md">Confirme seu e-mail</div>
        <div class="text-body2 text-grey-8 q-mt-sm">Enviamos um link de confirmação para:</div>
        <div class="text-subtitle1 text-bold q-mt-sm">
          {{ email }}
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-mt-lg">
        <q-btn
          color="primary"
          label="Ir para Login"
          :to="{ name: 'loginDefault' }"
          class="full-width"
          unelevated
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const email = route.query.email || 'seu email'
</script>

<style lang="sass" scoped>
.card-email-confirmation
  width: 500px
  max-width: 95vw
</style>
