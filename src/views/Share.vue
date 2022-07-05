<template>
  <mu-container class="share">
    <div style="" style="width:24px; height:24px;top:20px;right:20px;z-index:1;position: fixed">
      <svg class="icon" @click="$router.back(-1)" style="font-size: 24px; z-index: 999;" color="#fff">
        <use xlink:href="#icon-guanbi"></use>
      </svg>
    </div>
    <mu-card :raised="false" style="width: 100%;max-width: 100%; margin: 0 auto; text-align: left">

      <mu-card-media >
        <img src="@/assets/img5.jpg">
      </mu-card-media>
    </mu-card>


  </mu-container>
</template>
<script>

import Clipboard from "clipboard"

export default {
  name: "Share",
  data() {
    return {
      url: '',
      code: '',
      share_url: ''
    }
  },
  mounted() {
    this.url = location.href.split("#")[0];
    this.code = localStorage.getItem("extension_code");
    this.share_url = `${this.url.replace("index.html","")}#/register?code=${this.code}`;
    console.log(this.url);
    this.qrcode(this.share_url);
  },
  methods: {
    copy(className) {
      let that = this;
      let clipboard = new Clipboard(className);
      console.log(clipboard);
      clipboard.on('success', res => {
        that.$toast.success(that.$t('lay.copys'))
        res.clearSelection();
        clipboard.destroy();
      })

      clipboard.on('error', res => {
        that.$toast.warning(that.$t('lay.fcopy'))
      })
    }
  }
}
</script>
<style lang="scss">
.share {
  .mu-card-media-title {
    //background-color: transparent !important;
    text-align: center;
    color:#fff!important;
    .mu-card-sub-title{
      color:#fff!important;
    }
  }
}
</style>