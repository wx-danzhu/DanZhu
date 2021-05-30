const buttons = [
  {
    key: 'game',
    name: '无尽模式',
    state: 'infiniteGame',
  },
  {
    key: 'basic',
    name: '选关',
    children: [
      {
        name: 'Maze',
        state: 'danzhuGame',
        key: {
          index: 1,
          map: [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0],
            [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2],
            [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4],
            [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6],
            [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [9, 8],
            [1, 10], [2, 10], [3, 10], [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10],
            [10, 10],
          ],
        },
      },
      {
        name: 'Spiral',
        state: 'danzhuGame',
        key: {
          /**
 *inner bricks has twice the health, the core brick has thre times the health
 */
          index: 2,
          map: [
            [0, 0, 20],
            [0, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1],
            [0, 2], [2, 2], [8, 2],
            [0, 3], [2, 3], [4, 3], [5, 3], [6, 3], [8, 3],
            [0, 4], [2, 4], [4, 4], [6, 4], [8, 4],
            [0, 5], [2, 5], [4, 5], [6, 5], [8, 5],
            [0, 6], [2, 6], [4, 6], [6, 6], [8, 6],
            [0, 7], [2, 7], [4, 7], [6, 7], [8, 7],
            [0, 8], [2, 8], [6, 8], [8, 8],
            [0, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [8, 9],
            [0, 10], [8, 10],
            [0, 11], [1, 11], [2, 11], [3, 11], [4, 11], [5, 11], [6, 11], [7, 11], [8, 11],
          ],
        },
      },
      {
        name: 'Long corridor',
        state: 'danzhuGame',
        key: {
          index: 3,
          map: [
            [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1],
            [9, 2],
            [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3],
            [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6],
            [0, 7],
            [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8],
          ],
        },
      },
      {
        name: 'clusters',
        state: 'danzhuGame',
        key: {
          index: 4,
          map: [
            [4, 1], [5, 1], [6, 1],
            [4, 2], [5, 2], [6, 2],
            [1, 4], [8, 4],
            [0, 5], [2, 5], [7, 5], [9, 5],
            [0, 6], [2, 6], [7, 6], [9, 6],
            [0, 7], [2, 7], [7, 7], [9, 7],
            [0, 8], [2, 8], [7, 8], [9, 8],

          ],
        },
      },
      {
        name: 'Scattered',
        state: 'danzhuGame',
        key: {
          index: 5,
          map: [
            [0, 0], [2, 0], [4, 0], [6, 0], [8, 0],
            [0, 2], [2, 2], [4, 2], [6, 2], [8, 2],
            [0, 4], [2, 4], [4, 4], [6, 4], [8, 4],
            [0, 6], [2, 6], [4, 6], [6, 6], [8, 6],
            [0, 8], [2, 8], [4, 8], [6, 8], [8, 8],

          ],
        },
      },
      {
        name: 'Smile',
        state: 'danzhuGame',
        key: {
          index: 6,
          map: [
            [2, 1], [4, 1], [6, 1], [8, 1],
            [3, 2], [7, 2],
            [5, 5],
            [4, 6], [5, 6],
            [0, 9], [1, 9], [8, 9], [9, 9],
            [1, 10], [2, 10], [6, 10], [7, 10],
            [3, 11], [4, 11], [5, 11],
          ],
        },
      },
      {
        name: 'Radient',
        state: 'danzhuGame',
        key: {
          index: 7,
          map: [
            [0, 1], [4, 1], [5, 1], [9, 1],
            [1, 2], [4, 2], [5, 2], [8, 2],
            [2, 3], [4, 3], [5, 3], [7, 3],
            [3, 4], [4, 4], [5, 4], [6, 4],
            [4, 5], [5, 5],
            [3, 6], [4, 6], [5, 6], [6, 6],
            [2, 7], [4, 7], [5, 7], [7, 7],
            [1, 8], [4, 8], [5, 8], [8, 8],
            [0, 9], [4, 9], [5, 9], [9, 9],
            [4, 10], [5, 10],
          ],
        },
      },
    ],
  },
  {
    key: 'open',
    name: '排行',
    state: 'rankinglist',
  },
  {
    key: 'title',
    name: '弹珠之城',
  },
  {
    key: 'levelTitle',
    name: '选择关卡',
  },
  {
    key: 'about',
    name: 'About Danzhu 2021',
    state: 'licensepage',
  },
];

export default buttons;
