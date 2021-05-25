var buttons = [
	{
		key: 'game',
		name: '快速游戏',
		state: 'danzhuPreload'
	},
	{
		key: 'basic',
		name: '选关',
		children: [
			{
				name: '1',
				state: 'basicLoadAnImage'
			},
			{
				name: '2',
				state: 'basicClickOnAnImageState'
			},
			{
				name: '3',
				state: 'basicMoveAnImageState'
			},
			{
				name: '4',
				state: 'basicImageFollowInputState'
			},
			{
				name: '5',
				state: 'basicLoadAnAnimationState'
			},
			{
				name: '6',
				state: 'basicRenderTextState'
			},
			{
				name: '7',
				state: 'basicTweenAnImageState'
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
 