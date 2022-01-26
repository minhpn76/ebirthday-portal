<template>
  <div class="animated fadeIn mr-bottom-cs1">
    <b-row>
      <b-col md="12">
        <h2>
          <u>{{ $t('transaction.name') }}</u>
        </h2>
      </b-col>
    </b-row>
    <b-form @submit.prevent="submit">
      <b-row>
        <b-col md="4" xs="12">
          <div class="form-inline form-w">
            <v-select
              v-model="outLetSelected"
              class="mr-1 md-12"
              :options="dataOutLets"
              placeholder="Select Outlets"
              label="outletName"
            ></v-select>
          </div>
        </b-col>
        <b-col md="8" xs="12">
          <div class="float-right form-inline">
            <b-form-input
              v-model="searchFields.staffName"
              :placeholder="$t('textfield.placeholder_staff')"
              @keyup.native="submitFormPage"
            ></b-form-input>
            <b-button class="ml-1" variant="info" @click="submit"
              >{{ $t('textfield.search_staff') }}
            </b-button>
          </div>
        </b-col>
      </b-row>
      <br />
      <b-row>
        <b-col md="3" xs="12">
          <b-form-group label="From Date - To Date" label-for="">
            <DateRangeMonth is-required :input="selectedDate" />
          </b-form-group>
        </b-col>
        <b-col md="9" xs="12">
          <b-dropdown text="Export Data" class="pull-right pt-4">
            <b-dropdown-item @click="exportExcelTransactionRedeem">
              Excel
            </b-dropdown-item>
            <b-dropdown-item @click="exportPdfTransactionRedeem"
              >PDF
            </b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
    </b-form>
    <br />
    <b-row>
      <b-col md="12">
        <b-table
          key="key"
          striped
          hover
          small
          bordered
          class="p-3 table-custom"
          responsive
          :items="dataTransaction.transaction"
          :fields="fields"
          :busy="isLoading"
          :per-page="0"
          :current-page="dataTransaction.currentPage"
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
          <template slot="sNo" slot-scope="key">
            {{ key.index + 1 }}
          </template>
          <template slot="outlet" slot-scope="data">
            {{ data.item.outletName }}
          </template>
          <template slot="outletCode" slot-scope="data">
            {{ data.item.outletCode }}
          </template>
          <template slot="voucherExpiryDate" slot-scope="data">
            {{ data.item.voucherExpiryDate }}
          </template>
          <template slot="transactionDate" slot-scope="data">
            {{ data.item.transactionDate }}
          </template>
          <template slot="creationName" slot-scope="data">
            {{ data.item.creationName }}
          </template>
        </b-table>
        <div v-if="dataTransaction.totalCount > 0" class="pull-left">
          <p style="padding-top: 1rem">
            Total: <b>{{ dataTransaction.totalCount }}</b> records
          </p>
        </div>
        <Pagination
          v-if="dataTransaction.totalCount > searchFields.limit"
          class="pull-right mt-2"
          :total-pages="dataTransaction.lastPage"
          :total="dataTransaction.totalCount"
          :per-page="searchFields.limit"
          :current-page="searchFields.page"
          @pagechanged="onPageChange"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'
import { map, isUndefined } from 'lodash'
import Pagination from '~/components/Pagination/Pagination'
import DateRangeMonth from '~/components/Date/DateRangeMonth'

export default {
  layout: 'redemption',
  components: {
    Pagination,
    vSelect,
    DateRangeMonth
  },
  data() {
    return {
      fields: {
        sNo: {
          label: 'S/No.'
        },
        outlet: {
          label: this.$t('transaction.table.fields.outletName'),
          sortable: true
        },
        outletCode: {
          label: this.$t('transaction.table.fields.outletCode'),
          sortable: true
        },
        staffId: {
          label: this.$t('transaction.table.fields.staffID'),
          sortable: true
        },
        staffName: {
          label: this.$t('transaction.table.fields.staffName'),
          sortable: true
        },
        voucherName: {
          label: this.$t('transaction.table.fields.voucherName'),
          sortable: true
        },
        voucherId: {
          label: this.$t('transaction.table.fields.voucherID'),
          sortable: true
        },
        voucherExpiryDate: {
          label: this.$t('transaction.table.fields.voucherExpiryDate'),
          sortable: true
        },
        transactionNo: {
          label: this.$t('transaction.table.fields.transactionNo'),
          sortable: true
        },
        transactionDate: {
          label: this.$t('transaction.table.fields.transactionTime'),
          sortable: true
        },
        creationName: {
          label: this.$t('transaction.table.fields.creationName'),
          sortable: true
        }
      },
      outLetSelected: null,
      searchFields: {
        fromDate: '',
        toDate: '',
        outletCode: null,
        staffName: '',
        sortDesc: false,
        sortBy: '',
        page: 1,
        limit: 12
      },
      fromDate: '',
      toDate: ''
    }
  },
  computed: mapGetters({
    dataTransaction: 'redemption/data_transaction',
    dataOutLets: 'admin/getOutLets',
    isLoading: 'redemption/isLoading'
  }),
  watch: {
    fromDate: function(val) {
      if (val) {
        this.searchFields.fromDate = this.getDateFormat(
          val,
          'YYYY-MM-DD 00:00:00'
        )
      } else {
        this.searchFields.fromDate = ''
      }
      this.fetchTransaction(true)
      return val
    },
    toDate: function(val) {
      if (val) {
        this.searchFields.toDate = this.getDateFormat(
          val,
          'YYYY-MM-DD 23:59:59'
        )
      } else {
        this.searchFields.toDate = ''
      }
      this.fetchTransaction(true)
      return val
    },
    outLetSelected: function(val) {
      if (val) {
        this.searchFields.outletCode = val.outletCode
      } else {
        this.searchFields.outletCode = ''
      }
      this.fetchTransaction(true)
      return val
    }
  },
  async fetch({ store, query }) {
    await store.dispatch('redemption/data_transaction', query)
    await store.dispatch('admin/getOutLets')
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
    this.outLetSelected = this.dataOutLets[0]
  },
  methods: {
    fetchTransaction(resetPage = false) {
      if (resetPage) {
        this.searchFields.page = 1
      }
      this.$store
        .dispatch('redemption/data_transaction', this.searchFields)
        .then(() => {
          this.$router.push({ query: this.searchFields })
        })
    },
    submit() {
      this.fetchTransaction(true)
    },
    submitFormPage(event) {
      if (event.which === 13) {
        this.submit()
      }
    },
    sortChanged: function(ctx) {
      this.searchFields.sortBy = ctx.sortBy
      this.searchFields.sortDesc = ctx.sortDesc
      this.fetchTransaction(true)
    },
    onPageChange(page) {
      this.searchFields.page = page
      this.fetchTransaction()
    },
    selectedDate(range) {
      console.log(range)
      if (!isUndefined(range.start) && !isUndefined(range.end)) {
        this.searchFields.toDate = this.getDateFormat(
          range.end,
          'YYYY-MM-DD 23:59:59'
        )
        this.searchFields.fromDate = this.getDateFormat(
          range.start,
          'YYYY-MM-DD 00:00:00'
        )
      } else {
        this.searchFields.toDate = ''
        this.searchFields.fromDate = ''
      }
      console.log(this.searchFields)
      this.fetchTransaction(true)
    },
    keyDownFunction() {},
    exportExcelTransactionRedeem() {
      this.$axios
        .post(
          'v1/RedemptionPortal/ExportExcelTransactionRedeem',
          this.searchFields,
          {
            responseType: 'arraybuffer'
          }
        )
        .then(res => {
          const blob = new Blob([res.data])
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'VoucherRedemptionReport.xlsx'
          document.body.appendChild(link)
          link.click()
          link.remove()
        })
        .catch(err => {
          this.$toast.error(`Something wrong ${err}`)
        })
    },
    exportPdfTransactionRedeem() {
      this.$axios
        .post(
          'v1/RedemptionPortal/ExportPdfTransactionRedeem',
          this.searchFields,
          {
            responseType: 'arraybuffer'
          }
        )
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.href = url
          link.download = 'VoucherRedemptionReport.pdf'
          document.body.appendChild(link)
          link.click()
          link.remove()
        })
        .catch(err => {
          this.$toast.error(`Something wrong ${err}`)
        })
    }
  }
}
</script>
