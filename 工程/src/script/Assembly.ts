export default class Assembly extends Laya.Script {
    /** @prop {name:machine, tips:糖果制造机器, type:Node}*/
    public machine: Laya.Sprite;
    /** @prop {name:LongPointer, tips:长指针, type:Node}*/
    public LongPointer: Laya.Sprite;

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

    /**时间线*/
    private timeLine: number;
    /**Machine初始位置*/
    private initialPX_Machine: number;

    /**抖动次数*/
    private launchNum: number;
    /**当前这次抖动的时间*/
    private launchSwitch: boolean;

    /**时间进度*/
    private timer: Laya.Sprite;
    /**进度条*/
    private timeSchedule: Laya.ProgressBar;
    /**时间抖动次数*/
    private timerShakeNum: number;

    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.Sprite;
        this.selfScene = this.self.scene;
        this.smokeSwitch = true;
        this.smokeTime = Date.now();
        this.smokeInterval = 500;
        this.initialPX_Machine = this.machine.x;

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

        // 抖动函数
        this.launchNum = 0;
        this.launchSwitch = true;

        this.timer = this.owner.getChildByName('timer') as Laya.Sprite;
        this.timeSchedule = this.timer.getChildByName('timeSchedule') as Laya.ProgressBar;
        this.timerShakeNum = 0;
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
        this.timeLine++;
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
    }

    onDisable(): void {
    }
}