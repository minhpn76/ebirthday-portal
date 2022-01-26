import Vue from 'vue'
import Vcalendar from 'v-calendar'
import 'v-calendar/src/styles/tailwind-lib.css'

Vue.use(Vcalendar, {
  datePickerTintColor: '#F00',
  datePickerShowDayPopover: false
})
