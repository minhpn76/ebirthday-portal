<template>
  <div>
    <no-ssr>
      <v-date-picker
        v-model="selectedDate"
        show-caps
        mode="range"
        :is-required="isRequired"
        :formats="formats"
        :data="data"
        :locale="{ masks: { input: 'DD/MM/YYYY' } }"
        @input="inputChange"
        @drag="dragValue = $event"
      />
      <b-button
        class="remove-button-calender border-0 vs__clear"
        @click="selectedDate = null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
          <path
            d="M6.895455 5l2.842897-2.842898c.348864-.348863.348864-.914488 0-1.263636L9.106534.261648c-.348864-.348864-.914489-.348864-1.263636 0L5 3.104545 2.157102.261648c-.348863-.348864-.914488-.348864-1.263636 0L.261648.893466c-.348864.348864-.348864.914489 0 1.263636L3.104545 5 .261648 7.842898c-.348864.348863-.348864.914488 0 1.263636l.631818.631818c.348864.348864.914773.348864 1.263636 0L5 6.895455l2.842898 2.842897c.348863.348864.914772.348864 1.263636 0l.631818-.631818c.348864-.348864.348864-.914489 0-1.263636L6.895455 5z"
          ></path>
        </svg>
      </b-button>
    </no-ssr>
  </div>
</template>
<script>
import { isUndefined, isNull } from 'lodash'
export default {
  props: {
    isRequired: {
      type: Boolean,
      default: false
    },
    input: {
      type: Function,
      default: () => {
        return () => {}
      }
    }
  },
  data() {
    return {
      dragValue: null,
      selectedDate: {
        start: '',
        end: ''
      },
      masks: {},
      formats: {
        title: 'MMMM YYYY',
        weekdays: 'WWW',
        navMonths: 'MMM',
        input: ['DD/MMM/YYYY', 'DD/MMM/YYYY', 'DD/MMM/YYYY'], // Only for `v-date-picker`
        dayPopover: 'L' // Only for `v-date-picker`
      },
      data: ['DD/MMM/YYYY', 'DD/MMM/YYYY', 'DD/MMM/YYYY']
    }
  },
  methods: {
    inputChange(range) {
      let output = {}
      if (
        !isNull(range) &&
        !isUndefined(range.start) &&
        !isUndefined(range.end)
      ) {
        output = {
          start: this.$nuxt.$moment(range.start).format('YYYY-MM-DD'),
          end: this.$nuxt.$moment(range.end).format('YYYY-MM-DD')
        }
      }
      this.input(output)
    }
  }
}
</script>
<style lang="scss" scoped></style>
