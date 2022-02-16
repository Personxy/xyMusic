<template>
  <div class="singer">
    <!-- 歌手检索条件 -->
    <div class="singercondition">
      <!-- 语种 -->
      <div class="language">
        <span class="title">语种：</span>
        <div
          class="languagelist"
          v-for="(item, key, index) in area"
          :key="index"
          @click="choselanguage(item[0], index)"
        >
          <span :class="[lang, { active: currentlang === index }]">{{
            item[1]
          }}</span>
        </div>
      </div>
      <!-- 分类 -->
      <div class="sort">
        <span class="title">分类：</span>
        <div
          class="sortlist"
          v-for="(item, key, index) in type"
          :key="index"
          @click="chosesort(item[0], index)"
        >
          <span :class="[sortint, { active: currentsort === index }]">{{
            item[1]
          }}</span>
        </div>
      </div>
      <!-- 字母筛选 -->
      <div class="letterfilter">
        <span class="title">筛选：</span>
        <div class="letterlistbox">
          <div
            class="letterlist"
            v-for="(item, index) in initial"
            :key="index"
            @click="choseletter(item, index)"
          >
            <div>
              <span :class="[letter, { active: currentletter == index }]">{{
                item == -1 ? "热门" : item
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 歌手列表 -->
    <div
      class="singerlist"
      v-infinite-scroll="getsingerlist"
      infinite-scroll-distance="100px"
      infinite-scroll-delay="500"
    >
      <div
        class="singerinfo"
        v-for="item in artists"
        :key="item.id"
        @click="tosingerpage(item.id)"
      >
        <div class="authoravg">
          <el-image :src="item.picUrl" alt="" lazy>
            <div slot="placeholder" class="image-slot">
              <i
                class="el-icon-loading"
                style="font-size: 120px; color: #dd2f27; margin-top: 30px"
              ></i>
            </div>
          </el-image>
        </div>
        <div class="author">{{ item.name }}</div>
      </div>
    </div>
    <div class="loading" v-if="loading">加载中....</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 默认华语分类 全部 子母索引默认为热门
      type: {
        all: [-1, "全部"],
        man: [1, "男歌手"],
        women: [2, "女歌手"],
        band: [3, "乐队"],
      },
      // 语种
      area: {
        all: [-1, "全部"],
        huayu: [7, "华语"],
        europe: [96, "欧美"],
        japan: [8, "日本"],
        korea: [16, "韩国"],
        other: [0, "其他"],
      },
      // 子母检索
      initial: {
        all: -1,
        a: "a",
        b: "b",
        c: "c",
        d: "d",
        e: "e",
        f: "f",
        g: "g",
        h: "h",
        i: "i",
        j: "j",
        k: "k",
        l: "l",
        m: "m",
        n: "n",
        o: "o",
        p: "p",
        q: "q",
        r: "r",
        s: "s",
        t: "t",
        u: "u",
        v: "v",
        w: "w",
        x: "x",
        y: "y",
        z: "z",
        sing: "#",
      },
      // 获取到的歌手列表
      artists: [],
      // class
      lang: "lang",
      currentlang: 1,
      sortint: "sortint",
      currentsort: 0,
      letter: "letter",
      currentletter: "all",
      //传递的值
      nowtype: -1,
      nowarea: 7,
      nowletter: -1,
      offset: 0,
      loading: false,
    };
  },
  methods: {
    // 获取歌手列表
    async getsingerlist() {
      const { data } = await this.$http.get("/artist/list", {
        params: {
          initial: this.nowletter,
          type: this.nowtype,
          area: this.nowarea,
          offset: this.offset,
          limit: 18,
        },
      });
      this.loading = true;
      this.artists.push.apply(this.artists, data.artists);
      // 清除重复
      this.artists = this.artists.filter((element, index, arr) => {
        return arr.findIndex((el) => el.id == element.id) === index;
      });
      this.offset = this.offset + 18;
      // console.log(this.artists);
    },
    // 选择语种
    choselanguage(area, index) {
      // console.log(area);
      this.currentlang = index;
      this.nowarea = area;
      this.offset = 0;
      this.artists = [];
      this.getsingerlist();
    },
    // 选择分类
    chosesort(type, index) {
      // console.log(type);
      this.currentsort = index;
      this.nowtype = type;
      this.offset = 0;
      this.artists = [];
      this.getsingerlist();
    },
    // 选择字母
    choseletter(letter, index) {
      // console.log(letter);
      this.currentletter = index;
      this.nowletter = letter;
      this.offset = 0;
      this.artists = [];
      this.getsingerlist();
    },
    //跳转到歌手详情页
    tosingerpage(id) {
      this.$router.push(`/home/singerdetail/${id}`);
    },
  },
  created() {
    this.getsingerlist();
  },
};
</script>

<style lang="less">
.singer {
  padding: 0 200px 0 129px;
  .active {
    background: #fdf5f5;
    color: #ec4141;
  }
  .singercondition {
    margin-top: 30px;
    color: #676767;
    .language {
      display: flex;
      margin-bottom: 10px;
      font-size: 15px;
      align-items: center;
      .languagelist {
        cursor: pointer;
        width: 65px;
        border-right: 1px solid #f2f2f2;
        .lang {
          padding: 3px 10px;
          border-radius: 10px;
        }
      }
    }
    .sort {
      display: flex;
      margin-bottom: 10px;
      font-size: 15px;
      align-items: center;
      .sortlist {
        cursor: pointer;
        width: 65px;
        border-right: 1px solid #f2f2f2;
        .sortint {
          padding: 3px 10px;
          border-radius: 10px;
        }
      }
    }

    .letterfilter {
      font-size: 15px;
      .title {
        float: left;
      }
      .letterlistbox {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        text-align: center;
        .letterlist div {
          cursor: pointer;
          width: 65px;
          border-right: 1px solid #f2f2f2;
          margin-bottom: 10px;
          .letter {
            padding: 3px 10px;
            border-radius: 10px;
          }
        }
      }
    }
  }
  .singerlist {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    .singerinfo {
      cursor: pointer;
      margin-right: 15px;
      margin-bottom: 15px;
      .authoravg {
        width: 200px;
        height: 200px;
        img {
          width: 200px;
          height: 200px;
          border-radius: 5px;
        }
      }
      .author {
        width: 200px;
        text-align: left;
      }
    }
  }
}
</style>
