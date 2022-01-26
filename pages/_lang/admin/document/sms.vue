<template>
  <div class="animated fadeIn mr-bottom-cs1">
    <b-row>
      <b-col>
        <h1>{{ $t('menu.templates_sms') }}</h1>
      </b-col>
      <!-- <b-col class="text-right">
        <b-button v-b-modal.create-template variant="primary">Create</b-button>
      </b-col> -->
      <b-col md="12" class="mb-3">
        <b-table
          striped
          hover
          small
          bordered
          class="p-3 table-custom"
          responsive
          :items="listData.data"
          :busy="isLoading"
          show-empty
          :fields="fields"
        >
          <div slot="table-busy" class="text-center text-dark my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
          <template slot="sms_type" slot-scope="data">
            {{ data.item.type }}
          </template>
          <template slot="sms_content" slot-scope="data">
            {{ data.item.content }}
          </template>
          <template slot="action" slot-scope="data">
            <b-button
              v-b-modal.edit-template
              variant="primary"
              @click="passDataModal(data.item)"
              >Edit
            </b-button>
          </template>
        </b-table>
        <b-modal
          id="create-template"
          ref="modalCreate"
          size="lg"
          title="Create SMS Template"
          @show="resetModal"
          @hidden="resetModal"
          @ok="handleOk"
        >
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group label="SMS Type" label-for="sms_type">
              <b-form-select id="sms_type" v-model="formCreate.type">
                <option value="0">Please select an option</option>
                <option value="1">Normal</option>
                <option value="2">Reminder</option>
              </b-form-select>
            </b-form-group>
            <!-- <b-form-group
              label="SMs Subject"
              label-for="sms_subject"
              :state="subjectTemplate"
              invalid-feedback="sms subject is required"
            >
              <b-form-input
                id="sms_subject"
                v-model="formCreate.subject"
                :state="subjectTemplate"
                required
              ></b-form-input>
            </b-form-group> -->
            <b-form-group label="SMS content" label-for="sms_content_data">
              <b-form-textarea
                id="sms_content_data"
                v-model="formCreate.content"
                placeholder="Enter something..."
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>
          </form>
        </b-modal>
        <b-modal
          id="edit-template"
          ref="modalEdit"
          size="lg"
          title="Edit SMS Template"
          ok-title="Save"
          @show="resetModal"
          @hidden="resetModal"
          @ok="handleEdit"
        >
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group
              :label="$t('admin.templates.table.fields.sms_type')"
              label-for="sms_type"
            >
              <b-form-input
                id="email_type"
                v-model="typeTemplate"
                :disabled="true"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              :label="$t('admin.templates.table.fields.sms_content')"
              label-for="sms_content"
            >
              <b-form-textarea
                id="sms_content"
                v-model="dataModal.content"
                :placeholder="
                  $t('admin.templates.table.fields.enter_something')
                "
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>
            <template v-if="typeTemplate === 'Input'">
              <hr />
              <b-form-group
                :label="$t('admin.templates.table.fields.sms_header')"
                label-for="sms_header"
              >
                <b-form-textarea
                  id="sms_header"
                  v-model="dataModal.header"
                  :placeholder="
                    $t('admin.templates.table.fields.enter_something')
                  "
                  rows="2"
                  max-rows="6"
                ></b-form-textarea>
              </b-form-group>
              <b-form-group
                :label="$t('admin.templates.table.fields.sms_body')"
                label-for="sms_body"
              >
                <b-form-textarea
                  id="sms_body"
                  v-model="dataModal.body"
                  :placeholder="
                    $t('admin.templates.table.fields.enter_something')
                  "
                  rows="2"
                  max-rows="6"
                ></b-form-textarea>
              </b-form-group>
              <b-form-group
                :label="$t('admin.templates.table.fields.sms_footer')"
                label-for="sms_footer"
              >
                <b-form-textarea
                  id="sms_footer"
                  v-model="dataModal.footer"
                  :placeholder="
                    $t('admin.templates.table.fields.enter_something')
                  "
                  rows="2"
                  max-rows="6"
                ></b-form-textarea>
              </b-form-group>
            </template>
          </form>
        </b-modal>
      </b-col>
      <b-col v-if="!isEmpty(dataSendSms)" md="12" class="mb-3">
        <div class="p-3 table-custom  table-responsive">
          <table
            aria-busy="false"
            aria-colcount="3"
            aria-rowcount="2"
            class="table b-table table-striped table-hover table-bordered table-sm"
          >
            <thead>
              <tr>
                <th aria-colindex="1" width="7%">XX day(s)</th>
                <th aria-colindex="2">Description</th>
                <th aria-colindex="3" width="7%">
                  {{ $t('tablecontext.field.action') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td aria-colindex="1">{{ dataSendSms.daySendSmsLastMonth }}</td>
                <td aria-colindex="2">{{ dataSendSms.descriptionSms }}</td>
                <td aria-colindex="3">
                  <b-button
                    v-b-modal.editDaySendSMS
                    variant="primary"
                    @click="mapDataSendSms"
                    >Edit
                  </b-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <b-modal
          id="editDaySendSMS"
          ref="editDaySendSMS"
          size="lg"
          title="Edit Day SMS"
          ok-title="Save"
          no-close-on-backdrop
          no-close-on-esc
          no-enforce-focus
          @ok="submitFormSms"
        >
          <form ref="form_sms_day" @submit.stop.prevent="submitFormSms">
            <b-form-group label="XX day(s)" label-for="xx_days">
              <b-form-input
                id="xx_days"
                v-model="formSendSms.daySendSmsLastMonth"
                v-validate="'required'"
                name="XX day(s)"
                type="number"
                max="28"
                required
              ></b-form-input>
              <span class="text-red">{{ vErrors.first('xx_days') }}</span>
            </b-form-group>
            <b-form-group label="Description" label-for="sms_descriptions">
              <b-form-textarea
                id="sms_descriptions"
                v-model="formSendSms.descriptionSms"
                placeholder="Enter something..."
                rows="3"
                max-rows="6"
              ></b-form-textarea>
              <span class="text-red">{{
                vErrors.first('sms_descriptions')
              }}</span>
            </b-form-group>
          </form>
        </b-modal>
      </b-col>
      <b-col md="6">
        <h5 class="mb-3">{{ $t('admin.templates.context.legends') }}:</h5>
        <table class="table table-bordered table-custom">
          <tbody>
            <tr>
              <th scope="row">
                {{ $t('admin.templates.context.EmpPreferredName') }}
              </th>
              <td>
                {{ $t('admin.templates.context.EmpPreferredNameDesc') }}
              </td>
            </tr>
            <tr>
              <th scope="row">
                {{ $t('admin.templates.context.EmpFirstName') }}
              </th>
              <td>
                {{ $t('admin.templates.context.BirthdayStaffFirstName') }}
              </td>
            </tr>
            <tr>
              <th scope="row">
                {{ $t('admin.templates.context.EmpLastName') }}
              </th>
              <td>{{ $t('admin.templates.context.BirthdayStaffLastName') }}</td>
            </tr>
            <tr>
              <th scope="row">{{ $t('admin.templates.context.Message') }}</th>
              <td>{{ $t('admin.templates.context.decsMessage') }}</td>
            </tr>
            <tr>
              <th scope="row">{{ $t('admin.templates.context.TinyURL') }}</th>
              <td>{{ $t('admin.templates.context.decsTinyURL') }}</td>
            </tr>
            <tr>
              <th scope="row">
                {{ $t('admin.templates.context.ManagerFirstName') }}
              </th>
              <td>{{ $t('admin.templates.context.decsManagerFirstName') }}</td>
            </tr>
            <tr>
              <th scope="row">
                {{ $t('admin.templates.context.MgrPreferredName') }}
              </th>
              <td>
                {{ $t('admin.templates.context.MgrPreferredNameDesc') }}
              </td>
            </tr>
            <tr>
              <th scope="row">
                {{ $t('admin.templates.context.AdditionalCompPreferredName') }}
              </th>
              <td>
                {{
                  $t('admin.templates.context.AdditionalCompPreferredNameDesc')
                }}
              </td>
            </tr>
            <tr>
              <th scope="row">
                {{ $t('admin.templates.context.MessageFromReportingManager') }}
              </th>
              <td>
                {{
                  $t('admin.templates.context.MessageFromReportingManagerDesc')
                }}
              </td>
            </tr>
            <tr>
              <th scope="row">
                {{ $t('admin.templates.context.MessageFromAdditionalPerson') }}
              </th>
              <td>
                {{ $t('admin.templates.context.MessageFromAdditionalPerson') }}
              </td>
            </tr>
            <tr>
              <th scope="row">
                {{ $t('admin.templates.context.Marker') }}
              </th>
              <td>
                {{ $t('admin.templates.context.MarkerDesc') }}
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEmpty, clone } from 'lodash'

export default {
  layout: 'admin',
  name: 'SmsTemplate',
  data() {
    return {
      fields: {
        sms_type: {
          label: this.$t('admin.templates.table.fields.sms_type')
        },
        sms_content: {
          label: this.$t('admin.templates.table.fields.sms_content')
        },
        action: {
          label: this.$t('tablecontext.field.action')
        }
      },
      typeTemplate: '',
      dataModal: {},
      edit: false,
      loading: true,
      subjectTemplate: null,
      formCreate: {
        id: 0,
        emailSMS: '',
        type: '',
        content: '',
        header: '',
        body: '',
        footer: ''
      },
      formSendSms: {
        daySendSmsLastMonth: 0,
        descriptionSms: null
      }
    }
  },
  computed: mapGetters({
    listData: 'admin/getListTemplates',
    dataSendSms: 'admin/dataSendSms',
    isLoading: 'admin/isLoading'
  }),
  async fetch({ store }) {
    const params = {
      emailSms: 2
    }
    await store.dispatch('admin/getListTemplate', { params: params })
    await store.dispatch('admin/getDaySendSms')
  },
  methods: {
    isEmpty(object) {
      return isEmpty(object)
    },
    mapDataSendSms() {
      this.formSendSms = clone(this.dataSendSms)
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.subjectTemplate = valid ? 'valid' : 'invalid'
      return valid
    },
    resetModal() {
      this.formCreate = {
        id: 0,
        emailSMS: '',
        type: '',
        content: '',
        header: '',
        body: '',
        footer: ''
      }
      this.subjectTemplate = null
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    handleSubmit() {
      if (!this.checkFormValidity()) {
        return
      }
      this.$store
        .dispatch('admin/createOrUpdateTemplate', {
          params: this.formCreate
        })
        .then(() => {
          this.$toast.success('Create template successfully!')
          setTimeout(() => {
            this.$refs.modalCreate.hide()
            this.$store.dispatch('admin/getListTemplate', {
              params: { emailSms: 2 }
            })
          }, 3000)
        })
        .catch(err => {
          this.$toast.error(`Something went wrong! ${err}`)
        })
    },
    passDataModal(data) {
      this.typeTemplate = data.type
      this.dataModal = {
        id: data.id,
        emailSMS: data.emailSMS,
        type: data.type,
        content: data.content,
        header: data.header,
        body: data.body,
        footer: data.footer
      }
    },
    handleEdit(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.updateTemplate()
    },
    submitFormSms(event) {
      event.preventDefault()
      this.$store.dispatch('admin/updateDaySendSms', this.formSendSms)
      this.$refs.editDaySendSMS.hide()
    },
    updateTemplate() {
      if (!this.checkFormValidity()) {
        return
      }
      this.$store
        .dispatch('admin/createOrUpdateTemplate', {
          params: this.dataModal
        })
        .then(() => {
          this.$toast.success('Template updated successfully!')
          setTimeout(() => {
            this.$refs.modalEdit.hide()
            this.$store.dispatch('admin/getListTemplate', {
              params: { emailSms: 2 }
            })
            this.dataModal = {}
            this.typeTemplate = ''
          }, 3000)
        })
        .catch(err => {
          this.$toast.error(`Something went wrong! ${err}`)
        })
    }
  }
}
</script>
