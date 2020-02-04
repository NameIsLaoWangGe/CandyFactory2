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

    /**属性添加数字*/
    private hintWord: Laya.Prefab;

    constructor() { super(); }

    onEnable(): void {
        this.init();
    }

    /**初始化*/
    init(): void {
        this.self = this.owner as Laya.Sprite;
        this.selfScene = this.self.scene as Laya.Scene;
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

        this.hintWord = this.selfScene['MainSceneControl'].hintWord;

        Laya.timer.frameOnce(150, this, function () {
            this.appearAni();
        })
    }

    //*动画初始化*/ 
    appearAni(): void {
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

    //*动画初始化*/ 
    vanishInit(): void {
        // 复活按钮
        Laya.Tween.to(this.resurgence_Btn, { x: 1200, rotation: -720 }, 700, null, Laya.Handler.create(this, function () {
            this.resurgence_Btn.rotation = 0;
        }, []), 0);
        // 数字地板
        Laya.Tween.to(this.digitalPlate, { x: -1200, rotation: -720 }, 700, null, Laya.Handler.create(this, function () {
            this.digitalPlate.rotation = 0;
            this.resurgence_BtnClink();
        }, []), 0);
        // 背景
        Laya.Tween.to(this.background, { alpha: 0 }, 700, null, Laya.Handler.create(this, function () {
        }, []), 0);
        // 倒计时数字
        Laya.Tween.to(this.digital, { scaleX: 1.3, scaleY: 1.3, alpha: 1 }, 700, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.digital, { scaleX: 0, scaleY: 0 }, 100, null, Laya.Handler.create(this, function () {
                this.roleResurgenceAni();
                this.self.removeSelf();
            }, []), 0);
        }, []), 0);
    }

    /**主角复活动画*/
    roleResurgenceAni(): void {
        let role_01 = this.selfScene['MainSceneControl'].role_01;
        let role_02 = this.selfScene['MainSceneControl'].role_02;
        Laya.Tween.to(role_01, { alpha: 1 }, 700, null, Laya.Handler.create(this, function () {
            this.hintWordMove();
        }, []), 0);
        Laya.Tween.to(role_02, { alpha: 1 }, 700, null, Laya.Handler.create(this, function () {

        }, []), 0);
    }

    /**属性增加提示动画*/
    hintWordMove(): void {
        let delayed = 0;
        let role_01 = this.selfScene['MainSceneControl'].role_01;
        let role_02 = this.selfScene['MainSceneControl'].role_02;
        for (let i = 0; i < 4; i++) {
            Laya.timer.frameOnce(delayed, this, function () {
                for (let j = 0; j < 2; j++) {
                    let hintWord = Laya.Pool.getItemByCreateFun('candy', this.hintWord.create, this.hintWord) as Laya.Sprite;
                    if (j === 0) {
                        role_01.addChild(hintWord);
                    } else {
                        role_02.addChild(hintWord);
                    }
                    hintWord.pos(0, -100);
                    let proPertyType: string;
                    let numberValue: number;
                    switch (i) {
                        case 0:
                            proPertyType = '攻击里';
                            role_01['Role'].role_property.attackValue += 20;
                            role_02['Role'].role_property.attackValue += 20;
                            break;
                        case 1:
                            proPertyType = '生命';
                            role_01['Role'].role_property.blood = 1000;
                            role_02['Role'].role_property.blood = 1000;
                            break;
                        case 2:
                            proPertyType = '公鸡速度';
                            role_01['Role'].role_property.attackSpeed += 20;
                            role_02['Role'].role_property.attackSpeed += 20;
                            break;
                        case 3:
                            proPertyType = '防御力';
                            role_01['Role'].role_property.defense += 20;
                            role_02['Role'].role_property.defense += 20;
                            break;
                        default:
                            break;
                    }
                    numberValue = 5;
                    hintWord['HintWord'].initProperty(proPertyType, numberValue);
                    // 播放完毕之后开始游戏
                    if (i === 3 && j === 1) {
                        this.selfScene['MainSceneControl'].gameOver = false;
                        role_01['Role'].roleDeath = false;
                        role_02['Role'].roleDeath = false;
                    }
                }
            })
            delayed += 25;
        }
    }

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
    /**抬起增加属性*/
    up(event): void {
        event.currentTarget.scale(1, 1);
        this.vanishInit();
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