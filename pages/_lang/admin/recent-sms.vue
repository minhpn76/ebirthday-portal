<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t('menu.resend_sms') }}</h1>
      </b-col>
    </b-row>
    <hr />
    <b-form @submit.prevent="submit">
      <b-row>
        <b-col md="8" xs="12">
          <div class="form-inline form-w">
            <v-select
              v-model="selectMonth"
              class="mr-1"
              placeholder="All Months"
              :options="getDropdownMonths()"
            />
            <v-select
              v-model="searchFields.department"
              class="mr-1"
              placeholder="All Departments"
              :options="dataDepartment"
              @input="submit"
            ></v-select>
            <v-select
              v-model="searchFields.manager"
              class="mr-1"
              placeholder="All Managers"
              :options="dataManager"
              @input="submit"
            ></v-select>
          </div>
        </b-col>
        <b-col md="4" xs="12">
          <div class="float-right form-inline">
            <b-form-input
              v-model="searchFields.name"
              class="max-width"
              :placeholder="$t('textfield.placeholder_staff')"
              @keyup.native="submitFormPage"
            />
            <b-button class="ml-1" variant="info" @click="submit"
              >{{ $t('textfield.search_staff') }}
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-form>
    <p class="mt-2">
      <b>{{ $t('tablecontext.head') }}</b>
    </p>
    <b-table
      id="table-sent"
      striped
      hover
      small
      bordered
      :items="dataRecentSms.employees"
      :fields="fields"
      :per-page="0"
      :current-page="dataRecentSms.currentPage || 1"
      class="table-custom"
      :busy="isLoading"
      show-empty
      :sort-desc.sync="searchFields.sortDesc"
      :sort-by.sync="searchFields.sortBy"
      :sort-compare="bootstrapTableSortBySever"
      @sort-changed="sortChanged"
    >
      <div slot="table-busy" class="text-center text-dark my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </div>
      <template slot="birthdate" slot-scope="data">
        {{ data.item.birthdate }}
      </template>
      <template slot="manager" slot-scope="data">
        {{ data.item.manager ? data.item.manager : '' }}
      </template>
      <template slot="voucher_issued" slot-scope="data">
        {{ data.item.voucherIssued ? 'Yes' : 'No' }}
      </template>
      <template slot="action" slot-scope="data">
        <b-button
          v-if="data.item.voucherIssued"
          :key="data.item.staff_ID"
          variant="warning"
          :disabled="
            votes.indexOf(data.item.staff_ID) !== -1 ||
              data.item.isAllowToSend === false
          "
          @click="
            resendSMS({
              staff_id: data.item.staff_ID,
              ID_Resend: data.item.iD_Resend
            })
          "
          >Resend SMS
        </b-button>
        <b-button
          v-else
          :key="data.item.staff_ID"
          variant="info"
          :disabled="votes.indexOf(data.item.staff_ID) !== -1"
          @click="
            resendSMS({
              staff_id: data.item.staff_ID,
              ID_Resend: data.item.iD_Resend
            })
          "
          >Send SMS
        </b-button>
      </template>
    </b-table>
    <div v-if="dataRecentSms.totalCount > 0" class="pull-left">
      <p style="padding-top: 1rem">
        Total: <b>{{ dataRecentSms.totalCount }}</b> records
      </p>
    </div>
    <Pagination
      v-if="dataRecentSms.totalCount > searchFields.limit"
      class="pull-right"
      :total-pages="dataRecentSms.lastPage"
      :total="dataRecentSms.totalCount"
      :per-page="searchFields.limit"
      :current-page="searchFields.page || dataRecentSms.currentPage"
      @pagechanged="onPageChange"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'
import { map, isUndefined } from 'lodash'
import Pagination from '~/components/Pagination/Pagination'
export default {
  layout: 'admin',
  name: 'RecentSms',
  components: {
    Pagination,
    vSelect
  },
  data() {
    return {
      fields: {
        name: {
          label: this.$t('tablecontext.field.name'),
          sortable: true
        },
        birthdate: {
          label: this.$t('tablecontext.field.birthdate'),
          sortable: true
        },
        department: {
          label: this.$t('tablecontext.field.department'),
          sortable: true
        },
        manager: {
          label: this.$t('tablecontext.field.manager'),
          sortable: true
        },
        voucher_issued: {
          label: this.$t('tablecontext.field.voucher_issued'),
          sortable: false
        },
        action: {
          label: this.$t('tablecontext.field.action')
        }
      },
      isPageMax: false,
      totalPage: 0,
      searchFields: {
        month: this.getCurrentMonth('M'),
        department: '',
        manager: '',
        name: '',
        sortBy: '',
        sortDesc: true,
        limit: 12,
        page: 1
      },
      selectMonth: this.getCurrentSelect(),
      paramsSort: {},
      votes: [],
      isTrue: false,
      monthChoice: this.getCurrentMonthFormatMM()
        ? this.getCurrentMonthFormatMM().toString()
        : '',
      isResendBefore: false,
      nameSearch: ''
    }
  },
  computed: mapGetters({
    dataRecentSms: 'admin/RecentSms',
    dataManager: 'admin/Manager',
    dataDepartment: 'admin/Department',
    sentSMS: 'admin/sentSMS',
    isLoading: 'admin/isLoading'
  }),
  watch: {
    selectMonth: function(val) {
      if (val) {
        this.searchFields.month = val.code
      } else {
        this.searchFields.month = '-1'
      }
      this.fetchDataRecentSms(true)
      return val
    }
  },
  /**
   * Fetch Data
   * @param store
   * @param query Route query
   * @returns {Promise<void>}
   */
  async fetch({ store, query }) {
    await store.dispatch('admin/getDataRecentSms', query)
    await store.dispatch('admin/getListManager')
    await store.dispatch('admin/getListDepartment')
  },
  mounted() {
    map(this.$route.query, (value, key) => {
      if (!isUndefined(this.searchFields[key])) {
        if (value === 'true' || value === 'false') {
          this.searchFields[key] = value === 'true'
        } else {
          this.searchFields[key] = value
        }
      }
    })
  },
  methods: {
    fetchDataRecentSms(resetPage = false) {
      if (resetPage) {
        this.searchFields.page = 1
      }
      this.$store
        .dispatch('admin/getDataRecentSms', this.searchFields)
        .then(() => {
          this.$router.push({ query: this.searchFields })
        })
    },
    submitFormPage(event) {
      if (event.which === 13) {
        this.submit()
      }
    },
    submit() {
      this.fetchDataRecentSms(true)
    },
    sortChanged: function(ctx) {
      this.paramsSort = {}
      this.searchFields.sortBy = ctx.sortBy
      this.searchFields.sortDesc = ctx.sortDesc
      this.fetchDataRecentSms(true)
    },
    onPageChange(page) {
      this.searchFields.page = page
      this.fetchDataRecentSms()
    },
    getCurrentSelect() {
      const month = this.$route.query.month
      return this.getDropdownMonthsSelect(month)
    },
    resendSMS(params) {
      try {
        if (!params.staff_id) {
          return
        }
        this.$store
          .dispatch('admin/resendSMS', {
            params: params
          })
          .then(() => {
            this.votes.push(params.staff_id)
            setTimeout(() => {
              this.getSearch(this.searchFields, this.paramsSort)
            }, 2000)
          })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
