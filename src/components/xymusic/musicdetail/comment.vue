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
           @click="tocomment(0)">评论</div>
    </el-dialog>
    <div class="opencommentdialog"
         @click="opencommentdialog()">
      <img src="../../../assets/images/写评论.svg"
           alt="">
      <span>写评论</span>
    </div>
    <div class="allcomments"
         v-if="hotcomments&&hotcomments.length!==0">
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
                     alt=""
                     @click="likecomment(item.commentId,1)"
                     v-if="!item.liked">
                <img src="../../../assets/images/已点赞.svg"
                     alt=""
                     v-else
                     @click="likecomment(item.commentId,0)"><span class="likedCount">{{item.likedCount}}</span>
              </div>
              <img src="../../../assets/images/评论.svg"
                   alt=""
                   class="combtn"
                   @click="opencommentdialog(item.commentId,item.user.nickname)"
                   style="cursor:pointer">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 更多精彩评论 -->
    <div class="morecomments"
         v-if="hotcomments&&hotcomments.length!==0">
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
                     alt=""
                     @click="likecomment(item.commentId,1)"
                     v-if="!item.liked">
                <img src="../../../assets/images/已点赞.svg"
                     alt=""
                     v-else
                     @click="likecomment(item.commentId,0)"><span class="likedCount">{{item.likedCount}}</span>
              </div>
              <img src="../../../assets/images/评论.svg"
                   alt=""
                   class="combtn"
                   @click="opencommentdialog(item.commentId,item.user.nickname)"
                   style="cursor:pointer">
              <img src="../../../assets/images/垃圾箱 (2).svg"
                   alt=""
                   class="deletcomment"
                   v-if="userInfo&&item.user.nickname==userInfo.nickname"
                   @click="deletcomment(item.commentId)">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nothing"
         v-if="newcomments.length==0">
      没有更多内容了
    </div>
    <!-- 页码 -->
    <el-pagination :pager-count="9"
                   :page-size="limit"
                   layout="prev, pager, next"
                   :total="total"
                   background
                   @current-change="change">
    </el-pagination>
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
      total: 0,
      loading: false,
      centerDialogVisible: false,
      commentscontent: "",
      placeholderstr: '发表评论',
      replyid: '',
      t: 1,
      offset: 0,
      limit: 20
    }
  },
  computed: {
    ...mapGetters(['songDetails', 'cookie', 'userInfo', 'loginflag'])
  },
  methods: {
    // 获取评论
    async getmusiccomment () {
      this.loading = true
      const { data } = await this.$http.get('/comment/music', {
        params: {
          id: this.songDetails.id,
          limit: this.limit,
          offset: this.offset,
          timeStamp: Date.now(),
          cookie: this.cookie
        }
      })
      this.hotcomments = data.hotComments
      this.newcomments = data.comments
      this.total = data.total
      this.loading = false
    },
    change (data) {
      this.offset = data - 1
      this.getmusiccomment()
    },
    // 打开评论框
    opencommentdialog (id, nickname) {
      this.commentscontent = ''
      if (!this.userInfo)
      {
        this.$store.dispatch("changeloginbar", true);
        return this.$message.error('请登录后再评论！');
      }
      this.centerDialogVisible = true

      if (nickname && id)
      {
        this.placeholderstr = '回复  ' + nickname + ":"
        this.replyid = id
        this.t = 2
      }
      else
      {
        this.placeholderstr = '发表评论'

        this.t = 1
        this.replyid = ''
      }

    },
    // 发布评论
    async tocomment (type) {
      const { data } = await this.$http.get('/comment', {
        params: {
          t: this.t,
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
      setTimeout(() => {
        this.getmusiccomment()
      }, 1000);
    },
    // 删除评论
    async deletcomment (content) {
      this.$store.dispatch("changeloginbar", true);
      if (!this.userInfo) return this.$message.error('请登录后再评论！');
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
        setTimeout(() => {
          this.getmusiccomment()
        }, 1000);

        this.$message({
          message: '删除成功！',
          type: 'success'
        });
      }
      else
      {
        this.$message.error('删除失败！请稍后再试');
      }
    },
    // 点赞评论
    async likecomment (id, t) {
      const { data } = await this.$http.get('/comment/like', {
        params: {
          id: this.songDetails.id,
          cid: id,
          t: t,
          type: 0,
          cookie: this.cookie,
          timeStamp: Date.now()

        }
      })
      if (data.code == 200)
      {
        setTimeout(() => {
          this.getmusiccomment()
        }, 1000);

        this.$message({
          message: '操作成功！',
          type: 'success'
        });
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
      // 页码变为1
      this.offset = 0
      //默认palceholder
      this.placeholderstr = "发表评论"
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
  .opencommentdialog {
    width: 95px;
    height: 35px;
    border-radius: 20px;
    background-color: #f1f1f1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    position: fixed;
    right: 22%;
    bottom: 90px;
    span {
      margin-left: 5px;
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
              img {
                cursor: pointer;
              }
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
              img {
                cursor: pointer;
              }
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
  top: 15vh;
}
.el-pagination {
  margin-top: 20px;
  margin-bottom: 50px;
}
/deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #ec4141 !important;
}
</style>