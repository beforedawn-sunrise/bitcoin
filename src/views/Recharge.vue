<template>
  <div style="height: 100%;">
    <mu-container style="height: 100%;">
      <mu-appbar style="width: 100%;" color="#fff" text-color="#000">
        {{ $t('account.charging') }}
        <mu-button @click="$router.back(-1)" icon flat slot="left">
          <mu-icon value=":icon-ziyuan1"></mu-icon>
        </mu-button>
      </mu-appbar>
      <!--      <mu-tabs :value.sync="active" center indicator-color="primary" color="primary">-->
      <!--        <mu-tab  v-for="name in Object.keys(wallets)">{{ name.toUpperCase() }}</mu-tab>-->
      <!--      </mu-tabs>-->
      <div class="flex">
        <div class="flex1"></div>
        <div v-bind:class="{'active':link == 'a'}" v-on:click.prevent="link='a'"  class="tabbt" v-for="(name,index) in Object.keys(wallets)">
          BTC
        </div>
        <div v-bind:class="{'active':link == 'b'}" v-on:click.prevent="link='b'"  class="tabbt" v-for="(name,index) in Object.keys(wallets)">
          ETH
        </div>
        <div v-bind:class="{'active':link == 'c'}" v-on:click.prevent="link='c'" class="tabbt" v-for="(name,index) in Object.keys(wallets)">
          LTC
        </div>
        <div v-bind:class="{'active':link == 'd'}" v-on:click.prevent="link='d'" class="tabbt" v-for="(name,index) in Object.keys(wallets)">
          USDT
        </div>
        
        <div class="flex1"></div>
      </div>
      <div style="overflow: auto; height: calc(100% - 56px - 48px);">
      <div v-if="link == 'a'">
        <div>
          <div id="qrcode" ref="qrcode">
             <!-- <img :src="'https://test14.dfb.io/show/lookqr.php?url='+wallets[Object.keys(wallets)[0]]"> -->
             <img :src="'https://test14.dfb.io/show/lookqr.php?url='+differentQRcode[0].imgNumber">
          </div>
        </div>
        <p>
          <span style="display: block; color:#2296f3" v-if="Object.keys(wallets)[active]==='usdt'">ERC20</span>
           <!-- {{ wallets[Object.keys(wallets)[0]] }}-->
           {{differentQRcode[0].qrcodeNumber}}
        </p> 
      </div>

      <div v-if="link == 'b'">
        <div>
          <div id="qrcode" ref="qrcode">
             <!-- <img :src="'https://test14.dfb.io/show/lookqr.php?url='+wallets[Object.keys(wallets)[0]]"> -->
             <img :src="'https://test14.dfb.io/show/lookqr.php?url='+differentQRcode[1].imgNumber">
          </div>
        </div>
        <p>
          <span style="display: block; color:#2296f3" v-if="Object.keys(wallets)[active]==='usdt'">ERC20</span>
           <!-- {{ wallets[Object.keys(wallets)[0]] }}-->
           {{differentQRcode[1].qrcodeNumber}}
        </p> 
      </div>

      <div v-if="link == 'c'">
        <div>
          <div id="qrcode" ref="qrcode">
             <!-- <img :src="'https://test14.dfb.io/show/lookqr.php?url='+wallets[Object.keys(wallets)[0]]"> -->
             <img :src="'https://test14.dfb.io/show/lookqr.php?url='+differentQRcode[2].imgNumber">
          </div>
        </div>
        <p>
          <span style="display: block; color:#2296f3" v-if="Object.keys(wallets)[active]==='usdt'">ERC20</span>
           <!-- {{ wallets[Object.keys(wallets)[0]] }}-->
           {{differentQRcode[2].qrcodeNumber}}
        </p> 
      </div>

      <div v-if="link == 'd'">
        <div>
          <div id="qrcode" ref="qrcode">
             <!-- <img :src="'https://test14.dfb.io/show/lookqr.php?url='+wallets[Object.keys(wallets)[0]]"> -->
             <img :src="'https://test14.dfb.io/show/lookqr.php?url='+differentQRcode[3].imgNumber">
          </div>
        </div>
        <p>
          <span style="display: block; color:#2296f3" v-if="Object.keys(wallets)[active]==='usdt'">ERC20</span>
           <!-- {{ wallets[Object.keys(wallets)[0]] }}-->
           {{differentQRcode[3].qrcodeNumber}}
        </p> 
      </div>    
        <mu-button class="copy" flat color="primary" :data-clipboard-text="wallets[Object.keys(wallets)[active]]"
                   @click="copy">{{ $t('account.copy') }}
        </mu-button>
        
        <div style="padding:0 20px;">
          <mu-text-field v-show="true" style="width: 100%;" :label="$t('account.cgaddress')" v-model="acc"></mu-text-field>
          <mu-text-field style="width: 100%;" :label="$t('withdrawList.hash')" v-show="false"
                         v-model="hash"></mu-text-field>
          <mu-text-field style="width: 100%;" :label="$t('account.amount')"
                         :suffix="Object.keys(wallets)[active]==='btc'?'BTC':'USDT'"
                         v-model="amount"></mu-text-field>
          <mu-text-field v-show="true" readonly="" v-model="pic===''?select:selected" style="width: 100%;"
                         :label="$t('account.picture')">
            <mu-button flat full-width slot="append" color="primary" @click="choosePic">{{ $t('account.choose') }}
            </mu-button>
          </mu-text-field>
          <mu-button full-width @click="openAlert=true" color="primary">
            {{ $t('account.submitRecharge') }}
          </mu-button>
          <p class="tall hide">
            <i class="currency_title">
              {{ $t('account.a10') }}
            </i></p>
          <input id="picture" @change="uploadFile" ref="uploads" type="file" style="display:none;"></input>
        </div>
      </div>
    </mu-container>
    <mu-dialog title="Tips" width="600" max-width="80%" :esc-press-close="false"
               :overlay-close="false" :open.sync="openAlert">
      {{ $t('lay.confirm') }}
      <mu-button slot="actions" flat color="primary" @click="openAlert=false">{{ $t('lay.ceil') }}</mu-button>
      <mu-button slot="actions" flat color="primary" @click="submit">{{
          $t('lay.sure')
        }}
      </mu-button>
    </mu-dialog>
  </div>
</template>

<script>

import QRCode from 'qrcodejs2'
import Clipboard from "clipboard"

export default {
  name: "Recharge",
  data() {
    return {
      openAlert: false,
      active: 0,
      wallets: [],
      qrccode: false,
      acc: '',
      amount: '',
      hash: 'default',
      pic: '',
      select: '',
      selected: '',
      loading: false,
      fullLoading: false,
      link: 'a',
      differentQRcode:[
        {
          imgNumber:123456,
          qrcodeNumber:"TXowbGCuudzTBLy7LkZsMJxX9K3a5Gtkb8"
        },
       {
          imgNumber:456789,
          qrcodeNumber:"JKlwbGCuudzTBLy7LkZsMJxX9K3a5ghljn9",
        },
       {
          imgNumber:123789,
          qrcodeNumber:"GHdwbGCuudzTBLy7LkZsMJxX9K3a5ldfghg3",
        },
        {
          imgNumber:147369,
          qrcodeNumber:"OBlwbGCuudzTBLy7LkZsMJxX9K3a5fgkkio5",
        },
      ]
    }
  },
  watch: {
    active(val) {
      // let url = this.wallets[Object.keys(this.wallets)[val]];
      // this.qrcode(url);
    }
  },
  mounted() {
    this.getWallets(0)
    this.select = this.$t('account.select')
    this.selected = this.$t('account.selected')
  },
  methods: {
    choosePic() {
      this.$refs.uploads.dispatchEvent(new MouseEvent("click"));
    },
    uploadFile(e) {
      let that = this;

      const loading = this.$loading();

      // that.loading = true;
      let reader = new FileReader();
      // console.log(window.event.target.files[0]);
      let file = e.target.files[0];

      reader.readAsDataURL(file);
      reader.onload = function (ed) {
      };
      let formData = new FormData();
      formData.append("file", file);
      this.$http.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res => {
        loading.close()
        let msg = res.data;
        if (msg.type == 'ok') {
          that.pic = msg.message
        } else {
          that.$toast.error(msg.message)
        }
      });
    },
    

    getWallets(i) {
      const loading = this.$loading();

      let that = this;
      this.$http({
        url: '/api/wallet/get_in_address',
        method: 'post',
        data: {
          currency: 3,
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {

        loading.close();
        if (res.data.type === 'ok') {
          console.log(res);
          that.wallets = res.data.message;

          let url = that.wallets[Object.keys(that.wallets)[0]];
          console.log(url);
          console.log(i);
          // that.qrcode(url)

        }
      })
    },
    copy() {
      let that = this;
      let clipboard = new Clipboard('.copy');
      console.log(clipboard);
      clipboard.on('success', res => {
        that.$toast.success(that.$t('lay.copys'))
        res.clearSelection();
        clipboard.destroy();
      })

      clipboard.on('error', res => {
        that.$toast.warning(that.$t('lay.fcopy'))
      })
    },
    qrcode(url) {
      this.$refs.qrcode.innerHTML = ''
      this.qrccode = new QRCode('qrcode', {
        width: 150,
        height: 150,
        text: url, // 二维码地址
      })
    },
    submit() {
      let that = this;
      const loading = this.$loading();
      this.$http({
        url: '/api/wallet/charge_req',
        method: 'post',
        data: {
          currency: Object.keys(this.wallets)[this.active] === 'btc' ? 1 : 3,
          acc: this.acc,
          amount: this.amount,
          pic: this.pic,
          hash: this.hash
        },
        headers: {Authorization: localStorage.getItem('token')}
      }).then(res => {
        loading.close();
        that.openAlert = false;
        if (res.data.type === 'ok') {
          that.$toast.success(res.data.message);
          that.pic = '';
          that.acc = '';
          that.amount = '';
          that.hash = '';
        } else {
          that.$toast.error(res.data.message);
        }
      })
    }
  }
}
</script>

<style lang="scss">
#qrcode {
  margin: 20px;

  canvas {
    display: none;
  }

  img {
    margin: 0 auto;
    width: 50%;
  }
}
.tabbt{
  padding:4px 20px;
  border:1px solid #eee;
  margin:0 5px;
  border-radius:5px;
  &.active{
    border-color:#0081cc;
  }
}
.mu-demo-form {
  width: 100%;
  max-width: 460px;
}
</style>