/* global wx:readonly */

// rank list: refer to https://forum.cocos.org/t/topic/59428

const PAGE_SIZE = 10;
const ITEM_HEIGHT = 60;

const AVATAR_WIDTH = 50;
const RANK_SIZE = 30;
const NAME_SIZE = 24;
const SCORE_SIZE = 20;

function drawRankItem(ctx, index, rank, data, pageLen) {
  const { avatarUrl } = data;
  const nick = data.nickname.length <= 10 ? data.nickname : `${data.nickname.substr(0, 10)}...`;
  const kvData = data.KVDataList.find((kd) => kd.key === 'score');
  const grade = kvData ? kvData.value : 0;
  const itemGapY = ITEM_HEIGHT * index;
  // 名次
  ctx.fillStyle = '#D8AD51';
  ctx.textAlign = 'right';
  ctx.baseLine = 'middle';
  ctx.font = `${RANK_SIZE}px Helvetica`;
  ctx.fillText(`${rank}`, 45, ITEM_HEIGHT - ((ITEM_HEIGHT - RANK_SIZE) / 2) + itemGapY);

  // 头像
  const avatarImg = wx.createImage();
  avatarImg.src = avatarUrl;
  avatarImg.onload = () => {
    if (index + 1 > pageLen) {
      return;
    }
    ctx.drawImage(avatarImg,
      60, ((ITEM_HEIGHT - AVATAR_WIDTH) / 2) + itemGapY,
      AVATAR_WIDTH, AVATAR_WIDTH);
  };

  // 名字
  ctx.fillStyle = '#ECF0F1';
  ctx.textAlign = 'left';
  ctx.baseLine = 'middle';
  ctx.font = `${NAME_SIZE}px Helvetica`;
  ctx.fillText(nick, 120, ITEM_HEIGHT - ((ITEM_HEIGHT - NAME_SIZE) / 2) + itemGapY);
  // 分数
  ctx.fillStyle = '#D3FBD8';
  ctx.textAlign = 'left';
  ctx.baseLine = 'middle';
  ctx.font = `${SCORE_SIZE}px cursive`;
  ctx.fillText(`${grade}分`, 280, ITEM_HEIGHT - ((ITEM_HEIGHT - SCORE_SIZE) / 2) + itemGapY);
}

function showPageRanks(ctx, pageNumber, gameData) {
  const pageStart = pageNumber * PAGE_SIZE;
  const pagedData = gameData.slice(pageStart, pageStart + PAGE_SIZE);
  const pageLen = pagedData.length;

  ctx.clearRect(0, 0, 375, 667);
  ctx.fillStyle = 'rgba(89, 89, 84, 0.5)';
  ctx.fillRect(0, 0, 375, 667);
  for (let i = 0, len = pagedData.length; i < len; i += 1) {
    drawRankItem(ctx, i, pageStart + i + 1, pagedData[i], pageLen);
  }
}

wx.onMessage((data) => {
  if (data.action === 'GET_SCORE') {
    wx.getUserCloudStorage({
      keyList: ['score'],
    });
  } else if (data.action === 'GET_FRIEND_SCORE') {
    wx.getFriendCloudStorage({
      keyList: ['score'],
    });
    /**
     * 排行榜渲染方案来自网友aleafworld，详细请看他的帖子：http://club.phaser-china.com/topic/5af6bf52484a53dd723f42e1
     */
  } else if (data.action === 'SHOW_RANKING_LIST') {
    wx.getFriendCloudStorage({
      keyList: ['score'],
      success(obj) {
        if (obj.data) {
          const sharedCanvas = wx.getSharedCanvas();
          const context = sharedCanvas.getContext('2d');
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';

          const scoreList = obj.data;
          scoreList.sort((a, b) => b.KVDataList
            .find(
              (kd) => kd.key === 'score',
            ).value - a.KVDataList
            .find(
              (kd) => kd.key === 'score',
            ).value);
          const dataLen = scoreList.length;
          if (dataLen) {
            showPageRanks(context, 0, scoreList);
          }
        }
      },
    });
  }
});
