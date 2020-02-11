export default class startGame extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;

    /** @prop {name:bg_01, tips:"背景1", type:Node}*/
    public bg_01: Laya.Image;

    /** @prop {name:bg_02, tips:"背景2", type:Node}*/
    public bg_02: Laya.Image;

    /** @prop {name:bg_03, tips:"背景3", type:Node}*/
    public bg_03: Laya.Image;

    /** @prop {name:bg_04, tips:"背景4", type:Node}*/
    public bg_04: Laya.Image;

    /** @prop {name:bg_Pure, tips:"纯背景", type:Node}*/
    public bg_Pure: Laya.Sprite;

    /** @prop {name:btn_Start, tips:"开始游戏按钮", type:Node}*/
    public btn_Start: Laya.Sprite;

    /** @prop {name:btn_Participate, tips:"分享按钮", type:Node}*/
    public btn_Participate: Laya.Image;

    /** @prop {name:btn_Ranking, tips:"排行榜按钮", type:Node}*/
    public btn_Ranking: Laya.Image;

    /** @prop {name:starParent, tips:"闪烁星星的父节点", type:Node}*/
    public starParent: Laya.Sprite;

    /** @prop {name:LoGo, tips:"标题", type:Node}*/
    public LoGo: Laya.Image;

    /**星星开始开关*/
    private starSwich: boolean;
    /**标题上的星星动画产生时间记录*/
    private starTime: number;
    /**标题上星星产生的时间间隔*/
    private starInterval: number;

    /**开始按钮动画开关*/
    private startBSwitch: boolean;
    /**开始按钮抖动方向记录*/
    private startBTime: number;
    /**开始按钮星星产生的时间间隔*/
    private startBInterval: number;
    /**开始按钮抖动次数*/
    private startBNum: number;

    /**开始游戏点击一次就结束，不可多次点击*/
    private againClik: boolean;

    constructor() { super(); }

    onEnable(): void {
        this.init();
    }

    /**动画模式
    * @param type 类型，不同类型动画不一样
   */
    aniTypeInit(type) {
        if (type === 'start') {
            this.startAniInit();
        } else if (type === 'returnStart') {
            this.returnStartInit();
        }
    }

    /**初始化一些非动画属性*/
    init(): void {
        this.self = this.owner as Laya.Sprite;
        this.selfScene = this.self.scene as Laya.Scene;
        this.self['startGame'] = this;

        this.LoGo.zOrder = 1000;//logo下面要有星星动画

        this.starSwich = true;
        this.starTime = Date.now();
        this.starInterval = 10;

        this.startBSwitch = null;
        this.startBInterval = null;
        this.startBTime = Date.now();
        this.startBNum = 0;


        this.againClik = true;
    }

    /**进入界面的动画节点属性*/
    startAniInit(): void {
        this.bg_01.x = 187;
        this.bg_01.y = 410;

        this.bg_02.x = 562;
        this.bg_02.y = 410;

        this.bg_03.x = 187;
        this.bg_03.y = 1230;

        this.bg_04.x = 562;
        this.bg_04.y = 1230;

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
        this.startAni();
    }

    /**动画初始化*/
    startAni(): void {
        // LoGo
        Laya.Tween.to(this.LoGo, { x: 375, rotation: 1080, alpha: 1, scaleX: 1, scaleY: 1 }, 700, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            this.LoGo.rotation = 0;
            this.starInterval = 300;//logo后面的星星出发间隔，开始很小，现在平稳
        }, []), 0);
        // 开始按钮
        // 动画结束之后出现
        Laya.Tween.to(this.btn_Start, { x: 375, rotation: -1080, alpha: 1, scaleX: 1, scaleY: 1 }, 700, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            this.btn_Start.rotation = 0;
            this.buttonAppear();
            // 第一次立即执行btn_Start抖动动画
            this.startBSwitch = true;
            this.startBInterval = 0;
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
        //隐藏其他元素
        this.bg_Pure.alpha = 0;
        this.LoGo.alpha = 0;
        this.btn_Start.alpha = 0;
        this.btn_Ranking.alpha = 0;
        this.btn_Participate.alpha = 0;

        // 4个背景拉开
        Laya.Tween.to(this.bg_01, { x: -1500, alpha: 0, scaleX: 0, scaleY: 0, rotation: -720 }, 800, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
            this.bg_01.rotation = 0;
            this.self.removeSelf();
            this.selfScene['MainSceneControl'].startGame();
        }, []), 0);

        Laya.Tween.to(this.bg_02, { x: 1500, alpha: 0, scaleX: 0, scaleY: 0, rotation: -720 }, 800, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
            this.bg_02.rotation = 0;
        }, []), 0);

        Laya.Tween.to(this.bg_03, { x: -1500, alpha: 0, scaleX: 0, scaleY: 0, rotation: -720 }, 800, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
            this.bg_03.rotation = 0;
        }, []), 0);

        Laya.Tween.to(this.bg_04, { x: 1500, alpha: 0, scaleX: 0, scaleY: 0, rotation: -720 }, 800, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
            this.bg_04.rotation = 0;
        }, []), 0);
    }


    /**返回主界面初始化一些节点的位置*/
    returnStartInit(): void {
        this.bg_01.x = -1500;
        this.bg_01.alpha = 0;
        this.bg_02.x = 1500;
        this.bg_02.alpha = 0;
        this.bg_03.x = -1500;
        this.bg_03.alpha = 0;
        this.bg_04.x = 1500;
        this.bg_04.alpha = 0;

        this.bg_Pure.alpha = 0;

        this.btn_Start.x = 375;
        this.btn_Start.alpha = 0;
        this.btn_Start.scale(1, 1);

        this.LoGo.x = 375;
        this.LoGo.alpha = 0;
        this.LoGo.scale(1, 1);

        this.btn_Participate.alpha = 0;
        this.btn_Participate.scale(1, 1);
        this.btn_Ranking.alpha = 0;
        this.btn_Ranking.scale(1, 1);
        this.returnStartAni();
    }

    /**返回主界面动画*/
    /**开始游戏界面消失动画*/
    returnStartAni(): void {
        this.bg_01.x = 187;
        this.bg_01.y = 410;

        this.bg_02.x = 562;
        this.bg_02.y = 410;

        this.bg_03.x = 187;
        this.bg_03.y = 1230;

        this.bg_04.x = 562;
        this.bg_04.y = 1230;

        // 4个背景合并
        Laya.Tween.to(this.bg_01, { x: 187, alpha: 1, scaleX: 1, scaleY: 1, rotation: -720 }, 800, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            // 显示其他元素
            this.bg_Pure.alpha = 1;
            this.LoGo.alpha = 1;
            this.btn_Ranking.alpha = 1;
            this.btn_Participate.alpha = 1;
            this.bg_01.rotation = 0;
            this.btn_Start.scale(0.1, 0.1);
            this.starInterval = 300;//logo后面的星星出发间隔，开始很小，现在平稳
            Laya.Tween.to(this.btn_Start, { alpha: 1, scaleX: 1, scaleY: 1, rotation: 0 }, 200, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                // 第一次立即执行btn_Start抖动动画
                this.startBSwitch = true;
                this.startBInterval = 0;
                this.btnClink();
            }, []), 0);

        }, []), 0);

        Laya.Tween.to(this.bg_02, { x: 562, alpha: 1, scaleX: 1, scaleY: 1, rotation: 720 }, 800, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            this.bg_02.rotation = 0;
        }, []), 0);

        Laya.Tween.to(this.bg_03, { x: 187, alpha: 1, scaleX: 1, scaleY: 1, rotation: 720 }, 800, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            this.bg_03.rotation = 0;
        }, []), 0);

        Laya.Tween.to(this.bg_04, { x: 562, alpha: 1, scaleX: 1, scaleY: 1, rotation: -720 }, 800, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            this.bg_04.rotation = 0;
        }, []), 0);
    }

    /**星星特效*/
    starShiningEffect(): void {
        let spacingX = 50;//logo以外扩大的像素范围
        let spacingY = 20;
        let insideW = this.LoGo.width - 20;//内部排除的像素范围
        let insideH = this.LoGo.height - 20;
        //右上角原点1
        let originX1 = this.LoGo.x - insideW / 2 - spacingX;
        let originY1 = this.LoGo.y - insideH / 2 - spacingY;
        //以logo为中心左右范围
        let x1;
        let y1;
        do {
            x1 = originX1 + Math.random() * (insideW + spacingX * 2);
        } while (Math.abs(x1 - this.LoGo.x) < insideW / 2);
        y1 = originY1 + Math.random() * insideH + spacingY;

        //以logo为中心上下范围
        //右上角原点2
        let originX2 = this.LoGo.x - insideW / 2;
        let originY2 = this.LoGo.y - insideH / 2 - spacingY;
        let x2;
        let y2;
        x2 = originX2 + Math.random() * insideW;
        do {
            y2 = originY2 + Math.random() * (insideH + spacingY * 2);
        } while (Math.abs(y2 - this.LoGo.y) < insideH / 2);

        // 在两个范围内随机产生一个位置
        let x;
        let y;

        let random = Math.floor(Math.random() * 3);
        if (random === 0) {
            x = x1;
            y = y1;
        } else {
            x = x2;
            y = y2;
        }
        let zoder = this.LoGo.zOrder - 1;
        this.selfScene['MainSceneControl'].explodeAni(this.starParent, x, y, 'starShining', 1, 100);
    }

    /**星星消失动画*/
    starVanish(): void {
        this.starSwich = false;
        Laya.Tween.to(this.starParent, { alpha: 0, }, 100, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            this.starParent.removeChildren(0, this.starParent._children.length - 1);
        }, []), 0);
    }

    /**开始按钮左右抖动*/
    startBtnAni() {
        this.startBInterval = 1050;//重置间隔，第一次的时候是0，立即执行
        Laya.Tween.to(this.btn_Start, { rotation: -5 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.btn_Start, { rotation: 5 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                // 动画结束之后清除动画，防止重叠
                Laya.Tween.clearTween(this.btn_Start);
                this.startBNum++;
                if (this.startBNum % 5 === 0) {
                    this.wholeAni();
                    this.startBSwitch = false;
                }
            }, []), 0);
        }, []), 0);
    }

    /**整体动画*/
    wholeAni(): void {
        /**开始按钮旋转*/
        Laya.Tween.to(this.btn_Start, { rotation: 360 }, 800, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            this.btn_Start.rotation = 0;
            this.startBSwitch = true;
        }, []), 0);
        // logo上下位移
        Laya.Tween.to(this.LoGo, { y: this.LoGo.y - 100 }, 400, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.LoGo, { y: this.LoGo.y + 100 }, 400, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            }, []), 0);
        }, []), 0);

        //下面两个按钮上下位移
        Laya.Tween.to(this.btn_Participate, { y: this.btn_Participate.y + 100 }, 400, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.btn_Participate, { y: this.btn_Participate.y - 100 }, 400, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            }, []), 0);
        }, []), 0);

        Laya.Tween.to(this.btn_Ranking, { y: this.btn_Ranking.y + 100 }, 400, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.btn_Ranking, { y: this.btn_Ranking.y - 100 }, 400, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            }, []), 0);
        }, []), 0);


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

    /**关闭点击事件*/
    /**按钮点击事件*/
    closeBtnClink(): void {
        // 开始游戏
        this.btn_Start.off(Laya.Event.MOUSE_DOWN, this, this.down);
        this.btn_Start.off(Laya.Event.MOUSE_MOVE, this, this.move);
        this.btn_Start.off(Laya.Event.MOUSE_UP, this, this.up);
        this.btn_Start.off(Laya.Event.MOUSE_OUT, this, this.out);
        // 排行
        this.btn_Ranking.off(Laya.Event.MOUSE_DOWN, this, this.down);
        this.btn_Ranking.off(Laya.Event.MOUSE_MOVE, this, this.move);
        this.btn_Ranking.off(Laya.Event.MOUSE_UP, this, this.up);
        this.btn_Ranking.off(Laya.Event.MOUSE_OUT, this, this.out);
        // 分享
        this.btn_Participate.off(Laya.Event.MOUSE_DOWN, this, this.down);
        this.btn_Participate.off(Laya.Event.MOUSE_MOVE, this, this.move);
        this.btn_Participate.off(Laya.Event.MOUSE_UP, this, this.up);
        this.btn_Participate.off(Laya.Event.MOUSE_OUT, this, this.out);
    }


    down(event): void {
        event.currentTarget.scale(0.95, 0.95);
        Laya.timer.pause();
    }
    /**移动*/
    move(event): void {
        Laya.timer.resume();
        event.currentTarget.scale(1, 1);
    }
    /**抬起增加属性
     * 由于这里的按钮不是及时消失，所以要关闭点击事件
    */
    up(event): void {
        event.currentTarget.scale(1, 1);
        if (event.currentTarget.name === 'btn_Start') {
            this.starVanish();
            this.vanishAni();
        } else if (event.currentTarget.name === 'btn_Participate') {

        } else if (event.currentTarget.name === 'btn_Ranking') {

        }
        Laya.timer.resume();
        this.closeBtnClink();
    }
    /**出屏幕*/
    out(event): void {
        Laya.timer.resume();
        event.currentTarget.scale(1, 1);
    }

    onUpdate(): void {
        let time = Date.now();
        // 星星动画
        if (this.starSwich) {
            if (time - this.starInterval > this.starTime) {
                this.starTime = time;
                this.starShiningEffect();
            }
        }

        // 开始按钮动画
        if (this.startBSwitch) {
            if (time - this.startBInterval > this.startBTime) {
                this.startBTime = time;
                this.startBtnAni();
            }
        }

    }



    onDisable(): void {
        Laya.Tween.clearAll(this);
        Laya.timer.clearAll(this);
    }
}