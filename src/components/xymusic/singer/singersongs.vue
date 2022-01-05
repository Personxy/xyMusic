<template>
  <div class="singersongs">
    <el-table :data="songs"
              stripe
              style="width: 100%"
              @row-dblclick="getmusic">
      <el-table-column type="index"
                       width="50"> </el-table-column>
      <el-table-column prop="name"
                       label="标题"
                       width="650">
        <template slot-scope="scope">
          <div v-if="songDetails ? scope.row.id == songDetails.id : false"
               style="color: #ec4141">
            {{ scope.row.name }}
            <!-- 当前播放动画 -->
            <div v-if="playstatus"
                 style="display: inline-block">
              <playanimation />
            </div>
            <!-- 暂停图标 -->
            <img src="../../../assets/images/列表暂停图标1.svg"
                 style="margin-bottom: -1px"
                 alt=""
                 v-else />
          </div>
          <div v-else>{{ scope.row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="al.name"
                       label="专辑"
                       width="400">
      </el-table-column>
      <el-table-column prop="dt"
                       label="时间"
                       width="60">
        <template slot-scope="dt">
          {{ (dt.row.dt / 1000) | minutesformat }}
        </template>

        <!-- <slot :dt="dt">
          {{dt.row.dt/1000 | minutesformat}}
        </slot> -->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import playanimation from "../animation/currentplayanimation";

export default {
  props: {
    songs: Array
  },
  components: {
    playanimation
  },
  data () {
    return {

    }
  },
  methods: {
    //播放音乐获取音乐src和音乐详情
    async getmusic (row) {
      const res = await this.$http.get("/song/url", {
        params: {
          id: row.id,
          cookie: this.cookie,
        },
      });
      // console.log(res.data.data[0].url);
      if (res.data.data[0].url == null)
        return this.$message.error("没有版权哦！");
      this.$store.dispatch("savecurrenturl", res.data.data[0].url);
      //获取歌曲详情
      const resdata = await this.$http.get("/song/detail", {
        params: {
          ids: row.id,
        },
      });
      // console.log(resdata);
      // 当前播放歌曲详情
      this.$store.dispatch("savesongDetails", resdata.data.songs[0]);
      //存入当前播放歌曲列表
      this.$store.dispatch("saveplaysonglist", resdata.data.songs[0]);
      //当前播放状态
      this.$store.dispatch("saveplaystatus", true);
    },
  },
  created () {

  },
  computed: {
    ...mapGetters([
      'cookie',
      "songDetails", "playstatus"
    ])
  }
}
</script>
<style lang="less" scoped>
</style>