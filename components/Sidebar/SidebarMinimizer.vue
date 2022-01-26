<template>
  <button
    class="sidebar-minimizer"
    type="button"
    @click="
      sidebarMinimize()
      brandMinimize()
    "
  ></button>
</template>
<script>
export default {
  name: 'SidebarMinimizer',
  methods: {
    sidebarMinimize() {
      document.body.classList.toggle('sidebar-minimized')
      document.getElementById('bg-div').classList.toggle('stickyFull')
      document.getElementById('icon-hidden').classList.toggle('hiddend')
    },
    brandMinimize(e) {
      document.body.classList.toggle('brand-minimized')
      // document.getElementById('bg-fixed').classList.toggle('sticky')
    }
  }
}
</script>
