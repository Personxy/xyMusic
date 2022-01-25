<template>
  <div class="videodetail">
    <div class="videotop">
      <!-- 视频和视频信息区域 -->
      <div class="videoplayarea">
        <div class="videotype">
          <span v-if="videoinfo.vid">&lt;&nbsp;视频详情</span>
          <span v-if="mvinfo.id">&lt;&nbsp;mv详情</span>
        </div>
        <div class="videoplay">
          <video :src="videourl.length!=0?videourl:mvurl"
                 style="width:620px;height:350px"
                 controls
                 autoplay></video>
        </div>
        <div class="videoinfo">
          <div class="videocreator">
            <div class="creatorcover">
              <!-- 作者头像 -->
              <el-image :src="videoinfo.vid?videoinfo.creator.avatarUrl:mvinfo.cover"></el-image>
              <!-- 作者名称 -->
              <div class="creatorname"
                   v-if="videoinfo.vid">{{videoinfo.creator.nickname}}</div>
              <div class="creatorname"
                   v-if="mvinfo.id">{{mvinfo.artists[0].name}}</div>

            </div>
          </div>
          <!-- 视频标题 -->
          <div class="videotitle">{{videoinfo.vid?videoinfo.title:mvinfo.name}}</div>
          <div class="publish">
            <span class="publishtime"
                  v-if="videoinfo.vid">发布：{{videoinfo.publishTime | dateFormat}}</span>
            <span class="publishtime"
                  v-if="mvinfo.id">{{mvinfo.publishTime}}</span>
            <span class="playcounts">播放：{{(videoinfo.vid?videoinfo.playTime:mvinfo.playCount)| wan}}次</span>
          </div>
          <!-- 视频标签 -->
          <div class="videotag"
               v-if="videoinfo.vid">
            <div class="videotaglist"
                 v-for="item in videoinfo.videoGroup"
                 :key="item.id">{{item.name}}</div>
          </div>
          <!-- mv标签 -->
          <div class="videotag"
               v-if="mvinfo.id">
            <div class="videotaglist"
                 v-for="item in mvinfo.videoGroup"
                 :key="item.id">{{item.name}}</div>
          </div>

        </div>
        <div class="videobtn">
          <!-- 点赞 mv没有点赞api -->
          <div class="like"
               v-if="videoinfo.vid">
            <img src="../../assets/images/点赞.svg"
                 alt="">
            <span>赞{{videoinfo.praisedCount}}</span>
          </div>
          <div class="collect">
            <img src="../../assets/images/收藏.svg"
                 alt="">
            <span>收藏{{videoinfo.vid?videoinfo.subscribeCount:mvinfo.subCount}}</span>
          </div>
          <div class="share">
            <img src="../../assets/images/分享.svg"
                 alt="">
            <span>分享{{videoinfo.vid?videoinfo.shareCount:mvinfo.shareCount}}</span>
          </div>
        </div>
      </div>

      <!-- 推荐视频区域 -->
      <videorecom :vid="vid"
                  :id="id"
                  @sendvideoid="getvideoid"
                  @sendmvid="getmvid" />
    </div>

    <videocomment :vid="vid"
                  :id="id" />
  </div>
</template>
<script>

import videorecom from '../../components/xymusic/videodetail/videorecom.vue'
import videocomment from "../../components/xymusic/videodetail/videocomment.vue"
export default {
  components: {
    videorecom,
    videocomment
  },
  data () {
    return {
      // 视频ID
      vid: '',
      // mvid
      id: 0,
      videoinfo: {},
      videourl: '',
      mvinfo: {},
      mvurl: ''

    }
  },
  methods: {
    // 视频详情
    async getvideodetail () {
      const { data } = await this.$http.get('/video/detail', {
        params: {
          id: this.vid
        }
      })
      this.videoinfo = data.data
    },
    //视频地址
    async getvideourl () {
      const { data } = await this.$http.get('/video/url', {
        params: {
          id: this.vid
        }
      })
      this.videourl = data.urls[0].url

    },
    //mv详情
    async getmvdetail () {
      const { data } = await this.$http.get('/mv/detail', {
        params: {
          mvid: this.id
        }
      })
      this.mvinfo = data.data
      this.getmvurl()
    },
    // mv地址
    async getmvurl () {
      const { data } = await this.$http.get('/mv/url', {
        params: {
          id: this.id
        }
      })
      this.mvurl = data.data.url
    },
    getvideoid (data) {
      this.vid = data
    },
    getmvid (data) {

      this.id = data
    }
  },
  created () {
    this.vid = this.$route.query.vid ? this.$route.query.vid : '';
    this.id = this.$route.query.id ? this.$route.query.id : 0
    if (this.vid)
    {
      this.getvideourl()
      this.getvideodetail()

    } else
    {
      this.getmvurl()
      this.getmvdetail()
    }
  },
  watch: {
    vid () {
      this.getvideodetail()
      this.getvideourl()
    },
    id () {

      this.getmvdetail()
      this.getmvurl()
    }
  }
}
</script>

<style lang="less" scoped>
.videodetail {
  text-align: left;
  .videotop {
    display: flex;
    justify-content: center;

    .videoplayarea {
      width: 620px;
      .videotype {
        font-weight: bold;
        cursor: pointer;
        font-size: 18px;
      }
      .videoplay {
        margin-top: 15px;
      }
      .videoinfo {
        // 作者
        margin-top: 15px;
        .videocreator {
          .creatorcover {
            display: flex;
            align-items: center;
            .el-image {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              margin-right: 10px;
            }
          }
          .creatorname {
            font-size: 15px;
          }
        }
        // 视频标题
        .videotitle {
          font-size: 20px;
          font-weight: bold;
          margin-top: 30px;
        }
        // 发布时间和播放次数
        .publish {
          color: #cfcfcf;
          margin-top: 20px;
          .publishtime {
            font-size: 14px;
          }
          .playcounts {
            font-size: 14px;
            margin-left: 20px;
          }
        }
        .videotag {
          display: flex;
          margin-top: 15px;
          .videotaglist {
            margin-right: 5px;
            background-color: #f7f7f7;
            padding: 2px 10px;
            border-radius: 15px;
            font-size: 14px;
          }
        }
      }
    }
    .videobtn {
      display: flex;
      margin-top: 30px;
      .like {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 30px;
        border: 1px solid #ccc;
        border-radius: 15px;
        margin-right: 20px;
        img {
          width: 18px;
          margin-right: 5px;
        }
      }
      .like:hover {
        background-color: #f2f2f2;
      }
      .collect {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 30px;
        border: 1px solid #ccc;
        border-radius: 15px;
        margin-right: 20px;
        cursor: pointer;
        img {
          width: 18px;
          margin-right: 5px;
        }
      }
      .collect:hover {
        background-color: #f2f2f2;
      }
      .share {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 30px;
        border: 1px solid #ccc;
        border-radius: 15px;
        margin-right: 20px;

        img {
          width: 18px;
          margin-right: 5px;
        }
      }
      .share:hover {
        background-color: #f2f2f2;
      }
    }
    .videorecom {
    }
  }
}
</style>