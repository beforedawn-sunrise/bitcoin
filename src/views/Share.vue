<template>
  <mu-container class="share">
    <mu-appbar style="width: 100%;" color="#fff" text-color="#000">
        
        <mu-button @click="$router.back(-1)" icon flat slot="left">
          <mu-icon value=":icon-ziyuan1"></mu-icon>
        </mu-button>
    </mu-appbar>
    <div style="" style="width:24px; height:24px;top:20px;right:20px;z-index:1;position: fixed">
      <svg class="icon" @click="$router.back(-1)" style="font-size: 24px; z-index: 999;" color="#fff">
        <use xlink:href="#icon-guanbi"></use>
      </svg>
    </div>
    <mu-card :raised="false" style="width: 100%;max-width: 100%; margin: 0 auto; text-align: left">

      <mu-card-media >
      
      <div>
      <h1>ICO Campaign</h1>
        invite Friends to Create a Path to Financial Freedom and Split $50 Million<br><br>                      

        SPAC ICO Exclusive Event<br><br>    

        In order to promote the primary market to the secondary market as soon as possible within three months, SPAC set up an invitation activity, this activity is to participate in the investment ICO model SPAC coin internal VIP development invitation activity, $50 million as a reward.<br><br>    

        Invite friends to accumulate investment amount reached $1000, reward $188<br><br> 

        Invite friends to invest $5,000, $388 reward<br><br>  

        Invite friends to invest $10,000, $1888 bonus<br><br>  

        Invite friends to invest $100,000, $18,888 bonus<br><br>    

        This campaign starts from June 26, 2022 and ends on September 26, 2022, any cheating is prohibited, once found, all rewards will be cancelled.<br><br>    

        ▲Contact our customer service to receive the reward when the amount is reached◎<br>
      </div>
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
    // this.qrcode(this.share_url);
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
<style lang="scss" scoped>
.share {
  .mu-card-media-title {
    //background-color: transparent !important;
    text-align: center;
    color:#fff!important;
    .mu-card-sub-title{
      color:#fff!important;
    }
  }
  div{
    padding:20px;
    text-align:left;
  }
}


</style>