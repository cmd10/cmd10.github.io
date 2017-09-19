<template>
    <div class="wecome">
      <div class="loader-inner pacman">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
      </div>
    </div>
</template>
<script>
import {savaToLocal} from '../../common/js/store';
    export default {
        mounted() {
            setTimeout(() => {
                this.$router.push({
                    name: 'hot'
                });
               savaToLocal('gank', 'welcome', true);
            }, 1000);
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus">
    @import 'welcome.styl';
</style>
