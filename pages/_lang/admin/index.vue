<template>
  <div class="animated fadeIn mr-bottom-cs1">
    <b-row>
      <b-col>
        <h1 class="float-left">{{ $t('menu.dashboard') }}</h1>
      </b-col>
    </b-row>
    <hr />
    <b-row> </b-row>
    <b-row>
      <b-col md="6" sm="6" xs="12">
        <h2 class="tab-dashboard">
          {{
            switchMonth(StaffBirthDateTotal.thisMonth) != ''
              ? switchMonth(StaffBirthDateTotal.thisMonth)
              : getCurrentMonth()
          }}
        </h2>
        <StaffBirthdays
          v-if="
            StaffBirthDateTotal.thisMonthGreetingNotPersonalised > 0 ||
              StaffBirthDateTotal.thisMonthGreetingPersonalised > 0
          "
          :not-personalised="
            StaffBirthDateTotal.thisMonthGreetingNotPersonalised
          "
          :month="StaffBirthDateTotal.thisMonth"
          :personalised="StaffBirthDateTotal.thisMonthGreetingPersonalised"
        />
        <div v-else>
          <h3>
            <b>{{ $t('messages.no_birthdays_this_month') }}</b>
          </h3>
        </div>
      </b-col>
      <b-col md="6" sm="6" xs="12">
        <h2 class="tab-dashboard">
          {{
            switchMonth(StaffBirthDateTotal.nextMonth) != ''
              ? switchMonth(StaffBirthDateTotal.nextMonth)
              : getNextMonth()
          }}
        </h2>
        <StaffBirthdays
          v-if="
            StaffBirthDateTotal.nextMonthGreetingNotPersonalised > 0 ||
              StaffBirthDateTotal.nextMonthGreetingPersonalised > 0
          "
          :not-personalised="
            StaffBirthDateTotal.nextMonthGreetingNotPersonalised
          "
          :personalised="StaffBirthDateTotal.nextMonthGreetingPersonalised"
          :month="StaffBirthDateTotal.nextMonth"
        />
        <div v-else>
          <h3>
            <b>{{ $t('messages.no_birthdays_this_month') }}</b>
          </h3>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import StaffBirthdays from '~/components/Dashboard/StaffBirthdays'

export default {
  layout: 'admin',
  name: 'Dashboard',
  components: { StaffBirthdays },
  computed: mapGetters({
    StaffBirthDateTotal: 'admin/StaffBirthDateTotal'
  }),
  async fetch({ store }) {
    await store.dispatch('admin/getTotalStaffBirthdays')
  },
  methods: {
    getCurrentMonth() {
      return this.$nuxt.$moment().format('MMMM')
    },
    getNextMonth() {
      return this.$nuxt
        .$moment()
        .add(1, 'M')
        .format('MMMM')
    },
    switchMonth(payload) {
      let result = ''
      switch (payload) {
        case 1:
          result = 'January'
          break
        case 2:
          result = 'February'
          break
        case 3:
          result = 'March'
          break
        case 4:
          result = 'April'
          break
        case 5:
          result = 'May'
          break
        case 6:
          result = 'June'
          break
        case 7:
          result = 'July'
          break
        case 8:
          result = 'August'
          break
        case 9:
          result = 'September'
          break
        case 10:
          result = 'October'
          break
        case 11:
          result = 'November'
          break
        case 12:
          result = 'December'
          break
        default:
          break
      }
      return result
    }
  }
}
</script>
