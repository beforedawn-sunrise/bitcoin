<template>
  <mu-container class="feedback" style="height: 100%;">
    <div style="" style="width:24px; height:24px;top:20px;right:20px;z-index:1;position: fixed">
      <svg class="icon" @click="$router.back(-1)" style="font-size: 24px; z-index: 999;" color="#fff">
        <use xlink:href="#icon-guanbi"></use>
      </svg>
    </div>
    <mu-card :raised="false" style="width: 100%; max-width: 375px; margin: 0 auto; text-align: left">

      <mu-card-media :title="$t('miscro.complaint')" :sub-title="$t('miscro.reply')">
        <img src="@/assets/img_6.png">
      </mu-card-media>
    </mu-card>
    <div style="height: calc(100% - 275px); overflow: auto">
      <mu-container>
        <mu-list textline="two-line">
          <div class="mt20" v-if="notices.length<=0">
            <svg color="gray" class="icon" font-size="40px" aria-hidden="true">
              <use xlink:href="#icon-empty1"></use>
            </svg>
            <p class="subtitle">{{ $t('tpc.nodata') }}</p>
          </div>
          <mu-list-item @click="showDetail(item.id)" v-for="(item,index) in notices" avatar button :ripple="true">
            <mu-list-item-action>
              <mu-avatar :color="item.is_reply===1?'success':'warning'">
                <mu-icon :value="item.is_reply===1?':icon-chenggong1':':icon-dengdai'"></mu-icon>
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content style="padding: 0 10px;">
              <mu-list-item-title>{{ item.content }}</mu-list-item-title>
              <mu-list-item-sub-title>{{ item.create_time }}</mu-list-item-sub-title>
            </mu-list-item-content>
            <mu-list-item-action>
              <mu-button icon>
                <mu-icon value=":icon-xiangqing"></mu-icon>
              </mu-button>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
      </mu-container>
    </div>
    <div style="height: 50px; width: 100%; padding: 0 20px;">
      <mu-button @click="openAlert=true" color="primary" full-width>
        <mu-icon value=":icon-jia"></mu-icon>
      </mu-button>
    </div>
    <mu-dialog class="feedback" width="100%" style="height: 100%;" transition="slide-bottom" fullscreen
               :open.sync="openAlert">
      <mu-appbar color="primary" :title="$t('miscro.complaint')">
        <mu-button slot="right" icon @click="openAlert=false">
          <mu-icon value=":icon-guanbi"></mu-icon>
        </mu-button>
      </mu-appbar>
      <div style="padding: 20px;">
        <mu-text-field :placeholder="$t('miscro.reply')" v-model="content" multi-line :rows="6"
                       full-width></mu-text-field>
        <mu-button @click="submit" color="primary" full-width>
          {{ $t('footer.workorder') }}
        </mu-button>
      </div>

    </mu-dialog>
    <mu-dialog class="feedback" width="100%" style="height: 100%;" transition="slide-bottom" fullscreen
               :open.sync="openDetail">
      <mu-appbar color="primary" :title="$t('c2c.detail')">
        <mu-button slot="right" icon @click="openDetail=false">
          <mu-icon value=":icon-guanbi"></mu-icon>
        </mu-button>
      </mu-appbar>
      <div style="padding: 20px;">
        <mu-card style="width: 100%; max-width: 375px; margin: 0 auto;">
          <mu-card-header :title="showInfo.account_number" :sub-title="showInfo.create_time">
            <mu-avatar slot="avatar">
              <img src="@/assets/img_2.png">
            </mu-avatar>
          </mu-card-header>

          <mu-card-text v-html="nl2br(showInfo.content)">
          </mu-card-text>
        </mu-card>
        <mu-card v-if="showInfo.is_reply===1" class="right" style="width: 100%; max-width: 375px; margin: 10px auto;">

          <mu-card-text v-html="'<i class=\'currency_title\'>Reply: </i>'+nl2br(showInfo.reply_content)">
          </mu-card-text>
          <mu-card-header right title="Bceoin Team" :sub-title="showInfo.reply_time">

          </mu-card-header>

        </mu-card>
      </div>

    </mu-dialog>
  </mu-container>
</template>
<script>

export default {
  name: "Feedback",
  data() {
    return {
      openAlert: false,
      notices: [],
      showInfo: false,
      content: '',
      openDetail: false
    }
  },
  mounted() {
    this.loadNews();
  },
  methods: {
    loadNews() {
      let loading = this.$loading();
      let that = this;
      this.$http.post("/api/feedback/list", {
        limit: 100,
        'lang': localStorage.getItem('locale')
      }, {
        headers: {Authorization: localStorage.getItem("token")}
      }).then(res => {
        loading && loading.close();
        if (res.data.type == "ok") {
          that.notices = res.data.message.list
        }
      });
    },
    nl2br(str, is_xhtml) {
      if (typeof str === 'undefined' || str === null) {
        return '';
      }
      var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
      return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },
    showDetail(id) {
      let loading = this.$loading();
      let that = this;
      this.$http.post("/api/feedback/detail", {"id": id}, {
        headers: {Authorization: localStorage.getItem("token")}
      }).then(res => {
        loading.close();
        if (res.data.type === "ok") {

          this.openDetail = true;

          that.showInfo = res.data.message;
        }
      });
    },
    submit() {
      let ads = this.content
      let that = this;

      if (ads !== "") {
        const loading = this.$loading();
        this.$http({
          url: '/api/feedback/add',
          method: 'post',
          data: {
            content: ads
          },
          headers: {
            Authorization: window.localStorage.getItem('token')
          }
        }).then(res => {
          loading.close();
          if (res.data.type === 'ok') {
            that.$toast.success(that.$t('td.finished'));
            this.loadNews();
            this.openAlert = false;
            this.content = '';
          } else {
            that.$toast.error(res.data.message);
          }
        });

      } else {
        this.$toast.warning(this.$t('miscro.complaintDescription'));
      }
    }
  }
}
</script>
<style lang="scss">
.feedback {
  .mu-appbar-title {
    font-size: 14px !important;
  }

  .mu-dialog-body {

    height: calc(100% - 56px);
    overflow: auto;
  }
}

.right {
  .mu-card-header {
    text-align: right!important;
  }

  .mu-card-header-title {
    padding: 0 !important;
  }
}
</style>