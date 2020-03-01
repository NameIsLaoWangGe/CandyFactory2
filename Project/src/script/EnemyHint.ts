export default class EnemyHint extends Laya.Script {
    /** @prop {name:baseboard, tips:"背景", type:Node}*/
    public baseboard: Laya.Sprite;
    /** @prop {name:seconds, tips:"倒计时数字", type:Node}*/
    public seconds: Laya.FontClip;
    constructor() { super(); }
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;
    /**倒计时时间间隔*/
    private numInterval: number;
    /**倒计时当前时间记录*/
    private numTime: number;
    /**倒计时开关*/
    private numSwitch: boolean;

    onEnable(): void {
        this.init();
        this.appear();
    }
    /**初始化*/
    init(): void {
        this.self = this.owner as Laya.Sprite;
        this.self.rotation = 0;
        this.self.x = 1500;
        this.self.y = Laya.stage.height / 3;
        this.selfScene = this.owner.scene as Laya.Scene;
        this.numTime = Date.now();
        this.numInterval = 1000;
        this.numSwitch = false;
    }
    /**出现动画*/
    appear(): void {
        // 第一步出现
        Laya.Tween.to(this.self, { x: -20 }, 800, null, Laya.Handler.create(this, function () {
        }), 0);
        // 内容旋转
        Laya.Tween.to(this.baseboard, { rotation: 720 }, 800, null, Laya.Handler.create(this, function () {
            this.baseboard.rotation = 0;
            this.seconds.value = '10' + 's';
            this.numSwitch = true;
        }), 0);
    }

    /**消失动画*/
    vanish(): void {
        // 第一步出现
        Laya.Tween.to(this.self, { x: -500 }, 400, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
        }), 0);
        // 内容旋转
        Laya.Tween.to(this.baseboard, { rotation: -720 }, 400, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
            this.baseboard.rotation = 0;
            this.seconds.value = '10' + 's';
            this.self.removeSelf();
        }), 0);
    }

    onUpdate(): void {
        let time = Date.now();
        if (this.numSwitch) {
            if (time - this.numTime > this.numInterval) {
                this.numTime = time;
                let value;
                if (this.seconds.value.length === 3) {
                    value = this.seconds.value.substring(0, 2);
                } else {
                    value = this.seconds.value.substring(0, 1);
                }
                this.seconds.value = (Number(value) - 1).toString() + 's';
                if ((Number(value) - 1) < 0) {
                    this.seconds.value = '0' + 's';
                    this.selfScene['MainSceneControl'].enemySwitch_01 = true;
                    this.selfScene['MainSceneControl'].enemySwitch_02 = true;
                    this.numSwitch = false;
                    this.vanish();
                }
            }
        }

    }
    onDisable(): void {
        Laya.Pool.recover(this.self.name, this.self);
        Laya.Tween.clearAll(this);
    }
}