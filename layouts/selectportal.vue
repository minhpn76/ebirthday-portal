<template>
  <div id="app-selectportal" class="justify-content-center">
    <b-container>
      <b-row class="mt-4">
        <b-col class="bg-white" md="6" offset-md="3">
          <nuxt />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SelectPortal',
  head: {
    title: 'FEO eBirthday Voucher'
  },
  data() {
    return {
      nav: [],
      scrolled: false,
      choseUrl: 'Select Portal',
      isSwitch: true
    }
  },
  computed: {
    name() {
      return this.$route.name
    },
    ...mapGetters({
      roleAuth: 'ROLE_AUTH'
    })
  }
}
</script>
