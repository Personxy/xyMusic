const state = {
  // 是否打开登陆面板
  loginflag: false,
  //用户信息
  userInfo: sessionStorage.getItem("userInfo")
    ? JSON.parse(sessionStorage.getItem("userInfo"))
    : null,
  // 搜索历史
  searchHistory: sessionStorage.getItem("searchHistory")
    ? JSON.parse(sessionStorage.getItem("searchHistory"))
    : null,
  // 个人歌单信息
  playListMine: sessionStorage.getItem("playListMine")
    ? JSON.parse(sessionStorage.getItem("playListMine"))
    : null,
  // 收藏歌单
  playListCollect: sessionStorage.getItem("playListCollect")
    ? JSON.parse(sessionStorage.getItem("playListCollect"))
    : null,
  //cookie
  cookie: sessionStorage.getItem("cookie")
    ? JSON.parse(sessionStorage.getItem("cookie"))
    : null,
  //当前播放url
  currenturl: sessionStorage.getItem("currenturl"),
  //当前播放歌曲详情
  songDetails: sessionStorage.getItem("songDetails")
    ? JSON.parse(sessionStorage.getItem("songDetails"))
    : null,
  // 当前播放歌曲列表
  playsonglist: sessionStorage.getItem("playsonglist")
    ? JSON.parse(sessionStorage.getItem("playsonglist"))
    : [],
  //当前播放状态
  playstatus: true,
  //播放顺序
  playorder: 1,
  //当前音量
  volume: 50,
  // 当前播放时间
  currentTime: 0,
};

export default state;
