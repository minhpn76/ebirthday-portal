<template>
  <div>
    <b-card>
      <b-card-title slot="header" class="text-center">
        {{ $t('dashboard.today') }}
        <br />
        {{ getDateFormat(new Date(), 'D MMM YYYY, dddd') }}
      </b-card-title>
      <div
        class="d-flex it-box-bd d-flex justify-content-left align-items-center"
      >
        <h2 class="display-1">{{ thisMonth }}</h2>
        <h5 class="pl-2">{{ $t('dashboard.birth_day_this_month') }}</h5>
      </div>
      <hr />
      <div
        class="d-flex it-box-bd d-flex justify-content-left align-items-center"
      >
        <h2 class="display-1">{{ nextMonth }}</h2>
        <h5 class="pl-2">{{ $t('dashboard.birth_day_next_month') }}</h5>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'BirthDays',
  props: {
    thisMonth: {
      type: Number,
      default: function() {
        return 0
      }
    },
    nextMonth: {
      type: Number,
      default: function() {
        return 0
      }
    }
  },
  methods: {
    getDateToday() {
      const now = this.$nuxt.$moment()
      return now.format('D MMM YYYY, dddd')
    }
  }
}
</script>
