<template>
  <div class="newalbum">
    <!-- 专辑检索条件 -->
    <div class="newalbumtop">
      <!-- 条件选项 -->
      <div class="newalbumonditionbox">
        <div :class="[newalbumcontionclass,{newalbumcontionActive:currentnewalbumcontion==index}]"
             v-for="(item,index) in newalbumcontion"
             :key="index"
             @click="selectnewalbumcontion(index,item[0])">{{item[1]}}</div>
      </div>
      <div class="newandhotalbum">
        <div :class="newalbum"
             @click="changealbumtype(0,'new')"><span :class="{newandhotalbumactive:currentnewandhotalbum==0}">推荐</span></div>
        <div :class="allalbum"
             @click="changealbumtype(1,'hot')"><span :class="{newandhotalbumactive:currentnewandhotalbum==1}">全部</span></div>
      </div>
    </div>
    <!-- 专辑列表 -->
    <div class="newalbumlistbox"
         v-infinite-scroll="getalbumnews"
         infinite-scroll-distance="200px"
         infinite-scroll-delay="500">
      <div class="newalbumlist"
           v-for="item in albumlist"
           :key="item.id">
        <el-image :src="item.blurPicUrl"
                  style="width:200px;height:200px"></el-image>
        <div class="albumname">{{item.name}}</div>
        <div class="albumauthor">{{item.artists[0].name}}</div>
      </div>
    </div>
    <div class=""
         v-if="loading"
         style="margin-top: 20px">加载中...</div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      newalbumcontion: [
        ['ALL', '全部'],
        ['ZH', '华语'],
        ['EA', '欧美'],
        ['JP', '日本'],
        ['KR', '韩国']
      ],
      // class
      newalbumcontionclass: 'newalbumcontionclass',
      newalbum: 'newalbum',
      allalbum: 'allalbum',
      currentnewalbumcontion: 0,
      currentnewandhotalbum: 0,
      // 地区
      area: 'ALL',
      // 热门或者推荐
      type: 'new',
      limit: 30,
      offset: 30,
      albumlist: [],
      loading: false,

    }
  },
  methods: {
    async getalbumnews () {
      const { data } = await this.$http.get("/album/new", {
        params: {
          area: this.area,
          type: this.type,
          limit: this.limit,
          offset: this.offset
        }
      })
      this.loading = true;
      this.albumlist.push.apply(this.albumlist, data.albums);
      this.offset = this.offset + 30
    },
    // 地区选择
    selectnewalbumcontion (index, item) {
      this.currentnewalbumcontion = index
      this.area = item
      this.albumlist = []
      this.offset = 30
      this.getalbumnews()
    },
    // 热门或者推荐选择
    changealbumtype (index, item) {
      this.currentnewandhotalbum = index
      this.type = item
      this.albumlist = []
      this.offset = 30
      this.getalbumnews()

    }

  },
  created () {
    this.getalbumnews()
  }

}
</script>

<style lang="less" scoped>
.newalbum {
  .newalbumtop {
    display: flex;
    justify-content: space-between;
    .newalbumonditionbox {
      display: flex;
      .newalbumcontionclass {
        cursor: pointer;
        margin-right: 15px;
        color: #8d8a8a;
        font-size: 15px;
      }
      .newalbumcontionclass:hover {
        color: #443f3f;
      }

      .newalbumcontionActive {
        color: #000000;
      }
    }
    .newandhotalbum {
      display: flex;
      font-size: 15px;
      align-items: center;
      .newalbum {
        cursor: pointer;
        border-right: 1px solid #f2f2f2;
        height: 20px;
        width: 70px;
        span {
          display: block;
          width: 48px;
          padding: 0 5px;
        }
      }
      .allalbum {
        cursor: pointer;
        width: 70px;
        height: 20px;
        margin-left: 10px;
        span {
          display: block;
          width: 48px;
          padding: 0 5px;
        }
      }
      .newandhotalbumactive {
        background-color: #fad8d8;
        color: #ec4141;
        border-radius: 15px;
      }
    }
  }
  .newalbumlistbox {
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    .newalbumlist {
      margin-right: 15px;
      text-align: left;
      margin-bottom: 10px;
      width: 200px;

      .el-image {
        border-radius: 5px;
      }
      .albumname {
        width: 200px;
        // 文字两行显示 超出部分显示省略号
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .albumauthor {
        width: 200px;
        margin-top: 5px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        line-clamp: 2;
      }
    }
  }
}
</style>