import Vue from 'vue';
import VueRouter from 'vue-router';

const originalPush = VueRouter.prototype.push;
//避免提示到当前位置的冗余导航。
//NavigationDuplicated: Avoided redundant navigation to current location 提示解决方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
Vue.use(VueRouter);

const routes = [
  {
    path: '',
    redirect: '/home/findmusic',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    children: [
      // 发现音乐模块
      {
        name: 'findmusic',
        path: '/home/findmusic',
        component: () => import('../views/findmusic/findmusic'),
      },
      //博客模块
      {
        name: 'podcast',
        path: '/home/podcast',
        component: () => import('../views/podcast/podcast'),
      },
      //视频
      {
        name: 'video',
        path: '/home/video',
        component: () => import('../views/video/video'),
      },
      //私人fm
      {
        name: 'privatefm',
        path: '/home/privatefm',
        component: () => import('../views/privatefm/privatefm'),
      },
      // 最近播放
      {
        name: 'recently',
        path: '/home/recently',
        component: () => import('../views/recently/recently'),
      },
      //音乐云盘
      {
        name: 'cloudmusic',
        path: '/home/cloudmusic',
        component: () => import('../views/cloudmusic/cloudmusic'),
      },
      //我的收藏
      {
        name: 'mycollect',
        path: '/home/mycollect',
        component: () => import('../views/mycollect/mycollect'),
      },
      // 歌单
      {
        name: 'playlistpage',
        path: '/home/playlistpage/:id',
        component: () => import('../views/playlistpage/playlistpage'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
