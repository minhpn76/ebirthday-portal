<template>
  <b-row>
    <b-col md="12">
      <h1>{{ $t('menu.birthdays') }}</h1>
      <div class="d-inline-block mb-2">
        <v-select
          v-model="selectMonth"
          class="mr-1"
          placeholder="All Month"
          :options="getDropdownMonths()"
        />
      </div>
      <div class="d-inline-block mb-2 float-right">
        <div class="form-inline">
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
      </div>
    </b-col>
    <b-col md="12">
      <b-table
        striped
        hover
        small
        bordered
        :items="StaffBirthDateOfMonth.birthdays"
        :busy="isLoading"
        :fields="fields"
        :current-page="StaffBirthDateOfMonth.currentPage"
        show-empty
        :sort-desc.sync="searchFields.sortDesc"
        :sort-by.sync="searchFields.sortBy"
        :sort-compare="bootstrapTableSortBySever"
        class="table-custom"
        @sort-changed="sortChanged"
      >
        <div slot="table-busy" class="text-center text-dark my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
        <template slot="birth_date" slot-scope="data">{{
          getDateFormat(data.item.birth_date)
        }}</template>
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
import { map, isUndefined } from 'lodash'
import vSelect from 'vue-select'
import Pagination from '~/components/Pagination/Pagination'
export default {
  layout: 'message',
  middleware: ['authMember'],
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
        birthday: {
          label: this.$t('tablecontext.field.birthdate'),
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
      searchFields: {
        month: this.getCurrentMonth('M'),
        sortBy: '',
        sortDesc: true,
        limit: 12,
        page: 1
      },
      selectMonth: this.getCurrentSelect()
    }
  },
  computed: mapGetters({
    StaffBirthDateOfMonth: 'message/StaffBirthDateOfMonth',
    isLoading: 'message/isLoading'
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
    await store.dispatch('message/getDataStaffBirthdayOfMonth', query)
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
        .dispatch('message/getDataStaffBirthdayOfMonth', this.searchFields)
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
