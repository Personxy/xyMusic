<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters([
      "userInfo",
      "searchHistory",
      "playListMine",
      "playListCollect",
      "cookie",
      "currenturl",
      "songDetails",
      "playsonglist",
      "playstatus",
      "playorder",
      "volume",
      "currentTime",
      "nextsonglist",
      "songdetailflag",
    ]),
  },
  methods: {
    // 存入session
    saveData() {
      //用户信息
      sessionStorage.setItem("userInfo", JSON.stringify(this.userInfo));
      //搜索历史
      sessionStorage.setItem(
        "searchHistory",
        JSON.stringify(this.searchHistory)
      );
      //热搜信息
      // sessionStorage.setItem("searchHot",JSON.stringify(this.searchHot));
      // 个人歌单信息
      sessionStorage.setItem("playListMine", JSON.stringify(this.playListMine));
      //收藏歌单
      sessionStorage.setItem(
        "playListCollect",
        JSON.stringify(this.playListCollect)
      );
      //cookie
      sessionStorage.setItem(
        "cookie",
        JSON.stringify(encodeURIComponent(this.cookie))
      );
      // 当前播放url
      sessionStorage.setItem("currenturl", this.currenturl);
      //当前歌曲详情
      sessionStorage.setItem("songDetails", JSON.stringify(this.songDetails));
      //当前播放列表
      sessionStorage.setItem("playsonglist", JSON.stringify(this.playsonglist));
      // 下一首播放列表
      sessionStorage.setItem("nextsonglist", JSON.stringify(this.nextsonglist));
      //当前播放状态
      sessionStorage.setItem("playstatus", this.playstatus);
      //播放顺序
      sessionStorage.setItem("playorder", this.playorder);
      // 当前音量
      sessionStorage.setItem("volume", this.volume);
      //当前进度条
      sessionStorage.setItem("currentTime", this.currentTime);
      //歌曲详情页面打开关闭
      sessionStorage.setItem("songdetailflag", this.songdetailflag);
    },
  },
  mounted() {
    // 判断是否兼容箭头函数
    try {
      eval("()=>{}");
      // alert("浏览器支持箭头函数");
    } catch (eo) {
      alert("本 现代浏览器进行使用");
      window.location.href = "http://browsehappy.osfipin.com/";
    }
    // 将数据保存到vuex
    window.addEventListener("unload", this.saveData);
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
