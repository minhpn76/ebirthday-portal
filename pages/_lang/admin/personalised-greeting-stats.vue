<template>
  <div class="animated fadeIn mr-bottom-cs1">
    <b-row>
      <b-col>
        <h1>{{ $t('menu.personalised_greeting_stats') }}</h1>
      </b-col>
    </b-row>
    <hr />
    <b-form @submit.prevent="keyDownFunction">
      <b-row>
        <b-col md="8" xs="12">
          <div class="form-inline form-w">
            <v-select
              v-model="selectQuarter"
              class="mr-1"
              :options="getDropdownQuarter()"
              placeholder="Current Quarter"
              @input="submit"
            ></v-select>
            <v-select
              v-model="searchFields.department"
              class="mr-1"
              :options="dataDepartment"
              placeholder="All Departments"
              @input="submit"
            ></v-select>
            <v-select
              v-model="searchFields.manager"
              class="mr-1"
              :options="dataManager"
              placeholder="All Managers"
              @input="submit"
            ></v-select>
            <!-- end -->
          </div>
        </b-col>
      </b-row>
    </b-form>
    <p class="mt-2">
      <!-- <b>{{ $t('tablecontext.head_personalized') }}</b> -->
    </p>
    <b-table
      striped
      hover
      small
      bordered
      :per-page="0"
      :current-page="dataPersonalisedGreeting.currentPage"
      :items="dataPersonalisedGreeting.staff"
      :fields="fields"
      class="table-custom"
      :busy="isLoading"
      show-empty
      :sort-desc.sync="searchFields.sortDesc"
      :sort-by.sync="searchFields.sortBy"
      @sort-changed="sortChanged"
    >
      <div slot="table-busy" class="text-center text-dark my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </div>
      <template slot="yearToDate" slot-scope="data">
        {{ data.item.yearToDate ? data.item.yearToDate : '0 (0/0)' }}
      </template>
      <template slot="before2Month" slot-scope="data">
        {{ data.item.before2Month ? data.item.before2Month : '0 (0/0)' }}
      </template>
      <template slot="before1Month" slot-scope="data">
        {{ data.item.before1Month ? data.item.before1Month : '0 (0/0)' }}
      </template>
      <template slot="thisMonth" slot-scope="data">
        {{ data.item.thisMonth ? data.item.thisMonth : '0 (0/0)' }}
      </template>
      <template slot="totalReportingStaff" slot-scope="data">
        {{
          data.item.totalReportingStaff ? data.item.totalReportingStaff : '0'
        }}
      </template>
    </b-table>
    <div v-if="dataPersonalisedGreeting.totalCount > 0" class="pull-left">
      <p v-if="isPageMax" style="padding-top: 1rem">Total: <b>0</b> records</p>
      <p v-else style="padding-top: 1rem">
        Total: <b>{{ dataPersonalisedGreeting.totalCount }}</b> records
      </p>
    </div>
    <Pagination
      v-if="dataPersonalisedGreeting.totalCount > searchFields.limit"
      class="pull-right"
      :total-pages="dataPersonalisedGreeting.lastPage"
      :total="dataPersonalisedGreeting.totalCount"
      :per-page="searchFields.limit"
      :current-page="searchFields.page"
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
  name: 'PersonalisedGreetingStats',
  components: {
    Pagination,
    vSelect
  },
  data() {
    return {
      searchFields: {
        department: '',
        manager: '',
        name: '',
        sortBy: '',
        sortDesc: true,
        limit: 12,
        page: 1,
        quarter: this.getCurrentQuarter()
      },
      paramsSort: {},
      fields: {
        name: {
          label: this.$t('tablecontext.field.name'),
          sortable: true
        },
        department: {
          label: this.$t('tablecontext.field.department'),
          sortable: false
        },
        yearToDate: {
          label: this.$t('tablecontext.field.year_to_date'),
          sortable: true
        },
        before2Month: {
          label: this.getTextBefore2MonthOfQuarter(this.getCurrentQuarter()),
          sortable: true
        },
        before1Month: {
          label: this.getTextBefore1MonthOfQuarter(this.getCurrentQuarter()),
          sortable: true
        },
        thisMonth: {
          label: this.getTextLastMonthOfQuarter(this.getCurrentQuarter()),
          sortable: true
        },
        totalReportingStaff: {
          label: this.$t('tablecontext.field.total_reporting_staff'),
          sortable: true
        }
      },
      selectQuarter: this.getSelectedQuarter(),
      listQuarter: this.getDropdownQuarter(),
      lastMonth: '',
      isPageMax: false,
      totalPage: 0
    }
  },
  computed: mapGetters({
    dataPersonalisedGreeting: 'admin/PersonalisedGreetingData',
    dataManager: 'admin/Manager',
    dataDepartment: 'admin/Department',
    isLoading: 'admin/isLoading'
  }),
  watch: {
    selectQuarter: function(val) {
      if (val) {
        this.searchFields.quarter = val.code
      } else {
        this.searchFields.quarter = this.getCurrentQuarter()
      }
      this.fetchDataPersonalised(true)
      return val
    }
  },
  async fetch({ store, query }) {
    await store.dispatch('admin/getDataPersonalised', query)
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
    fetchDataPersonalised(resetPage = false) {
      if (resetPage) {
        this.searchFields.page = 1
      }
      this.$store
        .dispatch('admin/getDataPersonalised', this.searchFields)
        .then(() => {
          this.$router.push({ query: this.searchFields })

          this.fields.thisMonth.label = this.getTextLastMonthOfQuarter(
            this.searchFields.quarter
          )
          this.fields.before1Month.label = this.getTextBefore1MonthOfQuarter(
            this.searchFields.quarter
          )
          this.fields.before2Month.label = this.getTextBefore2MonthOfQuarter(
            this.searchFields.quarter
          )

          console.log(this.fields)
        })
    },
    submit() {
      this.fetchDataPersonalised(true)
    },
    getSelectedQuarter() {
      return this.getDropdownQuarterSelected()
    },
    onPageChange(page) {
      this.searchFields.page = page
      this.fetchDataPersonalised()
    },
    sortChanged: function(ctx) {
      this.paramsSort = {}
      this.searchFields.sortBy = ctx.sortBy
      this.searchFields.sortDesc = ctx.sortDesc
      this.fetchDataPersonalised(true)
    }
  }
}
</script>
