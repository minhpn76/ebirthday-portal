<template>
  <b-col class="text-center pt-4">
    <h2>{{ $t('staff.available') }}</h2>
    <b-button href="/staff/step" class="mt-5" variant="primary">{{
      $t('staff.bd_voucher')
    }}</b-button>
    <div class="mt-5 text-center">
      <p class="text-primary pt-5">{{ $t('staff.tap_desc') }}</p>
    </div>
  </b-col>
</template>
<script>
export default {
  layout: 'staff',
  name: 'StaffDashboard'
}
</script>
