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
    /**爆炸糖果*/
    private candy_Explode: Laya.Prefab;
    /**爆炸糖果父节点*/
    private candy_ExplodeParent: Laya.Sprite;
    /**操作开关*/
    private operateSwitch: boolean;
    /**敌人*/
    private enemy: Laya.Prefab;
    /**计时器*/
    private timer: Laya.Sprite;
    /**计时器进度条*/
    private timeSchedule: Laya.ProgressBar;

    /**点击次数记录*/
    private clicksCount: number;
    /**每点两次后的糖果颜色名称*/
    private clicksNameArr: Array<string>;
    /**正确糖果的名字*/
    private rightName: Array<string>;
    /**错误糖果的名字*/
    private errorName: Array<string>;
    /**糖果总名称合集*/
    private candyNameArr: Array<string>;
    /**糖果总名称合集*/
    private alreadyGroup: Array<number>;
    /**分数*/
    private scoreLabel: Laya.FontClip;
    /**奖励提示文字*/
    private rewardWords: Laya.Prefab;
    /**新建糖果的开关*/
    private createCandy: boolean;

    constructor() { super(); }

    onEnable(): void {
        this.initProperty();
        this.buttonClink();
    }

    /**初始化一些属性*/
    initProperty(): void {
        this.self = this.owner as Laya.Sprite;
        this.selfScene = this.self.scene;
        this.clicksCount = 0;
        this.clicksNameArr = [];
        this.rightName = [];
        this.errorName = [];
        this.alreadyGroup = [];

        this.candyParent = this.selfScene['MainSceneControl'].candyParent;
        this.candy_Explode = this.selfScene['MainSceneControl'].candy_Explode
        this.candy_ExplodeParent = this.selfScene['MainSceneControl'].candy_ExplodeParent;
        this.scoreLabel = this.selfScene['MainSceneControl'].scoreLabel;
        this.candyNameArr = this.selfScene['MainSceneControl'].candyNameArr;
        this.timer = this.selfScene['MainSceneControl'].timer;
        this.rewardWords = this.selfScene['MainSceneControl'].rewardWords;

        this.timeSchedule = this.timer.getChildByName('timeSchedule') as Laya.ProgressBar;
        this.self['OperationControl'] = this;
    }

    /**操作按钮的点击事件*/
    buttonClink(): void {
        for (let i = 0; i < this.self._children.length; i++) {
            this.self._children[i].on(Laya.Event.MOUSE_DOWN, this, this.down);
            this.self._children[i].on(Laya.Event.MOUSE_MOVE, this, this.move);
            this.self._children[i].on(Laya.Event.MOUSE_UP, this, this.up);
            this.self._children[i].on(Laya.Event.MOUSE_OUT, this, this.out);
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
        this.clicksCount++;
        // 通过点击的按钮匹配对应的糖果类型
        switch (event.currentTarget.name) {
            case 'redButton':
                this.clicksNameArr.push('redCandy___');
                break;
            case 'yellowButton':
                this.clicksNameArr.push('yellowCandy');
                break;
            case 'greenButton':
                this.clicksNameArr.push('greenCandy_');
                break;
            case 'blueButton':
                this.clicksNameArr.push('blueCandy__');
                break;
            default: break;
        }
        // 两两对比判断之后清空这个数组，当点击次数是2的倍数时进行对比
        if (this.clicksCount % 2 === 0 && this.clicksCount >= 2) {
            this.clickTwoCompareName();//第二次点击对比
        } else {
            this.clickOneCompareName();//第一次点击对比
        }
        // 点完结算
        if (this.clicksCount === this.selfScene['MainSceneControl'].startRow * 2) {
            this.settlement();
        }
        event.currentTarget.scale(0.9, 0.9);
    }

    /**点击两次之后对比名称
     * 点击次数和组数都是固定的，分别是10次和5组
     *所以点击了2次对应的就是第0组，4次就是第1组......
    */
    clickTwoCompareName(): void {
        let nameArr = [];
        for (let i = 0; i < this.candyParent._children.length; i++) {
            let candy = this.candyParent._children[i];
            if (candy["Candy"].group === (this.clicksCount - 2) / 2) {//每点两次对应的糖果组
                nameArr.push(candy.name);
                let firstCandy = this.candyParent.getChildByName(nameArr[0]) as Laya.Sprite;
                // 文字显示
                if (nameArr.length >= 2) {
                    let compareArr = [nameArr[0].substring(0, 11), nameArr[1].substring(0, 11)]
                    // 对比两个数组看看是否相等，排序，转成字符串方可对比；
                    if (compareArr.sort().toString() === this.clicksNameArr.sort().toString()) {
                        this.rightAndWrongShow('right', firstCandy);
                        this.rightAndWrongShow('right', candy);
                        // 正确的糖果名称保存
                        this.rightName.push(nameArr[0], nameArr[1]);
                    } else {
                        this.rightAndWrongShow('wrong', firstCandy);
                        this.rightAndWrongShow('wrong', candy);
                        // 错误的糖果名保存
                        this.errorName.push(nameArr[0], nameArr[1]);
                    }
                    // 已经点过的糖果的组数
                    this.alreadyGroup.push(candy["Candy"].group);
                }
            }
        }
        this.clickHint();
        this.clicksNameArr = [];//对比后清空
    }

    /**每点一次的时候判断点击是否正确，并且给予动画提示
     * 此时分为三种情况
     * 一个都不对，那么直接写上错误
     * 对一个，那么直接写上正确
     * 如果两个相同都和 this.clicksNameArr[0]匹配，那么我只需要判断一个就行
     * 因为第二次点击的时候会补上标记
    */
    clickOneCompareName(): void {
        let nameArr = [];
        let first_Name: string = null;
        for (let i = 0; i < this.candyParent._children.length; i++) {
            let candy = this.candyParent._children[i];
            if (candy["Candy"].group === (this.clicksCount - 1) / 2) {//每点一次对应的糖果组
                if (candy.name.substring(0, 11) === this.clicksNameArr[0]) { //只判断一次，然后返回
                    this.rightAndWrongShow('right', candy);
                    break;
                } else {
                    // number用于记录第几次循环，最多两次循环
                    nameArr.push(candy.name);
                    if (nameArr.length === 2) {
                        // 当nameArr.length=2的时候说明一个都不对，那么直接结束本组
                        let firstCandy = this.candyParent.getChildByName(nameArr[0]) as Laya.Sprite;
                        this.rightAndWrongShow('wrong', firstCandy);
                        this.rightAndWrongShow('wrong', candy);
                        //重新初始化下一组
                        this.clicksNameArr = [];
                        this.clicksCount++;
                        this.errorName.push(nameArr[0], nameArr[1]);
                        this.alreadyGroup.push(candy["Candy"].group);
                        this.clickHint();
                    }
                }
            }
        }
    }

    /**
     *  点击正确和错误的显示
     * @param rightAndWrong 正确还是错误
     * @param candy 当前判断点击的糖果
    */
    rightAndWrongShow(rightAndWrong, candy): void {
        // 如果有提示了，就先删除
        let originImg = candy.getChildByName('img') as Laya.Image;
        if (originImg) {
            originImg.removeSelf();
        }

        // 重新显示一个提示
        let nowImg = new Laya.Image();
        if (rightAndWrong == 'right') {
            nowImg.skin = 'candy/ui/正确提示.png';
        } else if (rightAndWrong == 'wrong') {
            nowImg.skin = 'candy/ui/错误提示.png';
        } else {
            return;
        }
        nowImg.pivotX = nowImg.width / 2;
        nowImg.pivotY = nowImg.height / 2;
        nowImg.name = 'img';
        nowImg.scaleX = 1;
        nowImg.scaleY = 1;
        candy.addChild(nowImg);
        if (candy.x < Laya.stage.width / 2) {
            nowImg.pos(-20, 50);
        } else {
            nowImg.pos(20 + candy.width, 50);
        }
        // // 出现动画
        // Laya.Tween.to(nowImg, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
        // }), 0);
    }

    /**提示我应该点哪一组了
     * 这一组结束之后提示下一组
     * 然后这一组的提示消失
    */
    clickHint(): void {
        for (let i = 0; i < this.candyParent._children.length; i++) {
            let presentGroup = this.alreadyGroup[this.alreadyGroup.length - 1];
            let candy = this.candyParent._children[i];
            let candyGroup = candy['Candy'].group;
            if (this.alreadyGroup.length === 0) {
                if (candyGroup === 0) {
                    candy.scale(1.1, 1.1);
                }
            } else {
                if (candyGroup === presentGroup) {
                    candy.scale(1, 1);
                }
                if (candyGroup === presentGroup + 1) {
                    candy.scale(1.1, 1.1);
                }
            }
        }
    }

    /**结算，当10个都点击完毕后，执行吃糖果或者是变成爆炸糖果过的动画*/
    settlement(): void {
        this.operateSwitch = false;
        // 正确移动到主角处加属性
        if (this.rightName.length > 0) {
            for (let i = 0; i < this.rightName.length; i++) {
                let candy = this.candyParent.getChildByName(this.rightName[i]) as Laya.Sprite;
                if (candy.x < Laya.stage.width / 2) {
                    candy['Candy'].candyTagRole = this.selfScene['MainSceneControl'].role_01;
                    candy['Candy'].candyFlyToRole();
                } else {
                    candy['Candy'].candyTagRole = this.selfScene['MainSceneControl'].role_02;
                    candy['Candy'].candyFlyToRole();
                }
            }
        }
        // 错误的变成敌人
        if (this.errorName.length > 0) {
            for (let j = 0; j < this.errorName.length; j++) {
                let candy = this.candyParent.getChildByName(this.errorName[j]) as Laya.Sprite;
                this.candybecomeEnemy(candy);
            }
        }
        this.additionAward();
        // 清空
        this.rightName = [];
        this.errorName = [];
        this.clicksCount = 0;
        this.clicksNameArr = [];
        this.alreadyGroup = [];

        //准备发射糖果
        this.selfScene['MainSceneControl'].candyLaunch_01.play('prepare', false);
        this.selfScene['MainSceneControl'].candyLaunch_02.play('prepare', false);
    }

    /**新建糖果，初始换属性*/
    initCandy(): void {
        // 第二步位移
        Laya.timer.frameOnce(30, this, function () {
            this.selfScene['MainSceneControl'].candyMoveToDisplay();
            this.timeSchedule.value = 1;
        });
    }

    /**计时器控制
     * 当时间小于零的时候所有还没有点击的糖果直接变成敌人
     * 并且结算，重置属性
    */
    timerControl(): void {
        if (this.timeSchedule.value > 0 && this.operateSwitch) {
            this.timeSchedule.value -= 0.0025;
        } else if (this.timeSchedule.value <= 0 && this.operateSwitch) {
            // 没有点击过的全部变成敌人,减去点错的糖果
            let groupArr = [0, 1, 2, 3, 4]
            for (let i = 0; i < this.alreadyGroup.length; i++) {
                for (let j = 0; j < groupArr.length; j++) {
                    if (this.alreadyGroup[i] === groupArr[j]) {
                        groupArr.shift();
                    }
                }
            }
            // 把没有点击的变成敌人
            for (let k = 0; k < this.candyParent._children.length; k++) {
                let candy = this.candyParent._children[k] as Laya.Sprite;
                for (let l = 0; l < groupArr.length; l++) {
                    if (candy["Candy"].group === groupArr[l]) {
                        this.candybecomeEnemy(candy);
                    }
                }
            }
            // 点击过的结算
            this.settlement();
        }
    }
    /**根据进度条剩余的时间给予奖励加成
     * 分段给予不同的奖励
     * 如果有一个点错了，都不会给予特殊奖励
    */
    additionAward(): void {
        if (this.errorName.length > 0) {
            return;
        }
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

    /**点错后，糖果跳到地上变成1爆炸糖果
     * @param candy 这个糖果的信息
    */
    candybecomeEnemy(candy: Laya.Sprite): void {
        // 左右两个方向
        let point;//固定地点
        let explodeTarget;//攻击对象
        // 最终位置
        let moveX;
        let moveY;
        if (candy.x < Laya.stage.width / 2) {
            explodeTarget = this.selfScene['MainSceneControl'].role_01;
            point = new Laya.Point(candy.x - 200, candy.y + 80);
        } else {
            explodeTarget = this.selfScene['MainSceneControl'].role_02;
            point = new Laya.Point(candy.x + 200, candy.y + 80);
        }
        // 播放翻转动画
        if (candy['Candy'].skeleton) {
            switch (candy.name.substring(0, 11)) {
                case 'yellowCandy':
                    candy['Candy'].skeleton.play('yellow_turnLeft', true);
                    break;
                case 'redCandy___':
                    candy['Candy'].skeleton.play('red_turnLeft', true);
                    break;
                case 'blueCandy__':
                    candy['Candy'].skeleton.play('blue_turnLeft', true);
                    break;
                case 'greenCandy_':
                    candy['Candy'].skeleton.play('green_turnLeft', true);
                    break;
                default:
                    break;
            }
            candy['Candy'].skeleton.playbackRate(4);
        }
        this.flewToGround(candy, point, explodeTarget);
    }

    /**糖果飞到地上的动画
     * @param candy 糖果
     * @param targetP 目标点
     * @param explodeTarget 被爆炸的目标
    */
    flewToGround(candy, targetP, explodeTarget): void {
        // 糖果本身
        let HalfX;
        let HalfY;
        let distancePer = 2;
        if (candy.x > Laya.stage.width / 2) {
            HalfX = candy.x - (candy.x - targetP.x) / distancePer;
        } else {
            HalfX = candy.x + (targetP.x - candy.x) / distancePer;
        }
        HalfY = candy.y - 100;
        // 第一步飞天放大
        Laya.Tween.to(candy, { x: HalfX, y: HalfY, scaleX: 1.3, scaleY: 1.3 }, 500, null, Laya.Handler.create(this, function () {

            // 第二步降落缩小
            Laya.Tween.to(candy, { x: targetP.x, y: targetP.y, scaleX: 0.9, scaleY: 0.9 }, 400, null, Laya.Handler.create(this, function () {
                // 生成1个爆炸糖果
                let explodeCandy = this.selfScene['MainSceneControl'].createExplodeCandy(candy.name);
                explodeCandy.pos(candy.x, candy.y);
                explodeCandy.scale(0.9, 0.9);
                this.selfScene['MainSceneControl'].explodeAni(this.selfScene, explodeCandy.x, explodeCandy.y, 'disappear', 8, 1000);
                candy.removeSelf();

                // 第三步停留，延迟给予爆炸目标
                Laya.Tween.to(candy, {}, 500, null, Laya.Handler.create(this, function () {
                    explodeCandy['Candy_Explode'].explodeTarget = explodeTarget;
                }, []), 0);
            }, []), 0);
        }, []), 0);

        // 糖果的影子处理
        let shadow = candy.getChildByName('shadow') as Laya.Image;
        // 拉开距离并缩小
        Laya.Tween.to(shadow, { x: -20, y: 80, scaleX: 0.8, scaleY: 0.8, }, 300, null, Laya.Handler.create(this, function () {
            // 第二部回归
            Laya.Tween.to(shadow, { x: 0, y: 0, scaleX: 1, scaleY: 1 }, 500, null, Laya.Handler.create(this, function () {
            }), 0);
        }), 0);
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