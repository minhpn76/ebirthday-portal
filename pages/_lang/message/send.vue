<template>
  <div class="animated fadeIn pb-4 mb-custom">
    <h1>{{ $t('menu.send_personalised_greetings') }}</h1>
    <b-row class="">
      <b-col md="3">
        <template v-if="isLoadingSmsPending || isLoadingSms"
          >Loading...</template
        >
        <template v-else>
          <ul class="sub-menu">
            <li class="all" @click="getSentGreeting('pending')">
              <span :class="[typeDefault === 'pending' ? 'active_menu' : '']">
                {{
                  $t('status.pending', {
                    number: getPending.totalCount
                  })
                }}
              </span>
            </li>
            <li class="publish" @click="getSentGreeting('sent')">
              <span :class="[typeDefault === 'sent' ? 'active_menu' : '']">
                {{
                  $t('status.sent', {
                    number: getSent.totalCount
                  })
                }}
              </span>
            </li>
          </ul>
        </template>
      </b-col>
      <b-col md="9">
        <b-form inline class="float-md-right">
          <label class="mr-md-2 " for="filter">
            {{ $t('filter.sort_by') }}
          </label>
          <b-form-select
            id="filter"
            v-model="filter"
            class="mb-2 mr-sm-2 mb-sm-0"
            :options="options"
            size="sm"
            @change="changeSortBy($event)"
          ></b-form-select>
          <label class="mr-sm-2 cursor-point" for="sortData">
            <sort-checkbox :sort="sort" />
          </label>
          <b-form-checkbox
            id="sortData"
            v-model="sort"
            class="mb-2 mr-sm-2 mb-sm-0 d-none"
          ></b-form-checkbox>
        </b-form>
      </b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col md="12" sm="12" class="mb-1">
        <span>
          {{ $t('textfield.reporting_staff_whom_birthdays') }}
          <nuxt-link to="/message/birthdays">
            {{ $t('textfield.see_all_birthdays') }}
          </nuxt-link>
        </span>
      </b-col>
    </b-row>
    <b-row class="pb-4">
      <template>
        <b-col v-if="typeDefault === 'pending'" md="12">
          <template v-if="isLoadingSmsPending">
            Loading ....
          </template>
          <StaffList
            v-else
            :classes="'col-md-4'"
            :stylewrapper="'row'"
            :items="getPending.sendPersonalisedGreetingsPending"
            type="pending"
            :show-content-message="true"
            @reload="reloadPage"
          ></StaffList>
        </b-col>
        <b-col v-else>
          <template v-if="isLoadingSms">
            Loading ....
          </template>
          <StaffList
            v-else
            :classes="'col-md-4'"
            :stylewrapper="'row'"
            type="sent"
            :items="getSent.sendPersonalisedGreetingsSent"
            :show-content-message="true"
            @reload="reloadPage"
          ></StaffList>
        </b-col>
      </template>
    </b-row>
    <GreetingSend></GreetingSend>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import StaffList from '~/components/StaffInfo/StaffList'
import GreetingSend from '~/components/GreetingSend'
import SortCheckbox from '~/components/Icons/sortCheckbox'

export default {
  layout: 'message',
  name: 'Send',
  components: { SortCheckbox, StaffList, GreetingSend },
  filters: {
    filterSentStatus(value, status) {
      return value.filter(item => item.smsStatus === status)
    }
  },
  data() {
    return {
      typeDefault: 'pending',
      filter: 'date',
      sort: true,
      isSort: {},
      options: [
        { value: 'date', text: 'Date' },
        { value: 'name', text: 'Name' }
      ],
      sortDate: true,
      modalShow: false
    }
  },
  computed: mapGetters({
    isLoadingSmsPending: 'message/isLoadingSmsPending',
    getPageStage: 'message/getPageStage',
    isLoadingSms: 'message/isLoadingSms',
    getPending: 'message/getPending',
    getSent: 'message/getSent'
  }),
  watch: {
    sort: {
      handler: function(value) {
        this.isSort = {}
        if (this.filter === 'name') {
          this.isSort.IsNameDesc = value
        } else {
          this.isSort.IsDateDesc = value
        }
        this.$store.dispatch('message/GetPersonalisedGreetingPending', {
          params: this.isSort
        })
        this.$store.dispatch('message/GetPersonalisedGreetingSent', {
          params: this.isSort
        })
      }
    },
    getPageStage: {
      handler: function(value) {
        if (process.browser) {
          if (value) {
            // eslint-disable-next-line nuxt/no-globals-in-created
            window.onbeforeunload = function() {
              return 'Are you sure ?'
            }
          }
          // else {
          //   window.offbeforeunload = function() {
          //     return false
          //   }
          // }
        }
      }
    }
  },
  async fetch({ app, store }) {
    const sortDateDesc = {
      IsDateDesc: false
    }
    await store.dispatch('message/GetPersonalisedGreetingSent', {
      params: sortDateDesc
    })
    await store.dispatch('message/GetPersonalisedGreetingPending', {
      params: sortDateDesc
    })
  },
  methods: {
    getSentGreeting(type) {
      this.typeDefault = type
    },
    /**
     * sort name and date after revert data
     * @param event
     */
    changeSortBy(event) {
      this.isSort = {}
      if (event === 'name') {
        this.isSort.IsNameDesc = this.sort
      } else {
        this.isSort.IsDateDesc = this.sort
      }
      this.$store
        .dispatch('message/GetPersonalisedGreeting', {
          params: this.isSort
        })
        .then(() => {
          this.$root.$emit('revertData')
        })
    },
    reloadPage() {
      this.isSort = {}
      if (this.filter === 'name') {
        this.isSort.IsNameDesc = true
      } else {
        this.isSort.IsDateDesc = true
      }
      this.$store.dispatch('message/GetPersonalisedGreetingPending', {
        params: this.isSort
      })
      this.$store.dispatch('message/GetPersonalisedGreetingSent', {
        params: this.isSort
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.getPageStage) {
      this.$swal
        .fire({
          title: 'Do you want to leave?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Leave',
          cancelButtonText: 'Stay'
        })
        .then(result => {
          if (result.value) {
            next()
          } else {
            next(false)
          }
        })
    } else {
      next()
    }
  }
}
</script>
