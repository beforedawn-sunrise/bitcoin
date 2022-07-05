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
      <h1 align="center" class=""  style="line-height: 50px; margin:0; margin-bottom: 30px; text-align: left">{{$t('login.welcome')}}</h1>
      <mu-form ref="form" :model="validateForm" class="mu-demo-form">
        <mu-form-item :label="$t('register.emailnum')" prop="email">
          <mu-text-field v-model="validateForm.email" prop="email"></mu-text-field>
        </mu-form-item>
        <mu-form-item :label="$t('register.logpwd')" prop="password">
          <mu-text-field autoComplete="new-password"
                         :action-icon="!visibility ? ':icon-bianzubeifenx' : ':icon-kejian'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"
                         v-model="validateForm.password"
                         prop="password"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="isAgree">
          <mu-checkbox :label="$t('login.autologin')" v-model="validateForm.isAgree"></mu-checkbox>
        </mu-form-item>
        <mu-button color="primary" style="width: 100%; height: 40px;" @click="submit">{{$t('logins')}}</mu-button>
        <div class="flex" style="height: 50px;">
          <span @click="$router.push('/forget')" class="flex1 flex alcenter">{{$t('login.forget')}}？</span>
          <span @click="$router.push({name:'Register'})" class="flex alcenter">{{ $t('login.dont') }}</span>
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
      visibility:false,
      argeeRules: [{validate: (val) => !!val, message: '必须同意用户协议'}],
      validateForm: {
        email: '',
        password: '',
        isAgree: false
      }
    }
  },
  beforeCreate() {
    // loading = this.$loading();
  },
  mounted() {
    if(window.localStorage.getItem('user_id'))
    {
      // this.$toast.info('您已经登录');
      this.$router.push('/ucenter');
    }
  },
  methods: {
    submit() {
      this.login();
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
    login() {
      let account_number = this.validateForm.email;
      let password = this.validateForm.password;
      if (account_number.length === 0) {
        this.$toast.error(this.$t('register.emailnum'));
        return;
      }
      if (password.length < 6) {
        this.$toast.error(this.$t('register.logpwd'));
        return;
      }
      this.$http({
        url: '/api/' + 'user/login',
        method: 'post',
        data: {
          user_string: account_number,
          password: password,
          type: 1
        }
      }).then(res => {
        res = res.data;
        if (res.type === 'ok') {
          localStorage.setItem('token', res.message);
          localStorage.setItem('accountNum', account_number);
          this.$store.commit('setAccountNum');
          this.userInfo();
          this.$router.push('/');
        } else {
          this.$toast.error(res.message);
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
};
</script>