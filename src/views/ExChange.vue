<template>
  <mu-container class="container-my">
    <div class="home">
      <div class="header" style="padding-right: 0;">
        <div style="flex:1;"><h3 style="font-size: 18px;">{{ $t('header.currency') }}</h3></div>

        <div>
          <mu-button v-if="false" @click="$router.push('/kline?from=exchange')" icon>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-Kxiantu1"></use>
            </svg>
          </mu-button>
        </div>
      </div>
      <div class="container-my" style="overflow: auto">
        <div class="flex alcenter" style="padding-left: 5px;">
          <mu-button @click="open=!open" icon>
            <mu-icon color="primary" size="24" value=":icon-bizhong"></mu-icon>
          </mu-button>

          <span style="font-size: 16px;">{{ currency_name }}/USDT</span>
          <div class="flex1 talr" style="padding-right: 15px;">
            <mu-button @click="$router.push('/kline?from=exchange')" icon>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-Kxiantu1"></use>
              </svg>
            </mu-button>
          </div>
          <mu-drawer width="80%" :open.sync="open" :docked="docked" :right="position === 'right'">
            <h4>USDT</h4>
            <mu-list>
              <mu-container v-for="item in quotationsList">
                <mu-list-item button @click="changeCurrency(item.currency_name,item.currency_id)">
                  <mu-list-item-action>
                    <mu-avatar size="20">
                      <img :src="item.logo">
                    </mu-avatar>
                  </mu-list-item-action>
                  <mu-list-item-title>
                    <mu-flex class="flex-wrapper" align-items="center">
                      <mu-flex class="flex-demo" style="width: 20%;" justify-content="start">{{
                          item.currency_name
                        }}
                      </mu-flex>
                      <mu-flex class="flex-demo" style="width: 30%;" justify-content="center"><span
                          style="font-size: 14px;" :class="item.change>0?'green':'red'">{{ item.change }}%</span>
                      </mu-flex>
                      <mu-flex class="flex-demo" justify-content="center" fill><span
                          style="font-size: 14px;">{{ item.now_price|numberFixed }}</span></mu-flex>
                    </mu-flex>
                  </mu-list-item-title>
                </mu-list-item>
                <mu-divider shallow-inset/>
              </mu-container>
            </mu-list>
          </mu-drawer>
        </div>
        <div class="flex" style="padding:0 20px;">
          <div class="flex column" style="max-width: 50%;">
            <div class="flex">
              <div class="flex1" style="padding: 0 20px;">
                <mu-button class="bold" @click="tradeMode='buy'" flat :color="tradeMode==='buy'?'success':'normal'"
                           style="width: 50%; min-width: 20px;">{{ $t('td.buyin') }}
                </mu-button>
                <mu-button class="bold"  @click="tradeMode='sell'" flat :color="tradeMode==='sell'?'error':'normal'"
                           style="width: 50%; min-width: 20px;">{{ $t('td.sellout') }}
                </mu-button>
              </div>
            </div>
            <div>
              <div class="flex all">
                <mu-select :color="tradeMode==='buy'?'success':'error'" :label="$t('miscro.mode')" v-model="priceMode"
                           full-width>
                  <mu-option v-for="(option,index) in options" :key="index" :label="option.label"
                             :value="option.value"></mu-option>
                </mu-select>
              </div>
              <div class="flex all">
                <mu-text-field :type="priceMode==='shijia'?'text':'number'"
                               v-model="priceMode==='shijia'?bestPrice:price" :readonly="priceMode==='shijia'"
                               :color="tradeMode==='buy'?'success':'error'" help-text=""
                               suffix="USDT" :label="$t('cuy.price')"></mu-text-field>
              </div>
              <div class="flex all">
                <mu-text-field :label="$t('td.num')" v-model="number" :color="tradeMode==='buy'?'success':'error'"
                               type="number"
                               :suffix="currency_name"></mu-text-field>
              </div>
              <mu-slider v-model="sliderValue" @change="sliderChange" :color="tradeMode==='buy'?'success':'error'"
                         :display-value="false" style="margin-bottom: 10px;"></mu-slider>
              <div>
                <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
                  <div class="subtitle" style="color:rgba(0,0,0,.54)">{{ $t('center.available') }}</div>
                  <div class="flex1 talr currency_title">{{
                      tradeMode === 'buy' ? (Number(user_legal).toFixed(2)) : (Number(user_currency).toFixed(6))
                    }}<span class="currency_title">{{ tradeMode === 'buy' ? 'USDT' : currency_name }}</span>
                  </div>
                </div>

              </div>
<!--              <mu-divider></mu-divider>-->
              <div>
                <div class="left flex alcenter" style="text-align: left">
                  <div class="subtitle nowrap">{{ $t('center.tradetotal') }}</div>
                  <div class="flex1 talr nowrap currency_title">{{ amount }}<i class="currency_title">USDT</i></div>
                </div>
                <mu-button @click="buyCoin" class="mt10" :color="tradeMode==='buy'?'success':'error'" full-width>
                  {{ tradeMode == 'buy' ? $t('td.buyin') : $t('td.sellout') }}{{ currency_name }}
                </mu-button>
              </div>
            </div>
          </div>
          <div class="flex flex-column" style="min-width: 50%;">
            <div class="line green talc" style="line-height: 38px;">
              <span style="font-size: 16px;">{{ newData|numberFixed(4) }}</span> <span
                style="font-size: 12px; color:#a7a7a7;"><i class="currency_title">USDT</i></span>
            </div>
            <div class="flex ft12" style="line-height: 30px; text-indent: 12px; color: #666;">
              <div class="flex1">{{ $t('cuy.price') }}</div>
              <div class="flex1">{{ $t('footer.num') }}</div>
            </div>
            <div class="flex flex1">
              <ul class="list-item ft12 tc">
                <li class="curPer red" v-for="(out,index) in outList" v-if="index<6" :key="out.id">
                  <span>{{ out[0] | numberFixed }}</span>
                  <span>{{ out[1] | numberFixed }}</span>
                  <span class="info-shadow selli" :style="{width:(((out[1]/sellMaxValue-0)*100))+'%'}"></span>
                </li>
                <mu-divider inset color="rgba(0,0,0,.3)" style="margin:8px 0;"></mu-divider>
                <li class="curPer green" v-for="(buy,index) in inList" v-if="index<6" :key="index">
                  <span>{{ buy[0] | numberFixed }}</span>
                  <span>{{ buy[1] | numberFixed }}</span>
                  <span class="info-shadow" :style="{width:(buy[1]/inMaxValue-0)*100+'%'}"></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style="width:100%; height: 5px; margin:10px 0; " :style="getDayColor('background-color')"></div>

        <div style="padding:20px; padding-top: 0;">

          <mu-container>
            <mu-tabs class="bold" :value.sync="active1" inverse color="primary" indicator-color="white" left>
              <mu-tab>{{ $t('header.current') }}</mu-tab>
              <mu-tab>{{ $t('header.his') }}</mu-tab>
            </mu-tabs>
            <div class="demo-text" v-if="active1 === 0">
              <div style="margin:10px;" v-for="item in dealIn">
                <div class="flex alcenter">
                <span class="flex1" style="text-align: left">
                  <span class="bold" :class="item.direction==='buy'?'green':'red'"
                        style="font-size: 14px;">{{ item.direction === 'buy' ? $t('td.buy') : $t('td.sell') }}</span> <i
                    class="subtitle" style="font-style: normal;">{{ item.create_time }}</i>
                  </span>
                  <span>
                <mu-button small @click="cancel(item.id,item.direction)"
                           :color="item.direction==='buy'?'success':'error'">
                  {{ $t('lever.revoke') }}</mu-button>
              </span>
                </div>
                <div class="flex mt5">
                  <div class="tall" style="width: 33%">
                    <div class="subtitle">
                      {{ $t('td.price') }}[{{ item.legal_name }}]
                    </div>
                    <div class="subb">
                      {{ item.price|numberFixed(2) }}
                    </div>
                  </div>
                  <div class="talc" style="width: 33%">
                    <div class="subtitle">
                      {{ $t('td.num') }}[{{ item.currency_name }}]
                    </div>
                    <div class="subb">
                      {{ item.number }}
                    </div>
                  </div>
                  <div class="talr" style="width: 33%">
                    <div class="subtitle">
                      {{ $t('lever.dealed') }}[{{ item.currency_name }}]
                    </div>
                    <div class="subb">
                      -
                    </div>
                  </div>
                </div>
                <mu-divider></mu-divider>
              </div>
              <div class="mt20" v-if="dealIn.length<=0">
                <svg color="gray" class="icon" font-size="40px" aria-hidden="true">
                  <use xlink:href="#icon-empty1"></use>
                </svg>
                <p class="subtitle">{{ $t('tpc.nodata') }}</p>
              </div>
            </div>
            <div class="demo-text" v-if="active1 === 1">
              <div style="margin:10px;" v-for="item in dealCompleted">
                <div class="flex alcenter">
                <span class="flex1" style="text-align: left">
                  <span class="bold" :class="item.direction==='buy'?'green':'red'"
                        style="font-size: 14px;">{{ item.direction === 'buy' ? $t('td.buy') : $t('td.sell') }}</span> <i
                    class="subtitle" style="font-style: normal;">{{ item.time }}</i>
                  </span>
                  <span>
                  </span>
                </div>
                <div class="flex mt5">
                  <div class="tall" style="width: 33%">
                    <div class="subtitle">
                      {{ $t('td.price') }}[{{ item.legal_name }}]
                    </div>
                    <div class="subb">
                      {{ item.price|numberFixed(2) }}
                    </div>
                  </div>
                  <div class="talc" style="width: 33%">
                    <div class="subtitle">
                      {{ $t('td.num') }}[{{ item.currency_name }}]
                    </div>
                    <div class="subb">
                      {{ item.number }}
                    </div>
                  </div>
                  <div class="talr" style="width: 33%">
                    <div class="subtitle">
                      {{ $t('lever.dealed') }}[{{ item.currency_name }}]
                    </div>
                    <div class="subb">
                      {{ item.number }}
                    </div>
                  </div>
                </div>
                <mu-divider></mu-divider>
              </div>
              <div class="mt20" v-if="dealCompleted.length<=0">
                <svg color="gray" class="icon" font-size="40px" aria-hidden="true">
                  <use xlink:href="#icon-empty1"></use>
                </svg>
                <p class="subtitle">{{ $t('tpc.nodata') }}</p>
              </div>
            </div>
          </mu-container>

        </div>

      </div>
      <div class="footer">
        <Footer active="exchange"></Footer>
      </div>
    </div>
    <mu-dialog :title="$t('lay.revoke')" width="600" max-width="80%" :esc-press-close="false"
               :overlay-close="false" :open.sync="openAlert">
      {{ $t('lay.revoke') }}
      <mu-button slot="actions" flat color="primary" @click="openAlert=false">{{ $t('lay.ceil') }}</mu-button>
      <mu-button slot="actions" flat color="primary" @click="revoke(dotype,doid)">{{ $t('lay.sure') }}</mu-button>
    </mu-dialog>

    <mu-dialog :title="$t('lay.confirm')" width="600" max-width="80%" :esc-press-close="false"
               :overlay-close="false" :open.sync="openConfirm">
      <div >
        <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
          <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('cuy.price') }}</div>
          <div class="flex1 talr nowrap currency_title">{{
              (Number(price).toFixed(2))
            }}<i class="currency_title">USDT</i>
          </div>
        </div>
        <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
          <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('lever.contractVal') }}</div>
          <div class="flex1 talr nowrap currency_title">{{
              Number(amount).toFixed(2)
            }}<i class="currency_title">USDT</i>
          </div>
        </div>
      </div>
      <mu-button slot="actions" flat color="primary" @click="openConfirm=false">{{ $t('lay.ceil') }}</mu-button>
      <mu-button slot="actions" flat  :color="tradeMode === 'buy'?'green':'red'" @click="submit">{{
          tradeMode === 'buy' ? $t('td.buyin') : $t('td.sellout')
        }}
      </mu-button>
    </mu-dialog>

  </mu-container>
</template>

<script>

import Footer from "@/components/Footer";
import getUrlKey from '@/lib/getUrlKey';

export default {
  name: "ExChange",
  data() {
    return {
      docked: false,
      open: false,
      openTradeMode: false,
      position: 'left',
      quotationsList: [],
      options: [],
      tradeMode: 'buy',
      priceMode: 'shijia',
      sliderValue: 0,
      price: 0,
      number: 0,
      inMaxValue: 0,
      inList: [],
      sellMaxValue: 0,
      outList: [],
      newData: 0,
      active1: 0,
      currency_id: 0,
      legal_id: 3,
      currency_name: '',
      user_currency: 0,
      user_legal: 0,
      amount: 0,
      bestPrice: this.$t('lever.bestprice'),
      newDataOut: 0,
      cpage: 1,
      ctotal: 1,
      hpage: 1,
      htotal: 1,
      dealIn: [],
      dealOut: [],
      dealCompleted: [],
      openAlert: false,
      dotype: '',
      doid: '',
      openConfirm:false

    }
  },
  components: {
    Footer
  },
  mounted() {
    if (getUrlKey('way', window.location.href) === 'out') {
      this.tradeMode = 'sell';
    } else {
      this.tradeMode = 'buy';
    }
    this.init();
  },
  watch: {
    priceMode(val) {
      this.price = this.tradeMode === 'buy' ? this.newData : this.newDataOut;
    },
    tradeMode(val) {
      this.price = this.tradeMode === 'buy' ? this.newData : this.newDataOut;
    },
    number(val) {
      this.amount = (this.price * this.number).toFixed(2);
    },
    price(val) {
      this.amount = (this.price * this.number).toFixed(2);
    }
  },
  methods: {
    init() {
      let that = this;
      if (!window.localStorage.getItem('currentCurrency')) {
        window.localStorage.setItem('currentCurrency', 'BTC');
        window.localStorage.setItem('currentCurrencyID', 1);
      }

      this.options = [{label: this.$t('center.shi'), value: 'shijia'}, {
        value: 'xianjia',
        label: this.$t('center.xian')
      }];

      this.currency_id = window.localStorage.getItem('currentCurrencyID');
      this.currency_name = window.localStorage.getItem("currentCurrency");
      this.subScribeMarket();
      this.buy_sell(3, this.currency_id, false);
      this.getData();

    },
    sliderChange(val) {
      if (this.tradeMode === 'buy') {
        this.number = ((this.user_legal / this.price) * (val / 100)).toFixed(5);
      } else {
        this.number = (this.user_currency * (val / 100)).toFixed(5);
      }
    },
    buyCoin() {
      let that = this;

      that.openConfirm=true;

      // this.$confirm(this.$t('lay.confirm'), this.$t('auth2.reminder'), {
      //   type: 'info',
      //   okLabel:this.$t('lay.sure'),
      //   cancelLabel:this.$t('lay.ceil')
      // }).then(({result}) => {
      //   if (result) {
      //     that.submit()
      //   } else {
      //   }
      // });
    },
    submit() {
      let that = this;
      if (!this.price || this.price <= 0) {
        this.$toast.warning(this.$t(this.tradeMode === 'buy' ? 'lay.inprice' : 'lay.outprice'));
        return;
      }
      if (!this.number || this.number <= 0) {
        this.$toast.warning(this.$t(this.tradeMode === 'buy' ? 'lay.innumber' : 'lay.outnumber'));
        return;
      }
      this.$http({
        url: "/api/transaction/" + (this.tradeMode === 'buy' ? 'in' : 'out'),
        method: "post",
        data: {
          legal_id: this.legal_id,
          currency_id: this.currency_id,
          price: this.price,
          num: this.number,
          mode: this.priceMode === 'xianjia' ? 2 : 1
        },
        headers: {Authorization: localStorage.getItem("token")}
      }).then(res => {
        that.openConfirm=false;
        if (res.data.type == "ok") {
          that.$toast.success(res.data.message);
          that.price = 0;
          that.number = 0;
          that.sliderValue = 0;
          that.buy_sell(that.legal_id, that.currency_id)
          eventBus.$emit("buyTrade", "tradebuy");
          eventBus.$emit("tocel", "updata");
          that.getData();
          that.buy_sell(3, that.currency_id, false)
          // that.flushUserAmount();
        } else {
          that.$toast.warning(res.data.message);
        }
      }).catch(error => {
        that.openConfirm=false;
        console.log(error);
      });
    },
    buy_sell(legal_id, currency_id, update) {
      let that = this;
      this.$http({
        url: "/api/transaction/deal",
        method: "post",
        data: {
          legal_id: legal_id,
          currency_id: currency_id
        },
        headers: {Authorization: localStorage.getItem("token")}
      }).then(res => {

        if (res.data.type == "ok") {
          that.user_currency = res.data.message.user_currency;
          that.user_legal = res.data.message.user_legal;
          that.cny_price = res.data.message.cny_price;
          if (update) {
          } else {
            that.price = 0;
            that.number = 0;
          }
        } else {
          that.$toast.info(res.data.message);
        }
      }).catch(error => {
        // console.log(error)
      });
    },
    getDayColor(attr) {
      // let key = attr+"-color";
      // return {
      //   key:localStorage.getItem('mode') === 'day' ? '#eee' : '#000'
      // };
      let obj = {};
      obj[attr] = localStorage.getItem('mode') === 'day' ? '#eee' : '#39393a';
      return obj;
    },
    subScribeMarket() {

      let that = this;


      this.$http({
        url: "/api/" + "currency/quotation_new",
        method: "get",
        data: {}
      }).then(res => {
        if (res.data.type === "ok") {


          let arr = [];
          for (let i = 0; i < res.data.message.length; i++) {
            for (let j = 0; j < res.data.message[i].quotation.length; j++) {
              arr.push(res.data.message[i].quotation[j]);
              if (res.data.message[i].quotation[j].currency_name === that.currency_name) {
                that.currency_id = res.data.message[i].quotation[j].currency_id;
              }
            }
          }
          that.subScribeDepth();
          that.quotationsList = arr;

          that.sockets.subscribe('daymarket', msg => {
            if (msg.type == 'daymarket') {

              for (let i = 0; i < that.quotationsList.length; i++) {
                if (that.quotationsList[i].legal_id === msg.legal_id && that.quotationsList[i].currency_id === msg.currency_id) {
                  that.quotationsList[i].now_price = msg.now_price;
                  that.quotationsList[i].change = msg.change;
                  that.quotationsList[i].volume = msg.volume;
                  that.quotationsList[i].high = msg.high;
                  that.quotationsList[i].low = msg.low;
                }
              }
            }
          });

        }

      }).catch(error => {
      });


    },
    subScribeDepth() {


      let that = this;
      that.sockets.subscribe("market_depth", msg => {
        if (msg.type == "market_depth") {

          // console.log(msg);
          let inData = msg.bids;
          let outData = msg.asks.reverse();
          if (msg.currency_id === that.currency_id && msg.legal_id === 3) {
            // console.log(msg);
            let [inlist, outList] = [inData, outData];
            let [max, max1] = [0, 0];
            for (let i in inData) {
              // console.log(that.inMaxValue, inData[i], '变更');

              inlist[i].price = inlist[i][0];
              inlist[i].number = inlist[i][1];
              max = inlist[i].number > max ? inlist[i].number : max;

            }

            that.inMaxValue = max;
            that.inList = inlist;

            for (let i in outList) {
              outList[i].price = outList[i][0];
              outList[i].number = outList[i][1];
              max1 = outList[i].number > max1 ? outList[i].number : max1;
              // that.sellMaxValue = outList[i].number;

            }

            that.newData = inlist[0].price;
            that.newDataOut = outList[0].price;
            if (that.price == 0) {
              if (that.tradeMode === 'buy') {
                that.price = that.newData;
              } else {
                that.price = that.newDataOut;
              }
            }
            that.sellMaxValue = max1;
            that.outList = outList;
          }
        }
      });
    },
    changeCurrency(currency_name, currency_id) {
      window.localStorage.setItem('currentCurrency', currency_name);
      window.localStorage.setItem('currentCurrencyID', currency_id);
      this.open = false;
      this.currency_name = currency_name;
      this.currency_id = currency_id;
      this.buy_sell(3, this.currency_id, false);
      this.getData();
      // this.init();
    },
    getData() {

      let that = this;
      this.$http({
        url: "/api/transaction_in",
        method: "post",
        data: {
          page: this.cpage,
          limit: 100,
          currency_id: this.currency_id
        },
        headers: {Authorization: localStorage.getItem("token")}
      }).then(res => {
        if (res.data.type === 'ok') {
          let list = res.data.message.list;
          list.forEach(x => {
            x.direction = 'buy';
          })
          that.$http({
            url: "/api/transaction_out",
            method: "post",
            data: {
              page: that.cpage,
              limit: 100,
              currency_id: that.currency_id
            },
            headers: {Authorization: localStorage.getItem("token")}
          }).then(res1 => {
            if (res1.data.type === 'ok') {
              res1.data.message.list.forEach(x => {
                x.direction = 'sell';
                list.push(x);
              });
              list.sort((x, y) => {
                return Date.parse(y.create_time) - Date.parse(x.create_time)
              })
              console.log(list);
              that.dealIn = list;
            }
          })
        }
      });

      that.$http({
        url: "/api/transaction_complete",
        method: "post",
        data: {
          page: that.cpage,
          limit: 100,
          currency_id: that.currency_id
        },
        headers: {Authorization: localStorage.getItem("token")}
      }).then(res => {
        if (res.data.type === 'ok') {
          let list = res.data.message.list;
          list.forEach(x => {
            x.direction = x.way == 1 ? 'sell' : 'buy'
          })
          list.sort((x, y) => {
            return y.create_time - x.create_time
          })
          that.dealCompleted = list;
        }
      })


    },
    cancel(type, id) {
      this.doid = id;
      this.dotype = type;
      this.openAlert = true;
    },
    revoke(id, type) {

      let that = this;
      type = type === 'buy' ? 'in' : 'out';

      that.$http({
        url: "/api/" + "transaction_del",
        method: "post",
        data: {
          id: id,
          type: type
        },
        headers: {Authorization: localStorage.getItem('token')}
      }).then(res => {
        if (res.data.type == "ok") {

          eventBus.$emit("tocel", "celbuy");
          that.getData();
          that.buy_sell(3, that.currency_id, false);
          that.openAlert = false;
          that.$toast.success(res.data.message);
        } else {
          that.$toast.warning(res.message);
        }
      }).catch(error => {
        console.log(error);
      });

    },
  },
}
</script>

<style lang="scss">
.button-wrapper {
  text-align: center;

  .mu-button {
    margin: 8px;
    vertical-align: top;
  }
}

.mu-flat-button .mu-button-wrapper {
  padding: 0 !important;
}

.subtitle {
  font-size: 12px;
  color: rgba(0, 0, 0, .54);
}

.subb {
  font-size: 14px;
  line-height: 30px;
}

.tall {
  text-align: left;
}

.talr {
  text-align: right;
}

.talc {
  text-align: center;
}

.mu-raised-button {
  box-shadow: none !important;
}

.mu-item-action {
  min-width: 36px !important;
}

.mu-input {
  font-size: 14px !important;
  margin-bottom: 0 !important;
}
</style>
<style lang="scss">
.flex-demo {
  width: 33%;
}

.list-item {
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 12px;

  li {
    margin: 0;
    padding: 0;
    list-style: none;
    flex: 1;
    display: flex;
    flex-direction: row;
    position: relative;
    align-items: center;

    span:first-child {
      width: 50%;
    }

    span:nth-child(2) {
      width: 50%;
    }

    .info-shadow {
      height: 100%;
      background: rgba(53, 182, 90, .3);
      position: absolute;
      top: 0;
      right: 0;
      z-index: 0;
      transition: 0.2s;
      min-width: 10%;
    }

    .info-shadow.selli {
      height: 100%;
      background: rgba(255, 73, 74, .3);
      position: absolute;
      top: 0;
      right: 0;
      z-index: 0;
    }
  }
}
</style>