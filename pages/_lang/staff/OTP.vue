<template>
  <b-card class="text-center">
    <h5>Step 2/2</h5>
    <b-progress :value="value" :max="max" class="mb-3"></b-progress>
    <b-form @submit="validOTP">
      <b-form-input
        v-model="numOtp"
        v-validate="'required|max:6|numeric'"
        :placeholder="$t('form.enter_otp')"
        name="input-otp"
      ></b-form-input>
      <span class="text-red">{{ vErrors.first('input-otp') }}</span>
      <br />
      <p>
        Your SMS is sent at <b>{{ timeSend }}</b> <br />
        and will expire on <b>{{ timeExpired }}</b>
      </p>
      <b-button
        :disabled="isReSend"
        block
        class="mt-3"
        variant="primary"
        @click="reSendSMS(60)"
      >
        {{ $t('form.resend') }}
        <span v-if="timerCount !== 0">({{ timerCount }})</span>
      </b-button>
      <b-button type="submit" block class="mt-3" variant="primary"
        >{{ $t('form.submit') }}
      </b-button>
    </b-form>
  </b-card>
</template>
<script>
import { mapGetters } from 'vuex'
import { isEmpty } from 'lodash'

export default {
  layout: 'staff',
  data() {
    return {
      numOtp: '',
      value: 100,
      max: 100,
      timerCount: 60,
      isReSend: true,
      counterRenSend: '',
      timeSend: '',
      timeExpired: ''
    }
  },
  computed: mapGetters({
    dataStaff: 'staff/loginStaffOTP',
    dataVerify: 'staff/staffdetail',
    staffId: 'STAFF_ID'
  }),
  mounted() {
    this.countDownTimer()
    this.getTime()
    this.getExpired()
  },
  methods: {
    getTime() {
      this.timeSend = this.$nuxt.$moment().format('DD-MM-YYYY,HH:mm:ss')
    },
    getExpired() {
      this.timeExpired = this.$nuxt
        .$moment()
        .add('3', 'minutes')
        .format('DD-MM-YYYY,HH:mm:ss')
    },
    validOTP(evt) {
      evt.preventDefault()
      this.$validator.validate().then(valid => {
        if (valid) {
          const payload = {
            code: this.numOtp,
            ...this.dataStaff
          }
          this.$store
            .dispatch('staff/verifyOTP', { payload: payload })
            .then(res => {
              if (!isEmpty(this.dataVerify)) {
                this.resetTimer()
                this.$cookies.set('verify', true, { maxAge: 60 * 60 * 24 })
                this.$router.push('profile')
              } else {
                this.$toast.error('Error while verify OTP')
              }
            })
            .catch(() => {
              this.$toast.error('Error while verify OTP')
            })
        }
      })
    },
    countDownTimer() {
      this.counterRenSend = setInterval(() => {
        if (this.timerCount === 0) {
          this.isReSend = false
          this.resetTimer()
        } else {
          this.timerCount--
          this.isReSend = true
        }
      }, 1000)
    },
    resetTimer() {
      clearInterval(this.counterRenSend)
    },
    reSendSMS(params) {
      this.timerCount = params
      this.resetTimer()
      this.countDownTimer()
      this.$store
        .dispatch('staff/loginStaffOTP', {
          payload: this.staffId.staffid
        })
        .then(res => {})
    }
  }
}
</script>
