<template>
  <div>
    <div class="user"
         @click="changeloginbar(true)"
         v-if="userInfo === null">
      <el-avatar :size="28"
                 src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
      <a href="#">未登录</a>
    </div>
    <div class="user"
         v-else>
      <el-avatar :size="28"
                 :src="userInfo.avatarUrl"></el-avatar>
      <a href="#">{{ userInfo.nickname }}</a>
      <a href="#"
         @click="loginout">退出</a>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
export default {
  name: "loginbar",
  methods: {
    changeloginbar (loginflag) {
      this.$store.commit("changeloginbar", loginflag);
    },
    // 退出登陆
    async loginout () {
      await this.$http.get("/logout");
      //清除用户信息
      this.$store.dispatch("saveUserInfo", null);
      // console.log(sessionStorage.getItem("userInfo"));
      // 清除歌单
      this.$store.dispatch("saveplayListMine", null);
      //清除歌单
      this.$store.dispatch("saveplayListCollect", null);
      //清除cookie
      this.$store.dispatch("saveCookie", null);
      //回到发现模块
      this.$router.push('/home/findmusic/personrecom')
    },
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo;
    },
  },
};
</script>
<style lang="less" scoped>
.user {
  position: absolute;
  display: flex;
  right: 40px;
  align-items: center;
  cursor: pointer;
  top: 18px;
}
.user a {
  font-size: 12px;
  margin-left: 5px;
  color: #fbd9d9;
}
</style>
