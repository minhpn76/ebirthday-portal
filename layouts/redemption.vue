<template>
  <div class="app">
    <AppHeader />
    <div class="app-body">
      <Sidebar :nav-items="getNavMenu()" />
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
import { isUndefined } from 'lodash'
import nav from './redemption/menu'

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
      choseUrl: 'Redeem Voucher'
    }
  },
  computed: {
    name() {
      return this.$route.name
    },
    ...mapGetters({
      dataRole: 'ROLE_AUTH'
    })
  },
  mounted: function() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy: function() {
    document.body.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    getNavMenu() {
      if (
        !isUndefined(this.dataRole) &&
        !isUndefined(this.dataRole.finance) &&
        !isUndefined(this.dataRole.staff_Benefits) &&
        !isUndefined(this.dataRole.frontStaff) &&
        this.dataRole.staff_Benefits === false &&
        this.dataRole.frontStaff === false &&
        this.dataRole.finance === true
      ) {
        return [this.nav[1]]
      }
      return this.nav
    },
    itemBreadcrumb() {
      const vm = this
      const replace = vm.name.split('redemption-').join('/redemption/')
      if (['admin', 'messages', 'redemption'].includes(vm.name)) {
        if (
          !isUndefined(this.dataRole) &&
          !isUndefined(this.dataRole.staff_Benefits) &&
          this.dataRole.staff_Benefits
        ) {
          return this.$t('menu.check_voucher')
        } else {
          return this.$t('menu.redemption_voucher')
        }
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
