<template>
  <div class="navWrap">
      <div class="nav" v-for="item in items">
        <router-link :to="{name: item.routeName, params: item.params}" v-text="item.title" replace></router-link>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'v-navbar',
    props: {
      items: {
        type: Array
      }
    },
    data() {
      return {
      };
    },
    components: {
    },
    created() {

    },
    mounted() {

    },
    computed: {
    },
    destroyed() {

    },
    methods: {
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "navBar.styl"
</style>
