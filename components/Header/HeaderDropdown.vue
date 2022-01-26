<template>
  <b-nav-item-dropdown right no-caret>
    <template slot="button-content">
      <img src="~static/img/avatars/profile.png" class="img-avatar" />
    </template>
    <template v-if="menuCount > 1">
      <b-dropdown-item v-if="dataRole.staff_Benefits" @click="redirectRoute(1)">
        <b v-if="pageActive === 'admin'">
          <i class="fa fa-user" style="color: #536b78"></i>
          {{ $t('portal.admin') }}
        </b>
        <span v-else>
          <i class="fa fa-user" style="color: #536b78"></i>
          {{ $t('portal.admin') }}
        </span>
      </b-dropdown-item>
      <b-dropdown-item
        v-if="dataRole.reporting_Manager"
        @click="redirectRoute(2)"
      >
        <b v-if="pageActive === 'message'">
          <i class="fa fa-envelope" style="color: #536b78"></i>
          {{ $t('portal.message') }}
        </b>
        <span v-else>
          <i class="fa fa-envelope" style="color: #536b78"></i>
          {{ $t('portal.message') }}
        </span>
      </b-dropdown-item>
      <b-dropdown-item
        v-if="
          dataRole.frontStaff || dataRole.finance || dataRole.staff_Benefits
        "
        @click="redirectRoute(3)"
      >
        <b v-if="pageActive === 'redemption'">
          <i class="fa fa-credit-card" style="color: #536b78"></i>
          {{ $t('portal.redemption') }}
        </b>
        <span v-else>
          <i class="fa fa-credit-card" style="color: #536b78"></i>
          {{ $t('portal.redemption') }}
        </span>
      </b-dropdown-item>
    </template>
    <b-dropdown-item href="/adfs/sls">
      <i class="fa fa-lock" style="color: #536b78"></i>
      {{ $t('auth.logout') }}
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
import { map, includes } from 'lodash'

export default {
  name: 'HeaderDropdown',
  data: () => {
    return {
      itemsCount: 42,
      menuCount: 0
    }
  },
  computed: mapGetters({
    dataRole: 'ROLE_AUTH',
    pageActive: 'PAGE_ACTIVE'
  }),
  mounted() {
    let redemption = false
    let message = false
    map(this.dataRole, (value, index) => {
      if (includes(['frontStaff', 'finance', 'staff_Benefit'], index)) {
        if (!redemption && value) {
          redemption = true
          this.menuCount++
        }
      } else if (
        includes(['reporting_Manager', 'staff_Member', 'staff_Benefit'], index)
      ) {
        if (!message && value) {
          message = true
          this.menuCount++
        }
      } else if (value && !message && !redemption) {
        this.menuCount++
      }
    })
  },
  methods: {
    // eslint-disable-next-line require-await
    logout() {
      this.$router.push('/adfs/sls')
    },
    redirectRoute(value) {
      switch (value) {
        case 1:
          this.$router.push('/admin')
          break
        case 2:
          this.$router.push('/message')
          break
        case 3:
          this.$router.push('/redemption')
          break
        default:
          break
      }
    }
  }
}
</script>
