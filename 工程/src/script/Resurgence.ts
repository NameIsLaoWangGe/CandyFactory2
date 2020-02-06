export default class Resurgence extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;
    /**黑色背景遮罩*/
    private background: Laya.Sprite;
    /**内容，除了背景图*/
    private content: Laya.Sprite;
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

    /**结算*/
    private settlement: Laya.Prefab;

    constructor() { super(); }

    onEnable(): void {
        this.init();
    }

    /**初始化*/
    init(): void {
        this.self = this.owner as Laya.Sprite;
        this.self.pivotX = 0;
        this.self.pivotY = 0;
        this.self.x = this.self.pivotX;
        this.self.y = this.self.pivotY;

        this.selfScene = this.self.scene as Laya.Scene;
        this.background = this.self.getChildByName('background') as Laya.Sprite;
        this.background.alpha = 0;

        this.content = this.self.getChildByName('content') as Laya.Sprite;
        this.content.alpha = 0;

        this.resurgence_Btn = this.content.getChildByName('resurgence_Btn') as Laya.Image;
        this.resurgence_Btn.x = -1200;

        this.digitalPlate = this.content.getChildByName('digitalPlate') as Laya.Image;
        this.digitalPlate.x = 1200;

        this.digital = this.content.getChildByName('digital') as Laya.FontClip;
        this.digital.scaleX = 0;
        this.digital.scaleY = 0;
        this.digital.alpha = 0;
        this.digital.value = '5';
        this.timeLine = 0;

        this.countdown = false;

        this.hintWord = this.selfScene['MainSceneControl'].hintWord;
        this.settlement = this.selfScene['MainSceneControl'].settlement;

        Laya.timer.frameOnce(100, this, function () {
            this.appearAni();
        })

        this.adaptive();
    }

    /**自适应*/
    adaptive(): void {
        this.background.width = Laya.stage.width;
        this.background.height = Laya.stage.height;
        this.content.x = Laya.stage.width / 2;
        this.content.y = Laya.stage.height / 2;
        this.self.width = Laya.stage.width;
        this.self.height = Laya.stage.height;
        this.self.x = 0;
        this.self.y = 0;
    }

    //*动画初始化*/ 
    appearAni(): void {

        // 总体显现
        Laya.Tween.to(this.content, { alpha: 1 }, 500, null, Laya.Handler.create(this, function () {
        }, []), 0);

        // 复活按钮
        Laya.Tween.to(this.resurgence_Btn, { x: 375, rotation: 720 }, 500, null, Laya.Handler.create(this, function () {
            this.resurgence_Btn.rotation = 0;
        }, []), 0);
        // 数字地板
        Laya.Tween.to(this.digitalPlate, { x: 375, rotation: 720 }, 500, null, Laya.Handler.create(this, function () {
            this.digitalPlate.rotation = 0;
            this.resurgence_BtnClink();
        }, []), 0);
        // 背景
        Laya.Tween.to(this.background, { alpha: 0.7 }, 500, null, Laya.Handler.create(this, function () {
        }, []), 0);

        // 倒计时数字的倒计时动画
        Laya.Tween.to(this.digital, { scaleX: 1.2, scaleY: 1.2, alpha: 1 }, 700, null, Laya.Handler.create(this, function () {
            this.countdown = true;
        }, []), 0);
    }

    /**切换结算界面的消失动画*/
    cutSettlement(): void {
        this.self.pivotX = Laya.stage.width / 2;
        this.self.pivotY = Laya.stage.height / 2;
        this.self.x = this.self.pivotX;
        this.self.y = this.self.pivotY;
        // 移动
        Laya.Tween.to(this.self, { x: 1500, rotation: 720, scaleX: 0, scaleY: 0, alpha: 0 }, 500, null, Laya.Handler.create(this, function () {
            this.self.removeSelf();
        }, []), 0);
        // 移动
        Laya.Tween.to(this.background, { alpha: 0 }, 300, null, Laya.Handler.create(this, function () {
        }, []), 0);
    }

    /**复活消失动画*/
    vanishAni(): void {
        // 复活按钮
        Laya.Tween.to(this.resurgence_Btn, { x: 1200, rotation: -720 }, 450, null, Laya.Handler.create(this, function () {
            this.resurgence_Btn.rotation = 0;
        }, []), 0);
        // 数字地板
        Laya.Tween.to(this.digitalPlate, { x: -1200, rotation: -720 }, 450, null, Laya.Handler.create(this, function () {
            this.digitalPlate.rotation = 0;
            this.roleResurgenceAni();
            this.self.removeSelf();
        }, []), 0);
        // 背景
        Laya.Tween.to(this.background, { alpha: 0 }, 450, null, Laya.Handler.create(this, function () {
        }, []), 0);
        // 倒计时数字
        this.digital.scale(0, 0);
    }

    /**主角复活重新开始*/
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
        let MainSceneControl = this.selfScene['MainSceneControl'];
        let role_01 = MainSceneControl.role_01;
        let role_02 = MainSceneControl.role_02;
        for (let i = 0; i < 4; i++) {
            Laya.timer.frameOnce(delayed, this, function () {
                switch (i) {
                    case 0:
                        MainSceneControl.createHintWord(role_01, '攻击里', 20);
                        MainSceneControl.createHintWord(role_02, '攻击里', 20);
                        role_01['Role'].role_property.attackValue += 20;
                        role_02['Role'].role_property.attackValue += 20;
                        break;
                    case 1:
                        MainSceneControl.createHintWord(role_01, '生命', 1000);
                        MainSceneControl.createHintWord(role_02, '生命', 1000);
                        role_01['Role'].role_property.blood = 1000;
                        role_02['Role'].role_property.blood = 1000;
                        break;
                    case 2:
                        MainSceneControl.createHintWord(role_01, '公鸡速度', 20);
                        MainSceneControl.createHintWord(role_02, '公鸡速度', 20);
                        role_01['Role'].role_property.attackSpeed += 20;
                        role_02['Role'].role_property.attackSpeed += 20;
                        break;
                    case 3:
                        MainSceneControl.createHintWord(role_01, '防御力', 10);
                        MainSceneControl.createHintWord(role_02, '防御力', 10);
                        role_01['Role'].role_property.defense += 10;
                        role_02['Role'].role_property.defense += 10;
                        break;
                    default:
                        break;
                }
                // 播放完毕之后开始游戏
                if (i === 3) {
                    this.selfScene['MainSceneControl'].restartProperties();
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
        this.vanishAni();
    }
    /**出屏幕*/
    out(event): void {
        event.currentTarget.scale(1, 1);
    }

    /**创建结算界面*/
    createSettlement(): void {
        let settlement = Laya.Pool.getItemByCreateFun('settlement', this.settlement.create, this.settlement) as Laya.Sprite;
        this.selfScene.addChild(settlement);
        settlement.pos(0, 0);
    }

    onUpdate(): void {
        // 倒计时
        if (this.countdown) {
            this.timeLine++;
            // 等于零的时候创建结算界面
            if (this.timeLine % 60 == 0) {
                this.digital.value = (Number(this.digital.value) - 1).toString();
                this.digital.scale(1, 1);
                if (this.digital.value === '-1') {
                    this.countdown = false;
                    this.createSettlement();
                    this.cutSettlement();
                }
            } else {
                // 动画
                this.digital.scaleX -= 0.003;
                this.digital.scaleY -= 0.003;
            }
        }
    }

    onDisable(): void {
        Laya.Tween.clearAll(this);
        Laya.timer.clearAll(this);
        Laya.Pool.recover('resurgence', this.self);
    }
}