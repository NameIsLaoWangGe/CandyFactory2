export default class startGame extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;

    /** @prop {name:bg_01, tips:"背景1", type:Node}*/
    public bg_01: Laya.Image;

    /** @prop {name:bg_02, tips:"背景2", type:Node}*/
    public bg_02: Laya.Image;

    /** @prop {name:bg_Pure, tips:"纯背景", type:Node}*/
    public bg_Pure: Laya.Sprite;

    /** @prop {name:btn_Start, tips:"开始游戏按钮", type:Node}*/
    public btn_Start: Laya.Sprite;

    /** @prop {name:btn_Participate, tips:"分享按钮", type:Node}*/
    public btn_Participate: Laya.Image;

    /** @prop {name:btn_Ranking, tips:"排行榜按钮", type:Node}*/
    public btn_Ranking: Laya.Image;

    /** @prop {name:LoGo, tips:"标题", type:Node}*/
    public LoGo: Laya.Image;

    constructor() { super(); }

    onEnable(): void {
        this.init();
    }

    /**初始化一些节点的位置*/
    init(): void {
        this.bg_01.x = 187;
        this.bg_02.x = 562;
        this.bg_Pure.alpha = 1;

        this.btn_Start.x = -1500;
        this.btn_Start.alpha = 0;
        this.btn_Start.scale(0, 0);

        this.LoGo.x = 1500;
        this.LoGo.alpha = 0;
        this.LoGo.scale(0, 0);

        this.btn_Participate.alpha = 0;
        this.btn_Ranking.alpha = 0;

        this.appearAni();
    }
    /**动画初始化*/
    appearAni(): void {
        // 总体显现
        Laya.Tween.to(this.LoGo, { x: 375, rotation: 720, alpha: 1, scaleX: 1, scaleY: 1 }, 700, Laya.Ease.expoInOut, Laya.Handler.create(this, function () {
            this.LoGo.rotation = 0;
        }, []), 0);
        // 复活按钮
        Laya.Tween.to(this.btn_Start, { x: 375, rotation: -720, alpha: 1, scaleX: 1, scaleY: 1 }, 700, Laya.Ease.expoInOut, Laya.Handler.create(this, function () {
            this.btn_Start.rotation = 0;
        }, []), 0);
    }

    onDisable(): void {
    }
}