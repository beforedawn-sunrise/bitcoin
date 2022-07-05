<template>
  <mu-container class="iepn">
    <mu-appbar style="width: 100%;" color="#fff" text-color="#000">
      UpStart
      <mu-button @click="$router.back(-1)" icon flat slot="left">
        <mu-icon value=":icon-ziyuan1"></mu-icon>
      </mu-button>
      <mu-button icon flat slot="right">
      </mu-button>
    </mu-appbar>
    <!--    <mu-card :raised="false" style="width: 100%;max-width: 100%; margin: 0 auto; text-align: left">-->

    <!--      <mu-card-media :title="$t('iepn.netname')" :sub-title="$t('iepn.htitle')">-->
    <!--        <img src="@/assets/iepnbg.png">-->
    <!--      </mu-card-media>-->
    <!--    </mu-card>-->

    <div style="font-size: 16px;">IEPN:{{ $t('iepn.netname') }}</div>
    <div style="margin-top: 5px;">{{ $t('iepn.htitle') }}</div>
    <div style="margin-top:20px; width: 100%;">
      <div style="font-size: 18px; line-height: 45px;">{{ $t('iepn.plannum') }}:{{ iepn.total }}</div>
      <div class="flex alcenter">
        <span class="flex1"></span><span @click="gobuy"
                                         style="font-size: 14px; color: #0a8415; margin-right: 15px;">{{
          $t('iepn.gobuy')
        }}</span>

        <span class="flex1"></span>
      </div>
    </div>
    <div>
      <v-chart :options="polar" width="320" height="240"/>
    </div>
    <div class="tall" style="padding: 0 16px;">
      <div style="font-size: 18px; line-height: 45px;"><span
          style=" border-left: 3px solid #ffc90c; padding-left: 15px; font-size: 16px;">{{
          $t('iepn.hotcommond')
        }}</span></div>
      <div><img
          :src="lang==='zh'?'https://neptuneex.com/static_config/www/hot_cn.jpg':'https://neptuneex.com/static_config/www/hot_en.jpg'"
          alt=""
          class="banner-img" style="max-width: 100%;"></div>
      <div style="line-height: 1.8; padding-bottom: 20px;">
        <div style="line-height: 2.5; font-size: 16px;">{{ $t('iepn.ctitle') }}</div>
        <div>{{ $t('iepn.cdsp') }}</div>
        <div class="mt5">{{ $t('iepn.starttime') }}：{{ iepn.start }} <br>{{ $t('iepn.startprice') }}：{{ iepn.price }}
          <br>{{ $t('iepn.plannum') }}：{{ iepn.total }} <br>{{ $t('iepn.endtime') }}:{{ iepn.end }}
        </div>
        <div>

          <a href="https://iepninf.com/" target="_blank">
            <mu-button color="info">{{ $t('iepn.seemore') }}</mu-button>
          </a>
          <a href="https://iepninf.com/file/IEPN%E7%99%BD%E7%9A%AE%E4%B9%A6.pdf" class="ml10" target="_blank">
            <mu-button flat color="info">{{ $t('iepn.baipishu') }}</mu-button>
          </a>
        </div>
      </div>
    </div>

  </mu-container>
</template>
<script>
import ECharts from 'vue-echarts'
import QRCode from 'qrcodejs2'
import Clipboard from "clipboard"

export default {
  name: "IEPN",
  data() {
    return {
      url: '',
      code: '',
      share_url: '',
      iepn: {},
      polar: {
        color: [
          '#007aff',
          '#ffc90c',
        ],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            tooltip: {
              trigger: 'item',
              formatter: '{b} ({d}%)'
            },
            label: {
              show: true,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: 40000000, name: this.$t('iepn.pushednum')},
              {value: 1802560, name: this.$t('iepn.remindnum')}
            ]
          }
        ]
      },
      lang: localStorage.getItem('lang')
    }
  },
  components: {'v-chart': ECharts},
  mounted() {
    var that = this;
    this.$http({
      url: '/api/iepn',
      method: 'get'
    }).then(res => {
      that.iepn = res.data.message;
      that.polar.series[0].data[0].value = that.iepn.yfx;
      that.polar.series[0].data[0].name = that.polar.series[0].data[0].name + ":" + that.iepn.yfx;
      that.polar.series[0].data[1].value = that.iepn.sy;
      that.polar.series[0].data[1].name = that.polar.series[0].data[1].name + ":" + that.iepn.sy;
    })
  },
  methods: {
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