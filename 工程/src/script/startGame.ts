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

    /**标题上的星星动画产生时间记录*/
    private starTime: number;
    /**标题上星星产生的时间间隔*/
    private starInterval: number;


    /**开始按钮抖动开关*/
    private RshakeSwitch: boolean;
    /**开始按钮抖动方向记录*/
    private RDirection: string;

    /**开始按钮抖动事件记录*/
    private RshakeTime: number;
    /**开始按钮抖动时间间隔*/
    private RshakeInterval: number;

    constructor() { super(); }

    onEnable(): void {
        this.init();
    }

    /**初始化一些节点的位置*/
    init(): void {
        this.self = this.owner as Laya.Sprite;
        this.selfScene = this.self.scene as Laya.Scene;

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
        this.btn_Participate.scale(0, 0);
        this.btn_Ranking.alpha = 0;
        this.btn_Ranking.scale(0, 0);
    }

    /**动画模式
     * 
    */
    aniTypeInit(start, returnStart) {

    }

    /**动画初始化*/
    appearAni(): void {
        // LoGo
        Laya.Tween.to(this.LoGo, { x: 375, rotation: 1080, alpha: 1, scaleX: 1, scaleY: 1 }, 600, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            this.LoGo.rotation = 0;
        }, []), 0);
        // 开始按钮
        // 动画结束之后出现
        Laya.Tween.to(this.btn_Start, { x: 375, rotation: -1080, alpha: 1, scaleX: 1, scaleY: 1 }, 600, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            this.btn_Start.rotation = 0;
            this.buttonAppear();
        }, []), 0);
    }

    /**两个操作按钮出现动画*/
    buttonAppear(): void {
        Laya.Tween.to(this.btn_Ranking, { alpha: 1, scaleX: 1, scaleY: 1, rotation: 720 }, 350, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.btn_Participate, { alpha: 1, scaleX: 1, scaleY: 1, rotation: -720 }, 350, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                this.btnClink();
            }, []), 0);
        }, []), 0);
    }

    /**开始游戏界面消失动画*/
    vanishAni(): void {
        this.bg_Pure.alpha = 0;
        this.LoGo.alpha = 0;
        this.btn_Start.alpha = 0;
        this.btn_Ranking.alpha = 0;
        this.btn_Participate.alpha = 0;

        // 两个背景拉开
        Laya.Tween.to(this.bg_01, { x: -1500, alpha: 0, scaleX: 0, scaleY: 0, rotation: 540 }, 800, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
        }, []), 0);

        Laya.Tween.to(this.bg_02, { x: 1500, alpha: 0, scaleX: 0, scaleY: 0, rotation: -540 }, 800, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
            this.self.removeSelf();
            this.selfScene['MainSceneControl'].startGame();
        }, []), 0);
    }

    /**返回主界面动画*/
    /**开始游戏界面消失动画*/
    returnStart(): void {
        // 两个背景拉开
        Laya.Tween.to(this.bg_01, { x: -1500, alpha: 0, scaleX: 0, scaleY: 0, rotation: 540 }, 800, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            this.bg_Pure.alpha = 1;
            this.LoGo.alpha = 1;
            this.btn_Start.alpha = 1;
            this.btn_Ranking.alpha = 1;
            this.btn_Participate.alpha = 1;
        }, []), 0);

        Laya.Tween.to(this.bg_02, { x: 1500, alpha: 0, scaleX: 0, scaleY: 0, rotation: -540 }, 800, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            this.self.removeSelf();
            this.selfScene['MainSceneControl'].startGame();
        }, []), 0);
    }

    /**星星特效*/
    starShiningEffect(): void {
    }

    /**时间抖动抖动
    * 根据进度条的时间来给不同的抖动频率和抖动速度
   */
    timerShake() {
        if (this.RshakeSwitch) {
            let nowTime = Date.now();
            if (nowTime - this.RshakeTime > this.RshakeInterval) {
                this.RshakeTime = nowTime;
                // 目标判断
                if (this.RDirection === "left") {
                    this.btn_Start.rotation = -3;
                    if (this.btn_Start.rotation < 0) {
                        this.RDirection = "right";
                    }
                } else if (this.RDirection === "right") {
                    this.btn_Start.rotation = +3;
                    if (this.btn_Start.rotation > 0) {
                        this.RDirection = "left";
                    }
                }
            }
        }
    }

    /**按钮点击事件*/
    btnClink(): void {
        // 开始游戏
        this.btn_Start.on(Laya.Event.MOUSE_DOWN, this, this.down);
        this.btn_Start.on(Laya.Event.MOUSE_MOVE, this, this.move);
        this.btn_Start.on(Laya.Event.MOUSE_UP, this, this.up);
        this.btn_Start.on(Laya.Event.MOUSE_OUT, this, this.out);
        // 排行
        this.btn_Ranking.on(Laya.Event.MOUSE_DOWN, this, this.down);
        this.btn_Ranking.on(Laya.Event.MOUSE_MOVE, this, this.move);
        this.btn_Ranking.on(Laya.Event.MOUSE_UP, this, this.up);
        this.btn_Ranking.on(Laya.Event.MOUSE_OUT, this, this.out);
        // 分享
        this.btn_Participate.on(Laya.Event.MOUSE_DOWN, this, this.down);
        this.btn_Participate.on(Laya.Event.MOUSE_MOVE, this, this.move);
        this.btn_Participate.on(Laya.Event.MOUSE_UP, this, this.up);
        this.btn_Participate.on(Laya.Event.MOUSE_OUT, this, this.out);
    }
    down(event): void {
        event.currentTarget.scale(0.95, 0.95);
        if (event.currentTarget.name === 'btn_Start') {
            this.vanishAni();
        } else if (event.currentTarget.name === 'btn_Participate') {

        } else if (event.currentTarget.name === 'btn_Ranking') {

        }

    }
    /**移动*/
    move(event): void {
        event.currentTarget.scale(1, 1);
    }
    /**抬起增加属性*/
    up(event): void {
        event.currentTarget.scale(1, 1);
    }
    /**出屏幕*/
    out(event): void {
        event.currentTarget.scale(1, 1);
    }

    onDisable(): void {
    }
}