import Vue from "vue";
import VueRouter from "vue-router";

const originalPush = VueRouter.prototype.push;
//避免提示到当前位置的冗余导航。
//NavigationDuplicated: Avoided redundant navigation to current location 提示解决方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "/home/findmusic",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/home"),
    children: [
      // 发现音乐模块
      {
        name: "findmusic",
        path: "/home/findmusic",
        redirect: "/home/findmusic/personrecom",
        component: () => import("../views/findmusic/findmusic"),
        children: [
          //个性推荐
          {
            name: "personrecom",
            path: "/home/findmusic/personrecom",
            component: () =>
              import("../views/findmusic/personrecom/personrecom.vue"),
          },
          // 歌单
          {
            name: "songlist",
            path: "/home/findmusic/songlist",
            component: () => import("../views/findmusic/songlist/songlist.vue"),
          },
          // 排行榜
          {
            name: "ranking",
            path: "/home/findmusic/ranking",
            component: () => import("../views/findmusic/ranking/ranking.vue"),
          },
          // 歌手
          {
            name: "singer",
            path: "/home/findmusic/singer",
            component: () => import("../views/findmusic/singer/singer.vue"),
          },
          // 最新音乐
          {
            name: "newmusic",
            path: "/home/findmusic/newmusic",
            component: () => import("../views/findmusic/newmusic/newmusic.vue"),
          },
        ],
      },
      //博客模块
      {
        name: "podcast",
        path: "/home/podcast",
        component: () => import("../views/podcast/podcast"),
      },
      //视频
      {
        name: "video",
        path: "/home/video",
        component: () => import("../views/video/video"),
        redirect: "/home/video/videopage",
        children: [
          {
            name: "videopae",
            path: "/home/video/videopage",
            component: () => import("../views/video/videopage/videopage.vue"),
          },
          {
            name: "mvpage",
            path: "/home/video/mvpage",
            component: () => import("../views/video/MVpage/MVpage.vue"),
          },
        ],
      },
      //私人fm
      {
        name: "privatefm",
        path: "/home/privatefm",
        component: () => import("../views/privatefm/privatefm"),
      },
      // 最近播放
      {
        name: "recently",
        path: "/home/recently",
        component: () => import("../views/recently/recently"),
      },
      //音乐云盘
      {
        name: "cloudmusic",
        path: "/home/cloudmusic",
        component: () => import("../views/cloudmusic/cloudmusic"),
      },
      // //我的收藏
      // {
      //   name: 'mycollect',
      //   path: '/home/mycollect',
      //   component: () => import('../views/mycollect/mycollect'),
      // },
      // 歌单
      {
        name: "playlistpage",
        path: "/home/playlistpage/:id",
        component: () => import("../views/playlistpage/playlistpage"),
      },
      // 歌手
      {
        name: "singerdetail",
        path: "/home/singerdetail/:id",
        component: () => import("../views/singer/singer.vue"),
      },
      // 专辑
      {
        name: "album",
        path: "/home/album/:id",
        component: () => import("../views/album/album.vue"),
      },
      // 视频详情页
      {
        name: "videodetail",
        path: "/home/videodetail",
        component: () => import("../views/videodetail/videodetail.vue"),
      },
      //每日推荐歌单
      {
        name: "recomsongs",
        path: "/home/recomsongs",
        component: () => import("../views/recomsongs/receomsongs.vue"),
      },
      //搜索结果
      {
        name: "searchresult",
        path: "/home/search/:keywords",
        component: () => import("../views/searchresult/searchresult.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
