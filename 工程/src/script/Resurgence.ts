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
        this.timeLine = 0;

        this.aniInit();
    }

    //*动画初始化*/ 
    aniInit(): void {
        // 复活按钮
        Laya.Tween.to(this.resurgence_Btn, { x: 375 }, 1000, null, Laya.Handler.create(this, function () {
        }, []), 0);
        // 数字地板
        Laya.Tween.to(this.digitalPlate, { x: 375 }, 1000, null, Laya.Handler.create(this, function () {
        }, []), 0);
        // 背景
        Laya.Tween.to(this.background, { alpha: 0.7 }, 1000, null, Laya.Handler.create(this, function () {
        }, []), 0);
        // 倒计时数字
        Laya.Tween.to(this.digital, { scaleX: 1.5, scaleY: 1.5 }, 1000, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.digital, { scaleX: 1, scaleY: 1 }, 1000, null, Laya.Handler.create(this, function () {

            }, []), 0);
        }, []), 0);
    }

    onDisable(): void {
    }
}