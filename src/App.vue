<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import "//at.alicdn.com/t/font_2302506_u56hm93bj2.css";


.mu-icon {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.card-radius {
  .mu-card-media {
    width: calc(100% - 32px);
    margin: 0 auto;
    overflow: hidden;
    border-radius: 5px;
  }

  .mu-card-media-title {
    padding: 8px 16px !important;

    .mu-card-title {
      font-size: 20px !important;
    }
  }
}


header.mu-appbar {
  background: #fff;
  color: #0b0f10;
  box-shadow: none;

  .mu-appbar-title {
    font-size: 18px;
    font-weight: bold;
    //text-align: left;
  }
}

.currency_color{
  color:#555;
}
</style>
<script>
import 'typeface-roboto'
export default {
  name: "App",
  created() {
  }
}
</script>
<style lang="scss">
html, body {
  position: fixed;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.container {
  //height: 100%;
  padding: 0 !important;
}

.container-my {
  height: 100%;
  padding: 0 !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
}

</style>
