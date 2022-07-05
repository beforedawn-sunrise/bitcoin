<template>
  <div style="height: 100%;">
    <mu-container>
      <mu-appbar v-if="false" style="width: 100%;" color="primary">
<!--        <mu-button icon flat slot="left">-->

<!--        </mu-button>-->
        {{ $t('account.transfer') }}
        <mu-button @click="$router.back(-1)" icon flat slot="right">
          <mu-icon value=":icon-guanbi"></mu-icon>
        </mu-button>
      </mu-appbar>

      <mu-appbar style="width: 100%;" color="#fff" text-color="#000">
        {{ $t('account.transfer') }}
        <mu-button @click="$router.back(-1)" icon flat slot="left">
          <mu-icon value=":icon-ziyuan1"></mu-icon>
        </mu-button>
        <mu-button icon flat slot="right">
        </mu-button>
      </mu-appbar>

      <div style="padding:20px;">
        <mu-select :label="$t('account.choosecoin')" full-width v-model="coinIndex">
          <mu-option
              v-for="(coin,index) in coins"
              :key="index"
              :label="coin.currency_name"
              :value="index">
          </mu-option>
        </mu-select>

        <mu-select :label="$t('from')" full-width v-model="value1" @change="selectOne"
                   :placeholder="$t('transfer.select')">
          <mu-option
              v-for="(item,index) in accountList"
              :key="index"
              :label="item.texts"
              :value="item.type">
          </mu-option>
        </mu-select>

        <mu-select :label="$t('to')" full-width v-model="value2" @change="selectOne"
                   :placeholder="$t('transfer.select')">
          <mu-option
              v-for="(item,index) in accountList"
              :key="index"
              :label="item.texts"
              :value="item.type">
          </mu-option>
        </mu-select>

        <mu-text-field full-width :suffix="coins[coinIndex].currency_name"
                       :label="$t('account.huanum')" v-model="number">
           <span class="subtitle" slot="append" color="primary" @click="number = transferBalance"
                 style="margin-left: 10px; border-left: 1px solid #888; padding-left: 10px;">{{ $t('lever.all') }}
          </span>
        </mu-text-field>

        <div class="flex ft14">{{ $t('center.available') }}：<span class="green">{{ transferBalance }}</span></div>

        <mu-button  @click="transfer" style="margin-top: 10px" full-width slot="append" color="primary">{{
            $t('account.transfer')
          }}
        </mu-button>

      </div>
    </mu-container>
  </div>
</template>

<script>

let loadedCoin = false;
let loadCurrency = false;
export default {
  name: "Transfer",
  data() {
    return {
      token: "",
      selectedCoin: {name: "", id: ""},
      coins: [],
      coinIndex: '',
      types: [this.$t('usercenter.lever'), this.$t('usercenter.change')],
      number: '',
      selectedFrom: '合约账户',
      selectedTo: '资产账户',
      currencyList: [],
      accountList: [],
      value1: "change",
      value2: "lever",
      transferBalance: 0
    }
  },
  mounted() {
    this.getCoins();
    this.initCurrencyList();
  },
  watch: {
    value1: {
      handler(newVal) {
        if (loadedCoin)
          this.computeBalance();
      },
      deep: true,
      immediate: false
    },
    value2: {
      handler(newVal) {
        // this.computeBalance();
      },
      deep: true,
      immediate: false
    },
    coinIndex: {
      handler(newVal) {
        if (loadCurrency)
          this.computeBalance();
      },
      deep: true,
      immediate: false
    },

  },
  methods: {
    getCoins() {
      let that = this;
      this.token = window.localStorage.getItem("token") || "";
      this.$http({
        url: "/api/wallet/list",
        method: "post",
        headers: {Authorization: this.token}
      }).then(res => {
        if (res.data.type == "ok") {
          let [lever_balance, micro_balance, change_balance, lever_wallet, micro_wallet, legal_wallet, change_wallet] = [
            {},
            {},
            {},
            res.data.message.lever_wallet,
            res.data.message.micro_wallet,
            res.data.message.legal_wallet,
            res.data.message.change_wallet
          ];

          lever_wallet.balance.forEach(x => {
            lever_balance[x.currency_name] = x.lever_balance;
          });

          micro_wallet.balance.forEach(x => {
            micro_balance[x.currency_name] = x.micro_balance;
          });

          change_wallet.balance.forEach(x => {
            change_balance[x.currency_name] = x.change_balance;
          });


          let coins = legal_wallet.balance;
          for (let i = coins.length - 1; i >= 0; i--) {
            let item = coins[i];
            coins[i].lever_balance = lever_balance[item.currency_name];
            coins[i].micro_balance = micro_balance[item.currency_name];
            coins[i].change_balance = change_balance[item.currency_name];
          }
          that.coins = coins;
          that.coinIndex = 0;
          setTimeout(() => {

            that.value1 = "change";
            that.value2 = "lever";
          }, 100);


          loadedCoin = true;

        }
      });
    },
    transfer() {
      let that = this;
      if (this.number == '') {
        this.$toast.warning(this.$t('account.huanum'));
        return;
      } else {
        let data = {};
        data.number = this.number;

        let baseCoin = this.coins[this.coinIndex];

        data.from_field = this.value1;
        data.to_field = this.value2;

        if(data.from_field===data.to_field)
        {
          this.$toast.error(this.$t('transfer.same'))
          return;
        }


        data.currency_id = this.coins[this.coinIndex].currency;

        const loading = this.$loading();

        this.$http({
          url: '/api/wallet/change',
          method: 'post',
          data: data,
          headers: {'Authorization': localStorage.getItem('token')}
        }).then(res => {

          loading.close();
          if (res.data.type == 'ok') {
            that.$toast.success(that.$t('transfer.ok'));
            setTimeout(() => {
              that.getCoins();
              that.initCurrencyList();
            }, 1000);
          } else {
            that.$toast.error(res.data.message);
          }
        })
      }
    },
    initCurrencyList() {
      let token = localStorage.getItem('token')
      let that = this;
      this.$http({
        url: "/api/" + "currency/user_currency_list",
        method: "get",
        data: {},
        headers: {Authorization: token}
      }).then(res => {
        if (res.data.type == "ok") {
          var datas = res.data.message;
          if (datas.length > 0) {
            var arr = [];
            for (var i = 0; i < datas.length; i++) {
              var nums =
                  datas[i].is_legal - 0 +
                  (datas[i].is_lever - 0) +
                  (datas[i].is_match - 0) +
                  (datas[i].is_micro - 0);
              if (nums > 1) {
                arr.push(datas[i]);
              }
            }

            console.log(arr);

            var arr2 = [];
            if (arr[0].is_legal == 1) {
              var obj = {
                type: "legal",
                texts: that.$t("account.laccount")
              };
              arr2.push(obj);
            }

            if (arr[0].is_micro == 1) {
              var obj = {
                type: "micro",
                texts: that.$t("account.letransaction")
              };
              arr2.push(obj);
            }
            if (arr[0].is_lever == 1) {
              var obj = {
                type: "lever",
                texts: that.$t("account.taccount")
              };
              arr2.push(obj);
            }

            if (arr[0].is_match == 1) {
              var obj = {
                type: "change",
                texts: that.$t("usercenter.change")
              };
              arr2.push(obj);
            }

            that.accountList = arr2;
            that.currencyList = arr;

            console.log('账户列表', arr2, arr)

            that.value1 = arr2[0].texts;
            that.value2 = arr2[1].texts;
            if (arr2[0].type == "lever") {
              that.transferBalance = arr[0].wallet.lever_balance;
            } else if (arr2[0].type == "micro") {
              that.transferBalance = arr[0].wallet.micro_balance;
            } else if (arr2[0].type == "change") {
              that.transferBalance = arr[0].wallet.change_balance;
            } else if (arr2[0].type == "legal") {
              that.transferBalance = arr[0].wallet.legal_balance;
            }

            loadCurrency = true;
          }
        } else {
          return;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    selectOne(command) {
    },
    selectTwo(command) {
    },
    computeBalance() {
      if (loadedCoin && loadCurrency) {
        let baseCoin = this.coins[this.coinIndex];
        if (!baseCoin) {
          return;
        }
        this.number = '';
        switch (this.value1) {
          case 'legal':
            //法币
            this.transferBalance = baseCoin.legal_balance;
            break;
          case 'micro':
            //秒合约
            this.transferBalance = baseCoin.micro_balance;
            break;
          case 'lever':
            //合约
            this.transferBalance = baseCoin.lever_balance;
            break;
          case 'change':
            this.transferBalance = baseCoin.change_balance;
            break;
        }
      }
    },
    changeCoin(e) {
      this.coinIndex = e;
    },
  }
}
</script>

<style scoped>

</style>