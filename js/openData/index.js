/* global wx:readonly */

// rank list: refer to https://forum.cocos.org/t/topic/59428

const PAGE_SIZE = 10;
const ITEM_HEIGHT = 125;

function drawRankItem(ctx, index, rank, data, pageLen) {
  const avatarUrl = `${data.avatarUrl.substr(0, data.avatarUrl.length - 1)}132`;
  const nick = data.nickname.length <= 10 ? data.nickname : `${data.nickname.substr(0, 10)}...`;
  const kvData = data.KVDataList.find((kvData) => kvData.key === Consts.OpenDataKeys.Grade);
  const grade = kvData ? kvData.value : 0;
  const itemGapY = ITEM_HEIGHT * index;
  // 名次
  ctx.fillStyle = '#D8AD51';
  ctx.textAlign = 'right';
  ctx.baseLine = 'middle';
  ctx.font = '70px Helvetica';
  ctx.fillText(`${rank}`, 90, 80 + itemGapY);

  // 头像
  const avatarImg = wx.createImage();
  avatarImg.src = avatarUrl;
  avatarImg.onload = () => {
    if (index + 1 > pageLen) {
      return;
    }
    ctx.drawImage(avatarImg, 120, 10 + itemGapY, 100, 100);
  };

  // 名字
  ctx.fillStyle = '#777063';
  ctx.textAlign = 'left';
  ctx.baseLine = 'middle';
  ctx.font = '30px Helvetica';
  ctx.fillText(nick, 235, 80 + itemGapY);

  // 分数
  ctx.fillStyle = '#777063';
  ctx.textAlign = 'left';
  ctx.baseLine = 'middle';
  ctx.font = '30px Helvetica';
  ctx.fillText(`${grade}分`, 620, 80 + itemGapY);

  // 分隔线
  const lineImg = wx.createImage();
  lineImg.src = 'subdomain/images/llk_x.png';
  lineImg.onload = () => {
    if (index + 1 > pageLen) {
      return;
    }
    ctx.drawImage(lineImg, 14, 120 + itemGapY, 720, 1);
  };
}

function showPageRanks(ctx, pageNumber, gameData) {
  const pageStart = pageNumber * PAGE_SIZE;
  const pagedData = gameData.slice(pageStart, pageStart + PAGE_SIZE);
  const pageLen = pagedData.length;

  ctx.clearRect(0, 0, 1000, 1000);
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

          // context.clearRect(0, 0, 375, 667);
          // context.fillStyle = 'rgba(89, 89, 84, 0.5)';
          // context.fillRect(0, 0, 375, 667);

          // const scoreList = obj.data;
          // scoreList.sort((a, b) => b.KVDataList[0].value - a.KVDataList[0].value);

          // for (let i = 0; i < scoreList.length; i += 1) {
          //   context.fillStyle = 'rgba(255,255,255,0.1)';
          //   context.fillRect(5, i * 35 + 5, 190, 30);

          //   // 头像
          //   const avatar = wx.createImage();
          //   avatar.src = scoreList[i].avatarUrl;
          //   avatar.onload = (((c, a, ii) => () => {
          //     c.drawImage(a, 30, ii * 35 + 8, 24, 24);
          //   })(context, avatar, i)); // 这里是异步执行，要做个闭包处理

          //   context.fillStyle = 'rgb(250, 250, 250)';
          //   context.font = '12px Arial';
          //   context.textAlign = 'left';
          //   context.textBaseline = 'top';
          //   context.fillText(i + 1, 10, i * 35 + 16); // 名次
          //   context.fillText(scoreList[i].nickname, 60, i * 35 + 16); // 昵称
          //   context.textAlign = 'right';
          //   if (parseInt(scoreList[i].KVDataList[0].value, 10) > 99) {
          //     context.fillStyle = 'rgb(250, 250, 50)';
          //   }
          //   context.fillText(scoreList[i].KVDataList[0].value, 185, i * 35 + 16); // 分数
          // }
        }
      },
    });
  }
});
