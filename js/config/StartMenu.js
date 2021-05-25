var buttons = [
	{
		key: 'game',
		name: '快速游戏',
		state: 'danzhuGame'
	},
	{
		key: 'basic',
		name: '选关',
		children: [
			{
				name: '1',
				state: 'danzhuGame',
				key: {
					map: [
						[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
						[0, 1],
						[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					],
				},
			},
			{
				name: '2',
				state: 'danzhuGame',
				key: {
					map: [
						[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
						[0, 1],
						[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
						[0, 3],
					],
				},
			},
			{
				name: '3',
				state: 'danzhuGame',
				key: {
					map: [
						[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
						[0, 1],
						[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
						[1, 3],
					],
				},
			},
			{
				name: '4',
				state: 'danzhuGame',
				key: {
					map: [
						[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
						[0, 1],
						[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
						[2, 3],
					],
				},
			},
			{
				name: '5',
				state: 'danzhuGame',
				key: {
					map: [
						[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
						[0, 1],
						[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
						[3, 3],
					],
				},
			},
			{
				name: '6',
				state: 'danzhuGame',
				key: {
					map: [
						[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
						[0, 1],
						[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
						[4, 3],
					],
				},
			},
			{
				name: '7',
				state: 'danzhuGame',
				key: {
					map: [
						[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
						[0, 1],
						[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
						[5, 3],
					],
				},
			}
		]
	},
	{
		key: 'open',
		name: '排行',
		state: 'openShowRankingList',
		children: [
			{
				name: 'show open canvas',
				state: 'openShowOpenCanvas'
			},
			{
				name: 'set your score',
				state: 'openSetCloudScore'
			},
			{
				name: 'get your score',
				state: 'openGetCloudScore'
			},
			{
				name: 'get friend score',
				state: 'openGetFriendCloudScore'
			},
			{
				name: 'show ranking list',
				state: 'openShowRankingList'
			}
		]
	},
	{
		key: 'title',
		name: '弹珠之城',
	},
	{
		key: 'levelTitle',
		name: '选择关卡',
	}
];

export default buttons;
