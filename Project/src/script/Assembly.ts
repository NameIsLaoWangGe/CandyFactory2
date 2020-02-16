export default class Assembly extends Laya.Script {
    /** @prop {name:machine, tips:糖果制造机器, type:Node}*/
    public machine: Laya.Sprite;

    /** @prop {name:LongPointer, tips:长指针, type:Node}*/
    public LongPointer: Laya.Sprite;

    /** @prop {name:energyLamp_01, tips:能量灯1, type:Node}*/
    public energyLamp_01: Laya.Sprite;
    private lamp_01: Laya.Sprite;
    private lamp_02: Laya.Sprite;
    private lamp_03: Laya.Sprite;

    /** @prop {name:energyLamp_02, tips:能量灯2, type:Node}*/
    public energyLamp_02: Laya.Sprite;
    private lamp_04: Laya.Sprite;
    private lamp_05: Laya.Sprite;
    private lamp_06: Laya.Sprite;

    /**指示灯动画开关*/
    private LampSwitch: boolean;
    private lampTime: number;
    private lampInterval: number;

    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;
    /**烟囱烟雾特效开关*/
    private smokeSwitch: boolean;
    /**烟囱烟雾特效产生的时间间隔*/
    private smokeInterval: number;
    /**烟囱烟雾特效当前产生时间记录*/
    private smokeTime: number;

    /**位移抖动频率，机器会按一定的时间抖动，这个时间间隔可能是随机的*/
    private MshakeInterval: number;
    /**位移抖动事件记录*/
    private MshakeTime: number;
    /**位移抖动开关*/
    private MshakeSwitch: boolean;
    /**位移抖动强度控制*/
    private MshakesTre: number;
    /**位移抖动方向记录*/
    private MDirection: string;

    /**角度抖动频率，机器会按一定的时间抖动，这个时间间隔可能是随机的*/
    private RshakeInterval: number;
    /**角度抖动事件记录*/
    private RshakeTime: number;
    /**角度抖动开关*/
    private RshakeSwitch: boolean;
    /**角度抖动强度控制*/
    private RshakesTre: number;
    /**角度抖动方向记录*/
    private RDirection: string;

    /**Machine初始位置*/
    private initialPX_Machine: number;

    private timer: Laya.Sprite;
    /**进度条*/
    private timeSchedule: Laya.ProgressBar;
    /**时间抖动次数*/
    private timerShakeNum: number;
    /**管道1的骨骼动画*/
    private pipeSk_01: Laya.Skeleton;
    private pipeSk_01Tem: Laya.Templet;
    /**管道2的骨骼动画*/
    private pipeSk_02: Laya.Skeleton;
    private pipeSk_02Tem: Laya.Templet;

    constructor() { super(); }

    onEnable(): void {
        this.initProperty();
    }
    /**初始化属性*/
    initProperty(): void {
        this.self = this.owner as Laya.Sprite;
        this.selfScene = this.self.scene;
        this.smokeSwitch = true;
        this.smokeTime = Date.now();
        this.smokeInterval = 500;
        this.initialPX_Machine = this.machine.x;

        // 指示灯1的动画设置
        this.lamp_01 = this.energyLamp_01.getChildByName('lamp_01') as Laya.Sprite;
        this.lamp_02 = this.energyLamp_01.getChildByName('lamp_02') as Laya.Sprite;
        this.lamp_03 = this.energyLamp_01.getChildByName('lamp_03') as Laya.Sprite;
        this.lamp_01.alpha = 0.3;
        this.lamp_02.alpha = 0.3;
        this.lamp_03.alpha = 0.3;
        // 指示灯2的动画设置
        this.lamp_04 = this.energyLamp_02.getChildByName('lamp_04') as Laya.Sprite;
        this.lamp_05 = this.energyLamp_02.getChildByName('lamp_05') as Laya.Sprite;
        this.lamp_06 = this.energyLamp_02.getChildByName('lamp_06') as Laya.Sprite;
        this.lamp_04.alpha = 0.3;
        this.lamp_05.alpha = 0.3;
        this.lamp_06.alpha = 0.3;

        this.LampSwitch = true;
        this.lampTime = Date.now();
        this.lampInterval = 1600;

        // 位移抖动参数
        this.MDirection = Math.random() * 2 === 1 ? 'left' : 'right';
        this.MshakeInterval = 30;
        this.MshakeTime = Date.now();
        this.MshakesTre = 1;
        this.MshakeSwitch = true;

        // 角度抖动参数
        this.RshakeInterval = 30;
        this.RshakeTime = Date.now();
        this.RshakesTre = 2;
        this.RDirection = Math.random() * 2 === 1 ? 'left' : 'right';
        this.RshakeSwitch = true;

        this.timer = this.owner.getChildByName('timer') as Laya.Sprite;
        this.timeSchedule = this.timer.getChildByName('timeSchedule') as Laya.ProgressBar;
        this.timerShakeNum = 0;

        this.pipeSk_01 = this.machine.getChildByName('pipeline_01') as Laya.Skeleton;
        this.pipeSk_02 = this.machine.getChildByName('pipeline_02') as Laya.Skeleton;
        this.createPipeSk_01();
        this.createPipeSk_02();
        this.lampAni_01();
        this.lampAni_02();
    }

    /**开始机器运动*/
    assemblyStart(): void {
        this.pipeSk_01.play('flow', true);
        this.pipeSk_02.play('flow', true);
    }

    /**创建骨骼动画皮肤*/
    createPipeSk_01(): void {
        //创建动画模板
        this.pipeSk_01Tem = new Laya.Templet();
        this.pipeSk_01Tem.on(Laya.Event.COMPLETE, this, this.parseComplete_01);
        this.pipeSk_01Tem.on(Laya.Event.ERROR, this, this.onError);
        this.pipeSk_01Tem.loadAni("candy/糖果机器/pipeline_01.sk");
    }

    onError(): void {
        console.log('骨骼动画加载错误');
    }

    parseComplete_01(): void {
        // 水管动画
        this.pipeSk_01.play('static', true);
    }

    /**创建骨骼动画皮肤*/
    createPipeSk_02(): void {
        //创建动画模板
        this.pipeSk_02Tem = new Laya.Templet();
        this.pipeSk_02Tem.on(Laya.Event.COMPLETE, this, this.parseComplete_02);
        this.pipeSk_02Tem.on(Laya.Event.ERROR, this, this.onError);
        this.pipeSk_02Tem.loadAni("candy/糖果机器/pipeline_01.sk");
    }

    parseComplete_02(): void {
        // 水管动画
        this.pipeSk_02.play('static', true);
    }

    /**能量灯动画*/
    lampAni_01(): void {
        Laya.Tween.to(this.lamp_01, { alpha: 1 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.lamp_01, { alpha: 0.3 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            }, []), 0);

            Laya.Tween.to(this.lamp_02, { alpha: 1 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(this.lamp_02, { alpha: 0.3 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                }, []), 0);

                Laya.Tween.to(this.lamp_03, { alpha: 1 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(this.lamp_03, { alpha: 0.3 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    }, []), 0);
                }, []), 0);
            }, []), 0);

        }, []), 0);
    }

    /**能量灯动画*/
    lampAni_02(): void {
        Laya.Tween.to(this.lamp_04, { alpha: 1 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.lamp_04, { alpha: 0.3 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
            }, []), 0);

            Laya.Tween.to(this.lamp_05, { alpha: 1 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(this.lamp_05, { alpha: 0.3 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                }, []), 0);

                Laya.Tween.to(this.lamp_06, { alpha: 1 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(this.lamp_06, { alpha: 0.3 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    }, []), 0);
                }, []), 0);
            }, []), 0);

        }, []), 0);
    }

    /**位移抖动
    * @param target 目标
    */
    moveShake(target) {
        if (this.MshakeSwitch) {
            let nowTime = Date.now();
            if (nowTime - this.MshakeTime > this.MshakeInterval) {
                this.MshakeTime = nowTime;
                // 判断目标是什么,然后对比他原来的位置
                let initialPX;//target初始位置
                if (target === this.machine) {
                    initialPX = this.initialPX_Machine;
                }
                let shakeX = this.MshakesTre;//强度
                if (this.MDirection === "left") {
                    target.x -= this.MshakesTre;
                    if (this.machine.x < initialPX) {
                        this.MDirection = "right";
                    }
                } else if (this.MDirection === "right") {
                    target.x += this.MshakesTre;
                    if (this.machine.x > initialPX) {
                        this.MDirection = "left";
                    }
                }
            }
        }
    }

    /**时间抖动抖动
     * 根据进度条的时间来给不同的抖动频率和抖动速度
    */
    timerShake() {
        if (this.timeSchedule.value > 0 && this.timeSchedule.value <= 0.15) {
            this.RshakeInterval = 40;
            this.RshakesTre = 2;
        } else if (this.timeSchedule.value > 0.15 && this.timeSchedule.value <= 0.4) {
            this.RshakeInterval = 50;
            this.RshakesTre = 1.5;
        } else if (this.timeSchedule.value > 0.4 && this.timeSchedule.value <= 0.7) {
            this.RshakeInterval = 60;
            this.RshakesTre = 1;
        } else if (this.timeSchedule.value > 0.7 && this.timeSchedule.value <= 1) {
            this.RshakeInterval = 70;
            this.RshakesTre = 0.5;
        } else {
            this.RshakeInterval = 70;
            this.RshakesTre = 0.5;
        }

        if (this.RshakeSwitch) {
            let nowTime = Date.now();
            if (nowTime - this.RshakeTime > this.RshakeInterval) {
                this.RshakeTime = nowTime;
                // 目标判断
                if (this.RDirection === "left") {
                    this.timer.rotation = -this.RshakesTre;
                    if (this.timer.rotation < 0) {
                        this.RDirection = "right";
                    }
                } else if (this.RDirection === "right") {
                    this.timer.rotation = this.RshakesTre;
                    if (this.timer.rotation > 0) {
                        this.RDirection = "left";
                    }
                }
            }
        }
    }

    onUpdate(): void {
        if (this.selfScene['MainSceneControl'].gameOver) {
            return;
        }

        // 烟囱烟雾特效
        if (this.smokeSwitch) {
            1
            let nowTime = Date.now();
            if (nowTime - this.smokeTime > this.smokeInterval) {
                // 重置时间
                this.smokeTime = nowTime;
                // 随机时间间隔
                let random = Math.floor(Math.random() * 300) + 100;
                this.smokeInterval = 600 - random;
                // 随机位置
                this.selfScene['MainSceneControl'].explodeAni(this.machine, 650, 190, 'smokeEffects', 1, 10);
            }
        }

        // 指针动作
        this.LongPointer.rotation += 10;
        this.moveShake(this.machine);

        //进度条抖动
        this.timerShake();

        // 指示灯动画
        if (this.LampSwitch) {
            let time = Date.now();
            if (time - this.lampTime > this.lampInterval) {
                this.lampTime = time;
                this.lampAni_01();
                this.lampAni_02();
            }
        }
    }

    onDisable(): void {
    }
}