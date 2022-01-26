<template>
  <div class="animated fadeIn mb-custom-2">
    <h1>{{ $t('menu.dashboard') }}</h1>
    <b-row>
      <b-col md="4" sm="6" xs="12">
        <h2 class="tab-dashboard">{{ getCurrentMonth() }}</h2>
        <StaffList
          v-if="StaffBirthDate.birthdayThisMonth > 0"
          :items="
            StaffBirthDate.birthdayGreetings
              | filterMonthData(StaffBirthDate.thisMonth)
          "
        />
        <div v-else>
          <h3>
            <b>{{ $t('messages.no_birthdays_this_month') }}</b>
          </h3>
        </div>
      </b-col>
      <b-col md="4" sm="6" xs="12">
        <h2 class="tab-dashboard">{{ getNextMonth() }}</h2>
        <StaffList
          v-if="StaffBirthDate.birthdayNextMonth > 0"
          :items="
            StaffBirthDate.birthdayGreetings
              | filterMonthData(StaffBirthDate.nextMonth)
          "
        />
        <div v-else>
          <h3>
            <b>{{ $t('messages.no_birthdays_this_month') }}</b>
          </h3>
        </div>
      </b-col>
      <b-col md="4" lg="3" sm="6" xs="12" offset-lg="1">
        <BirthDays
          :this-month="StaffBirthDate.birthdayThisMonth"
          :next-month="StaffBirthDate.birthdayNextMonth"
        />
      </b-col>
    </b-row>
    <GreetingSend></GreetingSend>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import StaffList from '~/components/StaffInfo/StaffList'
import BirthDays from '~/components/Dashboard/Birthdays'
import GreetingSend from '~/components/GreetingSend'

export default {
  layout: 'message',
  middleware: ['authMember'],
  name: 'Dashboard',
  components: { BirthDays, StaffList, GreetingSend },
  filters: {
    filterMonthData: function(value, month) {
      const result = value.filter(item => item.month === month)
      return result
    }
  },
  computed: mapGetters({
    StaffBirthDate: 'message/StaffBirthDate'
  }),
  async fetch({ app, store }) {
    await store.dispatch('message/getBirthDayData')
  },
  methods: {}
}
</script>
