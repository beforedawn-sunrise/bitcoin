<template>
  <mu-container class="container-my">
    <div class="home">
      <div class="header" style="padding-right: 0;">
        <div style="flex:1;"><h3 style="font-size: 18px;">{{ currency_name }}USDT</h3></div>

        <div>
          <mu-button @click="back" icon>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fanhui2"></use>
            </svg>
          </mu-button>
        </div>
      </div>
      <div class="container-my container" style="overflow:auto;">
        <div class="flex" style="padding: 0 20px; padding-bottom: 10px;">
          <div class="flex flex1 flex-column" style=" text-align: left;">
            <div style="font-size: 24px; font-weight: bold;" :class="change>0?'green':'red'">{{
                nowPrice|numberFixed(5)
              }}
            </div>
            <div>
              <span class="ft12" style="padding:3px 5px; border-radius: 4px; color:#fff;"
                    :style="'background-color:'+(change>0?'#35b65a':'#ff494a')">{{ change }}%</span>
            </div>
          </div>
          <div class=" flex flex-column" style="width: 55%;">
            <div class="flex1 ft12 flex">
              <span class="htitle" style="width: 50%;text-align: left; ">{{ $t('home.high') }}</span>
              <span style="flex:1; text-align: right;">{{ high|numberFixed(5) }}</span>
            </div>
            <div class="flex1 ft12 flex">
              <span class="htitle" style="width: 50%;text-align: left;">{{ $t('home.min') }}</span>
              <span style="flex:1; text-align: right;">{{ low|numberFixed(5) }}</span>
            </div>
            <div class="flex1 ft12 flex">
              <span class="htitle" style="width: 50%;text-align: left;">{{ $t('home.vol') }}</span>
              <span style="flex:1; text-align: right;">{{ vol|numberFixed(5) }}</span>
            </div>
          </div>

        </div>
        <div id="chart-container" style="width: 100%; height: calc(100% - 200px); max-height: 500px;">
          <tv-box></tv-box>
        </div>
        <div style="width:100%; height: 5px; margin:10px 0; " :style="getDayColor('background-color')"></div>
        <div style="height: 60px;">
          <mu-container>
            <div style="line-height: 50px; font-size: 16px; text-align: left; padding-left: 20px;">
              {{ $t('cuy.allStation') }}
            </div>
            <div class="content">
              <ul class="flex">
                <li class="flex1" style="text-align: left">{{ $t('time') }}</li>

                <li class="flex1" style="text-align: center">{{ $t('cuy.direction') }}</li>
                <!-- <li class="fl w12">交易对</li> -->
                <li class="flex1" style="text-align: center">{{ $t('price') }}</li>
                <li class="flex1" style="text-align: right">{{ $t('treadnum') }}</li>
              </ul>
              <div class="containers scroll" v-if="deList.length>0">
                <ul v-for="item in deList" class="list-item fColor1 ft12">
                  <li class="flex" :class="item.direction">
                    <span class="flex1" style="text-align: left">{{ item.time }}</span>
                    <span class="flex1"
                          style="text-align: center">{{
                        item.direction == 'buy' ? $t('center.inbuy') : $t('center.outsell')
                      }}</span>
                    <!-- <span class="fl w12">{{itm.currency_name}} / {{itm.legal_name}}</span> -->
                    <span class="flex1" style="text-align: center">{{ item.price|numberFixed(4) }}</span>
                    <span class="flex1" style="text-align: right">{{ item.amount|numberFixed(6) }}</span>
                  </li>
                </ul>
              </div>
              <!-- <div class="no_data tc" v-if="deList.length<=0">
                  <img src="../assets/images/nodata.png" alt="">
                  <p class="fColor2 ft18">{{$t('nodata')}}</p>
              </div> -->
            </div>
          </mu-container>
        </div>
      </div>
      <div class="footer" style="height: 50px;">
        <div class="flex alcenter">
          <div class="flex1" @click="gotoTrade('in')"
               style="background: green; color: #fff; height: 40px; line-height: 40px; border-radius: 4px; margin:5px;margin-left: 20px;">
            {{ buyText }}
          </div>
          <div class="flex1" @click="gotoTrade('out')"
               style="background: red; color: #fff; height: 40px; line-height: 40px; border-radius: 4px; margin:5px; margin-right: 20px;">
            {{ sellText }}
          </div>
        </div>
      </div>

    </div>
  </mu-container>
</template>

<script>
import tvBox from "@/components/tvBox";
import getUrlKey from '@/lib/getUrlKey';

export default {
  name: "KLine",
  components: {
    tvBox
  },
  data() {
    return {
      currentBar: {},
      candleSeries: {},
      charts: {},
      lastClose: 0,
      lastIndex: 0,
      targetIndex: 0,
      targetPrice: 0,
      currentIndex: 0,
      currentBusinessDay: "",
      ticksInCurrentBar: 0,
      high: 0,
      low: 0,
      open: 0,
      close: 0,
      change: 0,
      vol: 0,
      nowPrice: 0,
      nowChange: 0,
      active1: 0,
      currency_name: '',
      deList: [],
      legal_id: 3,
      currency_id: 0,
      from: 'exchange',
      buyText: '买入',
      sellText: '卖出'
    }
  },
  methods: {
    subscribeMarketDepth() {
      that.sockets.subscribe("market_depth", msg => {
        if (msg.type == "market_depth") {
          // console.log(msg)
          //组件间传值
          // let newPrice = {
          //   newprice: msg.last_price,
          //   newup: msg.proportion,
          //   istoken: msg.token,
          //   yesprice: msg.yesterday,
          //   toprice: msg.today
          // };
          // setTimeout(() => {
          //   eventBus.$emit("toNew01", newPrice);
          // }, 1000);
          // console.log(msg);
          let inData = msg.bids;
          let outData = msg.asks.reverse();
          if (msg.currency_id == currency_id && msg.legal_id == legal_id) {
            let [inlist, outList] = [inData, outData];
            let [max, max1] = [0, 0];
            for (let i in inData) {

              inlist[i].price = inlist[i][0];
              inlist[i].number = inlist[i][1];
              max = inlist[i].number > max ? inlist[i].number : max;

            }

            that.inMaxValue = max;
            that.inlist = inlist;

            for (let i in outList) {
              outList[i].price = outList[i][0];
              outList[i].number = outList[i][1];
              max1 = outList[i].number > max1 ? outList[i].number : max;
              that.sellMaxValue = outList[i].number;

            }
            that.sellMaxValue = max1;
            that.outlist = outList;
          }
        }
      });
    },
    complete() {
      let that = this;
      let url = `/api/currency/new_tradehistory?legal_id=${this.legal_id}&currency_id=${this.currency_id}`;
      this.$http.get(url).then(res => {
        // console.log(res);
        if (res.data.type == "ok") {
          that.deList = res.data.message;
          that.subscribeMarketDetail();
        } else {
          // layer.msg(res.data.message)
        }
      })
          .catch(error => {
            // console.log(error)
          });
    },
    subscribeMarketDetail() {
      let that = this;
      that.$socket.emit("login", localStorage.getItem("user_id"));
      that.sockets.subscribe("market_detail", function (msg) {

        if (msg.type == "market_detail") {

          if (msg.legal_id == that.legal_id && msg.currency_id == that.currency_id) {

            let stayLength = 20;
            msg.data.forEach(x => {
              that.deList.unshift(x);
              if (that.deList.length > stayLength) {
                that.deList.splice(stayLength, that.deList.length - stayLength);
              }
            })
          }

        }
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
    back() {
      let back = getUrlKey('from', location.href);
      let mode = getUrlKey('mode', location.href);
      if (back === 'trade') {
        back = back + '?mode=' + mode;
      }

      this.$router.push('/' + back);
    },
    gotoTrade(way) {

      let back = getUrlKey('from', location.href);
      let mode = getUrlKey('mode', location.href);

      if (back === 'trade') {
        back = back + '?mode=' + mode + '&way=' + way;
      } else {
        back = back + '?way=' + way;
      }

      this.$router.push('/' + back);
    }
  },
  mounted() {
    let that = this;
    this.currency_name = localStorage.getItem('currentCurrency');
    this.currency_id = localStorage.getItem('currentCurrencyID');
    this.from = getUrlKey('from', location.href);

    if (this.from == 'exchange') {

      this.buyText = this.$t('center.inbuy');
      this.sellText = this.$t('center.outsell');
    } else if (this.from == 'trade') {
      if (getUrlKey('mode', window.location.href) === '2') {
        this.buyText = this.$t('miscro.up');
        this.sellText = this.$t('miscro.down');
      } else {

        this.buyText = this.$t('lever.domore');
        this.sellText = this.$t('lever.doshort');
      }
    }
    eventBus.$on('updateDaymarket', obj => {
      // console.log(obj.legal_name);
      // console.log(obj.currency_name === that.currency_name && obj.legal_name === 'USDT');
      if (obj.currency_name === that.currency_name && obj.legal_name === 'USDT') {
        that.open = obj.open;
        that.high = obj.high;
        that.low = obj.low;
        that.close = obj.close;
        that.change = obj.change;
        that.vol = obj.volume
      }
    });
    this.complete();
    eventBus.$on('updateKLine', obj => {
      that.nowPrice = obj.close;
      if (obj.change) {
        that.nowChange = obj.change;
      }
    });
  },
}
</script>

<style lang="scss" scoped>
.htitle {
  color: #999;
}

.footer {
  height: 70px;
}

.content {
  padding: 0 20px;

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
    font-size: 12px;
    line-height: 30px;
  }

  .buy {
    color: green;
  }

  .sell {
    color: red;
  }
}
</style>