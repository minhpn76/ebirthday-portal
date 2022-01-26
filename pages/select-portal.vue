<template>
  <div class="animated fadeIn mr-bottom-cs1">
    <b-row> </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'switchlanding',
  name: 'SwitchPage',
  computed: mapGetters({
    roleAuth: 'ROLE_AUTH'
  })
}
</script>
