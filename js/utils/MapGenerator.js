export default class MapGenerator {

  constructor(game) {
		this.game = game;
  }
  
  generateMap(stage) {
    var map = [];
    var set = new Set();
    if (stage > 20) {
      stage = 20;
    }
    for(var i=0; i<stage * 6; i++) { // a proportion of stage input
      var num = Math.floor(Math.random() * 111);
      while (set.has(num)) {
        num = Math.floor(Math.random() * 111);
      }
      set.add(num);
      map.push([Math.floor(num/10), num%10]);

    }
    console.log(map);
    return map;
  }
}