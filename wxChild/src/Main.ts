import GameConfig from "./GameConfig";
import BigRank from "./view/BigRank";
class Main {
	constructor() {
		//设置子域
		Laya.isWXOpenDataContext = true;
		Laya.isWXPosMsg = true;
		//根据IDE设置初始化引擎		
		Laya.init(GameConfig.width, GameConfig.height, false);
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		// 关于透传接口，请参考: https://ldc2.layabox.com/doc/?nav=zh-ts-5-0-7
		if (Laya.Browser.onMiniGame)
			wx.onMessage(function (data) {
				console.log("子域收到消息： " + JSON.stringify(data));
				if (data.action == "init") {//第一次初始化接受数据监听
					Laya.loader.load("res/atlas/rank.atlas", Laya.Handler.create(this, this.onComplete));

				} else if (data.action == "ranking") {
					BigRank.instance.visible = true;
					BigRank.instance.init();

				} else if (data.action == "close") {
					BigRank.instance.visible = false;
				}
			}.bind(this));
		else
			Laya.loader.load("res/atlas/rank.atlas", Laya.Handler.create(this, this.onComplete));
	}

	onComplete(): void {
		//初始化rank排行榜
		var rank = new BigRank();
		//初始化
		rank.init();
		console.log('进游戏就初始化子域接受数据');
	}
}
//激活启动类
new Main();
