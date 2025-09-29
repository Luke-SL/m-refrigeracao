<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div class="code-error">404</div>

      <div class="text-h2 warning-text">Oops. Nothing here...</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
//
</script>

<style lang="sass" scoped>
.code-error
  font-size: 30vh

.warning-text
  opacity: 0.4
</style>
