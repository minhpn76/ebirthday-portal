<template>
  <div class="app">
    <AppHeader />
    <div class="app-body">
      <Sidebar :nav-items="nav" :switch-portal="isSwitch" />
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
import { mapGetters } from 'vuex'
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
      nav: [],
      scrolled: false,
      choseUrl: 'Select Portal',
      isSwitch: true
    }
  },
  computed: {
    name() {
      return this.$route.name
    },
    ...mapGetters({
      roleAuth: 'ROLE_AUTH'
    })
  },
  mounted: function() {
    window.addEventListener('scroll', this.handleScroll)
    this.showMenuSwitch()
    const valueObject = Object.values(this.roleAuth)
    const numberValue = valueObject.filter(i => i === true).length
    if (numberValue >= 1 && numberValue <= 2) {
      if (this.roleAuth.staff_Benefits) {
        this.$router.push('/admin')
      } else if (this.roleAuth.reporting_Manager) {
        this.$router.push('/message')
      } else if (this.roleAuth.frontStaff || this.roleAuth.finance) {
        this.$router.push('/redemption')
      }
    }
  },
  beforeDestroy: function() {
    document.body.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    itemBreadcrumb() {
      const vm = this
      const replace = vm.name.split('admin-').join('/admin/')
      if (['admin', 'messages', 'redemption'].includes(vm.name)) {
        return this.choseUrl
      }
      if (vm.name === 'admin-roles') {
        this.choseUrl = 'Roles'
        return this.choseUrl
      } else if (vm.name === 'admin-functional-create') {
        this.choseUrl = 'Function ID Create'
        return this.choseUrl
      } else if (vm.name === 'admin-functional-modify') {
        this.choseUrl = 'Function ID Modify'
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
    },
    showMenuSwitch() {
      if (
        !this.roleAuth.staff_Benefits &&
        !this.roleAuth.reporting_Manager &&
        !this.roleAuth.frontStaff &&
        !this.roleAuth.finance
      ) {
        return this.nav
      } else {
        const listNav = []
        if (this.roleAuth.staff_Benefits) {
          listNav.push({
            url: '/admin',
            icon: 'fa fa-user',
            name: 'portal.admin'
          })
        }
        if (this.roleAuth.reporting_Manager) {
          listNav.push({
            url: '/message',
            icon: 'fa fa-envelope',
            name: 'portal.message'
          })
        }
        if (this.roleAuth.frontStaff || this.roleAuth.finance) {
          if (
            this.roleAuth.finance &&
            !this.roleAuth.frontStaff &&
            !this.roleAuth.staff_Benefits
          ) {
            listNav.push({
              url: '/redemption/transaction',
              icon: 'fa fa-birthday-cake',
              name: 'menu.page_transaction'
            })
          } else {
            listNav.push({
              url: '/redemption',
              icon: 'fa fa-credit-card',
              name: 'portal.redemption'
            })
          }
        }
        this.nav = listNav
        return this.nav
      }
    }
  }
}
</script>
