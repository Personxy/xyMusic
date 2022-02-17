<template>
  <!-- 搜索 -->
  <div class="searchbar">
    <el-input v-model="searchdata"
              placeholder="搜索"
              size="mini"
              @focus="changesearchbox"
              v-clickoutside="close"
              @keyup.enter.native="search"
              @input="searchsug"
              ref="input"></el-input>
    <i class="el-icon-search"
       @click="search"
       size="mini"></i>
    <div class="searchbox"
         v-show="opensearch">
      <div v-if="sugopenflag==false">
        <!-- 搜索历史 -->
        <p v-if="searchHistoryflag">
          搜索历史&nbsp;
          <el-popconfirm confirm-button-text="确认"
                         cancel-button-text="取消"
                         icon="el-icon-info"
                         icon-color="red"
                         title="确定要删除所有搜索历史记录吗"
                         @confirm="clearSearchData">
            <img src="../../../assets/images/垃圾箱 (2).svg"
                 alt=""
                 slot="reference" />
          </el-popconfirm>
        </p>
        <!-- 搜索历史 -->
        <div class="searchHistory">
          <div class="searchitem"
               v-for="item in searchHistory"
               :key="item.id"
               @click="tosearch(item)">
            {{ item }}
            <span @click="deletesearch(item)"> x</span>
          </div>
        </div>
        <!-- 热搜 -->
        <div class="hotSearch">
          <p>热搜榜</p>
          <div class="hotSearchItem"
               v-for="(item, i) in searchHot"
               :key="item.id"
               @click="tosearch(item.first)">
            <span class="hotnum">{{ i + 1 }}</span>
            <span class="hotname">{{ item.first }}</span>
          </div>
        </div>
      </div>

      <div class="sugsearch"
           style="color:black"
           v-if="sugopenflag">
        <div class="songs">
          <div class="title">单曲</div>
          <div class="content"
               v-for="item in searchsugarr.songs"
               :key="item.id"
               @click="tosearch(item.name)">{{item.name}}</div>
        </div>
        <div class="album">
          <div class="title">专辑</div>
          <div class="content"
               v-for="item in searchsugarr.albums"
               :key="item.id"
               @click="tosearch(item.name)">{{item.name}}</div>
        </div>
        <div class="singer">
          <div class="title">歌手</div>
          <div class="content"
               v-for="item in searchsugarr.artists"
               :key="item.id"
               @click="tosearch(item.name)">{{item.name}}</div>
        </div>
        <div class="playlists">
          <div class="title">歌单</div>
          <div class="content"
               v-for="item in searchsugarr.playlists"
               :key="item.id"
               @click="tosearch(item.name)">{{item.name}}</div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "search",
  data () {
    return {
      searchdata: "",
      opensearch: false,
      searchHistoryflag: true,
      searchHot: [],
      timeout: null,
      searchsugarr: {},
      sugopenflag: false
    };
  },
  methods: {
    // 控制搜索面板开关且提交热搜请求
    async changesearchbox () {
      this.opensearch = !this.opensearch;
      let res = await this.$http.get("/search/hot");
      this.searchHot = res.data.result.hots;
    },
    close: function (e) {
      if (this.$el.contains(e.target)) return;
      this.opensearch = false;
    },
    //搜索
    search () {
      this.searchHistoryflag = true;
      if (
        this.searchdata === "undefined" ||
        this.searchdata === null ||
        this.searchdata === "" ||
        this.searchdata.replace(/\s*/g, "").length == 0
      )
        return;
      // 保存搜索记录、
      this.$store.dispatch("saveSearchHistory", this.searchdata);
      // this.searchdata = "";
      this.changesearchbox();
      this.opensearch = false;
      // this.$refs.input.blur();
      this.$router.push({ path: `/home/search/${this.searchdata}` });
    },
    // 搜索建议
    searchsug () {

      if (this.timeout)
      {
        clearTimeout(this.timeout)
      }
      // 防抖
      this.timeout = setTimeout(() => {
        this.$http.get('/search/suggest', {
          params: {
            keywords: this.searchdata
          }
        }).then(({ data }) => {
          if (data.code == 400) return
          this.searchsugarr = data.result
          this.sugopenflag = true
          console.log(this.searchsugarr);
        })
      }, 200);

    },
    // 清空搜索记录
    clearSearchData () {
      this.$store.dispatch("clearSearchHistory");
      this.searchHistoryflag = false;
    },
    // 点击热搜词搜索
    tosearch (item) {
      // console.log(item);
      this.searchdata = item;
      this.search();
    },
    // 删除某条搜索记录
    deletesearch (item, e) {
      this.$store.dispatch("deletsearchitem", item);
      // 阻止冒泡
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
    },

  },
  computed: {
    ...mapGetters(["searchHistory"]),
  },
  directives: {
    // 自定义指令 能够在组件外部控制弹窗关闭
    // https://www.cnblogs.com/yangzhou33/p/10023410.html
    clickoutside: {
      bind: function (el, binding, vnode) {
        const documentHandler = function (e) {
          if (!vnode.context || el.contains(e.target)) return;
          binding.value(e);
        };

        setTimeout(() => {
          document.addEventListener("click", documentHandler);
        }, 0);
      },
    },
  },
  watch: {
    searchdata (newval) {
      if (newval == "")
      {
        this.opensearch = true;
        this.sugopenflag = false
      }
    },
    searchsug () {

    }
  },
};
</script>

<style lang="less" scoped>
.searchbar {
  margin-left: 20px;
  position: relative;
}
/deep/.el-input__inner {
  border-radius: 20px;
  width: 160px;
  background-color: #e13e3e;
  border: 0;
  text-indent: 12px;
  color: white;
}
/deep/ .searchbar input::-webkit-input-placeholder {
  color: #f1766a;
}
.searchbar .el-icon-search {
  font-size: 12px;
  position: absolute;
  left: 10px;
  top: 17px;
}
.searchbox {
  height: 420px;
  width: 280px;
  background-color: #ffffff;
  position: absolute;
  top: 43px;
  border-radius: 5px;
  border: 1px solid #ffffff;
  box-shadow: 2px 2px 2px #aaaaaa;
  overflow-y: hidden;
  z-index: 1000;
}
.searchbox:hover {
  overflow: overlay;
}
.searchbox p:nth-child(1) {
  color: #676767;
  font-size: 14px;
  display: flex;
  text-indent: 20px;
}
.searchbox p:nth-child(1) image {
  margin-left: 5px;
  width: 10px;
  height: 10px;
}
.searchHistory {
  display: flex;
  flex-wrap: wrap;
}
.searchHistory .searchitem {
  color: #373737;
  border: 1px solid #e2e2e2;
  border-radius: 10px;
  padding: 0 15px;
  font-size: 14px;
  margin-right: 5px;
  margin-left: 10px;
  margin-top: 10px;
  cursor: pointer;
  position: relative;
  span {
    display: none;
    position: absolute;
    right: 6px;
  }
}
.searchitem:hover {
  background: #f2f2f2;
  span {
    display: inline;
  }
  span:hover {
    color: #f1766a;
  }
}
.hotSearchItem {
  color: #484848;
  font-size: 14px;
  display: flex;
  height: 35px;
  align-items: center;
  cursor: pointer;
}
.hotSearchItem:hover {
  background: #f2f2f2;
}
.hotSearchItem:nth-child(-n + 4) .hotnum {
  color: #ff3d3d !important;
  margin-left: 30px;
}

.hotSearchItem:nth-child(-n + 4) .hotname {
  color: #333333;
  margin-left: 20px;
}

.hotSearchItem .hotnum {
  font-size: 18px;
  color: #c1c1c1;
  margin-left: 30px;
}

.hotSearchItem .hotname {
  margin-left: 20px;
}
</style>

<style >
.sugsearch {
  text-align: left;
}
.sugsearch .title {
  font-size: 16px;
  color: #9f9f9f;
  margin-top: 10px;
  margin-left: 10px;
}
.sugsearch .content {
  color: #484848;
  font-size: 14px;
  display: flex;
  height: 30px;
  align-items: center;
  cursor: pointer;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 10px;
}
.sugsearch .content:hover {
  background: #f2f2f2;
}
</style>
