/* global wx:readonly */

const sharedCanvas = wx.getSharedCanvas();
const context = sharedCanvas.getContext('2d');
context.fillStyle = 'red';
context.fillRect(0, 0, 375, 667);

wx.onMessage((data) => {
  if (data.action === 'GET_SCORE') {
    wx.getUserCloudStorage({
      keyList: ['score'],
    });
  } else if (data.action === 'GET_FRIEND_SCORE') {
    wx.getFriendCloudStorage({
      keyList: ['score'],
    });
  } else if (data.action === 'UPDATE_SCORE') {
    let maxScore = 0;
    wx.getUserCloudStorage({
      keyList: ['score'],
      success(obj) {
        if (data.currScore) {
          maxScore = data.currScore;
          if (obj.KVDataList) {
            maxScore = Math.max(maxScore,
              parseInt(obj.KVDataList[0].value, 10));
          }
          wx.setUserCloudStorage({
            KVDataList: [{
              key: "score",
              value: maxScore + '',
            }],
            success() {
              // eslint-disable-next-line no-console
              console.log(`save score ${maxScore} success`);
            },
            fail() {
              // eslint-disable-next-line no-console
              console.log(`save score ${maxScore} fail`);
            },
          });
        }
      },
    });
    /**
     * 排行榜渲染方案来自网友aleafworld，详细请看他的帖子：http://club.phaser-china.com/topic/5af6bf52484a53dd723f42e1
     */
  } else if (data.action === 'SHOW_RANKING_LIST') {
    wx.getFriendCloudStorage({
      keyList: ['score'],
      success(obj) {
        if (obj.data) {
          context.clearRect(0, 0, 375, 667);
          context.fillStyle = 'rgba(64, 64, 64, 0.5)';
          context.fillRect(0, 0, 375, 667);

          for (let i = 0; i < obj.data.length; i += 1) {
            context.fillStyle = 'rgba(255,255,255,0.1)';
            context.fillRect(5, i * 35 + 5, 190, 30);

            // 头像
            const avatar = wx.createImage();
            avatar.src = obj.data[i].avatarUrl;
            avatar.onload = (((c, a, ii) => () => {
              c.drawImage(a, 30, ii * 35 + 8, 24, 24);
            })(context, avatar, i)); // 这里是异步执行，要做个闭包处理

            context.fillStyle = 'rgb(250, 250, 250)';
            context.font = '12px Arial';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.fillText(i + 1, 10, i * 35 + 12); // 名次
            context.fillText(obj.data[i].nickname, 60, i * 35 + 12); // 昵称
            context.textAlign = 'right';
            context.fillText(obj.data[i].KVDataList[0].value, 185, i * 35 + 12); // 分数
          }
        }
      },
    });
  }
});
