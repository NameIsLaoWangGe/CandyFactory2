export default class Ranking extends Laya.Script {
    /** @prop {name:but_Close, tips:"关闭按钮", type:Node, default:true}*/
    public but_Close: Laya.Sprite;
    /** @prop {name:content, tips:"内容", type:Node, default:true}*/
    public content: Laya.Sprite;
    /** @prop {name:background, tips:"内容", type:Node, default:true}*/
    public background: Laya.Sprite;

    private self;

    constructor() { super(); }

    onEnable(): void {
        this.init();
    }
    /**初始化*/
    /**初始化一些非动画属性*/
    init(): void {
        this.self = this.owner as Laya.Sprite;
        this.background.alpha = 0;

        this.background.width = Laya.stage.width;
        this.background.height = Laya.stage.height;

        this.content.x = Laya.stage.width / 2;
        this.content.y = Laya.stage.height / 2;
        this.content.scale(0, 0);
        this.content.alpha = 0;
        this.appear();
    }

    onAwake() {
        if (Laya.Browser.onMiniGame) {
            //加载一个json和图集
            Laya.loader.load(["res/atlas/rank.atlas"], Laya.Handler.create(null, function () {
                //加载完成
                //使用接口将图集透传到子域
                Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/rank.atlas");

                let wx: any = Laya.Browser.window.wx;
                let openDataContext: any = wx.getOpenDataContext();
                openDataContext.postMessage({ action: 'ranking' });
            }));
        }
    }


    /**出场动画*/
    appear(): void {
        Laya.Tween.to(this.content, { rotation: 720, alpha: 1, scaleX: 1, scaleY: 1 }, 550, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            this.rotation = 0;
            this.btnClikClink();
        }, []), 0);

        Laya.Tween.to(this.background, { alpha: 0.5 }, 550, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
        }, []), 0);
    }

    /**消失动画*/
    vanish(): void {
        this.self.pivotX = Laya.stage.width / 2;
        this.self.pivotY = Laya.stage.height / 2;
        this.self.x = Laya.stage.width / 2;
        this.self.y = Laya.stage.height / 2;
        Laya.Tween.to(this.self, { rotation: -720, alpha: 0, scaleX: 0, scaleY: 0, x: 1500 }, 700, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
            this.self.removeSelf();
            // 发送排行榜关闭的消息
            if (Laya.Browser.onMiniGame) {
                let wx: any = Laya.Browser.window.wx;
                let openDataContext: any = wx.getOpenDataContext();
                openDataContext.postMessage({ action: 'close' });
            }
        }, []), 0);
        // 背景
        Laya.Tween.to(this.background, { alpha: 0 }, 450, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
        }, []), 0);
    }

    /**开启按钮点击事件*/
    btnClikClink(): void {
        this.but_Close.on(Laya.Event.MOUSE_DOWN, this, this.down);
        this.but_Close.on(Laya.Event.MOUSE_MOVE, this, this.move);
        this.but_Close.on(Laya.Event.MOUSE_UP, this, this.up);
        this.but_Close.on(Laya.Event.MOUSE_OUT, this, this.out);
    }

    /**关闭按钮点击事件*/
    btnCloseClink(): void {
        this.but_Close.off(Laya.Event.MOUSE_DOWN, this, this.down);
        this.but_Close.off(Laya.Event.MOUSE_MOVE, this, this.move);
        this.but_Close.off(Laya.Event.MOUSE_UP, this, this.up);
        this.but_Close.off(Laya.Event.MOUSE_OUT, this, this.out);
    }

    /**按下*/
    down(event): void {
        this.but_Close.scale(0.9, 0.9);
    }
    /**移动*/
    move(event): void {
        this.but_Close.scale(0.9, 0.9);
    }
    /**抬起增加属性
     * 由于这里的按钮不是及时消失，所以要关闭点击事件
    */
    up(event): void {
        this.but_Close.scale(1, 1);

        this.vanish();
    }
    /**出屏幕*/
    out(event): void {
        this.but_Close.scale(1, 1);
    }

    // onAwake() {
    //     this.getChildByName("Button1").on(Laya.Event.CLICK, this, this.click1);
    //     this.getChildByName("Button2").on(Laya.Event.CLICK, this, this.click2);
    //     this.getChildByName("Button3").on(Laya.Event.CLICK, this, this.click3);
    // }

    // click1() {
    //     if (Laya.Browser.onMiniGame) {
    //         //加载一个json和图集
    //         Laya.loader.load(["res/atlas/test.atlas"], Laya.Handler.create(null, function () {
    //             //加载完成

    //             //使用接口将图集透传到子域
    //             Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/test.atlas");

    //             let wx: any = Laya.Browser.window.wx;
    //             let openDataContext: any = wx.getOpenDataContext();
    //             openDataContext.postMessage({ action: 'ranking' });
    //         }));
    //     }
    // }

    // click2() {
    //     if (Laya.Browser.onMiniGame) {
    //         let wx: any = Laya.Browser.window.wx;
    //         let openDataContext: any = wx.getOpenDataContext();
    //         openDataContext.postMessage({ action: 'close' });
    //     }
    // }

    // click3() {
    //     console.log("被子域挡住的按钮");
    // }

    onDisable(): void {
    }
}