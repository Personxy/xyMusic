<template>
  <div class="comment"
       v-loading="loading">
    <!-- 评论框 -->
    <el-dialog title="评论"
               :visible.sync="centerDialogVisible"
               width="30%"
               center
               v-dialogDrag
               :modal="false">
      <textarea maxlength="140"
                class="inputcomment"
                :placeholder="placeholderstr"
                v-model="commentscontent"></textarea>
      <!-- 剩余字数 -->
      <div class="remainstr"><span>{{140-(commentscontent.length)}}</span></div>
      <!-- 发布评论 -->
      <div :class="{sendcomment:commentscontent.length==0,sendcomment2:commentscontent.length!=0,sendcomment3:true}"
           @click="tocomment(2,0)">评论</div>
    </el-dialog>
    <div class="allcomments"
         v-if="hotcomments.length!==0">
      <div class="allcommentstitle">全部评论({{total}})</div>
      <div class="hotcomment"
           v-for="item in hotcomments"
           :key="item.id">
        <!-- .用户头像 -->
        <div class="commentuserimg">
          <el-image :src="item.user.avatarUrl"></el-image>
        </div>
        <!-- 用户名和评论内容 -->
        <div class="userandcomment">
          <span class="username">{{item.user.nickname,}}:&nbsp;</span>
          <span class="commencontent">{{item.content}}</span>
          <div class="commentfoot">
            <div class="commenttime">{{item.timeStr}}</div>
            <div class="commentbtn">

              <div class="likebtn"><img src="../../../assets/images/点赞.svg"
                     alt=""><span class="likedCount">{{item.likedCount}}</span></div>

              <img src="../../../assets/images/评论.svg"
                   alt=""
                   class="combtn"
                   @click="replycomment(item.commentId,item.user.nickname)"
                   style="cursor:pointer">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 更多精彩评论 -->
    <div class="morecomments"
         v-if="hotcomments.length!==0">
      <span>更多精彩评论&nbsp;></span>
    </div>
    <!-- 最新评论 -->
    <div class="newcommnets">
      <div class="allcommentstitle">最新评论({{total}})</div>
      <div class="hotcomment"
           v-for="item in newcomments"
           :key="item.id">
        <!-- .用户头像 -->
        <div class="commentuserimg">
          <el-image :src="item.user.avatarUrl"></el-image>
        </div>
        <!-- 用户名和评论内容 -->
        <div class="userandcomment">
          <span class="username">{{item.user.nickname}}:&nbsp;</span>
          <span class="commencontent">{{item.content}}</span>
          <div class="reply"
               v-if="item.beReplied[0]"><span class="replayname">{{item.beReplied[0].user.nickname}}:&nbsp;</span><span>{{item.beReplied[0].content}}</span></div>
          <div class="commentfoot">
            <div class="commenttime">{{item.timeStr}}</div>
            <div class="commentbtn">
              <div class="likebtn"><img src="../../../assets/images/点赞.svg"
                     alt=""><span class="likedCount">{{item.likedCount}}</span></div>
              <img src="../../../assets/images/评论.svg"
                   alt=""
                   class="combtn"
                   @click="replycomment(item.commentId,item.user.nickname)"
                   style="cursor:pointer">
              <img src="../../../assets/images/垃圾箱 (2).svg"
                   alt=""
                   class="deletcomment"
                   v-if="item.user.nickname==userInfo.nickname"
                   @click="deletcomment(item.commentId)">
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 引入的指令可以是模态框可以拖拽
import '../../../../src/plugins/directive.js'
export default {
  data () {
    return {
      hotcomments: [],
      newcomments: [],
      total: '',
      loading: false,
      centerDialogVisible: false,
      commentscontent: "",
      placeholderstr: '请输入一百四十字以内',
      replyid: '',
      t: 1
    }
  },
  computed: {
    ...mapGetters(['songDetails', 'cookie', 'userInfo'])
  },
  methods: {
    // 获取评论
    async getmusiccomment () {
      this.loading = true
      const { data } = await this.$http.get('/comment/music', {
        params: {
          id: this.songDetails.id,
          limit: 100
        }
      })
      this.hotcomments = data.hotComments
      this.newcomments = data.comments
      this.total = data.total
      this.loading = false

    },
    // 打开评论框
    replycomment (id, nickname) {
      this.centerDialogVisible = true
      if (nickname && id)
      {
        this.placeholderstr = '回复  ' + nickname + ":"
        this.replyid = id
        this.t = 2
      }
    },
    // 发布评论
    async tocomment (t, type) {
      if (!this.userInfo) return this.$message.error('请登录后再评论！');
      const { data } = await this.$http.get('/comment', {
        params: {
          t: t,
          type: type,
          id: this.songDetails.id,
          content: this.commentscontent,
          commentId: this.replyid,
          cookie: this.cookie,
          timeStamp: Date.now()
        }
      })
      if (data.code == 200)
      {
        this.commentscontent = ''
        this.centerDialogVisible = false
        this.$message({
          message: '评论成功！',
          type: 'success'
        });

      } else
      {
        this.centerDialogVisible = false

        this.$message.error('评论失败！请稍后再试');
      }
      this.getmusiccomment()
    },
    async deletcomment (content) {
      const { data } = await this.$http.get('/comment', {
        params: {
          t: 0,
          type: 0,
          id: this.songDetails.id,
          commentId: content,
          cookie: this.cookie,
          timeStamp: Date.now()
        }
      })
      if (data.code == 200)
      {
        this.$message({
          message: '删除成功！',
          type: 'success'
        });
      }
      else
      {
        this.$message.error('删除失败！请稍后再试');
      }
    }

  },
  created () {
    this.getmusiccomment()
  },
  watch: {
    songDetails () {
      // 歌曲切换时要关闭评论框
      this.centerDialogVisible = false
      this.placeholderstr = "请输入一百四十字以内"
      this.getmusiccomment()
    }

  }

}
</script>

<style lang="less" scoped>
.comment {
  width: 47%;
  margin: 0 auto;
  text-align: left;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /deep/.el-dialog--center {
    width: 25% !important;
    height: 275px;
    .el-dialog__body {
      padding-top: 10px;
    }
    .inputcomment {
      resize: none;
      width: 430px;
      height: 100px;
      border-color: #e6e6e6;
      border-radius: 5px;
      color: #5c5c5c;
      font-family: Arial, Helvetica, sans-serif;
    }
    textarea::-webkit-input-placeholder {
      /* placeholder颜色  */
      color: #aab2bd;
      /* placeholder字体大小  */
      font-size: 12px;
    }
    .inputcomment:focus {
      outline: none !important;
      border-color: #e6e6e6;
    }
    .remainstr {
      text-align: right;
      margin-top: 10px;
    }
    .sendcomment {
      background-color: #f6a0a0;
    }
    .sendcomment2 {
      background-color: #ec4141;
    }
    .sendcomment3 {
      width: 80px;
      height: 34px;
      background-color: #ec4141;
      color: white;
      line-height: 34px;
      text-align: center;
      border-radius: 20px;
      margin-left: 360px;
      margin-top: 15px;
      cursor: pointer;
    }
    .sendcomment3:hover {
      background-color: #d73535;
    }
  }
  .allcomments {
    width: 88%;
    .allcommentstitle {
      font-weight: bold;
      margin-bottom: 20px;
    }
    .hotcomment {
      padding-bottom: 15px;
      border-bottom: 1px solid #f3f3f3;
      margin-bottom: 20px;
      display: flex;
      width: 100%;
      .commentuserimg {
        .el-image {
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }
      }
      .userandcomment {
        margin-left: 15px;
        font-size: 15px;
        line-height: 150%;
        width: 100%;

        .username {
          color: #5b85b4;
        }
        .commentfoot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-top: 5px;
          .commenttime {
            color: #999999;
            color: 14px;
          }
          .commentbtn {
            display: flex;
            align-items: center;
            .likebtn {
              margin-right: 15px;
              align-items: center;
              display: flex;
              .likedCount {
                font-size: 14px;
                margin-left: 1px;
              }
            }
            .combtn {
              width: 17px;
            }
          }
        }
      }
    }
  }
  .morecomments {
    text-align: center;
    height: 30px;
    width: 130px;
    border: 1px solid #ccc;
    border-radius: 20px;
    line-height: 30px;
    padding: 2px;
    cursor: pointer;
    margin-top: 15px;
    margin-bottom: 60px;
  }
  .newcommnets {
    width: 88%;
    .allcommentstitle {
      font-weight: bold;
      margin-bottom: 20px;
    }
    .hotcomment {
      padding-bottom: 15px;
      border-bottom: 1px solid #f3f3f3;
      margin-bottom: 20px;
      display: flex;
      width: 100%;
      .commentuserimg {
        .el-image {
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }
      }
      .userandcomment {
        margin-left: 15px;
        font-size: 15px;
        line-height: 150%;
        width: 100%;

        .username {
          color: #5b85b4;
        }
        .reply {
          background-color: #f5f5f5;
          line-height: 30px;
          margin-top: 10px;
          text-indent: 5px;
          border-radius: 7px;
          .replayname {
            color: #5b85b4;
          }
        }
        .commentfoot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-top: 5px;
          .commenttime {
            color: #999999;
            color: 14px;
          }
          .commentbtn {
            display: flex;
            align-items: center;
            .likebtn {
              margin-right: 15px;
              align-items: center;
              display: flex;
              .likedCount {
                font-size: 14px;
                margin-left: 1px;
              }
            }
            .combtn {
              margin-right: 15px;
              width: 17px;
            }
            .deletcomment {
              cursor: pointer;
              width: 17px;
            }
          }
        }
      }
    }
  }
}
/deep/.el-loading-spinner {
  top: 0;
}
</style>