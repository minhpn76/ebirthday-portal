<template>
  <div id="page_custom">
    <div class="face">
      <div class="band">
        <div class="red"></div>
        <div class="white"></div>
        <div class="blue"></div>
      </div>
      <div class="eyes"></div>
      <div class="dimples"></div>
      <div class="mouth"></div>
    </div>

    <h1>Something went wrong!</h1>
    <div class="btn_failed btn-primary" @click="redirectHome()">
      Return to Home
    </div>
  </div>
</template>
<script>
export default {
  name: 'Failed',
  layout: 'failed',
  methods: {
    redirectHome() {
      return this.$router.push('/')
    }
  }
}
</script>
