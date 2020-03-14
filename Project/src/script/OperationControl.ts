import MainSceneControl from "./MainSceneControl";
import Candy from "./Candy";
import tools from "./Tool";
export default class OperationButton extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;
    /**糖果父节点*/
    private candyParent: Laya.Sprite;
    /**操作开关*/
    private operateSwitch: boolean;
    /**按钮父节点*/
    /** @prop {name:btnGroup, tips:"按钮组", type:Node}*/
    public btnGroup: Laya.Sprite;
    /** @prop {name:redButton, tips:"按钮组", type:Node}*/
    public redButton: Laya.Sprite;
    /** @prop {name:yellowButton, tips:"按钮组", type:Node}*/
    public yellowButton: Laya.Sprite;
    /** @prop {name:greenButton, tips:"按钮组", type:Node}*/
    public greenButton: Laya.Sprite;
    /** @prop {name:blueButton, tips:"按钮组", type:Node}*/
    public blueButton: Laya.Sprite;
    /**计时器*/
    private timer: Laya.Sprite;
    /**计时器进度条*/
    private timeSchedule: Laya.ProgressBar;
    /** @prop {name:clickHintSign, tips:"点击提示遮罩", type:Node}*/
    public clickHintSign: Laya.Sprite;

    /**分数节点*/
    private scoreLabel: Laya.FontClip;
    /**奖励提示文字*/
    private rewardWords: Laya.Prefab;
    /**当前点击的组记录*/
    private clicksGroup: number;
    /**当前组正确点击了几个糖果*/
    private rightCount: number;
    /**所有糖果中，有多少个错误的糖果*/
    private erroCount: number;
    /**是否是第一次点击*/
    private firstClick: boolean;

    constructor() { super(); }

    onEnable(): void {
        this.initProperty();
        this.buttonClink();
    }

    /**初始化一些属性*/
    initProperty(): void {
        this.self = this.owner as Laya.Sprite;
        this.selfScene = this.self.scene;

        this.candyParent = this.selfScene['MainSceneControl'].candyParent;
        this.scoreLabel = this.selfScene['MainSceneControl'].scoreLabel;
        this.timer = this.selfScene['MainSceneControl'].timer;
        this.rewardWords = this.selfScene['MainSceneControl'].rewardWords;
        this.clickHintSign.alpha = 0;

        this.timeSchedule = this.timer.getChildByName('timeSchedule') as Laya.ProgressBar;
        this.self['OperationControl'] = this;

        this.clicksGroup = 0;
        this.rightCount = 0;
        this.erroCount = 0;
    }

    /**操作按钮的点击事件*/
    buttonClink(): void {
        for (let i = 0; i < this.btnGroup._children.length; i++) {
            this.btnGroup._children[i].on(Laya.Event.MOUSE_DOWN, this, this.down);
            this.btnGroup._children[i].on(Laya.Event.MOUSE_MOVE, this, this.move);
            this.btnGroup._children[i].on(Laya.Event.MOUSE_UP, this, this.up);
            this.btnGroup._children[i].on(Laya.Event.MOUSE_OUT, this, this.out);
        }
    }

    /**判断按下的按钮和准备位置的糖果是否匹配;
     * 如果匹配，那么看下糖果上面写的几次点击次数，需要连续点击到这个次数才可以吃糖果
     * 如果次数没有达到，却点了另一种按钮，那么前面的次数会重置，并且出现一个怪物
     * 如果不匹配，说明点错了，糖果会跳到外面变成一个怪物,则出现一个怪物
     */
    down(event): void {
        if (!this.operateSwitch) {
            return;
        }
        // 通过点击的按钮匹配对应的糖果类型
        let btn_name = event.currentTarget.name;
        this.clickJudge(btn_name);
        event.currentTarget.scale(0.9, 0.9);
    }

    /**点击判断*/
    clickJudge(btn_name): void {
        // 按钮颜色需要配对的糖果颜色名字
        let pairName;
        switch (btn_name) {
            case 'redButton':
                pairName = 'redCandy___';
                break;
            case 'yellowButton':
                pairName = 'yellowCandy';
                break;
            case 'greenButton':
                pairName = 'greenCandy_';
                break;
            case 'blueButton':
                pairName = 'blueCandy__';
                break;
            default: break;
        }
        // 记录有几个名字个相同
        let nameCount = 0;
        // 记录点击正确次数
        let rightCount = 0;
        let mainSceneControl = this.selfScene['MainSceneControl'];
        // 找出当前需要点击的组和配对的名字
        for (let i = 0; i < this.candyParent._children.length; i++) {
            let candy = this.candyParent._children[i];
            let group = candy['Candy'].group;
            let name = candy.name.substring(0, 11);
            // 糖果的组和配对的名字都相同的时候,那么clickLebal-1；
            let clicksLabel = candy.getChildByName('clicksLabel') as Laya.FontClip;
            if (group === this.clicksGroup && name === pairName) {
                nameCount++;
                // 第一次点击正确了break
                // 第一次点击不正确，可能会进入第二次，第二次点击正确了也会break
                if (nameCount === 1 || nameCount === 2) {
                    if (Number(clicksLabel.value) > 0) {
                        rightCount++;
                        clicksLabel.value = (Number(clicksLabel.value) - 1).toString();
                        this.spealGuidance('right');
                        this.clicksRightAni(candy);
                        if (Number(clicksLabel.value) === 0) {
                            mainSceneControl.explodeAni(this.selfScene, candy.x, candy.y, 'disappear', 8, 100);
                            candy['Candy'].playSkeletonAni(1, 'static');
                            clicksLabel.value = ' ';
                            this.rightCount++;
                        }
                        break;
                    }
                }
            }
        }
        // 两个糖果都不相同的时候，和点的不正确的时候直接结算
        if (nameCount === 0 || rightCount === 0) {
            this.erroCount += 2;
            for (let i = 0; i < this.candyParent._children.length; i++) {
                let candy = this.candyParent._children[i];
                let group = candy['Candy'].group;
                if (group === this.clicksGroup) {
                    // 生成1个爆炸糖果
                    mainSceneControl.explodeAni(this.selfScene, candy.x, candy.y, 'disappear', 8, 1000);
                    candy['Candy'].group = 'error';
                    candy['Candy'].playSkeletonAni(1, 'explode');
                    let clicksLabel = candy.getChildByName('clicksLabel') as Laya.FontClip;
                    clicksLabel.value = ' ';
                }
            }
            this.groupHint();
            this.spealGuidance('error');
        }
        // 两个都点成了零，说明这组点对了，到下一组
        if (this.rightCount === 2) {
            this.groupHint();
        }
        // 都点完了最终结算
        if (this.clicksGroup === 4) {
            this.settlement('finished');
        }
    }
    /**点击正确时，糖果的动画*/
    clicksRightAni(candy): void {
        // 第二步降落缩小
        Laya.Tween.to(candy, { scaleX: 1.1, scaleY: 1.1 }, 50, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(candy, { scaleX: 1, scaleY: 1 }, 50, null, Laya.Handler.create(this, function () {
            }, []), 0);
        }, []), 0);
    }

    /**判断是否是第一次，如果是第一次，那么通过主角对话框给予一些引导*/
    spealGuidance(judge: string): void {
        // 如果是第一次，结算的时候删掉主角对话框，因为第一轮是新手引导
        let MainSceneControl = this.selfScene['MainSceneControl'];
        let launcheCount = MainSceneControl.launcheCount;
        if (launcheCount === 1) {
            let role_01 = MainSceneControl.role_01;
            let speakBox_01 = role_01.getChildByName('speakBox') as Laya.Sprite;

            let role_02 = MainSceneControl.role_02;
            let speakBox_02 = role_02.getChildByName('speakBox') as Laya.Sprite;
            if (judge === 'error') {
                speakBox_01['SpeakBox'].speakingRules('role_01', 'clickError');
                speakBox_02['SpeakBox'].speakingRules('role_02', 'clickError');
            } else if (judge === 'right') {
                speakBox_01['SpeakBox'].speakingRules('role_01', 'clickRight');
                speakBox_02['SpeakBox'].speakingRules('role_02', 'clickRight');
            }
        }
    }

    /**组提示*/
    groupHint(): void {
        this.rightCount = 0;
        this.clicksGroup++;
        //两边箭头提示
        let maskYArr = [749, 647.5, 546, 449];
        this.clickHintSign.alpha = 1;
        this.clickHintSign.y = maskYArr[this.clicksGroup];
    }
    /**初始化提示，一组糖果出来的时候进行*/
    initHint(): void {
        this.rightCount = 0;
        this.clicksGroup = 0;
        //两边箭头提示
        let maskYArr = [749, 651.5, 550, 449];
        this.clickHintSign.alpha = 1;
        this.clickHintSign.y = maskYArr[this.clicksGroup];
        this.erroCount = 0;
    }

    /**结算分为两种
     * 一种是点击完成了，分别对应变成爆炸或者是吃糖果进行动画播放
     * 一种是时间到了，先把没有点击完成的糖果变成爆炸，然后再进行动画播放
     * 这些动画都是延时播放的，并且从最近的开始
     * @param type 是两种结算类型
    */
    settlement(type): void {
        this.clickHintSign.alpha = 0;
        this.operateSwitch = false;
        if (type === 'finished') {
            console.log('完成的结算！')
            if (this.erroCount === 0) {
                this.additionAward();
            }
            this.settlementAni();
        } else if (type === 'unfinished') {
            // 当前组的两个变成爆炸糖果，即便有一个点击成功了，也算失败
            // 以及后面的没有点击完成的两种的情况
            let delayed = 0;//延迟动画的时间递增
            for (let i = this.candyParent._children.length - 1; i >= 0; i--) {
                let candy = this.candyParent._children[i];
                let group = candy['Candy'].group;
                let clicksLabel = candy.getChildByName('clicksLabel') as Laya.FontClip;
                if (group === this.clicksGroup || (group !== 'error' && clicksLabel.value !== ' ')) {
                    delayed += 10;
                    // 延时进行
                    Laya.timer.frameOnce(delayed, this, function () {
                        this.selfScene['MainSceneControl'].explodeAni(this.selfScene, candy.x, candy.y, 'disappear', 8, 1000);
                        candy['Candy'].group = 'error';
                        clicksLabel.value = ' ';
                        candy['Candy'].playSkeletonAni(1, 'explode');
                        // 最后一个糖果进行结算，因为如果到了最后一组，整个组都会进入这里，group === this.clicksGroup，所有0是必然可以循环到的
                        if (i === 0) {
                            this.settlementAni();
                        }
                    })
                }
            }
        }
    }

    /**结算动画
     * 延时进行结算动画
    */
    settlementAni(): void {
        // 如果是第一次，结算的时候删掉主角对话框，因为第一轮是新手引导
        let launcheCount = this.selfScene['MainSceneControl'].launcheCount;
        if (launcheCount === 1) {
            let role_01 = this.selfScene['MainSceneControl'].role_01;
            let speakBox_01 = role_01.getChildByName('speakBox') as Laya.Sprite;
            speakBox_01.removeSelf();
            let role_02 = this.selfScene['MainSceneControl'].role_02;
            let speakBox_02 = role_02.getChildByName('speakBox') as Laya.Sprite;
            speakBox_02.removeSelf();
        }
        let delayed = 10;
        for (let i = this.candyParent._children.length - 1; i >= 0; i--) {
            delayed += 15;
            Laya.timer.frameOnce(delayed, this, function () {
                let candy = this.candyParent._children[i];
                let group = candy['Candy'].group;
                // 只有错误和正确之分
                if (group === 'error') {
                    this.explodeCandyFlyToRole(candy);
                } else {
                    candy['Candy'].candyFlyToRole();
                }
                // 当最后一个执行的时候就播放下一组
                if (i === 0) {
                    // 如果是第二次才正式开始初始化
                    if (launcheCount === 1) {
                        this.selfScene['MainSceneControl'].secondAfterStart();
                    } else {
                        this.selfScene['MainSceneControl'].candyLaunch_01.play('prepare', false);
                        this.selfScene['MainSceneControl'].candyLaunch_02.play('prepare', false);
                    }
                }
            })
        }
    }

    /**爆炸糖果移动路径
    * @param candy 爆炸糖果
    */
    explodeCandyFlyToRole(candy: Laya.Sprite): void {
        // 左右两个方向
        let point;//飞向固定点的左右位置
        let explodeTarget;//攻击对象
        // 抛物线运动最高点位置
        let HalfX;
        let HalfY;
        // 抛物线最高点位置站整个x移动位置的比例
        let distancePer = 2;
        if (candy.x < Laya.stage.width / 2) {
            explodeTarget = this.selfScene['MainSceneControl'].role_01;
            point = new Laya.Point(candy.x - 200, candy.y + 80);
            HalfX = candy.x - (candy.x - point.x) / distancePer;
        } else {
            explodeTarget = this.selfScene['MainSceneControl'].role_02;
            point = new Laya.Point(candy.x + 200, candy.y + 80);
            HalfX = candy.x + (point.x - candy.x) / distancePer;
        }
        HalfY = candy.y - 100;

        // 第一步飞天放大
        Laya.Tween.to(candy, { x: HalfX, y: HalfY, scaleX: 1.3, scaleY: 1.3 }, 250, null, Laya.Handler.create(this, function () {

            // 第二步降落缩小
            Laya.Tween.to(candy, { x: point.x, y: point.y, scaleX: 0.9, scaleY: 0.9 }, 300, null, Laya.Handler.create(this, function () {
                candy.scale(0.9, 0.9);
                this.selfScene['MainSceneControl'].explodeAni(this.selfScene, candy.x, candy.y, 'disappear', 8, 1000);
                candy['Candy'].asExplodeCandy();
            }, []), 0);
        }, []), 0);

        // 糖果的影子处理
        let shadow = candy.getChildByName('shadow') as Laya.Image;
        // 拉开距离并缩小
        Laya.Tween.to(shadow, { x: -20 + 52, y: 80 + 60, scaleX: 0.8, scaleY: 0.8, }, 300, null, Laya.Handler.create(this, function () {
            // 第二部回归
            Laya.Tween.to(shadow, { x: 0 + 52, y: 0 + 60, scaleX: 1, scaleY: 1 }, 300, null, Laya.Handler.create(this, function () {
            }), 0);
        }), 0);
    }

    /**计时器控制
     * 当时间小于零的时候所有还没有点击的糖果直接变成敌人
     * 并且结算，重置属性
    */
    timerControl(): void {
        if (this.timeSchedule.value > 0 && this.operateSwitch && !this.firstClick) {
            this.timeSchedule.value -= 0.0015;
        } else if (this.timeSchedule.value <= 0 && this.operateSwitch) {
            // 时间到了进行结算
            this.settlement('unfinished');
        }
    }

    /**根据进度条剩余的时间给予奖励加成
     * 分段给予不同的奖励
     * 如果有一个点错了，都不会给予特殊奖励
    */
    additionAward(): void {
        if (this.timeSchedule.value > 0.8) {
            this.creatRewardWords('干得漂亮');
        } else if (this.timeSchedule.value > 0.6) {
            this.creatRewardWords('太棒了');
        } else if (this.timeSchedule.value > 0.4) {
            this.creatRewardWords('牛皮');
        }
    }

    /**提示奖励文字的创建*/
    creatRewardWords(word): void {
        let rewardWords = Laya.Pool.getItemByCreateFun('rewardWords', this.rewardWords.create, this.rewardWords) as Laya.Sprite;
        this.selfScene.addChild(rewardWords);
        rewardWords['RewardWords'].createWordsAni(word);
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
        // 主角全部死亡游戏结束
        if (this.selfScene['MainSceneControl'].gameOver) {
            this.operateSwitch = false;
            return;
        }
        //计时器
        this.timerControl();
    }

    onDisable(): void {
    }
}