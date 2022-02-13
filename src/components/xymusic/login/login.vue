<template>
  <div class="loginbox">
    <!-- 关闭按钮 -->
    <i class="el-icon-close"
       @click="closelogin(false)"></i>
    <img src="../../../assets/images/手机.svg"
         alt=""
         id="phoneico" />
    <!-- 登陆方式切换 -->
    <div class="logintype">
      <span :class="{logintypechose:logintype==0}"
            @click="changelogintype(0)">密码登陆</span>
      <span :class="{logintypechose:logintype==1}"
            @click="changelogintype(1)">验证码登陆</span>
    </div>
    <!-- 登陆表单 -->
    <el-form :model="logindata"
             :rules="rules"
             ref="ruleForm"
             label-width="100px"
             class="demo-ruleForm"
             @keyup.enter.native="sublogin">
      <el-form-item prop="phonenum">
        <el-input v-model="logindata.phonenum"
                  placeholder="请输入手机号"
                  prefix-icon="el-icon-mobile"
                  v-if="logintype===0"></el-input>
        <el-input v-model="logindata.phonenum"
                  placeholder="请输入手机号"
                  prefix-icon="el-icon-mobile"
                  v-if="logintype===1"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <!-- 密码输入框 -->
        <el-input v-model="logindata.password"
                  type="password"
                  placeholder="请输入密码"
                  prefix-icon="el-icon-lock"
                  v-if="logintype===0"></el-input>
        <!-- 验证码输入框 -->
        <el-input v-model="logindata.identification"
                  placeholder="请输入验证码"
                  v-if="logintype===1">
          <el-button slot="append"
                     class="identification"
                     @click="getidentification"
                     v-if="beforeidentification">{{getidentificationcontent}}</el-button>
          <el-button slot="append"
                     class="identificationafter"
                     v-if="!beforeidentification"
                     :disabled="btndisabled">可重新获取{{countdown}}s</el-button>
        </el-input>
      </el-form-item>
      <el-button type="primary"
                 @click="sublogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Login",
  components: {},
  data () {
    return {
      //登录数据
      logindata: {
        phonenum: "",
        password: "",
        identification: ''
      },
      loginflag: true,
      // 表单验证规则
      rules: {
        phonenum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度为11位数字", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      playListm: [],
      playListc: [],
      logintype: 0,
      beforeidentification: true,
      btndisabled: true,
      countdown: 60,
      getidentificationcontent: '获取验证码'
    };
  },
  methods: {
    // 登录
    async sublogin () {
      if (this.logintype == 0)
      {
        let res = await this.$http.post("/login/cellphone", {
          phone: this.logindata.phonenum,
          password: this.logindata.password,
        });
        if (res.data.code !== 200)
          return this.$message.error("账户或者密码错误！");
        // console.log(res);
        this.saveinfo(res);
      } else if (this.logintype == 1)
      {
        // 验证验证码
        const { data } = await this.$http.get('/captcha/verify',
          {
            params: {
              phone: this.logindata.phonenum,
              captcha: this.logindata.identification,
              timestamp: Date.now()
            }

          })
        // console.log({ data });
        // this.saveinfo(res);
        if (data.code !== 200) return this.$message.error('验证码错误！')
        let res = await this.$http.post("/login/cellphone", {
          phone: this.logindata.phonenum,
          captcha: this.logindata.identification,
        });
        if (res.data.code !== 200)
          return this.$message.error("账户或者密码错误！");
        // console.log(res);
        this.saveinfo(res);
        this.getidentificationcontent = "获取验证码"
      }


    },

    // 保存个人信息和登录信息
    async saveinfo (res) {
      //保存用户个人信息
      this.$store.dispatch("saveUserInfo", res.data.profile);
      //保存cookie
      this.$store.dispatch("saveCookie", res.data.cookie);
      this.closelogin(false);
      // 获取用户歌单
      let resdata = await this.$http.get("/user/playlist", {
        params: { uid: this.userInfo.userId, limit: 40 },
      });

      // 找出个人歌单
      this.playListm = resdata.data.playlist.filter((element) => {
        return element.userId == this.userInfo.userId;
      });
      // 找出收藏歌单
      this.playListc = resdata.data.playlist.filter((element) => {
        return element.userId !== this.userInfo.userId;
      });
      // console.log(this.playListc);
      // console.log(this.playListMine);
      // 保存歌单
      this.$store.dispatch("saveplayListMine", this.playListm);
      this.$store.dispatch("saveplayListCollect", this.playListc);
    },
    // 登录面板状态
    closelogin (loginflag) {
      this.$store.commit("changeloginbar", loginflag);
    },
    // 登陆模式改变
    changelogintype (type) {
      this.logintype = type
    },
    // 验证码获取
    async getidentification () {
      this.beforeidentification = false
      const { data } = await this.$http.get('/captcha/sent', {
        params: {
          phone: this.logindata.phonenum,

        }
      })
      console.log(data);
      if (this.timer)
      {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.countdown--
        if (this.countdown == 0)
        {
          clearInterval(this.timer)
          this.getidentificationcontent = "重新获取验证码"
          this.beforeidentification = true
          this.countdown = 5
        }
      }, 1000);
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo;
    },
    ...mapGetters(["playListMine", "playListCollect", "cookie"]),
  },
};
</script>

<style lang="less" scoped>
.loginbox {
  width: 350px;
  height: 530px;
  z-index: 9999;
  background-color: #ffffff;
  position: fixed;
  top: 100px;
  left: 50%;
  box-shadow: 5px 5px 10px #dfdede;
  .logintype {
    text-align: left;
    color: #02a7de;
    margin-left: 46px;
    font-size: 14px;
    cursor: pointer;
    span {
      margin-right: 15px;
    }
    .logintypechose {
      color: #555555;
    }
  }

  /deep/.identification {
    cursor: pointer;
    background-color: #ec4141;
    color: white;
  }
  /deep/ .identificationafter {
    background-color: #ec4141;
    color: white;
  }
}
.el-icon-close {
  position: absolute;
  right: 0;
  top: 0;
  color: #a5a5a5;
  font-size: 24px;
  cursor: pointer;
}
#phoneico {
  width: 100px;
  height: 130px;
  margin-top: 60px;
}
.el-form.demo-ruleForm {
  margin-top: 5px;
}
/deep/.el-form-item__content {
  width: 75%;
  margin-left: 44px !important;
}
.el-button--primary {
  background-color: #ec4141;
  border-color: #ec4141;
  width: 260px;
  height: 40px;
}
</style>
