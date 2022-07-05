<template>
  <div>
    <mu-container>
      <mu-appbar v-if="false" style="width: 100%;" color="primary">
<!--        <mu-button icon flat slot="left">-->

<!--        </mu-button>-->
        {{ $t('account.withdraw') }}
        <mu-button @click="$router.back(-1)" icon flat slot="right">
          <mu-icon value=":icon-guanbi"></mu-icon>
        </mu-button>
      </mu-appbar>

      <mu-appbar style="width: 100%;" color="#fff" text-color="#000">
        {{ $t('account.withdraw') }}
        <mu-button @click="$router.back(-1)" icon flat slot="left">
          <mu-icon value=":icon-ziyuan1"></mu-icon>
        </mu-button>
        <mu-button icon flat slot="right">
        </mu-button>
      </mu-appbar>

      <mu-tabs v-if="false" inverse :value.sync="active" center indicator-color="primary" color="primary">
        <mu-tab>BTC</mu-tab>
        <mu-tab>USDT</mu-tab>
      </mu-tabs>
      <div class="flex mb5">
        <div class="flex1"></div>
        <div @click="active=0" class="tabbt" :class="active===0?'active':''">
          BTC
        </div>
        <div @click="active=1" class="tabbt" :class="active===1?'active':''">
          USDT
        </div>
        <div class="flex1"></div>
      </div>
      <div style="padding:0 20px;">
        <mu-text-field style="width: 100%;"
                       :label="$t('dep.ti_num')" :suffix="active===0?'BTC':'USDT'" v-model="wallets.change_balance"
                       readonly=""></mu-text-field>
        <mu-text-field style="width: 100%; margin-bottom: 20px!important;" :help-text="$t('wAddress.nospace')"
                       :label="$t('wAddress.enterAddress')" v-model="address"></mu-text-field>
        <mu-text-field style="width: 100%; margin-bottom: 20px!important;"
                       :help-text="$t('lever.rate')+':'+wallets.rate + (active===0?' BTC':' USDT')"
                       :label="$t('withdrawList.tibiNum')"
                       :suffix="active===0?'BTC':'USDT'" v-model="number">
          <span class="subtitle" slot="append" color="primary" @click="alltixian"
                style="margin-left: 10px; border-left: 1px solid #888; padding-left: 10px;">{{ $t('lever.all') }}
          </span>
        </mu-text-field>
        <div class="currency_title tall" style="line-height: 30px; margin-left: 0;">{{ $t('account.havenum') }}<b style="color:#000">{{
            number - wallets.rate < 0 ? 0 : number - wallets.rate
          }}</b>{{ (active === 0 ? ' BTC' : ' USDT') }}
        </div>
        <mu-button full-width slot="append" @click="openAlert=true" color="primary">{{ $t('account.withdraw') }}
        </mu-button>
        <p class="tall hide">
          <i class="currency_title">
            {{ $t('account.a10') }}
          </i></p>
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

import Clipboard from "clipboard"

export default {
  name: "Withdrawal",
  data() {
    return {
      openAlert: false,
      active: 0,
      wallets: [],
      qrccode: false,
      address: "",
      number: 0,
      pic: '',
      select: '',
      selected: '',
      loading: false,
      currency: 1
    }
  },
  watch: {
    active(val) {
      this.currency = val === 0 ? 1 : 3
      this.number = 0
      this.address = ''
      this.getWallets()
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
    alltixian() {
      this.number = parseFloat(this.wallets.change_balance)
    },
    getWallets() {
      const loading = this.$loading();
      let that = this;
      this.$http({
        url: '/api/wallet/get_info',
        method: 'post',
        data: {
          currency: this.currency,
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        loading.close();
        if (res.data.type === 'ok') {
          that.wallets = res.data.message;
        }
      })
    },
    submit() {
      let that = this;
      const loading = this.$loading();
      this.$http({
        url: '/api/wallet/out',
        method: 'post',
        data: {
          currency: this.active === 0 ? 1 : 3,
          address: this.address,
          number: this.number,
          rate: this.wallets.rate
        },
        headers: {Authorization: localStorage.getItem('token')}
      }).then(res => {
        loading.close();
        that.openAlert = false;
        if (res.data.type === 'ok') {
          that.$toast.success(res.data.message);
          that.address = '';
          that.number = '';
        } else {
          that.$toast.error(res.data.message);
        }
      })
    },
    copy() {
      let that = this;
      let clipboard = new Clipboard('.copy');
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

.mu-demo-form {
  width: 100%;
  max-width: 460px;
}
</style>