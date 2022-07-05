<template>
  <div style="width:100%">
    <mu-container>
      <mu-appbar style="width: 100%;" :color="mode==='day'?'#ffffff':'#39393a'" z-depth="0">
        <mu-button @click="$router.push('/')" icon slot="left">
          <mu-icon size="18" value=":icon-fanhui1"></mu-icon>
        </mu-button>
        <h5 style="font-weight: normal" slot="default">{{ title }}</h5>
        <mu-button @click="logout" icon slot="right">
          <mu-icon size="22" value=":icon-tuichu"></mu-icon>
        </mu-button>
      </mu-appbar>
    </mu-container>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '您好'
    },
  },
  data() {
    return {
      mode: localStorage.getItem('mode')
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      this.$router.push('/login');
    }
  }
}
</script>