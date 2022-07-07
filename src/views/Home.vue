<template>
  <mu-container class="container-my">
    <div class="home">
      <div class="header">
        <div style="flex:1;"><h2 style="display: none">{{ $t('welcome') }}</h2>
        <img style="width: 90px" src="@/assets/logo.png">
        </div>

        <div>

          <mu-button @click="toLogin" icon>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gerenzhongxin_xuanzhong-copy"></use>
            </svg>
          </mu-button>

        </div>
        <div>
          <mu-button ref="buttona" icon @click="openLanguage = !openLanguage">

            <svg class="icon" aria-hidden="true">
              <use v-if="lang=='zh'" xlink:href="#icon-zhongwen1"></use>
              <use v-if="lang=='spa'" xlink:href="#icon-xibanya"></use>
              <use v-if="lang=='hk'" xlink:href="#icon-hong_kong__easyiconnet"></use>
              <use v-if="lang=='kr'" xlink:href="#icon-hanyu1"></use>
              <use v-if="lang=='jp'" xlink:href="#icon--riyu"></use>
              <use v-if="lang=='en'" xlink:href="#icon-yingyu1"></use>
              <use v-if="lang=='tr'" xlink:href="#icon--turkey"></use>
            </svg>
          </mu-button>
          <mu-popover class="popforlang" :open.sync="openLanguage" :trigger="trigger">
            <mu-list>
              <mu-list-item @click="changeLang(item.lang)" class="flex alcenter" avatar button v-for="item in langArr">
                <mu-list-item-action>
                  <mu-avatar size="20" style="border-radius: 0; background: none;">
                    <svg class="icon" style="font-size: 20px" aria-hidden="true">
                      <use v-if="item.lang=='zh'" xlink:href="#icon-zhongwen1"></use>
                      <use v-if="item.lang=='jp'" xlink:href="#icon--riyu"></use>
                      <use v-if="item.lang=='spa'" xlink:href="#icon-xibanya"></use>
                      <use v-if="item.lang=='hk'" xlink:href="#icon-hong_kong__easyiconnet"></use>
                      <use v-if="item.lang=='kr'" xlink:href="#icon-hanyu1"></use>
                      <use v-if="item.lang=='en'" xlink:href="#icon-yingyu1"></use>
                      <use v-if="item.lang=='tr'" xlink:href="#icon-turkey"></use>
                    </svg>
                  </mu-avatar>
                </mu-list-item-action>
                <mu-list-item-title :class="{'active':lang==item.lang}">{{ item.text }}</mu-list-item-title>
              </mu-list-item>
            </mu-list>
          </mu-popover>
        </div>
      </div>
      <div class="container-my">
        <router-view style=""></router-view>
      </div>
      <div class="footer">
        <Footer></Footer>
      </div>
    </div>
  </mu-container>
</template>

<script>
import Footer from "@/components/Footer";

export default {
  data() {
    return {
      shift: 'home',
      openLanguage: false,
      trigger: null,
      lang: 'en',
      mode: localStorage.getItem('mode'),
      langArr: [
        {
          src: require('@/assets/zh.png'),
          text: this.$t('lang.zh'),
          lang: 'zh'
        },
        {
          src: require('@/assets/jp.png'),
          text: this.$t('lang.jp'),
          lang: 'jp'
        },
        {
          src: require('@/assets/zh.png'),
          text: this.$t('lang.hk'),
          lang: 'hk'
        },
        {
          src: require('@/assets/en.png'),
          text: this.$t('lang.en'),
          lang: 'en'
        },
        {
          src: require('@/assets/han.png'),
          text: this.$t('lang.kr'),
          lang: 'kr'
        },
        {
          src: require('@/assets/han.png'),
          text: this.$t('lang.tr'),
          lang: 'tr'
        },
        // {
        //   src: require('@/assets/zh.png'),
        //   text: this.$t('lang.spa'),
        //   lang: 'spa'
        // },
      ],
    }
  },
  name: 'Home',
  components: {
    Footer
  },
  mounted() {
    this.trigger = this.$refs.buttona.$el;
    this.lang = window.localStorage.getItem('lang').toLowerCase();
  },
  methods: {
    changeLang(lang) {
      let l = window.localStorage.getItem("locale") || "en";
      if (l == lang) {
        return;
      } else {
        this.openLanguage = false;
        window.localStorage.setItem("locale", lang);
        this.$i18n.locale = lang;
        window.localStorage.setItem('lang', lang);
        this.lang = lang;
        eventBus.$emit('refresh', lang);
      }
    },
    toLogin() {

      console.log('dsadsa');
      this.$router.push({name: 'Login'});
    },
    getDayColor(attr) {
      // let key = attr+"-color";
      // return {
      //   key:localStorage.getItem('mode') === 'day' ? '#eee' : '#000'
      // };
      let obj = {};
      obj[attr] = localStorage.getItem('mode') === 'day' ? '#eee' : '#39393a';
      return obj;
    }
  }
}
</script>
<style lang="scss">

.popforlang {
  .mu-icon-button {
    width: 36px !important;
    height: 36px !important;
    padding: 5px !important;
  }

  .mu-item {
    font-size: 14px;

    .mu-item-title {
      font-size: inherit;
    }

    .mu-item-action {
      min-width: 30px !important;
      height: auto !important;
    }
  }
}

.header {
  .button-wrapper {
    text-align: center;

    .mu-icon-button {
      padding: 8px !important;
    }

    .mu-button {
      margin: 8px;
      vertical-align: top;
    }
  }
}

.mu-popover.transition-bottom{
  border-radius: 5px;
}

.home {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 20px;
    box-sizing: border-box;
    padding-right: 10px;

    .icon {
      font-size: 23px;
    }

    div:first-child {
      text-align: left;
    }

    div:nth-child(2) {
      //padding: 0 5px;
    }
  }

  .container-my {
    flex: 1;
    padding: 0;
    height: calc(100% - 130px);
  }

  .mu-load-more {
    overflow: auto;
  }

}
</style>