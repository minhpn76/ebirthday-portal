<template>
  <div class="animated fadeIn mr-bottom-cs1">
    <b-row> </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'selectportal',
  name: 'SwitchPage',
  computed: mapGetters({
    roleAuth: 'ROLE_AUTH'
  }),
  created() {
    if (this.roleAuth.staff_Benefits) {
      this.$router.push('/admin')
    } else {
      this.$router.push('/select-portal')
    }
  }
}
</script>
