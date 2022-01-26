<template>
  <div :class="[stylewrapper]">
    <div
      v-for="item in items"
      :key="item.staffId"
      :class="['box-day mb-4', classes]"
    >
      <StaffPending
        v-if="type === 'pending'"
        :key="item.staffId"
        :item="item"
        class-items="mb-0"
        :show-content-message="showContentMessage"
        @reload="reload"
      />
      <StaffSent
        v-else
        :key="item.staffId"
        class-items="mb-0"
        :item="item"
        :show-content-message="showContentMessage"
        @reload="reload"
      />
    </div>
  </div>
</template>
<script>
import StaffPending from './StaffPending'
import StaffSent from './StaffSent'

export default {
  components: { StaffPending, StaffSent },
  props: {
    items: {
      type: Array,
      default: function() {
        return []
      }
    },
    type: {
      type: String,
      default: function() {
        return 'pending'
      }
    },
    classes: {
      type: String,
      default: function() {
        return ''
      }
    },
    stylewrapper: {
      type: String,
      default: function() {
        return ''
      }
    },
    showContentMessage: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  methods: {
    reload(needReload) {
      this.$emit('reload', needReload)
    }
  }
}
</script>
