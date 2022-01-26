<template>
  <div class="app">
    <AppHeader />
    <div class="app-body">
      <Sidebar :nav-items="nav" />
      <main class="main">
        <breadcrumb :item="itemBreadcrumb()" />
        <div
          id="bg-div"
          style="background-image: url('/img/birthday_bg.png'); width: 100%; position: fixed; z-index: -1"
        ></div>
        <div id="bg-fixed" class="container-fluid">
          <nuxt />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import nav from './admin/menu'
import {
  Header as AppHeader,
  Sidebar,
  // Footer as AppFooter,
  Breadcrumb
} from '~/components/'

export default {
  name: 'Full',
  head: {
    title: 'FEO eBirthday Voucher'
  },
  components: {
    AppHeader,
    Sidebar,
    // AppFooter,
    Breadcrumb
  },
  data() {
    return {
      nav: nav.items,
      scrolled: false,
      choseUrl: 'Dashboard'
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
      const replace = vm.name.split('admin-').join('/admin/')
      if (['admin', 'messages', 'redemption'].includes(vm.name)) {
        this.choseUrl = 'Dashboard'
        return this.choseUrl
      } else if (vm.name === 'admin-roles') {
        this.choseUrl = 'Portal Settings / Roles'
        return this.choseUrl
      } else if (vm.name === 'admin-functional-create') {
        this.choseUrl = 'Portal Settings / Functional ID / Create'
        return this.choseUrl
      } else if (vm.name === 'admin-functional-modify') {
        this.choseUrl = 'Portal Settings / Functional ID / Modify'
        return this.choseUrl
      } else if (vm.name === 'admin-document-sms') {
        this.choseUrl = 'Templates / SMS'
        return this.choseUrl
      } else if (vm.name === 'admin-document-email') {
        this.choseUrl = 'Templates / Email'
        return this.choseUrl
      }
      this.nav.forEach(item => {
        if (item.url === replace) {
          this.choseUrl = this.$t(item.name)
        }
      })
      return this.choseUrl
    },
    handleScroll: function(event) {
      // const scrollTop = window.pageYOffset
      // // const element = document.getElementById('bg-fixed')
      // if (scrollTop > 45) {
      //   document.getElementById('bg-div').classList.add('sticky')
      // } else {
      //   document.getElementById('bg-div').classList.remove('sticky')
      // }
      // if (scrollTop > 0) {
      //   document.getElementById('breadcrumb').classList.add('sticky-breadcrumb')
      // } else {
      //   document
      //     .getElementById('breadcrumb')
      //     .classList.remove('sticky-breadcrumb')
      // }
      // const heightElement = element.style.height
      // element.style.backgroundPosition =
      //   '50% ' + Math.round((heightElement - scrollTop) * 0.4) + 'px'
    }
  }
}
</script>
