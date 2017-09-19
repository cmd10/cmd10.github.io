<!-- template for the modal component -->
<template>
  <div class="uploadPage">
    <img  class="uploadingImg" src="../../assets/loading.png">
  </div>
</template>
<script>
  export default {
    name: 'v-upload',
    props: {
    },
    data() {
      return {
      };
    },
    created() {
      console.log('upload create');
    },
    mounted() {

    },
    computed: {

    },
    methods: {

    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "upload.styl"
</style>

<!-- app -->
<!-- <div id="app">
  <button id="show-modal" @click="showModal = true">Show Modal</button>

  <modal v-if="showModal" @close="showModal = false">

    <h3 slot="header">custom header</h3>
  </modal>
</div> -->

