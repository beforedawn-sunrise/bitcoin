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
      <h1 align="left" style="line-height: 50px; margin:0; margin-bottom: 30px;">{{ $t('register.email') }}</h1>

      <mu-form ref="form" :model="validateForm" v-if="stepOne" class="mu-demo-form">
        <mu-form-item v-if="false" :help-text="$t('xieyi1.first')" :label="$t('register01.country')" prop="country">
          <mu-select filterable :no-data-text="$t('td1.nodata')" color="primary" v-model="validateForm.country">
            <mu-option color="primary" v-for="(option,index) in country" :key="index" :label="option.name_en"
                       :value="option.country_id"></mu-option>
          </mu-select>
        </mu-form-item>
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
        <mu-form-item prop="isAgree">
          <mu-checkbox size="12" :label="$t('register.agree')" v-model="validateForm.isAgree"></mu-checkbox>
          {{ $t('register.mian') }}
        </mu-form-item>
        <mu-button color="primary"
                   :disabled="validateForm.email.length===0||validateForm.code.length===0||!canNext||!validateForm.isAgree"
                   style="width: 100%; height: 40px;" @click="submit">{{ $t('regiterStep1') }}
        </mu-button>
        <div class="flex" style="height: 50px;">
          <span @click="$router.push('/login')" class="flex1 flex alcenter">{{ $t('register.gologin') }}</span>
        </div>
      </mu-form>

      <mu-form ref="form" :model="validateForm" v-if="stepTwo" class="mu-demo-form">
        <mu-form-item :label="$t('register.logpwd')" prop="logpwd">
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
        <mu-form-item :label="$t('register.invitecode')" prop="invitecode">
          <mu-text-field v-model="validateForm.invitecode" prop="invitecode"></mu-text-field>
        </mu-form-item>
        <mu-button color="primary"
                   :disabled="validateForm.email.length===0||validateForm.code.length===0||!canNext||!validateForm.isAgree"
                   style="width: 100%; height: 40px;" @click="register">{{ $t('regiterStep2') }}
        </mu-button>
        <div class="flex" style="height: 50px;">
          <span @click="$router.push('/login')" class="flex1 flex alcenter">{{ $t('register.gologin') }}</span>
        </div>
      </mu-form>

    </mu-container>
  </div>
</template>
<style>
.mu-form-item .mu-button {
  margin: 0 !important;
}

.mu-option.is-selected .mu-item {
  color: #0b0f10 !important;
}

.mu-form-item-help {
  color: #9c9c9c8a !important;
}

.mu-checkbox-icon {
  transform: scale(0.8);
  margin-top: -2px;
  margin-right: 2px !important;
}
</style>
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
<style lang="scss">
</style>
<script>

import country from '../lib/country.js'
import getUrlKey from '@/lib/getUrlKey';

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
      visibilityre: false
    }
  },
  beforeCreate() {
    // loading = this.$loading();
  },
  mounted() {
    let code = getUrlKey('code', window.location.href);
    if (code) {
      this.validateForm.invitecode = code;
    }
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
    register() {

      if (this.validateForm.invitecode.length < 0) {
        this.$toast.error(this.$t('register.invitecode'));
        return;
      }

      if (this.validateForm.logpwd.length < 0) {
        this.$toast.error(this.$t('register.logpwd'));
        return;
      }

      if (this.validateForm.logpwd !== this.validateForm.repwd) {
        this.$toast.error(this.$t('lay.twopwd'));
        return;
      }


      let that = this;
      let data = {};

      data.type = 'email';
      data.user_string = that.validateForm.email;
      data.code = that.validateForm.code;
      data.password = that.validateForm.logpwd;
      data.re_password = that.validateForm.repwd;
      data.extension_code = that.validateForm.invitecode;
      data.country_code = that.validateForm.country;

      that.$http({
        url: "/api/user/register",
        data: data,
        method: "post"
      }).then(res => {
        if (res.data.type === "ok") {
          that.$toast.success(res.data.message);
          that.$router.push("/login");
        } else {
          that.$toast.error(res.data.message);
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

      let data = {user_string: this.validateForm.email};
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