<template>
  <div>
    <no-ssr>
      <v-date-picker
        v-model="selectedDate"
        :min-date="minDate"
        show-caps
        :is-required="isRequired"
        :locale="{ masks: { input: 'DD/MM/YYYY' } }"
        @input="inputChange"
      />
    </no-ssr>
  </div>
</template>
<script>
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
    },
    minDate: {
      type: Date,
      default: () => {
        return new Date()
      }
    },
    value: {
      type: Date,
      default: () => {
        return new Date()
      }
    }
  },
  data() {
    return {
      selectedDate: this.value
    }
  },
  methods: {
    inputChange(date) {
      this.input(this.$nuxt.$moment(date).format('YYYY-MM-DDTHH:mm:ss'))
    }
  }
}
</script>
<style lang="scss" scoped></style>
