<template>
  <div v-if="isExternalLink">
    <a :href="url" :class="classList">
      <i :class="icon"></i> {{ name }}
      <b-badge v-if="badge && badge.text" :variant="badge.variant">{{
        badge.text
      }}</b-badge>
    </a>
  </div>
  <div v-else>
    <nuxt-link
      :to="{
        path: url,
        query: {}
      }"
      :class="classList"
      exact
    >
      <i :class="icon"></i> {{ name }}
      <b-badge v-if="badge && badge.text" :variant="badge.variant">{{
        badge.text
      }}</b-badge>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'SidebarNavLink',
  props: {
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    badge: {
      type: Object,
      default: () => {}
    },
    variant: {
      type: String,
      default: ''
    },
    classes: {
      type: String,
      default: ''
    }
  },
  computed: {
    classList() {
      let active = ''
      if (this.url === this.$route.path) {
        active = 'active'
      }
      return ['nav-link', this.linkVariant, ...this.itemClasses, active]
    },
    linkVariant() {
      return this.variant ? `nav-link-${this.variant}` : ''
    },
    itemClasses() {
      return this.classes ? this.classes.split(' ') : []
    },
    isExternalLink() {
      if (this.url.substring(0, 4) === 'http') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
