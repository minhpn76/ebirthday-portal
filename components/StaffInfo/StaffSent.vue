<template>
  <div class="item-staff">
    <b-card
      no-body
      class="overflow-hidden"
      :class="['rounded-0', 'my-0', 'card-accent-left-success']"
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
        disabled
        maxlength="250"
        :value="item.contentInput"
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
        <div class="fix-bottom-forward">
          <div>{{ item.footerForward }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Staff',
  props: {
    item: {
      type: Object,
      default: function() {
        return {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          memberId: '',
          smsStatus: false,
          contentInput: '',
          noInputTemplateSMS: '',
          serviceDuration: '',
          templateSMSInsertAfter: '',
          isExpried: false,
          dayOfBirth: ''
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
  })
}
</script>
