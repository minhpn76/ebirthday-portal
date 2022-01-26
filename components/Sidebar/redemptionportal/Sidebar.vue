<template>
  <b-navbar toggleable="xs" fixed="top" type="light" variant="light">
    <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

    <b-collapse id="nav-text-collapse" is-nav>
      <b-navbar-nav>
        <ul class="expend-menu">
          <li
            v-for="(item, key) in nav"
            :key="key"
            v-b-toggle.nav-text-collapse
          >
            <nuxt-link :to="item.url">{{ $t(item.name) }}</nuxt-link>
          </li>
          <li v-if="dataRole.staff_Benefits">Admin Portal</li>
          <li v-if="dataRole.reporting_Manager">
            Message Portal
          </li>
          <li v-b-toggle.nav-text-collapse>
            <a href="javascript();" @click="logout">{{ $t('auth.logout') }}</a>
          </li>
        </ul>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    nav: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  computed: mapGetters({
    dataRole: 'ROLE_AUTH'
  }),
  methods: {
    // eslint-disable-next-line require-await
    async logout() {
      try {
        this.$auth.logout().then(() => {
          this.$router.push('/login')
        })
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>
