const actions = {
  //登陆面板状态
  changeloginbar({ commit }, loginflag) {
    commit("changeloginbar", loginflag);
  },
  // 保存用户个人信息
  saveUserInfo({ commit }, profile) {
    commit("saveUserInfo", profile);
  },

  // 搜索历史
  saveSearchHistory({ commit }, searchHistory) {
    commit("saveSearchHistory", searchHistory);
  },
  // 删除某条搜索记录
  deletsearchitem({ commit }, searchitem) {
    commit("deletsearchitem", searchitem);
  },
  //清空搜索记录
  clearSearchHistory({ commit }) {
    commit("clearSearchHistory");
  },
  //收藏的歌单
  saveplayListCollect({ commit }, playListCollect) {
    commit("saveplayListCollect", playListCollect);
  },
  //个人歌单
  saveplayListMine({ commit }, playListMine) {
    commit("saveplayListMine", playListMine);
  },
  //保存cookie
  saveCookie({ commit }, cookie) {
    commit("saveCookie", cookie);
  },
  // savecurrentactive({ commit }, currentactive) {
  //   commit('savecurrentactive', currentactive);
  // },
  // 保存当前url
  savecurrenturl({ commit }, currenturl) {
    commit("savecurrenturl", currenturl);
  },
  //保存当前歌曲详情
  savesongDetails({ commit }, songDetails) {
    commit("savesongDetails", songDetails);
  },
  //保存当前歌曲列表
  saveplaysonglist({ commit }, playsonglist) {
    commit("saveplaysonglist", playsonglist);
  },
  // 下一首播放列表
  savenextsonglist({ commit }, nextsonglist) {
    commit("savenextsonglist", nextsonglist);
  },
  clearnextsonglist({ commit }) {
    commit("clearnextsonglist");
  },
  //播放当前选中歌曲并放到列表的下一首而不是列表最后面
  savenextsong({ commit }, nextsonglist) {
    commit("savenextsong", nextsonglist);
  },
  //删除选中歌曲
  deletesong({ commit }, index) {
    commit("deletesong", index);
  },
  // 清空当前播放列表
  clearplaysonglist({ commit }) {
    commit("clearplaysonglist");
  },
  //当前播放状态
  saveplaystatus({ commit }, playstatus) {
    commit("saveplaystatus", playstatus);
  },
  //当前播放顺序
  saveplayorder({ commit }, playorder) {
    commit("saveplayorder", playorder);
  },
  //当前音量
  savevolume({ commit }, volume) {
    commit("savevolume", volume);
  },
  //当前播放时间
  savecurrentTime({ commit }, currentTime) {
    commit("savecurrentTime", currentTime);
  },
  //歌曲详情面板
  savesongdetailflag({ commit }, songdetailflag) {
    commit("savesongdetailflag", songdetailflag);
  },
};
export default actions;
