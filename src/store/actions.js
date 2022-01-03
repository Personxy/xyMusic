const actions = {
  // 保存用户个人信息
  saveUserInfo({ commit }, profile) {
    commit("saveUserInfo", profile);
  },

  // 搜索历史
  saveSearchHistory({ commit }, searchHistory) {
    commit("saveSearchHistory", searchHistory);
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
};
export default actions;
