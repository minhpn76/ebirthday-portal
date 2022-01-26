<template>
  <div class="p-3 text-center">
    <p>{{ $t('auth.login') }}</p>
    <b-button block variant="outline-success" @click="LoginAuth"
      ><i class="fa fa-user mr-1"></i>{{ $t('auth.loginName') }}</b-button
    >
  </div>
</template>
<script>
export default {
  layout: 'login',
  methods: {
    LoginAuth() {
      this.$auth.loginWith('auth0')
    }
  }
}
</script>
