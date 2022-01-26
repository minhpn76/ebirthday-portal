<template>
  <b-row>
    <b-col>
      <h1>{{ $t('menu.birthdays') }}</h1>
    </b-col>
    <b-col md="12" class="mb-3">
      <hr />
      <b-form @submit.prevent="keyDownFunction">
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
          <b-col md="4" xs="12">
            <div class="float-right form-inline">
              <b-form-input
                v-model="searchFields.name"
                class="max-width"
                :placeholder="$t('textfield.placeholder_staff')"
                @keyup.native="submitFormPage"
              ></b-form-input>
              <b-button class="ml-1" variant="info" @click="submit()">{{
                $t('textfield.search_staff')
              }}</b-button>
            </div>
          </b-col>
        </b-row>
      </b-form>
    </b-col>
    <b-col md="12">
      <b-table
        striped
        hover
        small
        bordered
        :items="StaffBirthDateOfMonth.viewBirthdaysDtos"
        :fields="fields"
        class="table-custom"
        :busy="isLoading"
        :per-page="0"
        :current-page="StaffBirthDateOfMonth.currentPage || 1"
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
        <template slot="service_since" slot-scope="data">
          {{ data.item.inServiceSince }}
        </template>
        <template slot="service_duration" slot-scope="data">
          {{ data.item.serviceDuration }}
        </template>
      </b-table>
      <div v-if="StaffBirthDateOfMonth.totalCount > 0" class="pull-left">
        <p style="padding-top: 1rem">
          Total: <b>{{ StaffBirthDateOfMonth.totalCount }}</b> records
        </p>
      </div>
      <Pagination
        v-if="StaffBirthDateOfMonth.totalCount > searchFields.limit"
        class="pull-right"
        :total-pages="StaffBirthDateOfMonth.lastPage"
        :total="StaffBirthDateOfMonth.totalCount"
        :per-page="searchFields.limit"
        :current-page="searchFields.page || StaffBirthDateOfMonth.currentPage"
        @pagechanged="onPageChange"
      />
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'
import { map, isUndefined } from 'lodash'
import Pagination from '~/components/Pagination/Pagination'

export default {
  layout: 'admin',
  name: 'Birthdays',
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
        service_since: {
          label: this.$t('tablecontext.field.service_since'),
          sortable: true
        },
        service_duration: {
          label: this.$t('tablecontext.field.service_duration'),
          sortable: true
        }
      },
      monthChoice: this.getCurrentMonthFormatMM()
        ? this.getCurrentMonthFormatMM().toString()
        : '',
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
      selectMonth: this.getCurrentSelect()
    }
  },
  computed: mapGetters({
    StaffBirthDateOfMonth: 'admin/StaffBirthDateOfMonth',
    dataManager: 'admin/Manager',
    dataDepartment: 'admin/Department',
    isLoading: 'admin/isLoading'
  }),
  watch: {
    selectMonth: function(val) {
      if (val) {
        this.searchFields.month = val.code
      } else {
        this.searchFields.month = '-1'
      }
      this.fetchBirthDay(true)
      return val
    }
  },
  async fetch({ store, query }) {
    await store.dispatch('admin/getDataStaffBirthdayOfMonth', query)
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
    fetchBirthDay(resetPage = false) {
      if (resetPage) {
        this.searchFields.page = 1
      }
      this.$store
        .dispatch('admin/getDataStaffBirthdayOfMonth', this.searchFields)
        .then(() => {
          this.$router.push({ query: this.searchFields })
        })
    },
    getCurrentSelect() {
      const month = this.$route.query.month
      return this.getDropdownMonthsSelect(month)
    },
    submitFormPage(event) {
      if (event.which === 13) {
        this.submit()
      }
    },
    submit() {
      this.fetchBirthDay(true)
    },
    sortChanged: function(ctx) {
      this.searchFields.sortBy = ctx.sortBy
      this.searchFields.sortDesc = ctx.sortDesc
      this.fetchBirthDay(true)
    },
    onPageChange(page) {
      this.searchFields.page = page
      this.fetchBirthDay()
    }
  }
}
</script>
