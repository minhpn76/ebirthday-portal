<template>
  <header class="app-header navbar">
    <button
      class="navbar-toggler mobile-sidebar-toggler d-lg-none"
      type="button"
      @click="mobileSidebarToggle"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="/"></b-link>
    <button
      class="navbar-toggler sidebar-toggler d-md-down-none"
      type="button"
      @click="sidebarToggle"
    >
      <span id="icon-hidden" class="navbar-toggler-icon"></span>
    </button>
    <b-navbar-nav class="ml-auto">
      <div>
        {{ preferred_name }} <b>({{ staff_auth }})</b>
      </div>
      <HeaderDropdown />
    </b-navbar-nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import HeaderDropdown from './HeaderDropdown.vue'
export default {
  name: 'CHeader',
  components: {
    HeaderDropdown
  },
  computed: mapGetters({
    info_user: 'INFO_USER',
    staff_auth: 'STAFF_AUTH',
    preferred_name: 'PREFERRED_NAME'
  }),
  beforeMount() {
    document.body.classList.add('sidebar-fixed', 'header-fixed', 'pace-done')
  },
  methods: {
    sidebarToggle(e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
      document.getElementById('bg-div').classList.toggle('sticky-click')
      if (
        document.getElementById('bg-div').classList.contains('sticky-click')
      ) {
        document.getElementById('bg-div').classList.add('sticky-click')
      } else {
        document.getElementById('bg-div').classList.remove('sticky-click')
      }
    },
    sidebarMinimize(e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
      document.getElementById('bg-div').classList.toggle('sticky-click')
    },
    mobileSidebarToggle(e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    }
  }
}
</script>
