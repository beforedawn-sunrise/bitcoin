<template>
  <!--  <mu-load-more @refresh="refresh"  :refreshing="refreshing" :loading="loading" @load="load">-->
  <mu-container data-mu-loading-color="primary" style="height: 100%; overflow: auto" v-loading="loadingall"
                data-mu-loading-overlay-color="rgba(255, 255,255, .9)"
                class="demo-loading-wrap">
    <div class="wrap">
      <div>

        <!--轮播图开始-->
        <swiper style="min-height: 100px;" :options="swiperOption">
          <swiper-slide v-for="slide in banners" style="padding: 0 20px;">
            <img :src="slide.pic" style="width: 100%; border-radius: 5px; height: auto;">
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <!--轮播图-->
        <!--公告开始-->
        <div
            style="height: 40px; padding: 0 15px; overflow: hidden; display: flex;
            flex-direction: row;align-items: center; margin:15px 20px; margin-top:9px;  border-radius:20px;"
            :style="{'background-color':mode == 'day'?'#f4f4f4':'#39393a'}">
          <div style="line-height: 40px; display: flex; flex-direction: row; align-items: center;">
            <svg class="icon" style="font-size: 18px; " aria-hidden="true">
              <use xlink:href="#icon-gonggao3"></use>
            </svg>
          </div>
          <div @click="$router.push('/notice')" style="height: 40px; flex: 1; overflow:hidden;">
            <div class="textBox">
              <transition name="slide">
                <p class="text flex" style="padding: 0 10px; line-height: 42px; " :key="text.id"><span
                    style="flex:1; height: 40px;display: block; overflow:hidden; text-align: left; text-overflow:ellipsis;white-space:nowrap">{{
                    text.val.title
                  }}</span>
                  <span>{{ text.val.create_time }}</span></p>

              </transition>
            </div>
          </div>
          <div @click="$router.push('/notice')" style="line-height: 40px; display: flex; align-items: center;">
            <svg class="icon" style="font-size: 24px; " aria-hidden="true">
              <use xlink:href="#icon-gengduo"></use>
            </svg>
          </div>
        </div>
        <!--end公告-->
        <!--快捷方式-->
        <div class=" flex pb10">
          <div style="flex:1;" v-for="(item1,index) in quotationsListPrice"
               v-if="index<3">
            <span style="font-size: 14px; font-weight: bold;">{{ item1.currency_name }}/{{ item1.legal_name }}</span>
            <br/>
            <span style="font-weight: bold; font-size: 16px;" :class="item1.change>0?'green':'red'">{{
                item1.now_price
              }}</span>
            <br/>
            <span :class="item1.change>0?'green':'red'">{{ item1.change }}%</span>
            <br/>
            <span class="bold" style="font-size: 10px;color: rgb(170, 170, 170);">Vol {{ item1.volume / 1000|numberFixed(2) }} K</span>
          </div>
        </div>
        <!--快捷方式结束-->

      </div>

      <div style="width:100%; height: 5px;" :style="getDayColor('background-color')"></div>
      <div class="inner-menu flex" :style="getDayColor('border-color')" style="border-width: 0px;">

      <!-- 使用v-for 4個重複的組件-->
      <div @click="$router.push('/'+item.link)" class="flex-column" v-for="item in shorts" justify-content="center">
          <mu-ripple>
            <div class="pt5">
              <div class="icon-container">
                <svg class="icon" style="font-size: 18px; " aria-hidden="true">
                  <use :xlink:href="'#'+ item.icon"></use>
                </svg>
              </div>
              <div class="bold">{{ item.name }}</div>
            </div>
          </mu-ripple>
      </div>
      </div>
      <div style="width:100%; height: 5px;" :style="getDayColor('background-color')"></div>
      <div style="width: 100%; min-height: 500px;">
        <mu-container>
          <mu-tabs v-if="false" :value.sync="active1" :inverse="mode=='day'" :color="mode=='day'?'black':'#303030'"
                   :indicator-color="mode=='day'?'white':'white'" left>
            <mu-tab style="font-weight: bold;">
              <span style="padding: 0 5px; font-size: 16px; font-weight: bold;">{{ $t('market.quotation') }}</span>
            </mu-tab>
          </mu-tabs>
          <div class="bold tall ft16" style="padding-left: 20px; line-height: 50px;">
            {{ $t('market.quotation') }}
          </div>
          <div>
            <div class=" flex alcenter bold"
                 style="border-top:1px solid #fafafa; border-width: 0; font-size:13px; padding:10px 0;">

              <div class="flex flex-column" style="flex:1; text-align: left; padding-left: 20px;">
                <span  style="color:#aaa;">{{ $t('miscro.symbol') }}</span>
              </div>
              <div class="flex flex-column talc" style="flex:2">
                <span style="color:#aaa;">{{ $t('market.lastprice') }}</span>
              </div>
              <div class="talr" style="width: 120px; padding-right: 20px;">
                <span style="color:#aaa;">{{ $t('market.zoushi') }}</span>
              </div>
            </div>
            <div class="flex alcenter" @click="gotoKline(item.currency_id,item.currency_name)"
                 style="border-top:1px solid #fafafa; padding-top: 10px;padding:10px 20px; padding-right: 15px;"
                 :style="{'border-color':mode=='day'?'#eee':'#39393a'}"
                 v-for="item in showQuotationList">
              <div class="flex flex-column" style="flex:1; text-align: left; ">

                  <span
                      style="font-size: 14px; font-weight: bold; display: flex; flex-direction: row; align-items: center;">
                    <mu-avatar style="margin-right: 5px;" :size="16">
                  <img :src="item.logo">
                </mu-avatar>
                    {{ item.currency_name }}</span>
                <span :class="item.change>0?'green':'red'">{{ item.change }}%</span>
              </div>
              <div class="flex flex-column flex1" style="text-align: center; flex: 2">
                <span style="font-weight: bold; font-size: 15px;" :class="item.change>0?'green':'red'">{{
                    item.now_price
                  }}</span>
                <span style="font-size: 10px;font-weight: bold; color:rgb(170,170,170)">Vol {{ item.volume / 1000|numberFixed(2) }} K</span>
              </div>

              <div style="width: 110px; display: flex;flex-direction: row;align-items: end;">
                <div style="height: 60px; overflow: hidden">
                  <ChartBox style="" width="120px" height="70px"
                            :color="parseFloat(item.change) >= 0?'up':'down'" peorid="60min" :count="24"
                            :symbol="item.currency_name"></ChartBox>
                </div>
              </div>
            </div>

            
          </div>
        </mu-container>
      </div>

    </div>

  </mu-container>
</template>

<script>
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import "swiper/css/swiper.min.css";
import ChartBox from "@/components/chartBox"
import Loading from "muse-ui-loading";

let instance;
let loading = false;
export default {
  data() {
    return {
      loadingall: true,
      banners: [],
      notices: [],
      swiperOption: {
        loop: true,
        speed: 600,
        spaceBetween: 10,
        pagination: {
          el: '.swiper-pagination',
          clickable: false
        }
      },
      swiperOptionNotice: {
        autoplay: true,
        direction: 'vertical',
      },
      firstRequest: true,
      active1: 0,
      refreshing: false,
      loading: false,
      quotationsList: [],
      quotationsListChange: [],
      quotationsListPrice: [],
      quotationsListVol: [],
      number: 0,
      showQuotationList: [],
      mode: window.localStorage.getItem('mode'),
      shorts: [
        {
          name: this.$t('header.help'),
          icon: 'icon-bangzhu',
          link: 'help'
        },
        {
          name: this.$t('header.fastrecharge'),
          icon: 'icon-deposit',
          link: 'recharge'
        },
        {
          name: this.$t('header.center'),
          icon: 'icon-lanlvtubiaozhizuomoban-06',
          link: 'ucenter'
        },
        {
          name: this.$t('sgr.invite'),
          icon: 'icon-yaoqinghaoyou',
          link: 'share'
        }
      ]
    }
  },

  name: "homeContent",
  components: {
    Swiper,
    SwiperSlide,
    ChartBox,
    Loading
  },
  beforeCreate() {
    console.log('大');
  },
  computed: {
    text() {
      return this.notices.length > 0 ? {
        id: this.number,
        val: this.notices.length > 0 ? this.notices[this.number] : {'title': ''}
      } : {id: 0, val: {title: '欢迎来到Bceoin'}};
    }
  },
  watch: {
    active1(val) {
      this.showQuotationList = (val === 0 ? this.quotationsListChange : (val === 1 ? this.quotationsListPrice : this.quotationsListVol))
    }
  },
  mounted() {

    instance = this;
    this.loadingall = true;
    this.firstRequest = true;

    this.getSwiper();
    this.subScribeMarket();
    this.startMove();
    eventBus.$on('refresh', () => {
      instance.getSwiper();
      instance.shorts = [
        {
          name: this.$t('header.help'),
          icon: 'icon-bangzhu',
          link: 'help'
        },
        {
          name: this.$t('header.fastrecharge'),
          icon: 'icon-deposit',
          link: 'recharge'
        },
        {
          name: this.$t('header.center'),
          icon: 'icon-lanlvtubiaozhizuomoban-06',
          link: 'ucenter'
        },
        {
          name: this.$t('sgr.invite'),
          icon: 'icon-yaoqinghaoyou',
          link: 'share'
        }
      ];
    })
  },
  methods: {
    load() {
      return false;
    },
    gotoKline(id,name)
    {
      window.localStorage.setItem("currentCurrencyID",id);
      window.localStorage.setItem("currentCurrency",name.toUpperCase());
      this.$router.push('/kline?from=trade&mode=1')
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
    startMove() {
      // eslint-disable-next-line
      let timer = setTimeout(() => {
        if (this.number === instance.banners.length - 1) {
          this.number = 0;
        } else {
          this.number += 1;
        }
        this.startMove();
      }, 5000); // 滚动不需要停顿则将2000改成动画持续时间
    },
    refresh() {
      this.refreshing = true;
      let that = this;
      setTimeout(() => {
        that.refreshing = false
      }, 2000)
    },
    getSwiper() {
      let that = this;
      this.$http.post("/api/news/list", {"c_id": 5, 'lang': localStorage.getItem('locale')}).then((res) => {
        if (res.data.type == "ok") {
          let pics = [];
          for (let i = res.data.message.list.length - 1; i >= 0; i--) {
            let item = res.data.message.list[i];
            pics.push({
              sort: item.sorts,
              id: item.id,
              href: '',
              pic: item.thumbnail,
              title: item.title ? item.title : '',
              create_time: item.create_time.substring(5, 10)
            });

          }
          pics = pics.sort((x, y) => {
            return x.sort == y.sort ? x.id - y.id : x.sort - y.sort;
          })
          that.banners = pics;
        }
      });

      this.$http.post("/api/news/list", {"c_id": 4, 'lang': localStorage.getItem('locale')}).then((res) => {
        if (res.data.type == "ok") {
          let pics = [];
          for (let i = res.data.message.list.length - 1; i >= 0; i--) {
            let item = res.data.message.list[i];
            pics.push({
              sort: item.sorts,
              id: item.id,
              href: '',
              pic: item.thumbnail,
              title: item.title ? item.title : '',
              create_time: item.create_time.substring(5, 10)
            });

          }
          pics = pics.sort((x, y) => {
            return x.sort == y.sort ? x.id - y.id : x.sort - y.sort;
          })
          that.notices = pics;
        }
      });
    },
    subScribeMarket() {

      let that = instance;
      const url = "/api/" + "currency/quotation_new";

      this.$http.get(url).then((res) => {
        console.log(res);

        if (res.data.type == "ok") {

          let arr = [];
          for (var i = 0; i < res.data.message.length; i++) {
            for (var j = 0; j < res.data.message[i].quotation.length; j++) {
              arr.push(res.data.message[i].quotation[j]);
            }
          }
          that.quotationsList = arr;
          // that.marketSocket();
          that.showQuotationList = that.quotationsList;
          that.loadingall = false;

          instance.sockets.subscribe('daymarket', msg => {
            if (msg.type == 'daymarket') {

              for (let i = 0; i < that.quotationsList.length; i++) {
                if (that.quotationsList[i].legal_id == msg.legal_id && that.quotationsList[i].currency_id == msg.currency_id) {

                  that.quotationsList[i].now_price = msg.now_price;
                  that.quotationsList[i].change = msg.change;
                  that.quotationsList[i].volume = msg.volume;
                  that.quotationsList[i].high = msg.high;
                  that.quotationsList[i].low = msg.low;
                }
              }

              if (instance.firstRequest) {
                instance.firstRequest = false;
                instance.loadingall = false;
              }

              that.quotationsList.sort((x, y) => {
                return x.change - y.change
              });

              that.quotationsListChange = that.quotationsList.reverse();


              let quotationsListPrice = that.quotationsList.slice(0);
              quotationsListPrice.sort((x, y) => {
                return x.now_price - y.now_price
              }).reverse();
              that.quotationsListPrice = quotationsListPrice;

              let quotationsListVol = that.quotationsList.slice(0);
              quotationsListVol.sort((x, y) => {
                return x.volume - y.volume
              }).reverse();
              that.quotationsListVol = quotationsListVol;
              if (that.showQuotationList.length <= 0) {
                that.showQuotationList = that.quotationsListChange;
              }
            }
          });

        }

      }).catch(error => {
        console.log(error);
      });


    },
  },
  
}
</script>Î
<style lang="scss">

.swiper-slide {
  transition: all 0.6s;
}

.mu-tabs-inverse {
  background: #ffffff !important;
}

.mu-linear-progress-determinate {
  height: 1px !important;
  position: fixed !important;
}


.swiper-slide-prev, .swiper-slide-next {
  img {
    transform: scale(0.96) !important;
  }
}

.swiper-slide-active, .swiper-slide-duplicate-prev {
  img {
    transform: scale(1) !important;
  }
}

.swiper-pagination-bullet {
  width: 5px;
  height: 5px;
}

.swiper-pagination-bullet-active {
  background: #fff;
  width: 5px;
  height: 5px;
}

</style>

<style lang="scss" scoped>

.mu-load-more {
  height: 100%;
}

.inner-menu {
  height: 70px;
  line-height: 70px;
  border-top: 1px solid #eee;
  box-sizing: border-box;
  align-items: center;
  display: flex;
  //font-weight: bold;

  .flex-column {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

    > div {
      position: relative;
      height: 100%;

      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    mu-ripple {
      position: relative;
    }

    .iconfont {
      font-size: 18px;
    }

    line-height: 25px;
    flex: 1;
    display: flex;
    flex-direction: column;

    div:last-child {
      font-size: 12px;
    }

  }

}

.wrap {
  height: 100%;
}

.textBox {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  text-align: center;
}

.text {
  width: 100%;
  position: absolute;
  line-height: 40px;
  margin: 0;
  padding: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.5s linear;
}

.slide-enter {
  transform: translateY(20px) scale(1);
  opacity: 1;
}

.slide-leave-to {
  transform: translateY(-20px) scale(0.8);
  opacity: 0;
}

</style>