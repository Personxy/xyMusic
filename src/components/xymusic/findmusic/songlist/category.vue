<template>
  <div class="category">
    <!-- 选择按钮 -->
    <div class="allcatebtn" @click="changecatpanel(panel)">
      <span>{{ all.name }}&nbsp;></span>
    </div>
    <!-- 热门分类 -->
    <div class="hotcat">
      <span v-for="(item, index) in tags" :key="item.id" :class="{ active: index == currentindex }" @click="selectcat(index, item.name)">{{ item.name }}</span>
    </div>
    <!-- 分类列表 -->
    <div class="catlist" style="width: 750px; height: 750px" v-show="panel" v-clickoutside="close">
      <div class="top">
        <span style="margin-left: 30px" :class="{ spanactive: spanflag }" @click="selectallcate">全部歌单</span>
      </div>
      <!-- 详细分类 -->
      <div class="contain">
        <div class="catbox" v-for="(item, index) in categories" :key="index">
          <span class="cattitle">{{ item }}</span>
          <!-- 详细分类列表 -->
          <div class="abox">
            <div :class="[catboxlist, { hide: item1.category != index }]" v-for="(item1, index1) in sub" :key="index1">
              <span @click="getcatlist(index1, item1.name)" :class="{ currentcat: currentcatindex == index1 }">{{ item1.category == index ? item1.name : '' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '../../../../plugins/bus';
export default {
  data() {
    return {
      // name
      all: {},
      //歌单种类分类
      categories: {},
      // 全部歌单种类
      sub: [],
      tags: [],
      //热门分类高亮
      currentindex: 1000,
      // 全部分类高亮
      spanflag: false,
      //class
      catboxlist: 'catboxlist',
      // 分类选中高亮
      currentcatindex: 1000,
      // 面板开关控制
      panel: false,
    };
  },
  methods: {
    // 获取歌单分类
    async getlistcat() {
      const {
        data: { all, categories, sub },
      } = await this.$http.get('/playlist/catlist');
      this.all = all;
      this.categories = categories;
      this.sub = sub;
      // console.log(sub);
      // console.log(categories);
    },
    // 热门歌单分类
    async gethotcat() {
      const { data: tags } = await this.$http.get('/playlist/hot');
      // console.log(tags);
      this.tags = tags.tags;
    },

    //点击全部分类
    selectallcate() {
      this.spanflag = true;
      this.currentcatindex = 1000;
      this.currentindex = 1000;
      this.panel = false;
      this.sendmessage('');
      this.all.name = '全部歌单';
    },
    // 热门分类点击
    selectcat(index, item) {
      this.currentindex = index;
      this.currentcatindex = 1000;
      this.spanflag = false;
      this.sendmessage(item);
      this.all.name = item;
      this.panel = false;
    },
    //分类点击
    getcatlist(index1, item) {
      this.currentcatindex = index1;
      this.currentindex = 1000;
      this.spanflag = false;
      this.panel = false;
      this.sendmessage(item);
      this.all.name = item;
    },
    // 面板开关控制
    changecatpanel(panel) {
      this.panel = !panel;
    },
    //传递查询参数
    sendmessage(item) {
      bus.$emit('catname', item);
    },
    // 点击外部关闭面板
    close: function (e) {
      if (this.$el.contains(e.target)) return;
      this.panel = false;
    },
  },
  created() {
    this.getlistcat();
    this.gethotcat();
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
.category {
  margin-top: 50px;
  padding: 0 300px 0 70px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  position: relative;
  .allcatebtn {
    margin-left: 60px;
    cursor: pointer;
    width: 110px;
    height: 35px;
    border-radius: 80px;
    border: 1px solid #cccc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
  }
  .allcatebtn:hover {
    background-color: #f2f2f2;
  }
  .hotcat {
    font-size: 14px;
    color: #676767;

    span {
      display: inline-block;
      margin-left: 5px;
      cursor: pointer;
      padding: 0 10px;
    }
    span:hover {
      color: black;
    }
    .active {
      background-color: #fad8d8;
      color: #ec4141;
      border-radius: 10px;
    }
  }

  .catlist {
    position: absolute;
    top: 45px;
    left: 130px;
    border-radius: 5px;
    box-shadow: 0px 4px 5px 5px #f5f5f5;
    z-index: 5000;
    background-color: #ffffff;
    .top {
      height: 60px;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      span {
        cursor: pointer;
        padding: 5px 10px;
      }
      .spanactive {
        background-color: #fad8d8;
        color: #ec4141;
        border-radius: 15px;
      }
    }
    .contain {
      .catbox {
        text-align: left;
        margin-top: 30px;
        margin-left: 10px;
        .hide {
          display: none;
        }
        .cattitle {
          margin-left: 15px;
          margin-top: 20px;
          margin-right: 60px;
          display: block;
          float: left;
          color: #cfcfcf;
        }
        .abox {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          margin-left: 120px;
          .catboxlist span:hover {
            color: #ec4141;
          }
          .catboxlist span {
            margin-left: 10px;
            width: 80px;
          }
          .currentcat {
            background-color: #fad8d8;
            color: #ec4141;
            border-radius: 15px;
            padding: 5px 7px;
            margin-left: 3px !important;
          }
          .catboxlist {
            cursor: pointer;
            width: 100px;
            margin-top: 20px;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
