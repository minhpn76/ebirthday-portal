<template>
  <div id="app-index" class="app-index mt-0">
    <b-container class="mt-4">
      <b-row>
        <b-col offset-md="3" md="6" sm="12">
          <nuxt />
        </b-col>
      </b-row>
    </b-container>
    <div class="fix-version-staff">
      v1.0.18
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutRedemptionpotal',
  head: {
    title: 'FEO eBirthday Voucher'
  },
  computed: {},
  mounted() {
    const url = window.location.pathname
    if (url.includes('/staff')) {
      document.getElementById('__layout').classList.add('sticky')
      if (
        this.$cookies.get('BackgroundStaff') &&
        this.$cookies.get('BackgroundStaff') === 2
      ) {
        document.getElementById('__layout').classList.add('especially')
      } else {
        document.getElementById('__layout').classList.add('popular')
      }
      document.getElementById('app-index').classList.add('none-class')
    }
  },
  methods: {}
}
</script>
