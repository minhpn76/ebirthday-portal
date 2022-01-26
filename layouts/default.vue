<template>
  <div class="app">
    <AppHeader />
    <div class="app-body">
      <Sidebar :nav-items="nav" />
      <main class="main">
        <breadcrumb :item="itemBreadcrumb()" />
        <div id="bg-fixed" class="container-fluid">
          <nuxt />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import nav from './message/menu'
import {
  Header as AppHeader,
  Sidebar,
  // Footer as AppFooter,
  Breadcrumb
} from '~/components/'

export default {
  name: 'Full',
  components: {
    AppHeader,
    Sidebar,
    // AppFooter,
    Breadcrumb
  },
  data() {
    return {
      nav: nav.items,
      scrolled: false
    }
  },
  computed: {
    name() {
      return this.$route.name
    }
  },
  mounted: function() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy: function() {
    document.body.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    itemBreadcrumb() {
      const vm = this
      this.choseUrl = 'Dashboard'
      if (!_.isNull(vm.name)) {
        const replace = vm.name.split('admin-').join('/admin/')
        if (['admin', 'messages', 'redemption'].includes(vm.name)) {
          this.choseUrl = 'Dashboard'
          return this.choseUrl
        } else if (vm.name === 'admin-roles') {
          this.choseUrl = 'Roles'
          return this.choseUrl
        } else if (vm.name === 'admin-functional-create') {
          this.choseUrl = 'Function ID Create'
          return this.choseUrl
        } else if (vm.name === 'admin-functional-modify') {
          this.choseUrl = 'Function ID Modify'
          return this.choseUrl
        } else if (vm.name === 'admin-templates-sms') {
          this.choseUrl = 'Templates Sms'
          return this.choseUrl
        } else if (vm.name === 'admin-templates-email') {
          this.choseUrl = 'Templates Email'
          return this.choseUrl
        }
        this.nav.forEach(item => {
          if (item.url === replace) {
            this.choseUrl = this.$t(item.name)
          }
        })
      }
      return this.choseUrl
    },
    handleScroll: function(event) {
      // const scrollTop = window.pageYOffset
      // if (scrollTop > 15) {
      //   document.getElementById('bg-fixed').classList.add('sticky-scroll')
      // } else {
      //   document.getElementById('bg-fixed').classList.remove('sticky-scroll')
      // }
    }
  }
}
</script>
