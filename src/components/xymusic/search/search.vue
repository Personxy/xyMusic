<template>
  <!-- 搜索 -->
  <div class="searchbar">
    <el-input v-model="searchdata"
              placeholder="搜索"
              size="mini"
              @focus="changesearchbox"
              v-clickoutside="close"
              @keyup.enter.native="search"
              ref="input"></el-input>
    <i class="el-icon-search"
       @click="search"
       size="mini"></i>
    <div class="searchbox"
         v-show="opensearch">
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
      <div class="searchHistory">
        <div class="searchitem"
             v-for="item in searchHistory"
             :key="item.id">
          {{ item }}
        </div>
      </div>
      <div class="hotSearch">
        <p>热搜榜</p>
        <div class="hotSearchItem"
             v-for="(item, i) in searchHot"
             :key="item.id">
          <span class="hotnum">{{ i + 1 }}</span>
          <span class="hotname">{{ item.first }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'search',
  data () {
    return {
      searchdata: '',
      opensearch: false,
      searcharr: [],
      searchHistoryflag: true,
      searchHot: [],
    };
  },
  methods: {
    // 控制搜索面板开关且提交热搜请求
    async changesearchbox () {
      this.opensearch = !this.opensearch;
      let res = await this.$http.get('/search/hot');
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
        this.searchdata == 'undefined' ||
        this.searchdata == null ||
        this.searchdata == '' ||
        this.searchdata.replace(/(^s*)|(s*$)/g, '').length == 0
      )
        return;

      this.searcharr.push(this.searchdata);
      this.$store.dispatch('saveSearchHistory', this.searcharr);
      this.searchdata = '';
      this.changesearchbox();
      this.$refs.input.blur();
    },
    // 清空搜索记录
    clearSearchData () {
      this.searcharr = [];
      this.$store.dispatch('saveSearchHistory', this.searcharr);
      this.searchHistoryflag = false;
    },
  },
  computed: {
    ...mapGetters(['searchHistory']),
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
          document.addEventListener('click', documentHandler);
        }, 0);
      },
    },
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
  caret-color: white;
}
/deep/ .searchbar input::-webkit-input-placeholder {
  color: #f1766a;
}
.searchbar .el-icon-search {
  font-size: 12px;
  position: absolute;
  left: 10px;
  top: 16px;
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
