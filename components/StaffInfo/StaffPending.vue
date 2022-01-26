<template>
  <div class="item-staff">
    <b-card
      no-body
      class="overflow-hidden"
      :class="[
        'rounded-0',
        'my-0',
        item.smsStatus ? 'card-accent-left-success' : 'card-accent-left-danger'
      ]"
    >
      <b-row>
        <b-col
          md="12"
          align-self="center"
          align-v="center"
          class="text-center border-bottom py-2"
        >
          <h1>
            {{ item.dateOfBirth }}
          </h1>
        </b-col>
        <b-col md="12" align-self="center" align-v="center" class="text-center">
          <b-card-body
            :title="item.firstName + ' ' + item.lastName"
            class="mt-2"
          />
        </b-col>
      </b-row>
    </b-card>
    <div v-show="showContentMessage" class="wrapper-message mb-4">
      <p>
        <b>{{ item.header }}</b>
      </p>
      <b-form-textarea
        :id="item.memberId"
        v-model="contentInput"
        v-validate="'max:250'"
        :name="item.memberId"
        rows="6"
        :disabled="item.isExpried"
        maxlength="250"
        placeholder="Enter message..."
      ></b-form-textarea>
      <p class="mt-2">
        <b v-html="replaceBr(item.footer)" />
      </p>
      <div>
        <span v-if="vErrors.items.length > 0" class="errors">{{
          $t('messages.limitTextArea')
        }}</span>
        <span
          v-if="!item.sent && routePath.includes('message/send')"
          class="mt-2 text-right d-block"
          >{{
            $t('status.countContentSms', {
              num: item.smsStatus
                ? item.contentInput.length
                : contentInput.length
            })
          }}</span
        >
      </div>
      <div class="d-block mt-2">
        <b-button
          :id="'sendms' + item.memberId"
          size="sm"
          class="btn-blue "
          :disabled="!item.isSend"
          @click="sendSms(item)"
        >
          {{ $t('textfield.button_send') }}
        </b-button>
        <b-button
          v-if="item.isForward"
          size="sm"
          class="btn-blue float-right"
          @click="getStaffForward(item.staffId)"
        >
          {{ $t('messages.forward') }}
        </b-button>
        <div class="fix-bottom-forward">
          <div>{{ item.footerForward }}</div>
        </div>
        <b-modal
          ref="selectStaff"
          hide-header
          ok-title="Submit"
          size="md"
          centered
          @ok="updateStaffForward($event, item.staffId)"
        >
          <b-button-close @click="$refs.selectStaff.hide()"></b-button-close>
          <b-form-group
            label-class="font-weight-bold pt-0"
            label="Please select the staff that you wish to forward this message to"
          >
            <div v-show="isLoading">Staff Loading...</div>
            <v-select
              v-show="!isLoading"
              v-model="staffSelected"
              class="w-100"
              :options="dataStaffForward"
              label="fullNameForward"
            />
          </b-form-group>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { clone, includes, replace } from 'lodash'
import vSelect from 'vue-select'

export default {
  name: 'Staff',
  components: {
    vSelect
  },
  props: {
    item: {
      type: Object,
      default: function() {
        return {
          contentFull: '',
          contentInput: '',
          dateOfBirth: '',
          dayOfBirth: '',
          defaultSMS: '',
          firstName: '',
          footer: '',
          footerForward: '',
          header: '',
          isExpried: false,
          isForward: true,
          isSend: true,
          lastName: '',
          memberId: '',
          mobileNumber: '',
          staffId: '',
          staffIdForward: '',
          templateSMS: ''
        }
      }
    },
    showContentMessage: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    classItems: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      contentInput: this.item.contentInput,
      lengthMes: 0,
      routePath: this.$nuxt.$route.path,
      isDisableText: false,
      staffSelected: {},
      dataStaffForwardUpdate: {},
      submitNumber: 0,
      confirmManager: false,
      confirmForward: false,
      smsStatus: false,
      formSendSms: {
        smsManager: '',
        staffIdTake: '',
        staffIdManager: '',
        confirm: false
      }
    }
  },
  computed: mapGetters({
    roleAuth: 'ROLE_AUTH',
    DataReadySendSMS: 'message/DataReadySendSMS',
    isLoading: 'message/isLoading',
    dataStaffForward: 'message/dataStaffForward',
    staffSmsData: 'message/staffSmsData'
  }),
  watch: {
    contentInput(after, before) {
      let value = clone(after)
      if (
        includes(after, '@') ||
        includes(after, '<') ||
        includes(after, '&')
      ) {
        value = replace(value, new RegExp('@', 'g'), '')
        value = replace(value, new RegExp('<', 'g'), '')
        value = replace(value, new RegExp('&', 'g'), '')
        this.$toast.info(this.$t('messages.reg'))
      }
      console.log('after replace 2', value)
      if (after && !before) {
        this.$store.dispatch('message/updatePageStage', true)
      }
      if (!after && before) {
        this.$store.dispatch('message/updatePageStage', false)
      }
      this.$set(this, 'contentInput', value)
      return value
    }
  },
  methods: {
    getStaffForward(staffIdTake) {
      this.$swal
        .fire({
          title:
            'Please note that you will not be able to compose or amend birthday message once you proceed to forward.',
          text: '',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Forward'
        })
        .then(result => {
          if (result.value) {
            this.$refs.selectStaff.show()
            this.$store.dispatch('message/getStaffForward', { staffIdTake })
          }
        })
    },
    sendSms(item) {
      let message = this.$t('messages.send_sms')
      if (this.contentInput === '' || !this.contentInput) {
        message = this.$t('messages.send_empty_sms')
      }
      this.$swal
        .fire({
          title: message,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirm'
        })
        .then(async result => {
          if (result.value) {
            const dataSend = clone(item)
            dataSend.contentInput = this.contentInput
            await this.$store.dispatch('message/sendGreeting', dataSend)
            this.$nextTick(() => {
              setTimeout(() => {
                this.$emit('reload', true)
                this.$refs.selectStaff.hide()
              }, 2000)
            })
          }
        })
    },
    updateStaffForward(event, staffIdTake) {
      event.preventDefault()
      const dataUpdate = clone(this.staffSelected)
      dataUpdate.staffIdTake = staffIdTake
      dataUpdate.body = this.contentInput
      dataUpdate.footer = this.item.footer
      dataUpdate.header = this.item.header
      this.$store.dispatch('message/updateStaffForward', dataUpdate)
      this.$refs.selectStaff.hide()
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit('reload', true)
          this.$refs.selectStaff.hide()
        }, 2000)
      })
    },
    getComposeMessage(staffIdTake, staffIdForward, smsStatus = false) {
      if (staffIdTake && staffIdForward) {
        this.formSendSms = {}
        this.$refs.confirmForward.show()
        this.$store.dispatch('message/getStaffForwardSms', {
          staffIdTake,
          staffIdForward
        })
        this.formSendSms.staffIdTake = staffIdTake
      }
      this.smsStatus = smsStatus
    },
    confirmSms(event) {
      event.preventDefault()
      if (this.formSendSms.confirm && this.formSendSms.smsManager) {
        this.$swal
          .fire({
            title: this.$t('messages.submit_message'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes'
          })
          .then(async result => {
            if (result.value) {
              await this.$store.dispatch(
                'message/updateStaffForwardSms',
                this.formSendSms
              )
              this.$nextTick(() => {
                setTimeout(() => {
                  this.$emit('reload', true)
                  this.$refs.confirmForward.hide()
                }, 2000)
              })
            }
          })
      } else {
        this.$toast.info('Please check confirm box and write something')
      }
    }
  }
}
</script>
