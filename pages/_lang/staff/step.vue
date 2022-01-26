<template>
  <b-card class="text-center">
    <h5>Step 1/2</h5>
    <b-progress :value="value" :max="max" class="mb-3"></b-progress>
    <b-button variant="outline-primary" @click="sendOTP()">{{
      $t('step.sent_otp')
    }}</b-button>
  </b-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'staff',
  name: 'StaffDashboard',
  data() {
    return {
      value: 50,
      max: 100
    }
  },
  computed: mapGetters({
    // arrow functions can make the code very succinct!
    staffId: 'STAFF_ID'
  }),
  methods: {
    sendOTP() {
      this.getLoginOTP()
      // this.$cookies.set('expried-otp', new Date(), { maxAge: 60 })
      // this.$cookies.set('codeOtp', '12345', { maxAge: 60 })
    },
    getLoginOTP() {
      if (this.staffId.staffid === undefined) {
        this.$toast.error('StaffID is not exist!')
      } else {
        this.$store
          .dispatch('staff/loginStaffOTP', {
            payload: this.staffId.staffid
          })
          .then(res => {
            this.$router.push('/staff/OTP')
          })
      }
    }
  }
}
</script>
