import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import en from 'vee-validate/dist/locale/en'

const dict = {
  custom: {
    'input-otp': {
      required: 'Please key in your OTP'
    }
  }
}

const language = {
  ...en,
  ...dict
}

Vue.use(VeeValidate, {
  errorBagName: 'vErrors',
  fieldsBagName: 'vfield'
})

Validator.localize('en', language)
