<template>
  <ol id="breadcrumb" class="breadcrumb breadcrumb-fixed">
    <li class="breadcrumb-item">
      <span class="">{{ $t('menu.home') }}</span>
    </li>
    <li class="breadcrumb-item">
      <span class="active">{{ item }}</span>
    </li>
  </ol>
</template>

<script>
export default {
  props: {
    item: {
      type: String,
      default: () => ''
    }
  },
  methods: {}
}
</script>
