<template>
  <i class="icons font-2xl d-block" :class="icon"></i>
</template>

<script>
export default {
  name: 'SortCheckbox',
  props: {
    sort: {
      type: Boolean,
      default: function() {
        return true
      }
    }
  },
  data() {
    return {
      icon: 'icon-arrow-up-circle'
    }
  },
  watch: {
    sort(value) {
      this.icon = value ? 'icon-arrow-up-circle' : 'icon-arrow-down-circle'
      return value
    }
  }
}
</script>

<style scoped></style>
