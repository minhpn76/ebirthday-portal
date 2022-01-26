<template>
  <div class="animated fadeIn mr-bottom-cs1">
    <b-row>
      <b-col>
        <h1>{{ $t('menu.templates_email') }}</h1>
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
          :busy="loading"
          show-empty
          :fields="fields"
        >
          <div slot="table-busy" class="text-center text-dark my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
          <template slot="email_type" slot-scope="data">
            {{ data.item.type }}
          </template>
          <template slot="email_subject" slot-scope="data" style="width: 30%">
            {{ data.item.subject }}
          </template>
          <template slot="email_content" slot-scope="data">
            <div v-html="data.item.content"></div>
          </template>
          <template slot="action" slot-scope="data">
            <b-button
              v-b-modal.edit-template
              variant="primary"
              @click="passDataModal(data.item)"
              >Edit</b-button
            >
          </template>
        </b-table>
        <b-modal
          id="edit-template"
          ref="modalEdit"
          size="lg"
          title="Edit Email Template"
          ok-title="Save"
          @show="resetModal"
          @hidden="resetModal"
          @ok="handleEdit"
        >
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group label="Email Type" label-for="email_type">
              <b-form-input
                id="email_type"
                v-model="typeTemplate"
                :disabled="true"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="Email Subject"
              label-for="email_subject"
              :state="subjectTemplate"
              invalid-feedback="Email subject is required"
            >
              <b-form-input
                id="email_subject"
                v-model="dataModal.subject"
                :state="subjectTemplate"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Email content" label-for="email_content">
              <ckeditor
                id="email_content"
                v-model="dataModal.content"
                :editor="editor"
              >
              </ckeditor>
            </b-form-group>
          </form>
        </b-modal>
      </b-col>
      <b-col md="6">
        <h5 class="mb-3">{{ $t('admin.templates.context.legends') }}:</h5>
        <table class="table table-bordered table-custom">
          <tbody>
            <tr>
              <th scope="row">{{ $t('admin.templates.context.FIRSTNAME') }}</th>
              <td>{{ $t('admin.templates.context.descFirstName') }}</td>
            </tr>
            <tr>
              <th scope="row">{{ $t('admin.templates.context.LASTNAME') }}</th>
              <td>{{ $t('admin.templates.context.descLastName') }}</td>
            </tr>
            <tr>
              <th scope="row">
                {{ $t('admin.templates.context.REPORTINGMANAGERFIRSTNAME') }}
              </th>
              <td>{{ $t('admin.templates.context.descManagerName') }}</td>
            </tr>
            <tr>
              <th scope="row">
                {{ $t('admin.templates.context.DATEOFBIRTH') }}
              </th>
              <td>{{ $t('admin.templates.context.descDateOfBirth') }}</td>
            </tr>
            <tr>
              <th scope="row">
                {{ $t('admin.templates.context.BIRTHDAY_URL') }}
              </th>
              <td>{{ $t('admin.templates.context.decsBirthDay') }}</td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
Vue.use(CKEditor)
// if (process.client) {
//   const CKEditor = require('@ckeditor/ckeditor5-vue')
//   const ClassicEditor = require('@ckeditor/ckeditor5-build-classic')
//   Vue.use(CKEditor, ClassicEditor)
// }

export default {
  layout: 'admin',
  name: 'EmailTemplate',
  data() {
    return {
      fields: {
        email_type: {
          label: this.$t('admin.templates.table.fields.email_type')
        },
        email_subject: {
          label: this.$t('admin.templates.table.fields.email_subject')
        },
        email_content: {
          label: this.$t('admin.templates.table.fields.email_content')
        },
        action: {
          label: this.$t('tablecontext.field.action')
        }
      },
      typeTemplate: '',
      dataModal: {},
      editor: ClassicEditor,
      edit: false,
      loading: true,
      subjectTemplate: null,
      formCreate: {
        emailSMS: 'Email',
        type: 'Normal',
        content: '',
        subject: ''
      }
    }
  },
  computed: mapGetters({
    listData: 'admin/getListTemplates'
  }),
  async fetch({ store }) {
    const params = {
      emailSms: 1
    }
    await store.dispatch('admin/getListTemplate', { params: params })
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.subjectTemplate = valid ? 'valid' : 'invalid'
      return valid
    },
    resetModal() {
      this.formCreate = {
        emailSMS: 1,
        type: 0,
        content: '',
        subject: ''
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
              params: { emailSms: 1 }
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
        subject: data.subject
      }
    },
    handleEdit(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.updateTemplate()
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
              params: { emailSms: 1 }
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
