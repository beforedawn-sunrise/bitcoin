<template>
  <mu-container class="iepn">
    <mu-appbar style="width: 100%;" color="#fff" text-color="#000">
      订单详情
      <mu-button @click="$router.back(-1)" icon flat slot="left">
        <mu-icon value=":icon-ziyuan1"></mu-icon>
      </mu-button>
      <mu-button icon flat slot="right">
      </mu-button>
    </mu-appbar>
    <mu-stepper :active-step="activeStep">
      <mu-step>
        <mu-step-label>
          匹配商家
        </mu-step-label>
      </mu-step>
      <mu-step>
        <mu-step-label>
          买家付款
        </mu-step-label>
      </mu-step>
      <mu-step>
        <mu-step-label>
          商家确认完成
        </mu-step-label>
      </mu-step>
    </mu-stepper>
    <div v-if="detail.status===0">
      <div style="line-height: 30px;">付款信息</div>
      <div v-if="detail.pay_way==='alipay'||detail.pay_way==='wechat'">
        <img style="width:200px; height: 200px;"
             :src="detail.pay_way==='alipay'?legalInfo.alipayCode:legalInfo.wechatCode">
        <div class="ft14 fColor2">
          {{ detail.pay_way == 'alipay' ? legalInfo.alipay : legalInfo.wechat }} 请使用{{ getPayway(detail.pay_way) }}扫码支付
        </div>
      </div>
      <div v-if="detail.pay_way==='bank'">
        <div class="hh">
          <mu-list>
            <mu-list-item avatar :ripple="false">
              <mu-list-item-action>
                <div style="width: 100%; text-align: right">开户行</div>
              </mu-list-item-action>
              <mu-list-item-title> {{ legalInfo.bankAddress }}
              </mu-list-item-title>
              <mu-list-item-action>
                <a class="copy1" style="color:#2196f3;" :data-clipboard-text="legalInfo.bankAddress"
                   @click="copy('.copy1')">{{ $t('account.copy') }}</a>
              </mu-list-item-action>

            </mu-list-item>
            <mu-list-item avatar :ripple="false">
              <mu-list-item-action>
                <div style="width: 100%; text-align: right">卡号</div>
              </mu-list-item-action>
              <mu-list-item-title> {{ legalInfo.bankNo }}</mu-list-item-title>
              <mu-list-item-action>
                <a class="copy" style="color:#2196f3;" :data-clipboard-text="legalInfo.bankNo"
                   @click="copy('.copy')">{{ $t('account.copy') }}</a>
              </mu-list-item-action>
            </mu-list-item>
            <mu-list-item avatar :ripple="false">
              <mu-list-item-action>
                <div style="width: 100%; text-align: right">开户人</div>
              </mu-list-item-action>
              <mu-list-item-title> {{ legalInfo.bankName }}</mu-list-item-title>
              <mu-list-item-action>
                <a class="copy2" style="color:#2196f3;" :data-clipboard-text="legalInfo.bankName"
                   @click="copy('.copy2')">{{ $t('account.copy') }}</a>
              </mu-list-item-action>

            </mu-list-item>
          </mu-list>
        </div>
      </div>
    </div>

    <div v-if="detail.status===1">
      <div style="line-height: 45px;">付款信息</div>
      已于{{ detail.pay_time }}付款
    </div>

    <div style="height: 5px; background:#f5f5f5; margin: 15px 0;"></div>
    <div style="font-size: 14px; line-height: 36px;" class="fColor2">{{ getStatus(detail.status) }}<span v-if="detail.status===0">，请在30分钟内完成支付</span></div>
    <div v-if="detail.status===0 && time>0" style="line-height: 45px;">
      <span>支付剩余</span> <a style="color:green; font-size: 24px;">{{ time }}</a> 秒
    </div>
    <div v-if="detail.status===0 && time<0">
      订单已超时
    </div>
    <div style="padding: 0 20px" v-if="detail.status===0">
      <mu-text-field v-show="true" readonly="" v-model="pic===''?select:selected" style="width: 100%;"
                     :label="$t('account.picture')">
        <mu-button flat full-width slot="append" color="primary" @click="choosePic">{{ $t('account.choose') }}
        </mu-button>
      </mu-text-field>
      <input id="picture" @change="uploadFile" ref="uploads" type="file" style="display:none;"></input>
    </div>
    <div style="height: 80px;"></div>
    <div v-if="detail.status==0" style="padding: 0 20px; width: 100%; position: fixed;bottom: 60px;">
      <mu-button full-width @click="payed"
                 :color="detail.pay_way==='wechat'?'green':(detail.pay_way==='alipay'?'blue':'red')">
        确定已付款
      </mu-button>
    </div>

    <div v-if="detail.status==0" style="padding: 0 20px; width: 100%; position: fixed;bottom: 20px;">
      <mu-button full-width @click="cancel">
        取消订单
      </mu-button>
    </div>

  </mu-container>

</template>
<script>

import QRCode from 'qrcodejs2'
import Clipboard from "clipboard"
import getUrlKey from "@/lib/getUrlKey";

export default {
  name: "IEPN",
  data() {
    return {
      activeStep: 0,
      id: "",
      url: '',
      pic: '',
      code: '',
      share_url: '',
      select: '未上传',
      selected: '已上传',
      iepn: {},
      detail: {},
      legalInfo: {},
      lang: localStorage.getItem('lang'),
      interval: null,
      time:0,
    }
  },
  mounted() {
    this.getWallets();
    this.getDetail();
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
    getDetail() {
      let id = getUrlKey('id', window.location.href);
      this.id = id;
      var that = this;
      this.$http({
        url: '/api/legal_buy/detail?id=' + id,
        method: 'get',
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        that.detail = res.data.message;
        let time = Date.parse(that.detail.created_at);
        if(that.interval)
        {
          window.clearInterval(that.interval);
        }
        that.interval = setInterval(() => {
          that.time = (((30*60*1000)-((new Date()).valueOf() - time))/1000).toFixed(3);
        },100);
        that.activeStep = that.detail.status + 1;
      })
    },
    getWallets() {

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

        if (res.data.type === 'ok') {
          that.legalInfo = res.data.message;
        }
      })
    },
    cancel() {

      let that = this;

      this.$confirm('确定要取消订单？', '温馨提示', {
        okLabel: '确定',
        cancelLabel: '取消'
      }).then(({result}) => {
        if (result) {

          const loading = that.$loading();

          that.$http({
            url: '/api/legal_buy/cancel',
            method: 'post',
            data: {
              id: that.id,
            },
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => {

            loading.close();
            if (res.data.type === 'ok') {
              that.$toast.success(res.data.message);
            } else {
              that.$toast.error(res.data.message);
            }
          })
        } else {
          // this.$toast.message('点击了取消');
        }
      });


    },
    payed() {

      if (this.pic === '') {
        this.$toast.error('请上传付款截图')
        return;
      }

      let that = this;
      this.$confirm('确定已付款，恶意点击可能会被冻结账户？', '确认已付款', {
        okLabel: '确定',
        cancelLabel: '取消'
      }).then(({result}) => {
        if (result) {

          const loading = that.$loading();
          that.$http({
            url: '/api/legal_buy/payed',
            method: 'post',
            data: {
              id: that.id,
              pic: that.pic
            },
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => {

            loading.close();
            if (res.data.type === 'ok') {
              that.getDetail()
            }
          })

        } else {

        }
      });
    },
    getStatus(status) {
      if (status === -1) {
        return this.$t('c2c.canceled');
      }
      if (status === 0) {
        return '已匹配到商家';
      }
      if (status === 1) {
        return '买家已付款，等待商户确认';
      }
      if (status === 2) {
        return '订单已完成';
      }
    },
    getPayway(status) {
      if (status === 'alipay') {
        return '支付宝';
      }
      if (status === 'wechat') {
        return '支付宝';
      }
      if (status === 'bank') {
        return '银行卡转账'
      }
    },
    gobuy() {
      window.localStorage.setItem('currentCurrency', 'IEPN');
      window.localStorage.setItem('currentCurrencyID', 18);
      this.$router.push('/exchange');
    },
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
    },
    qrcode(url) {
      this.$refs.qrcode.innerHTML = ''
      this.qrccode = new QRCode('qrcode', {
        width: 150,
        height: 150,
        text: url, // 二维码地址
      })
    },
  }
}
</script>
<style lang="scss">
.hh {
  .mu-item-action {
    width: 80px;
    text-align: right !important;

    div {
      padding-right: 10px;
    }
  }

  .mu-item-title {
    text-align: center !important;
  }
}

.iepn {
  height: 100%;
  overflow: auto;

  .echarts {
    width: 340px;
    height: 280px;
    margin: 0 auto;
  }

  .mu-card-media-title {
    background-color: transparent !important;
    text-align: center;

    .mu-card-title, .mu-card-sub-title {
      background-image: linear-gradient(0deg, rgb(93, 53, 176) 2.63158%, rgb(255, 255, 255) 74.5614%) !important;
      background-clip: text !important;
      text-fill-color: transparent !important;
      color: transparent !important;
    }
  }
}
</style>