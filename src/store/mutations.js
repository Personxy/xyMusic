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
    state.searchHistory.unshift(searchHistory);
    state.searchHistory = [...new Set(state.searchHistory)];
  },
  //删除某条搜索记录
  deletsearchitem(state, searchitem) {
    for (let index = 0; index < state.searchHistory.length; index++) {
      if (state.searchHistory[index] === searchitem) {
        state.searchHistory.splice(index, 1);
      }
    }
  },
  //清空搜索记录
  clearSearchHistory(state) {
    state.searchHistory = [];
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
    if (playsonglist) {
      state.playsonglist = state.playsonglist.concat(playsonglist);
    } else {
      state.playsonglist.push(playsonglist);
    }
    // 去掉重复添加的歌曲
    state.playsonglist = state.playsonglist.filter((element, index, arr) => {
      return arr.findIndex((el) => el.id == element.id) === index;
    });
  },
  // 保存下一首播放列表
  savenextsonglist(state, nextsonglist) {
    let type = 2;
    if (type == 1) {
      // 找到当前播放歌曲的index
      let i = 0;
      if (state.songDetails) {
        state.playsonglist.forEach((element, index, arr) => {
          if (arr[index].id == state.songDetails.id) {
            i = index;
          }
        });
        // 正在播放歌曲时，把下一首添加当前播放歌曲后面
        state.nextsonglist.unshift(nextsonglist);
      } else {
        // 没有播放歌曲时放到列表最后面
        state.nextsonglist.push(nextsonglist);
      }
      // 去重
      state.nextsonglist = state.nextsonglist.filter((element, index, arr) => {
        return arr.findIndex((el) => el.id == element.id) === index;
      });
      // 把列表放到当前播放歌曲后面

      state.playsonglist.splice(i + 1, 0, ...state.nextsonglist);
      // 去重;
      state.playsonglist = state.playsonglist.filter((element, index, arr) => {
        return arr.findIndex((el) => el.id == element.id) === index;
      });
    } else if (type == 2) {
      //  首先判断添加的歌曲是否在列表里存在
      let isExist = state.playsonglist.find((element, index, arr) => {
        return arr[index].id == nextsonglist.id;
      });
      // 正在播放歌曲时，找到当前播放歌曲的index 且列表存在当前播放的歌曲
      let i = 0;
      if (state.songDetails && isExist) {
        state.playsonglist.forEach((element, index, arr) => {
          if (arr[index].id == state.songDetails.id) {
            i = index;
          }
        });
        //  添加的下一首歌曲不是当前播放歌曲
        if (state.songDetails.id != nextsonglist.id) {
          //找到下一首在列表中的位置
          let j = 0;
          state.playsonglist.forEach((element, index, arr) => {
            if (arr[index].id == nextsonglist.id) {
              j = index;
            }
          });
          // 把添加的歌曲放到正在播放歌曲的后面
          state.playsonglist.splice(i + 1, 0, nextsonglist);
          // 正在播放歌曲在添加的歌曲后面
          if (i > j) {
            state.playsonglist.splice(j, 1);
          }
          // 去重
          state.playsonglist = state.playsonglist.filter((element, index, arr) => {
            return arr.findIndex((el) => el.id == element.id) === index;
          });
        } else {
          //  添加了歌曲本身 交换相邻两个元素
          state.playsonglist.splice(i + 1, 0, state.playsonglist[i + 1]);
        }
      } else if (state.songDetails && !isExist) {
        state.playsonglist.splice(i + 1, 0, nextsonglist);
      } else if (!state.songDetails && !isExist) {
        state.playsonglist[0] = nextsonglist;
      }
    }
  },
  // 清空下一首播放列表
  clearnextsonglist(state) {
    state.nextsonglist = [];
  },
  // 将歌曲添加到当前歌曲的下一首并播放
  savenextsong(state, nextsonglist) {
    let i = 0;
    if (state.songDetails) {
      state.playsonglist.forEach((element, index, arr) => {
        if (arr[index].id == state.songDetails.id) {
          i = index;
        }
      });
      // 把列表放到当前播放歌曲后面
      state.playsonglist.splice(i + 1, 0, nextsonglist);
    } else {
      // 当前没有播放歌曲时把要播放的歌曲放到第一首
      state.playsonglist.splice(i, 0, nextsonglist);
    }
    // 去重
    state.playsonglist = state.playsonglist.filter((element, index, arr) => {
      return arr.findIndex((el) => el.id == element.id) === index;
    });
  },
  //删除歌曲
  deletesong(state, index) {
    state.playsonglist.splice(index, 1);
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
  //歌曲详情面板
  savesongdetailflag(state, songdetailflag) {
    state.songdetailflag = songdetailflag;
  },
};
export default mutations;
