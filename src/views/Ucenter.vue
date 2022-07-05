<template>
  <div class="my-settings">

    <mu-container class="card-radius">
      <mu-card :raised="false" style="width: 100%; max-width: 375px; margin: 0 auto; text-align: left">
        <mu-card-header left :title="account_num" :sub-title="'ID: '+ addPreZero(user_id)">
          <mu-avatar  color="primary" slot="avatar">
            <mu-icon color="#fff" value=":icon-wode"></mu-icon>
          </mu-avatar>
          <div slot="default" style="float: right;
               height: 40px;
               display: flex;
               flex-direction: row;
               align-items: center;">
            <mu-button @click="$router.push('/')" icon color="primary">
              <mu-icon size="24" value=":icon-ico_home"></mu-icon>
            </mu-button>
          </div>
        </mu-card-header>
        <mu-card-media :title="$t('header.center')" :sub-title="$t('welcome')">
          <img
              src="@/assets/img_1.png">
        </mu-card-media>
        <mu-card-actions v-if="false">

          <mu-button @click="$router.push('/recharge')" flat>
            <mu-icon left value=":icon-chongzhi"></mu-icon>
            {{ $t('account.charging') }}
          </mu-button>
          <mu-button @click="$router.push('/withdrawal')" flat>
            <mu-icon left value=":icon-tixian"></mu-icon>
            {{ $t('account.withdraw') }}
          </mu-button>
          <mu-button @click="$router.push('/transfer')" flat>
            <mu-icon left value=":icon-huazhuan2"></mu-icon>
            {{ $t('account.transfer') }}
          </mu-button>
        </mu-card-actions>
      </mu-card>
      <mu-list class="my-settings">
        <mu-list-item @click="named" button :ripple="true">
          <mu-list-item-action>
            <mu-icon color="primary" value=":icon-icon"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>{{ $t('shop.truename') }}</mu-list-item-title>
          <mu-list-item-action>
            <mu-icon color="primary" :value="getNamed()"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item  class="hide" @click="$router.push('/share')" button :ripple="true">
          <mu-list-item-action>
            <mu-icon color="primary" value=":icon-yaoqinghaoyou"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>{{ $t('sgr.invite') }}</mu-list-item-title>
        </mu-list-item>
        <mu-list-item class="hide" @click="openChild" button :ripple="true">
          <mu-list-item-action>
            <mu-icon color="secondary" value=":icon-gengduo1"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>{{ $t('invite.mypromotion') }}</mu-list-item-title>
        </mu-list-item>
        <mu-list-item @click="$router.push('/feedback')" button :ripple="true">
          <mu-list-item-action>
            <mu-icon color="primary" value=":icon-info"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>{{ $t('miscro.complaint') }}</mu-list-item-title>
        </mu-list-item>
        <mu-divider></mu-divider>
        <mu-list-item @click="$router.push('/forget')" button :ripple="true">
          <mu-list-item-action>
            <mu-icon color="primary" value=":icon-mima"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>{{ $t('lgpwd.setpwd') }}</mu-list-item-title>
        </mu-list-item>
        <mu-list-item @click="logout" button :ripple="true">
          <mu-list-item-action>
            <mu-icon color="primary" value=":icon-tuichudenglu1"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>{{ $t('header.out') }}</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-container>
    <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openName">
      <mu-appbar color="primary" :title="$t('shop.truename')">
        <mu-button slot="right" icon @click="openName=false">
          <mu-icon value=":icon-guanbi"></mu-icon>
        </mu-button>
      </mu-appbar>
      <div style="padding: 24px;">
        <mu-text-field full-width :label="$t('auth.truename')" v-model="truename"></mu-text-field>
        <mu-text-field full-width :label="$t('auth.truenum')" v-model="idcard"></mu-text-field>
        <div class="currency_title" style="margin:0;">{{ $t('auth.note') }}</div>
        <div class="flex alcenter mb15 mt15">
          <div class="flex1 talc">
            <mu-icon v-if="pic1===''" size="72" @click="upload1" color="#eee" value=":icon-jia"></mu-icon>
            <mu-avatar @click="upload1" v-if="pic1!==''" size="72">
              <img :src="pic1">
            </mu-avatar>
            <input type="file" @change="uploadFile1" ref="uploadprev" style="display: none;"></input>
          </div>
          <div class="flex1 talc">
            <mu-icon v-if="pic2===''" ref="uploadback" @click="upload2" size="72" color="#eee"
                     value=":icon-jia"></mu-icon>
            <mu-avatar @click="upload2" v-if="pic2!==''" size="72">
              <img :src="pic2">
            </mu-avatar>
            <input type="file" @change="uploadFile2" ref="uploadback" style="display: none;"></input>
          </div>
        </div>
        <div>
          <mu-button @click="submit" full-width color="primary">{{ $t('auth.up') }}</mu-button>
        </div>
      </div>
    </mu-dialog>

    <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openExtension">
      <mu-appbar color="primary" :title="$t('invite.mypromotion') ">
        <mu-button slot="right" icon @click="openExtension=false">
          <mu-icon value=":icon-guanbi"></mu-icon>
        </mu-button>
      </mu-appbar>
      <div style="box-sizing:border-box; height: calc(100% - 56px); overflow: auto; padding: 10px;">
        <mu-list>
          <mu-list-item style="border-bottom: 1px solid #f5f5f5;" v-for="(item,index) in users" :ripple="false">
            <mu-list-item-action>
              <mu-badge color="lightBlueA700" :content="index+1"></mu-badge>
            </mu-list-item-action>
            <mu-list-item-title style="font-size: 14px;">{{item.account}}</mu-list-item-title>
            <mu-list-item-action style="min-width: 120px!important;">
              <i class="currency_title">{{item.create_date}}</i>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
      </div>
    </mu-dialog>
  </div>
</template>
<style lang="scss">

.my-settings {
  height: 100%;
  overflow: auto;

  .mu-item-action {
    margin-left: 10px;
    min-width: 40px !important;
  }

  .mu-card {
    box-shadow: none !important;
    //border-bottom: 1px solid #eee;
  }

  .mu-card-actions {
    text-align: center;
  }

  .mu-flat-button {
    min-width: 108px !important;
  }
}

.button-wrapper {
  text-align: center;

  .mu-button {
    margin: 8px;
    vertical-align: top;
  }
}


</style>
<script>

import BackHeader from "@/components/backHeader";

export default {
  components: {BackHeader},
  data() {
    let user_id = window.localStorage.getItem('user_id');
    return {
      openName: false,
      openExtension: false,
      truename: '',
      idcard: '',
      user_id: user_id,
      review_status: -1,
      pic1: '',
      pic2: '',
      account_num: window.localStorage.getItem('accountNum'),
      users:[]
    }
  },
  mounted() {
    this.loadCenter();
  },
  methods: {
    addPreZero(num, len = 7) {
      let t = (num + '').length,
          s = '';

      for (let i = 0; i < len - t; i++) {
        s += '0';
      }

      return "1" + s + num;
    },
    loadCenter() {
      let that = this;
      this.$http({
        method: 'get',
        url: '/api/user/center',
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.type === 'ok') {
          that.review_status = res.data.message.review_status
        }
      });
    },
    openChild(){
      const loading = this.$loading();
      let that = this;
      this.$http({
        method: 'get',
        url: '/api/user/extension',
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        loading.close();
        if (res.data.type === 'ok') {
          that.openExtension = true
          that.users = res.data.message;
        }
      });
    },
    upload1() {
      this.$refs.uploadprev.dispatchEvent(new MouseEvent("click"));
    },
    upload2() {
      this.$refs.uploadback.dispatchEvent(new MouseEvent("click"));
    },
    uploadFile1(e) {
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
        if (msg.type === 'ok') {
          that.pic1 = msg.message
        } else {
          that.$toast.error(msg.message)
        }
      });
    },
    uploadFile2(e) {
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
        if (msg.type === 'ok') {
          that.pic2 = msg.message
        } else {
          that.$toast.error(msg.message)
        }
      });
    },
    submit() {
      const loading = this.$loading();
      let that = this;
      this.$http({
        url: '/api/user/real_name',
        method: 'post',
        data: {
          name: this.truename,
          card_id: this.idcard,
          front_pic: this.pic1,
          reverse_pic: this.pic2
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        loading.close();
        if (res.data.type === 'ok') {
          that.$toast.success(res.data.message);
          that.loadCenter();
        } else {
          that.$toast.error(res.data.message);
        }
      })
    },
    named() {
      if (this.review_status === 0) {
        this.openName = true;
      }
      if (this.review_status === 2) {
        this.$toast.success(this.$t('auth2.complete'))
        return;

      }
      if (this.review_status === 1) {
        this.$toast.message(this.$t('security.auing'))
      }
    },
    getNamed() {
      if (this.review_status === 0) {
        return ":icon-weishiming"
      }
      if (this.review_status === 1) {
        return ":icon-dengdai"
      }
      if (this.review_status === 2) {
        return ":icon-renzheng"
      }
    },
    logout() {
      let that = this;
      this.$confirm(this.$t('header.out')+'?', this.$t('auth2.reminder'), {
        type: 'none',
        okLabel:this.$t('lay.sure'),
        cancelLabel:this.$t('lay.ceil')
      }).then(({result}) => {
        if (result) {
          localStorage.removeItem('user_id');
          localStorage.removeItem('accountNum');
          that.$toast.info('退出成功');
          that.$router.push('/');
        } else {
        }
      });
    }
  }
}
</script>