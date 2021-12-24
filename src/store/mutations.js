const mutations = {
  // 登陆面板控制
  changeloginbar(state, loginflag) {
    state.loginflag = loginflag;
  },
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  //搜索历史
  saveSearchHistory(state, searchHistory) {
    state.searchHistory = searchHistory;
  },
  //个人歌单
  saveplayListMine(state, playListMine) {
    state.playListMine = playListMine;
  },
  // 收藏歌单
  saveplayListCollect(state, playListCollect) {
    state.playListCollect = playListCollect;
  },
  //保存cookie
  saveCookie(state, cookie) {
    state.cookie = cookie;
  },
  // savecurrentactive(state, currentactive) {
  //   state.currentactive = currentactive;
  // },
  // 保存当前url
  savecurrenturl(state, currenturl) {
    state.currenturl = currenturl;
  },
  //保存当前歌曲详情
  savesongDetails(state, songDetails) {
    state.songDetails = songDetails;
  },
  //保存当前歌曲列表
  saveplaysonglist(state, playsonglist) {
    // console.log(playsonglist);
    if (playsonglist instanceof Array) {
      state.playsonglist = state.playsonglist.concat(playsonglist);
    } else {
      state.playsonglist.push(playsonglist);
    }
    // 去掉重复添加的歌曲
    state.playsonglist = state.playsonglist.filter((element, index, arr) => {
      return arr.findIndex((el) => el.id == element.id) === index;
    });
  },
  // 清空当前播放列表
  clearplaysonglist(state) {
    state.playsonglist = [];
  },
  // 当前播放状态
  saveplaystatus(state, playstatus) {
    state.playstatus = playstatus;
  },
  //播放顺序
  saveplayorder(state, playorder) {
    state.playorder = playorder;
  },
  //当前音量
  savevolume(state, volume) {
    state.volume = volume;
  },
  //当前播放时间
  savecurrentTime(state, currentTime) {
    state.currentTime = currentTime;
  },
};
export default mutations;
