<!-- src/pages/UnauthorizedPage.vue -->
<template>
  <q-page class="flex flex-center">
    <div class="text-center q-pa-md">
      <q-icon name="block" size="100px" color="negative" class="q-mb-md" />
      <div class="text-h4 q-mb-md">Acesso Negado</div>
      <p class="text-body1 text-grey-7 q-mb-lg">Você não tem permissão para acessar esta página.</p>
      <q-btn label="Voltar para Home" color="primary" icon="home" @click="$router.push('/')" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'UnauthorizedPage',
}
</script>
