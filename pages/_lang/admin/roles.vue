<template>
  <b-row>
    <b-col>
      <h1>{{ $t('menu.roles') }}</h1>
    </b-col>
    <b-col md="12" class="mb-3">
      <hr />
      <b-form @submit="searchStaff">
        <table class="table table-borderless">
          <tbody class="border-0">
            <tr>
              <td width="20%">
                <b>{{ $t('roles.userId') }}</b>
              </td>
              <td>
                <b-form-input
                  v-model="formSearch.staffId"
                  v-validate="{ required: !formSearch.managerEmail }"
                  placeholder="Enter Staff ID"
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
                  v-model="formSearch.managerEmail"
                  v-validate="{ email: true, required: !formSearch.staffId }"
                  placeholder="Enter Email"
                  name="Email"
                ></b-form-input>
                <span class="text-red">{{ vErrors.first('Email') }}</span>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <b-button type="submit" variant="primary"
                  >{{ $t('dashboard.search') }}
                </b-button>
                <b-button type="reset" variant="secondary" @click="clearData()"
                  >{{ $t('dashboard.clear') }}
                </b-button>
              </td>
            </tr>
          </tbody>
        </table>
      </b-form>
    </b-col>
    <b-col v-if="loading === true && show">
      <template>
        <div class="text-center">
          <strong>Loading...</strong>
        </div>
      </template>
    </b-col>
    <b-col v-if="!isEmpty(roleStaff) && loading === false" md="12" class="">
      <h4
        v-if="
          (roleStaff.email !== '' || roleStaff.staffID !== '') &&
            (formSearch.staffId !== '' || formSearch.managerEmail !== '')
        "
      >
        <u>{{ $t('dashboard.staff.staffdetail') }}</u>
      </h4>
      <template
        v-if="
          roleStaff.length || roleStaff.email !== '' || roleStaff.staffID !== ''
        "
      >
        <div class="row">
          <div class="col-md-6">
            <table
              class="table table-bordered table-custom"
              style="margin-bottom: 0px!important"
            >
              <tbody>
                <tr>
                  <th scope="row" width="40%">
                    <b>{{ $t('roles.userId') }}</b>
                  </th>
                  <td>{{ roleStaff.staffID }}</td>
                </tr>
                <tr>
                  <th scope="row">
                    {{ $t('dashboard.staff.name') }}
                  </th>
                  <td>{{ roleStaff.name }}</td>
                </tr>
                <tr>
                  <th scope="row">
                    {{ $t('roles.email') }}
                  </th>
                  <td>{{ roleStaff.email }}</td>
                </tr>
                <tr>
                  <th scope="row" style="border-right: none">
                    Roles
                  </th>
                  <td style="border-left: none"></td>
                </tr>
              </tbody>
            </table>
            <table
              class="table table-bordered table-custom table-roles"
              style="border: none"
            >
              <tbody>
                <b-form-group>
                  <tr v-for="option in options" :key="option.value">
                    <td
                      style="width: 100%; border-top: none; border-right: none"
                    >
                      {{ option.text }}
                    </td>
                    <td style="border-top: none; border-left: none">
                      <b-form-checkbox
                        v-model="selected"
                        :value="option.value"
                        :name="option.value"
                        :disabled="isDisable"
                        inline
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="text-center">
                      <b-button variant="primary" @click="updateRoleStaff"
                        >{{ $t('roles.btn_update_text') }}
                      </b-button>
                    </td>
                  </tr>
                </b-form-group>
              </tbody>
            </table>
          </div>
        </div>
      </template>
      <template v-else>
        <b>{{ $t('redemption.notification.not_found_staff_search') }}</b>
      </template>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEmpty } from 'lodash'
export default {
  layout: 'admin',
  name: 'Roles',
  data() {
    return {
      fields: {
        sNo: {
          label: 'S/No.'
        },
        staffID: {
          label: this.$t('transaction.table.fields.staffID'),
          sortable: false
        },
        staffName: {
          label: this.$t('transaction.table.fields.staffName'),
          sortable: false
        },
        actionRole: {
          label: this.$t('roles.table.fields.actionRole'),
          sortable: false
        }
      },
      formSearch: {
        staffId: '',
        managerEmail: ''
      },
      isDisable: false,
      isChoose: false,
      selected: [],
      loading: false,
      show: false,
      options: [
        {
          text: 'Staff Benefits',
          value: 'staff_Benefits'
        },
        {
          text: 'Reporting Manager',
          value: 'reporting_Manager'
        },
        // {
        //   text: 'Finance',
        //   value: 'finance'
        // },
        // {
        //   text: 'F&B Outlet/ Hotel',
        //   value: 'frontStaff'
        // },
        {
          text: 'Staff Member',
          value: 'staff_Member'
        }
      ],
      tempRoles: {},
      tempTicked: false,
      tempSelected: []
    }
  },
  computed: mapGetters({
    roleStaff: 'admin/getRoleStaff',
    info_user: 'INFO_USER',
    staff_auth: 'STAFF_AUTH'
  }),
  methods: {
    isEmpty(data) {
      return isEmpty(data)
    },
    getSearch() {
      this.loading = true
      this.selected = []
      this.isDisable = false
      this.$store
        .dispatch('admin/getRoleStaff', {
          params: this.formSearch
        })
        .then(() => {
          this.loading = false
          this.setRoles()
          if (
            this.formSearch.staffId === this.staff_auth ||
            this.formSearch.managerEmail === this.info_user.nameID
          ) {
            this.isDisable = true
            this.$toast.error(
              `You are not allowed to modify your own access roles`
            )
          }
        })
    },
    searchStaff(evt) {
      evt.preventDefault()
      this.$validator.validate().then(valid => {
        if (valid) {
          this.getSearch()
        }
      })
    },
    setRoles() {
      this.tempRoles = this.roleStaff.roleStaff
      if (this.tempRoles) {
        if (this.tempRoles.staff_Benefits === true) {
          this.selected.push('staff_Benefits')
        }
        if (this.tempRoles.reporting_Manager === true) {
          this.selected.push('reporting_Manager')
        }
        if (this.tempRoles.finance === true) {
          this.selected.push('finance')
        }
        if (this.tempRoles.frontStaff === true) {
          this.selected.push('frontStaff')
        }
        if (this.tempRoles.staff_Member === true) {
          this.selected.push('staff_Member')
        }
      }
    },
    arrayRemove(arr, value) {
      return arr.filter(function(ele) {
        return ele !== value
      })
    },
    clearData() {
      this.formSearch = {
        staffId: '',
        managerEmail: ''
      }
      this.show = false
      this.$validator.reset()
      this.$store.dispatch('admin/resetRoleStaff')
    },
    updateRoleStaff() {
      // if (
      //   this.selected.includes('staff_Benefits') &&
      //   !this.selected.includes('frontStaff')
      // ) {
      //   this.$toast.error(
      //     "You are not allowed to un-select F&B Outlet/ Hotel only if you have Staff Benefit's role"
      //   )
      //   return false
      // }

      this.$swal
        .fire({
          title: 'Are you sure you want perform these changes?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes'
        })
        .then(async result => {
          if (result.value) {
            const date = new Date()
            date.setTime(date.getTime() + 5000) // 5s
            if (this.getCookiesMap(document.cookie).updateRoles) {
              this.$toast.error(
                'You are only allowed to perform 1 modification every 5 seconds!'
              )
              return
            }
            document.cookie = `updateRoles=${true};expires=${date.toGMTString()};path=/;`
            const payload = {
              staff_Benefits: false,
              staff_Member: false,
              reporting_Manager: false,
              finance: false,
              frontStaff: false,
              staffId: this.roleStaff.staffID,
              email: this.roleStaff.email
            }
            if (this.selected.includes('staff_Benefits')) {
              payload.staff_Benefits = true
              payload.frontStaff = true
            }
            if (this.selected.includes('staff_Member')) {
              payload.staff_Member = true
            }
            if (this.selected.includes('reporting_Manager')) {
              payload.reporting_Manager = true
            }
            if (this.selected.includes('finance')) {
              payload.finance = true
            }
            if (this.selected.includes('frontStaff')) {
              payload.frontStaff = true
            }
            await this.$store.dispatch('admin/updateRoleStaff', {
              payload: payload
            })
            this.getSearch()
          } else {
            this.selected = []
            this.setRoles()
          }
        })
    },
    getCookiesMap(cookiesString) {
      return cookiesString
        .split(';')
        .map(function(cookieString) {
          return cookieString.trim().split('=')
        })
        .reduce(function(acc, curr) {
          acc[curr[0]] = curr[1]
          return acc
        }, {})
    }
  }
}
</script>
