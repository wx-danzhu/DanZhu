/* global wx:readonly */

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
          context.clearRect(0, 0, 375, 667);
          context.fillStyle = 'rgba(89, 89, 84, 0.5)';
          context.fillRect(0, 0, 375, 667);

          const scoreList = obj.data;
          scoreList.sort((a, b) => b.KVDataList[0].value - a.KVDataList[0].value);

          for (let i = 0; i < scoreList.length; i += 1) {
            context.fillStyle = 'rgba(255,255,255,0.1)';
            context.fillRect(5, i * 35 + 5, 190, 30);

            // 头像
            const avatar = wx.createImage();
            avatar.src = scoreList[i].avatarUrl;
            avatar.onload = (((c, a, ii) => () => {
              c.drawImage(a, 30, ii * 35 + 8, 24, 24);
            })(context, avatar, i)); // 这里是异步执行，要做个闭包处理

            context.fillStyle = 'rgb(250, 250, 250)';
            context.font = '12px Arial';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.fillText(i + 1, 10, i * 35 + 16); // 名次
            context.fillText(scoreList[i].nickname, 60, i * 35 + 16); // 昵称
            context.textAlign = 'right';
            if (parseInt(scoreList[i].KVDataList[0].value, 10) > 99) {
              context.fillStyle = 'rgb(250, 250, 50)';
            }
            context.fillText(scoreList[i].KVDataList[0].value, 185, i * 35 + 16); // 分数
          }
        }
      },
    });
  }
});
