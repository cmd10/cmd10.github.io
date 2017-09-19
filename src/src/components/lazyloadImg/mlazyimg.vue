<template>
    <img v-lazy="imgObj" lazy="loading" class="bg-box"/>
</template>
<script>
  export default {
    name: 'v-mimg',
    props: {
      imgUrl: {
        type: String
      }
    },
    computed: {
      imgObj() {
        return this.imgUrl;
      }
    }
  };
</script>
<style>
  @-webkit-keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  img[lazy=loaded] {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
  }

  img[lazy=loading] {
    position: absolute;
    width: 15% !important;
    height: 15% !important;
    margin-top: 40%;
    bottom: 40%;
    left: 40%;
  }

  img[lazy=error] {
    position: absolute;
    width: 15% !important;
    height: 15% !important;
    margin-top: 40%;
    bottom: 40%;
    left: 40%;

    border-radius: 2px;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
  }

  .bg-box {
    height: 15%;
    background-size: contain;
    padding-bottom: 100%;
  }

  .bg-box[lazy=loading] {
    position: absolute;
    width: 15% !important;
    height: 15% !important;
    margin-top: 45%;
    bottom: 40%;
    left: 40%;;
  }

  .bg-box[lazy=loaded] {
    background-size: cover;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
    padding-bottom: 0px
  }

</style>
