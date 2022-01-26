<template>
  <div class="animated fadeIn mr-bottom-cs1">
    <b-row>
      <b-col>
        <h1>{{ $t('menu.modify_functional_id') }}</h1>
      </b-col>
      <b-col md="12" class="mb-3">
        <hr />
        <b-form @submit="searchStaff">
          <table class="table table-borderless">
            <tbody class="border-0">
              <tr>
                <td width="20%">
                  <b>{{ $t('roles.user_id_required') }}</b>
                </td>
                <td>
                  <b-form-input
                    v-model="formSearch.staffId"
                    :placeholder="$t('roles.user_id_required_desc')"
                    name="staffID"
                  ></b-form-input>
                  <span class="text-red">{{ vErrors.first('staffID') }}</span>
                </td>
              </tr>
              <tr>
                <td width="20%">
                  <b>{{ $t('roles.email_required') }}</b>
                </td>
                <td>
                  <b-form-input
                    v-model="formSearch.Email"
                    v-validate="'email'"
                    placeholder="Enter Email"
                    name="Email"
                  ></b-form-input>
                  <span class="text-red">{{ vErrors.first('Email') }}</span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <b-button type="submit" variant="primary">{{
                    $t('dashboard.search')
                  }}</b-button>
                  <b-button
                    variant="secondary"
                    type="reset"
                    @click="clearData()"
                    >{{ $t('dashboard.clear') }}</b-button
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </b-form>
      </b-col>
      <b-col v-if="isLoading && show">
        <template>
          <div class="text-center">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
      </b-col>
      <b-col v-if="show && !isLoading" md="12" class="">
        <h4 v-if="Object.keys(searchFunctionalId).length !== 0">
          <u>{{ $t('dashboard.staff.staffdetail') }}</u>
        </h4>
        <template v-if="Object.keys(searchFunctionalId).length !== 0">
          <div class="table-custom" style="padding:10px">
            <table class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">
                    {{ $t('modify_functional.tablecontext.field.name') }}
                  </th>
                  <th scope="col">
                    {{ $t('modify_functional.tablecontext.field.email') }}
                  </th>
                  <th scope="col">
                    {{ $t('modify_functional.tablecontext.field.staff_id') }}
                  </th>
                  <th scope="col" class="text-center">
                    {{
                      $t('modify_functional.tablecontext.field.account_status')
                    }}
                  </th>
                  <th scope="col" class="text-center">
                    {{ $t('modify_functional.tablecontext.field.out_lets') }}
                  </th>
                  <!-- <th scope="col" class="text-center">
                    {{
                      this.$t(
                        'modify_functional.tablecontext.field.tick_to_de_active'
                      )
                    }}
                  </th> -->
                  <th class="text-center">
                    {{ $t('tablecontext.field.action') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{{ searchFunctionalId.name }}</th>
                  <td>{{ searchFunctionalId.email }}</td>
                  <td>{{ searchFunctionalId.staffId }}</td>
                  <td class="text-center">
                    <span v-if="!searchFunctionalId.deActive">
                      <span class="badge badge-success">Active</span>
                    </span>
                    <span v-else>
                      <span class="badge badge-danger">Inactive</span>
                    </span>
                  </td>
                  <td>{{ searchFunctionalId.outletName }}</td>
                  <!-- <td class="text-center">
                    <b-form-group>
                      <b-form-checkbox-group
                        id="checkbox-group-2"
                        v-model="selected"
                        attr-disabled="true"
                        name="checkbox-1"
                        value="accepted"
                        unchecked-value="not_accepted"
                        @change="changeCheckBox"
                      >
                        <b-form-checkbox value="deactive"></b-form-checkbox>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </td> -->
                  <td class="text-center">
                    <b-button
                      v-b-modal.edit-functional
                      variant="primary"
                      @click="passDataModal(searchFunctionalId)"
                      >Edit</b-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </b-col>
      <b-col>
        <b-modal
          id="edit-functional"
          ref="modalEdit"
          size="lg"
          title="Edit Functional ID"
          ok-title="Save"
          @hidden="resetModal"
          @ok="handleOk"
        >
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group label="Name" label-for="name">
              <b-form-input
                id="name"
                v-model="dataModal.name"
                :value="searchFunctionalId.email"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="Email"
              label-for="email"
              :state="emailTemplate"
              invalid-feedback="Email is required"
            >
              <b-form-input
                id="email"
                v-model="dataModal.email"
                :state="emailTemplate"
                :value="searchFunctionalId.email"
                readonly
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              :label="$t('modify_functional.tablecontext.field.staff_id')"
              label-for="staffId"
              :state="staffIdTemplate"
              readonly
              invalid-feedback="Function ID is required"
            >
              <b-form-input
                id="staffId"
                v-model="dataModal.staffId"
                :value="searchFunctionalId.staffId"
                :state="staffIdTemplate"
                required
                readonly
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="Account status"
              label-for="accountStatus"
              :state="accountStatusTem"
              invalid-feedback="Account Staff is required"
            >
              <b-form-select
                id="accountStatus"
                v-model="dataModal.deActive"
                :value="searchFunctionalId.deActive"
                :options="listStatus"
                :state="accountStatusTem"
                required
              >
              </b-form-select>
            </b-form-group>
            <b-form-group label="OutLet">
              <v-select
                v-model="outLetSelected"
                class="mr-1 md-12"
                style="width: 100%"
                :options="dataOutLets"
                label="outletName"
                placeholder="Select Outlets"
                @input="onChange($event)"
              ></v-select>
            </b-form-group>
          </form>
        </b-modal>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'
import { isUndefined } from 'lodash'
export default {
  layout: 'admin',
  name: 'ModifyFunctinal',
  components: {
    vSelect
  },
  data() {
    return {
      formSearch: {
        staffId: '',
        Email: ''
      },
      outLetSelected: {
        outletCode: '',
        outletName: ''
      },
      loading: false,
      show: false,
      isCheck: false,
      selected: [],
      tempSellected: {},
      tempDeactive: false,
      dataModal: {},
      listStatus: [
        {
          text: 'Active',
          value: false
        },
        {
          text: 'Inactive',
          value: true
        }
      ],
      accountStatusTem: null,
      staffIdTemplate: null,
      emailTemplate: null,
      fields: {
        name: {
          label: this.$t('modify_functional.tablecontext.field.name'),
          sortable: false
        },
        email: {
          label: this.$t('modify_functional.tablecontext.field.email'),
          sortable: false
        },
        staffId: {
          label: this.$t('modify_functional.tablecontext.field.staff_id'),
          sortable: false
        },
        account_status: {
          label: this.$t('modify_functional.tablecontext.field.account_status'),
          sortable: false
        },
        // deActive: {
        //   label: this.$t(
        //     'modify_functional.tablecontext.field.tick_to_de_active'
        //   ),
        //   sortable: false
        // },
        action: {
          label: this.$t('tablecontext.field.action')
        }
      }
    }
  },
  computed: mapGetters({
    dataOutLets: 'admin/getOutLets',
    searchFunctionalId: 'admin/searchFunctionalId',
    isLoading: 'admin/isLoading'
  }),
  async fetch({ store }) {
    await store.dispatch('admin/getOutLets')
  },
  methods: {
    searchFunctionId() {
      if (this.formSearch.staffId === '' && this.formSearch.Email === '') {
        this.$toast.error(`There is no email address or staff ID entered`)
        return false
      }
      this.show = true
      this.$store
        .dispatch('admin/searchFunctionalId', this.formSearch)
        .then(() => {
          this.setDeactive()
        })
    },
    searchStaff(evt) {
      evt.preventDefault()
      this.$validator.validate().then(valid => {
        if (valid) {
          if (
            (this.formSearch.staffId !== '' &&
              this.formSearch.staffId.startsWith('F') &&
              this.formSearch.staffId.includes('F')) ||
            this.formSearch.Email
          ) {
            this.searchFunctionId()
          } else {
            this.$toast.error(`There is no email address or staff ID entered.`)
          }
        }
      })
    },
    updateDeactive(params) {},
    setDeactive() {
      return new Promise(resolve => {
        this.tempSellected = {
          deActive: this.searchFunctionalId.deActive
        }
        if (this.tempSellected) {
          if (this.tempSellected.deActive === true) {
            this.selected.push('deactive')
          }
        }
      })
    },
    arrayRemove(arr, value) {
      return arr.filter(function(ele) {
        return ele !== value
      })
    },
    clearData() {
      this.formSearch = {
        staffId: '',
        Email: ''
      }
      this.$store.dispatch('admin/resetSearchFunctionId')
      this.show = false
    },
    onChange(event) {
      if (event) {
        this.dataModal.outletName = event.outletName
        this.dataModal.outletCode = event.outletCode
      } else {
        this.dataModal.outletName = ''
        this.dataModal.outletCode = ''
      }
    },
    passDataModal(data) {
      this.dataModal = {
        staffId: data.staffId,
        email: data.email,
        name: data.name,
        deActive: data.deActive,
        accountStatus: data.accountStatus,
        outletCode: data.outletCode,
        outletName: data.outletName
      }
      this.outLetSelected.outletCode = data.outletCode
      this.outLetSelected.outletName = data.outletName
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.accountStatusTem = valid ? 'valid' : 'invalid'
      this.staffIdTemplate = valid ? 'valid' : 'invalid'
      this.emailTemplate = valid ? 'valid' : 'invalid'
      return valid
    },
    resetModal() {
      this.dataModal = {}
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
      const updateFunction = this.$cookies.get('updateFunction')
      if (isUndefined(updateFunction)) {
        this.$cookies.set('updateFunction', true, {
          path: '/',
          maxAge: 5
        })
        this.$store
          .dispatch('admin/deactiveFunctionalId', this.dataModal)
          .then(() => {
            this.$toast.success('Modify Functional ID Successfully!')
            this.$refs.modalEdit.hide()
            this.$store.dispatch('admin/resetSearchFunctionId', this.dataModal)
          })
          .catch(error => {
            this.$toast.error(`${error}.`)
          })
      } else {
        this.$toast.error(
          'You are only allowed to perform 1 modification every 5 seconds!'
        )
      }
    }
  }
}
</script>
