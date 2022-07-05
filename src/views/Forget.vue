<template>
  <div class="wrap" style="padding:20px; background: #FFFFFF;">
    <div style="height: 50px;" class="flex alcenter">
      <div class="flex1 flex" style="padding-right: 15px; justify-content: flex-end;">
        <svg class="icon" @click="$router.back(-1)" style="font-size: 24px; " color="#999" aria-hidden="true">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
      </div>
    </div>
    <mu-container>
      <h1 align="left" class="" style="line-height: 50px; margin:0; margin-bottom: 30px;">{{ $t('login.forget') }}</h1>

      <mu-form ref="form" :model="validateForm" v-if="stepOne" class="mu-demo-form">
        <mu-form-item :label="$t('register.emailnum')" prop="email">
          <mu-text-field v-model="validateForm.email" prop="username"></mu-text-field>
        </mu-form-item>
        <mu-form-item :label="$t('register.codenum')" prop="password">
          <mu-text-field type="number" autoComplete="new-password" v-model="validateForm.code"
                         prop="code">
            <div slot="append">
              <mu-button flat color="primary" :disabled="isSending" data-mu-loading-size="24"
                         v-loading="loadingSend" @click="sendCode">
                {{ isSending ? $t('resend', {number: seconds}) : $t('send') }}
              </mu-button>
            </div>
          </mu-text-field>
        </mu-form-item>
        <mu-button color="primary"
                   :disabled="validateForm.email.length===0||validateForm.code.length===0||!canNext"
                   style="width: 100%; height: 40px;" @click="submit">{{ $t('lpwd.rpwd') }}
        </mu-button>
        <div class="flex" style="height: 50px;">
          <span @click="$router.push('/login')" class="flex1 flex alcenter">{{ $t('register.gologin') }}</span>
        </div>
      </mu-form>

      <mu-form ref="form" :model="validateForm" v-if="stepTwo" class="mu-demo-form">
        <mu-form-item :label="$t('lpwd.newpwd')" prop="logpwd">
          <mu-text-field v-model="validateForm.logpwd"
                         :action-icon="!visibilitylog ? ':icon-bianzubeifenx' : ':icon-kejian'"
                         :action-click="() => (visibilitylog = !visibilitylog)"
                         :type="visibilitylog ? 'text' : 'password'"
                         prop="logpwd"></mu-text-field>
        </mu-form-item>
        <mu-form-item :label="$t('register.repwd')" prop="repwd">
          <mu-text-field v-model="validateForm.repwd"
                         :action-icon="!visibilityre ? ':icon-bianzubeifenx' : ':icon-kejian'"
                         :action-click="() => (visibilityre = !visibilityre)" :type="visibilityre ? 'text' : 'password'"
                         prop="repwd"></mu-text-field>
        </mu-form-item>
        <mu-button color="primary"
                   :disabled="validateForm.email.length===0||validateForm.code.length===0||!canNext"
                   style="width: 100%; height: 40px;" @click="reset">{{ $t('lpwd.spwd') }}
        </mu-button>
        <div class="flex" style="height: 50px;">
          <span @click="$router.push('/login')" class="flex1 flex alcenter">{{ $t('register.gologin') }}</span>
        </div>
      </mu-form>

    </mu-container>
  </div>
</template>
<style lang="scss" scoped>
body {
  background: #000;
  text-align: left;
}

.wrap {
  height: 100%;
  text-align: left
}

.mu-demo-form {
  width: 100%;
  max-width: 460px;
}
</style>
<script>

import country from "@/lib/country";

export default {
  data() {
    return {
      usernameRules: [
        {validate: (val) => !!val, message: '必须填写用户名'},
        {validate: (val) => val.length >= 3, message: '用户名长度大于3'}
      ],
      passwordRules: [
        {validate: (val) => !!val, message: '必须填写密码'},
        {validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10'}
      ],
      visibility: false,
      argeeRules: [{validate: (val) => !!val, message: '必须同意用户协议'}],
      validateForm: {
        email: '',
        code: '',
        isAgree: false,
        country: 'China',
        logpwd: '',
        repwd: '',
        invitecode: ''
      },
      loadingSend: false,
      isSending: false,
      seconds: 60,
      country: country,
      canNext: false,
      stepOne: true,
      stepTwo: false,
      visibilitylog: false,
      visibilityre: false,
      accountValid: false
    }
  },
  beforeCreate() {
    // loading = this.$loading();
  },
  mounted() {

  },
  methods: {
    submit() {
      let that = this;
      let url = "user/check_email";
      let data = {email_code: this.validateForm.code};

      this.$http({
        url: "/api/" + url,
        method: "post",
        data: data
      }).then(res => {

        if (res.data.type == "ok") {
          that.stepTwo = true;
          that.stepOne = false;
        } else {
          that.$toast.info(res.data.message);
        }
      });

    },
    clear() {
      this.$refs.form.clear();
      this.validateForm = {
        email: '',
        password: '',
        isAgree: false
      };
    },
    userInfo() {
      this.$http({
        url: '/api/user/info',
        method: 'get',
        data: {},
        headers: {'Authorization': localStorage.getItem('token')},
      }).then(res => {
        if (res.data.type === 'ok') {
          localStorage.setItem('user_id', res.data.message.id);
          localStorage.setItem('extension_code', res.data.message.extension_code);
          localStorage.setItem('is_seller', res.data.message.is_seller);
          eventBus.$emit("seller", res.data.message.is_seller);
        }
      }).catch(error => {

      })

    },
    reset() {
      const loading = this.$loading();
      let that = this;

      this.$http({
        url: '/api/user/forget',
        method: 'post',
        data: {
          account: this.validateForm.email,
          password: this.validateForm.logpwd,
          repassword: this.validateForm.repwd,
          code: this.validateForm.code
        }
      }).then(res => {
        loading.close();
        if (res.data.type === 'ok') {
          that.$toast.success(that.$t('legal.finished'));

          ['token', 'user_id'].forEach(x => {
            localStorage.removeItem(x);
          })

          setTimeout(() => {
            that.$router.push('/login');
          }, 2000)
        } else {
          that.$toast.success(res.data.message);
        }
      });
    },
    sendCode() {


      let that = this;

      let url = 'sms_mail';

      let emreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!emreg.test(this.validateForm.email)) {
        this.$toast.error(this.$t('register.emailnum'));
        return;
      }


      this.loadingSend = true;

      let data = {user_string: this.validateForm.email, type: 'forget'};
      data.lang = window.localStorage.getItem("lang");
      this.$http({
        url: "/api/" + url,
        method: "post",
        data: data,
        headers: {not_loading: true}
      }).then(res => {

        that.loadingSend = false;
        that.isSending = true;

        if (res.data.type !== 'error') {

          that.$toast.success(res.data.message);

          that.canNext = true;
          let interval = setInterval(x => {
            that.seconds--;
            if (that.seconds === 0) {
              that.seconds = 60;
              clearInterval(interval);
              that.isSending = false;
            }
          }, 1000);
        } else {
          that.isSending = false;
          that.$toast.error(res.data.message);
        }
      });
    }
  }
};
</script>