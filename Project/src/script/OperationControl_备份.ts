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
    /** @prop {name:clickHintSign, tips:"点击提示遮罩", type:Node}*/
    public clickHintSign: Laya.Sprite;

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
    /**当前点击的组记录*/
    private clicksGroup: number;
    /**当前正确点击了几个糖果*/
    private zeroCount: number;

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
        this.clickHintSign.alpha = 0;

        this.timeSchedule = this.timer.getChildByName('timeSchedule') as Laya.ProgressBar;
        this.self['OperationControl'] = this;

        this.clicksGroup = 0;
        this.zeroCount = 0;
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
        let btn_name = event.currentTarget.name;
        this.clickJudge(btn_name);
        // switch (event.currentTarget.name) {
        //     case 'redButton':
        //         this.clicksNameArr.push('redCandy___');
        //         break;
        //     case 'yellowButton':
        //         this.clicksNameArr.push('yellowCandy');
        //         break;
        //     case 'greenButton':
        //         this.clicksNameArr.push('greenCandy_');
        //         break;
        //     case 'blueButton':
        //         this.clicksNameArr.push('blueCandy__');
        //         break;
        //     default: break;
        // }
        // // 两两对比判断之后清空这个数组，当点击次数是2的倍数时进行对比
        // if (this.clicksCount % 2 === 0 && this.clicksCount >= 2) {
        //     this.clickTwoCompareName();//第二次点击对比
        // } else {
        //     this.clickOneCompareName();//第一次点击对比

        // }
        // // 点完结算
        // if (this.clicksCount === this.selfScene['MainSceneControl'].startRow * 2) {
        //     this.settlement();
        // }
        event.currentTarget.scale(0.9, 0.9);
    }


    /**点击判断*/
    clickJudge(btn_name): void {
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

        // 找出当前需要点击的组和配对的名字
        for (let i = 0; i < this.candyParent._children.length; i++) {
            let candy = this.candyParent._children[i];
            let group = candy['Candy'].group;
            let name = candy.name.substring(0, 11);
            // 糖果的组和配对的名字都相同的时候,那么clickLebal-1；
            let clicksLabel = candy.getChildByName('clicksLabel') as Laya.FontClip;
            if (group === this.clicksGroup && name === pairName) {
                nameCount++;
                // 第一次点击正确了
                if (nameCount === 1) {
                    if (Number(clicksLabel.value) > 0) {
                        rightCount++;
                        clicksLabel.value = (Number(clicksLabel.value) - 1).toString();
                        if (Number(clicksLabel.value) === 0) {
                            clicksLabel.value = ' ';
                            this.zeroCount++;
                        }
                        break;
                    }
                } else if (nameCount === 2) {//第一次点击不正确则到第二次，因为break了
                    if (Number(clicksLabel.value) > 0) {
                        rightCount++;
                        clicksLabel.value = (Number(clicksLabel.value) - 1).toString();
                        if (Number(clicksLabel.value) === 0) {
                            clicksLabel.value = ' ';
                            this.zeroCount++;
                        }
                        break;
                    }
                }
            }
        }

        // 两个糖果都不相同的时候，和点的不正确的时候直接结算
        if (nameCount === 0 || rightCount === 0) {
            for (let i = 0; i < this.candyParent._children.length; i++) {
                let candy = this.candyParent._children[i];
                let group = candy['Candy'].group;
                if (group === this.clicksGroup) {
                    // 生成1个爆炸糖果
                    let explodeCandy = this.selfScene['MainSceneControl'].createExplodeCandy(candy.name);
                    explodeCandy.pos(candy.x, candy.y);
                    candy.removeSelf();
                    i--;
                }
            }
            this.groupHint();
        }

        // 两个都点成了零，说明这组点对了，到下一组
        if (this.zeroCount === 2) {
            this.groupHint();
        }

        // 都点完了最终结算
        if (this.clicksGroup === 5) {
            this.groupHint();
            this.settlementMethods();
        }
    }

    /**组提示*/
    groupHint(): void {
        this.zeroCount = 0;
        this.clicksGroup++;
        //两边箭头提示
        let maskYArr = [753, 651.5, 550, 449];
        this.clickHintSign.alpha = 1;
        this.clickHintSign.y = maskYArr[this.clicksGroup];
    }

    /**结算
     * 结算的时候，点击错误的糖果已经变成了爆炸糖果
     * 所以，第一步让糖果飞到主角身上
     * 第二步让爆炸糖果炸主角
    */
    settlementMethods(): void {
        for (let i = 0; i < this.candyParent._children.length; i++) {
            let candy = this.candyParent._children[i];
            if (candy.x < Laya.stage.width / 2) {
                candy['Candy'].candyTagRole = this.selfScene['MainSceneControl'].role_01;
                candy['Candy'].candyFlyToRole();
            } else {
                candy['Candy'].candyTagRole = this.selfScene['MainSceneControl'].role_02;
                candy['Candy'].candyFlyToRole();
            }
        }
        for (let j = 0; j < this.candy_ExplodeParent._children.length; j++) {
            let explodeCandy = this.candy_ExplodeParent._children[j];
            this.explodeCandyFlyToRole(explodeCandy);
        }
    }

    /**爆炸糖果移动路径
    * @param explodeCandy 爆炸糖果
   */
    explodeCandyFlyToRole(explodeCandy: Laya.Sprite): void {
        // 左右两个方向
        let point;//飞向固定点的左右位置
        let explodeTarget;//攻击对象
        // 抛物线运动最高点位置
        let HalfX;
        let HalfY;
        // 抛物线最高点位置站整个x移动位置的比例
        let distancePer = 2;
        if (explodeCandy.x < Laya.stage.width / 2) {
            explodeTarget = this.selfScene['MainSceneControl'].role_01;
            point = new Laya.Point(explodeCandy.x - 200, explodeCandy.y + 80);
            HalfX = explodeCandy.x - (explodeCandy.x - point.x) / distancePer;
        } else {
            explodeTarget = this.selfScene['MainSceneControl'].role_02;
            point = new Laya.Point(explodeCandy.x + 200, explodeCandy.y + 80);
            HalfX = explodeCandy.x + (point.x - explodeCandy.x) / distancePer;
        }
        HalfY = explodeCandy.y - 100;
        
        // 第一步飞天放大
        Laya.Tween.to(explodeCandy, { x: HalfX, y: HalfY, scaleX: 1.3, scaleY: 1.3 }, 500, null, Laya.Handler.create(this, function () {

            // 第二步降落缩小
            Laya.Tween.to(explodeCandy, { x: point.x, y: point.y, scaleX: 0.9, scaleY: 0.9 }, 400, null, Laya.Handler.create(this, function () {
                explodeCandy.scale(0.9, 0.9);
                this.selfScene['MainSceneControl'].explodeAni(this.selfScene, explodeCandy.x, explodeCandy.y, 'disappear', 8, 1000);
                // 层级排序
                this.selfScene['MainSceneControl'].explodeCandyzOrder();
                // 第三步停留，延迟给予爆炸目标
                Laya.Tween.to(explodeCandy, {}, 500, null, Laya.Handler.create(this, function () {
                    explodeCandy['Candy_Explode'].explodeTarget = explodeTarget;
                }, []), 0);
            }, []), 0);
        }, []), 0);

        // 糖果的影子处理
        let shadow = explodeCandy.getChildByName('shadow') as Laya.Image;
        // 拉开距离并缩小
        Laya.Tween.to(shadow, { x: -20, y: 80, scaleX: 0.8, scaleY: 0.8, }, 300, null, Laya.Handler.create(this, function () {
            // 第二部回归
            Laya.Tween.to(shadow, { x: 0, y: 0, scaleX: 1, scaleY: 1 }, 500, null, Laya.Handler.create(this, function () {
            }), 0);
        }), 0);

    }

    /**当前组结算*/
    groupBecomeEnemy(): void {

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
                        // this.rightAndWrongShow('right', firstCandy);
                        // this.rightAndWrongShow('right', candy);
                        // 正确的糖果名称保存
                        this.rightName.push(nameArr[0], nameArr[1]);
                    } else {
                        // this.rightAndWrongShow('wrong', firstCandy);
                        // this.rightAndWrongShow('wrong', candy);
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
                    // this.rightAndWrongShow('right', candy);
                    break;
                } else {
                    // number用于记录第几次循环，最多两次循环
                    nameArr.push(candy.name);
                    if (nameArr.length === 2) {
                        // 当nameArr.length=2的时候说明一个都不对，那么直接结束本组
                        let firstCandy = this.candyParent.getChildByName(nameArr[0]) as Laya.Sprite;
                        // this.rightAndWrongShow('wrong', firstCandy);
                        // this.rightAndWrongShow('wrong', candy);
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
    }

    /**提示我应该点哪一组了
     * 这一组结束之后提示下一组
     * 然后这一组的提示消失
    */
    clickHint(): void {
        let maskYArr = [753, 651.5, 550, 449];
        this.clickHintSign.alpha = 1;
        for (let i = 0; i < this.candyParent._children.length; i++) {
            // 当前点击到的组，是最后一个
            let presentGroup = this.alreadyGroup[this.alreadyGroup.length - 1];
            let candy = this.candyParent._children[i];
            let candyGroup = candy['Candy'].group;
            // 如果还没有点击那么0组提示
            if (this.alreadyGroup.length === 0) {
                if (candyGroup === 0) {
                    candy.scale(1.1, 1.1);
                    this.clickHintSign.y = maskYArr[0];
                }
            } else {
                // 当前这一组
                if (candyGroup === presentGroup) {
                    candy.scale(1, 1);
                }
                if (candyGroup === presentGroup + 1) {
                    candy.scale(1.1, 1.1);
                    this.clickHintSign.y = maskYArr[presentGroup + 1];
                }
            }
        }
    }

    /**结算，当10个都点击完毕后，执行吃糖果或者是变成爆炸糖果过的动画*/
    settlement(): void {
        this.operateSwitch = false;
        this.clickHintSign.alpha = 0;
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

        //发射糖果预备动画，监听这个动画完成后发射糖果
        this.selfScene['MainSceneControl'].candyLaunch_01.play('prepare', false);
        this.selfScene['MainSceneControl'].candyLaunch_02.play('prepare', false);
    }

    /**计时器控制
     * 当时间小于零的时候所有还没有点击的糖果直接变成敌人
     * 并且结算，重置属性
    */
    timerControl(): void {
        if (this.timeSchedule.value > 0 && this.operateSwitch) {
            this.timeSchedule.value -= 0.0005;
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
            candy['Candy'].playSkeletonAni(4, 'turnLeft');
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
                // 层级排序
                this.selfScene['MainSceneControl'].explodeCandyzOrder();
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