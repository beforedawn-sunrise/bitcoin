<template>
  <div style="height: 100%;">
    <mu-container style="height: 100%;">
      <mu-appbar style="width: 100%;" color="#fff" text-color="#000">
        {{ $t('legal.buy') }} USDT
        <mu-button @click="$router.back(-1)" icon flat slot="left">
          <mu-icon value=":icon-ziyuan1"></mu-icon>
        </mu-button>
        <mu-button flat @click="$router.push('/Recharge')" slot="right" style="margin-right: 10px;">
          充值&nbsp;&nbsp;
        </mu-button>
      </mu-appbar>
      <!--      <mu-tabs :value.sync="active" center indicator-color="primary" color="primary">-->
      <!--        <mu-tab  v-for="name in Object.keys(wallets)">{{ name.toUpperCase() }}</mu-tab>-->
      <!--      </mu-tabs>-->
      <div class="flex" style="width: 100%">
        <div class="flex1">
          <div class="currency_title">当前买入价</div>
          <div class="ft18">￥{{ legalInfo.rate }}</div>
        </div>
        <div class="flex1">
          <div class="currency_title">认证卖家</div>
          <div class="ft16">{{ legalInfo.count }}</div>
        </div>
        <div class="flex1">
          <div class="currency_title">到账率</div>
          <div class="ft16">100%</div>
        </div>
      </div>
      <div style="width: 100%; height: 8px; background: #f5f5f5;"></div>
      <div style="overflow: auto; height: calc(100% - 56px - 48px);">
        <div style="line-height: 35px; padding-top: 5px;">
          <mu-button flat color="#d50000">人民币</mu-button>
          买
          <mu-button flat color="green900">USDT</mu-button>
        </div>
        <div style="padding:0 20px;">
          <mu-text-field style="width: 100%;" suffix="￥" label="买入数量"
                         v-model="acc" :placeholder="`单笔交易金额应在${legalInfo.min}~${legalInfo.max}之间`"></mu-text-field>
          <div class="flex">
            <div class="tabbtd" @click="acc=shortNumbers[index]"
                 :class="parseInt(acc)===shortNumbers[index]?'active':''"
                 :style="index!==0 && index!==shortNumbers.length-1?'margin:0 5px':''"
                 v-for="(name,index) in shortNumbers">
              {{ name }}
            </div>
          </div>

          <mu-text-field style="width: 100%;" readonly="" :label="'到账数量'" suffix="USDT" v-show="true"
                         :value="(acc / legalInfo.rate)|numberFixed(2)"></mu-text-field>
          <div class="mb15">
            <p class="tall" style="color:rgba(0,0,0,.54); text-indent:-4px; font-size: 14px; ">
              <span style="display:inline-block; transform: scale(.75);">付款方式</span>
            </p>
            <div class="flex" style="width: 100%;">
              <mu-chip @click="activeway='alipay'" class="demo-chip flex1" :color="activeway==='alipay'?'blue':'gray'">
                <mu-avatar :size="32" color="transparent">
                  <mu-icon value=":icon-umidd17"></mu-icon>
                </mu-avatar>
                支付宝
              </mu-chip>

              <mu-chip @click="activeway='wechat'" class="demo-chip" style="margin: 0 5px;"
                       :color="activeway==='wechat'?'green':'gray'">
                <mu-avatar :size="32" color="transparent">
                  <mu-icon value=":icon-weixinzhifu"></mu-icon>
                </mu-avatar>
                微信支付
              </mu-chip>

              <mu-chip @click="activeway='bank'" class="demo-chip flex1" :color="activeway==='bank'?'red':'gray'">
                <mu-avatar :size="32" color="transparent">
                  <mu-icon value=":icon-yinlian"></mu-icon>
                </mu-avatar>
                银行卡转账
              </mu-chip>

            </div>
          </div>

          <p class="tall hide">
            <i class="currency_title">
              {{ $t('account.a10') }}
            </i></p>
          <input id="picture" @change="uploadFile" ref="uploads" type="file" style="display:none;"></input>
        </div>
        <div style="width: 100%; height: 8px; background: #f5f5f5;"></div>
        <div style="line-height: 50px;">推荐使用银行卡转账，更快，更稳定，更大额</div>
        <div class="currency_title">
          <div style="line-height: 20px;">行情火爆，下单人数过多，商家应接不暇</div>
          <div style="line-height: 20px;">请提前做好够币准备</div>
          <div style="line-height: 20px;">付款成功后，请耐心等待</div>
        </div>
        <div style="padding: 0 20px; width: 100%; position: fixed;bottom: 20px;">
          <mu-button full-width @click="buyLegal"
                     :color="activeway==='wechat'?'green':(activeway==='alipay'?'blue':'red')">
            确定买入
          </mu-button>
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
    <div v-show="showPipei"
         style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; background:rgba(0,0,0,.8)">
      <div style="width: 100%; height: 100%; transition: all 0.45s; display: flex; align-items: center;">
        <img style="width:80%; margin: 0 auto;" v-if="pipeing" src="@/assets/pipei.gif">
        <img style="width:80%; margin: 0 auto;" v-if="!pipeing" src="@/assets/pipei1.gif">
      </div>
    </div>
  </div>
</template>

<script>

import QRCode from 'qrcodejs2'
import Clipboard from "clipboard"

export default {
  name: "BuyUSDT",
  data() {
    return {
      openAlert: false,
      active: 0,
      wallets: [],
      shortNumbers: [1000, 5000, 10000, 20000, 50000],
      qrccode: false,
      acc: '',
      activeway: 'bank',
      amount: '',
      hash: '',
      pic: '',
      select: '',
      selected: '',
      loading: false,
      fullLoading: false,
      legalInfo: {},
      showPipei: false,
      pipeing: true
    }
  },
  watch: {
    active(val) {
      // let url = this.wallets[Object.keys(this.wallets)[val]];
      // this.qrcode(url);
    }
  },
  mounted() {
    this.getWallets()
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
    getWallets() {
      const loading = this.$loading();

      let that = this;
      this.$http({
        url: '/api/legalInfo',
        method: 'get',
        data: {
          currency: 3,
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {

        loading.close();
        if (res.data.type === 'ok') {
          that.legalInfo = res.data.message;
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
        text: url
      })
    },
    buyLegal() {
      let that = this;
      that.pipeing = true;
      if (this.acc < this.legalInfo.min || this.acc > this.legalInfo.max) {
        this.$toast.error("请输入正确的购买金额");
        return;
      }

      if (this.activeway === 'alipay' && (this.legalInfo.alipay.length <= 0 || this.legalInfo.alipayCode.length <= 0)) {
        this.$toast.error("暂不支持支付宝转账");
        return;
      }
      if (this.activeway === 'wechat' && (this.legalInfo.wechat.length <= 0 || this.legalInfo.wechatCode.length <= 0)) {
        this.$toast.error("暂不支持微信支付");
        return;
      }
      if (this.activeway === 'bank' && (this.legalInfo.bankNo.length <= 0 || this.legalInfo.bankName.length <= 0)) {
        this.$toast.error("暂不支持银行卡转账");
        return;
      }

      this.showPipei = true;
      setTimeout(() => {

        that.pipeing = false;

        setTimeout(() => {

          that.showPipei = false;
          that.submit();

        }, 1500);

      }, 3000);


    },
    submit() {
      let that = this;
      const loading = this.$loading();
      this.$http({
        url: '/api/wallet/buy_legal',
        method: 'post',
        data: {
          acc: this.acc,
          rate: this.legalInfo.rate,
          pay_way: this.activeway
        },
        headers: {Authorization: localStorage.getItem('token')}
      }).then(res => {
        loading.close();
        that.openAlert = false;
        if (res.data.type === 'ok') {
          that.$toast.success('下单成功');
          that.$router.push('/Detail?id='+res.data.message);
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

.tabbtd {
  display: inline-block;
  padding: 4px 8px;
  flex: 1;
  border: 1px solid #eee;
  transition: all .45s cubic-bezier(.23, 1, .32, 1);

  border-radius: 5px;

  &.active {
    border-color: #0081cc;
  }
}

.mu-demo-form {
  width: 100%;
  max-width: 460px;
}
</style>