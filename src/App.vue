<template>
  <div id="app">
    <router-view v-if="routerAlive" />
  </div>
</template>

<script>
  export default {
    name: 'App',
    provide() {
      return {
        reload: this.reload,
      }
    },
    data() {
      return {
        routerAlive: true
      }
    },
    methods: {
      reload() {
        this.routerAlive = false
        this.$nextTick(function () {
          this.routerAlive = true
        })
      },
    },
    mounted() {
      // test1()
      // myUndefinedFunction();
    }
  }
</script>
