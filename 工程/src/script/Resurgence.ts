export default class Resurgence extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;
    /**黑色背景遮罩*/
    private background: Laya.Sprite;
    /**复活按钮*/
    private resurgence_Btn: Laya.Image;
    /**倒计时数字底板*/
    private digitalPlate: Laya.Image;
    /**倒计时数字*/
    private digital: Laya.FontClip;

    /**时间线*/
    private timeLine: number;
    /**倒计时开关*/
    private countdown: boolean;

    constructor() { super(); }

    onEnable(): void {
        this.init();
    }

    /**初始化*/
    init(): void {
        this.self = this.owner as Laya.Sprite;
        this.background = this.self.getChildByName('background') as Laya.Sprite;
        this.background.alpha = 0;
        this.resurgence_Btn = this.self.getChildByName('resurgence_Btn') as Laya.Image;
        this.resurgence_Btn.x = -1200;
        this.digitalPlate = this.self.getChildByName('digitalPlate') as Laya.Image;
        this.digitalPlate.x = 1200;
        this.digital = this.self.getChildByName('digital') as Laya.FontClip;
        this.digital.scaleX = 0;
        this.digital.scaleY = 0;
        this.digital.alpha = 0;
        this.timeLine = 0;

        this.countdown = false;

        Laya.timer.frameOnce(100, this, function () {
            this.aniInit();
        })
    }

    //*动画初始化*/ 
    aniInit(): void {
        // 复活按钮
        Laya.Tween.to(this.resurgence_Btn, { x: 375, rotation: 720 }, 700, null, Laya.Handler.create(this, function () {
            this.resurgence_Btn.rotation = 0;
        }, []), 0);
        // 数字地板
        Laya.Tween.to(this.digitalPlate, { x: 375, rotation: 720 }, 700, null, Laya.Handler.create(this, function () {
            this.digitalPlate.rotation = 0;
            this.resurgence_BtnClink();
        }, []), 0);
        // 背景
        Laya.Tween.to(this.background, { alpha: 0.7 }, 700, null, Laya.Handler.create(this, function () {
        }, []), 0);
        // 倒计时数字
        Laya.Tween.to(this.digital, { scaleX: 1.3, scaleY: 1.3, alpha: 1 }, 700, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.digital, { scaleX: 1, scaleY: 1 }, 100, null, Laya.Handler.create(this, function () {
                this.countdown = true;
            }, []), 0);
        }, []), 0);
    }

    /***/ 

    /**复活按钮点击事件*/
    resurgence_BtnClink(): void {
        this.resurgence_Btn.on(Laya.Event.MOUSE_DOWN, this, this.down);
        this.resurgence_Btn.on(Laya.Event.MOUSE_MOVE, this, this.move);
        this.resurgence_Btn.on(Laya.Event.MOUSE_UP, this, this.up);
        this.resurgence_Btn.on(Laya.Event.MOUSE_OUT, this, this.out);
    }
    down(event): void {
        event.currentTarget.scale(0.95, 0.95);
    }
    /**移动*/
    move(event): void {
        event.currentTarget.scale(1, 1);
    }
    /**抬起*/
    up(event): void {
        event.currentTarget.scale(1, 1);
    }
    /**出屏幕*/
    out(event): void {
        event.currentTarget.scale(1, 1);
    }

    onUpdate(): void {
        // 倒计时
        if (this.countdown) {
            this.timeLine++;
            if (this.digital.value === '0') {
                return;
            }
            if (this.timeLine % 60 == 0) {
                this.digital.value = (Number(this.digital.value) - 1).toString();
            }
        }
    }

    onDisable(): void {
        Laya.Pool.recover('resurgence', this.self);
    }
}