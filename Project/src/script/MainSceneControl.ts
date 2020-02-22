import Enemy from "./Enemy";
import Candy from "./Candy";
export default class MainSceneControl extends Laya.Script {
    /** @prop {name:candy, tips:"糖果", type:Prefab}*/
    public candy: Laya.Prefab;
    /** @prop {name:candyParent, tips:"糖果父节点", type:Node}*/
    public candyParent: Laya.Sprite;
    /** @prop {name:candy_Explode, tips:"糖果", type:Prefab}*/
    public candy_Explode: Laya.Prefab;
    /** @prop {name:candy_ExplodeParent, tips:"爆炸糖果的父节点", type:Node}*/
    public candy_ExplodeParent: Laya.Sprite;
    /** @prop {name:explode, tips:"制作爆炸动画的预制体", type:Prefab}*/
    public explode: Laya.Prefab;

    /** @prop {name:roleParent, tips:"角色父节点", type:Node}*/
    public roleParent: Laya.Sprite;

    /** @prop {name:enemy, tips:"敌人", type:Prefab}*/
    public enemy: Laya.Prefab;
    /** @prop {name:enemyParent, tips:"敌人父节点", type:Node}*/
    public enemyParent: Laya.Sprite;
    /** @prop {name:enemyBullet, tips:"敌人子弹预制体", type:Prefab}*/
    public enemyBullet: Laya.Prefab;

    /** @prop {name:background, tips:"背景图", type:Node}*/
    public background: Laya.Sprite;

    /** @prop {name:speakBoxParent, tips:"对话框父节点", type:Node}*/
    public speakBoxParent: Laya.Sprite;
    /** @prop {name:speakBox, tips:"对话框", type:Prefab}*/
    public speakBox: Laya.Prefab;

    /** @prop {name:bulletParent, tips:"子弹父节点", type:Node}*/
    public bulletParent: Laya.Sprite;
    /** @prop {name:roleBullet, tips:"子弹", type:Prefab}*/
    public roleBullet: Laya.Prefab;

    /** @prop {name:scoreLabel, tips:‘得分’, type:Node}*/
    public scoreLabel: Laya.FontClip;

    /** @prop {name:hintWord , tips:"属性飘字提示", type:Prefab}*/
    public hintWord: Laya.Prefab;

    /** @prop {name:rewardWords , tips:"奖励提示语", type:Prefab}*/
    public rewardWords: Laya.Prefab;

    /** @prop {name:timer , tips:"计时器", type:Node}*/
    public timer: Laya.Sprite;
    /**时间进度条*/
    private timeSchedule: Laya.ProgressBar;

    /** @prop {name:displays , tips:"陈列台", type:Node}*/
    public displays: Laya.Image;

    /** @prop {name:operating , tips:"操作节点", type:Node}*/
    public operating: Laya.Sprite;

    /** @prop {name:assembly, tips:"流水线", type:Node}*/
    public assembly: Laya.Sprite;

    /** @prop {name:role_01 , tips:"主角1", type:Node}*/
    public role_01: Laya.Sprite;
    /** @prop {name:role_02 , tips:"主角2", type:Node}*/
    public role_02: Laya.Sprite;

    /** @prop {name:resurgence , tips:"复活继续界面", type:Prefab}*/
    public resurgence: Laya.Prefab;

    /** @prop {name:settlement , tips:"结算", type:Prefab}*/
    public settlement: Laya.Prefab;

    /** @prop {name:startInterface , tips:"开始游戏界面", type:Prefab}*/
    public startInterface: Laya.Prefab;

    /** @prop {name:ranking , tips:"排行榜界面", type:Prefab}*/
    public ranking: Laya.Prefab;

    /** @prop {name:score , tips:"分数节点", type:Prefab}*/
    public score: Laya.Prefab;

    /**两个主角的对话框*/
    private role_01speak: Laya.Sprite;
    private role_02speak: Laya.Sprite;

    /**敌人出现开关，这个开关每次开启后，一次性，赋一次值只能产生一个敌人*/
    private enemyAppear: boolean;
    /**怪物攻击对象,也是上个吃糖果对象,一次性，赋一次值只能用一次*/
    private enemyTagRole: Laya.Sprite;
    /**敌人产生的总个数记录*/
    private enemyCount: number;

    /**糖果产生的时间间隔*/
    private candy_interval: number;
    /**当前时间记录*/
    private creatTime: number;
    /**生产开关*/
    private creatOnOff: boolean;
    /**糖果到碰到感应装置时，名字装进这个数组*/
    private nameArr: Array<string>;
    /**糖果生产的总个数记录*/
    private candyCount: number;
    /**复活所需吃糖果的数量*/
    private rescueNum: number;

    /**时间线*/
    private timerControl: number;

    /**怪物属性*/
    private enemyProperty: any;

    /**左边出怪的时间间隔*/
    private enemyInterval_01: number;
    /**左边每次出怪时间控制*/
    private enemyTime_01: number;
    /**左边出怪开关*/
    private enemySwitch_01: boolean;

    /**右边出怪的时间间隔*/
    private enemyInterval_02: number;
    /**右边每次出怪时间控制*/
    private enemyTime_02: number;
    /**左边出怪开关*/
    private enemySwitch_02: boolean;

    /**10个糖果固定位置*/
    private posArr_left: Array<Array<number>>;
    private posArr_right: Array<Array<number>>;
    /**每次创建第一波糖果他们的名称组合*/
    private candyNameArr: Array<string>;
    /**糖果的行数*/
    private startRow: number;
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;
    /**是否处于暂停状态*/
    private suspend: boolean;

    /**左边糖果发射口*/
    private launchTemp_01: Laya.Templet;
    private candyLaunch_01: Laya.Skeleton;
    /**右边糖果发射口*/
    private launchTemp_02: Laya.Templet;
    private candyLaunch_02: Laya.Skeleton;

    /**游戏结束*/
    private gameOver: boolean;

    constructor() { super(); }

    onEnable(): void {
        this.noStarted();
        this.createStartInterface('start');
    }

    /**场景初始化*/
    startGame(): void {
        this.enemyAppear = false;
        this.enemyTagRole = null;
        this.enemyCount = 0;
        // 初始化怪物属性，依次为血量，攻击力，攻速，移动速度，攻击速度
        this.enemyProperty = {
            blood: 5000,
            attackValue: 200,
            attackSpeed: 1000,//暂时最小时间间隔为100
            defense: 10,
            moveSpeed: 10,
            creatInterval: 5000
        }
        this.enemyInterval_01 = 500;
        this.enemyTime_01 = Date.now();
        this.enemySwitch_01 = true;

        this.enemyInterval_02 = 500;
        this.enemyTime_02 = Date.now();
        this.enemySwitch_02 = true;

        this.candy_interval = 1000;
        this.creatTime = Date.now();
        this.creatOnOff = true;
        this.nameArr = [];
        this.candyCount = 0;
        this.scoreLabel.value = '0';

        this.timeSchedule = this.timer.getChildByName('timeSchedule') as Laya.ProgressBar;

        this.rescueNum = 0;
        // 关闭多点触控
        Laya.MouseManager.multiTouchEnabled = false;
        this.timerControl = 0;
        this.suspend = false;
        this.startRow = 4;
        this.gameOver = false;
        // 流水线水管动画
        this.assembly['Assembly'].pipeAnimation('flow');

        this.candyMoveToDisplay();
    }

    /**游戏没有开始的时候设置的属性*/
    noStarted(): void {
        this.self = this.owner as Laya.Scene;
        this.owner['MainSceneControl'] = this;//脚本赋值
        this.gameOver = true;
        this.createLaunchAni();
    }

    /**创建开始游戏界面*/
    createStartInterface(type): void {
        let startInterface = Laya.Pool.getItemByCreateFun('startInterface', this.startInterface.create, this.startInterface) as Laya.Sprite;
        this.owner.addChild(startInterface);
        startInterface.pivotX = startInterface.width / 2;
        startInterface.pivotY = startInterface.height / 2;
        startInterface.x = Laya.stage.width / 2;
        startInterface.y = Laya.stage.height / 2;

        startInterface['startGame'].aniTypeInit(type);
    }

    /**两个发射口的骨骼动画*/
    createLaunchAni(): void {
        //创建动画模板1
        this.launchTemp_01 = new Laya.Templet();
        this.launchTemp_01.on(Laya.Event.COMPLETE, this, this.parseComplete_01);
        this.launchTemp_01.on(Laya.Event.ERROR, this, this.onError);
        this.launchTemp_01.loadAni("candy/糖果机器/candyLaunch.sk");
        //创建动画模板2
        this.launchTemp_02 = new Laya.Templet();
        this.launchTemp_02.on(Laya.Event.COMPLETE, this, this.parseComplete_02);
        this.launchTemp_02.on(Laya.Event.ERROR, this, this.onError);
        this.launchTemp_02.loadAni("candy/糖果机器/candyLaunch.sk");
    }

    onError(): void {
        console.log('骨骼动画加载错误');
    }
    parseComplete_01(): void {
        // 静止
        this.candyLaunch_01 = this.assembly.getChildByName('candyLaunch_01') as Laya.Skeleton;//模板0
        this.candyLaunch_01.play('static', false);
        this.candyLaunch_01.on(Laya.Event.LABEL, this, this.candyLaunchListen_01);
    }
    parseComplete_02(): void {
        // 静止
        this.candyLaunch_02 = this.assembly.getChildByName('candyLaunch_02') as Laya.Skeleton;//模板0
        this.candyLaunch_02.play('static', false);
        this.candyLaunch_02.on(Laya.Event.LABEL, this, this.candyLaunchListen_02);
    }

    /**发射口监听监听1
     * 分开监听，因为有写操作只会执行一次
    */
    candyLaunchListen_01(e): void {
        if (e.name === 'launch') {
            console.log('发射！');
        } else if (e.name === 'getReady') {
            this.candyMoveToDisplay();
            this.timeSchedule.value = 1;
        }
    }
    /**发射口监听监听1*/
    candyLaunchListen_02(e): void {
        if (e.name === 'launch') {
            console.log('发射！');
        } else if (e.name === 'getReady') {
        }
    }

    /**生产8个糖果移动到操作台的动画
     * 4次，每次2个移动
     * 倒过来遍历
    */
    candyMoveToDisplay(): void {
        let delayed = 10;
        let candyHeiht = 100;
        let spacing = -1;
        let startX_02 = Laya.stage.width / 2 - 42;
        let startX_01 = Laya.stage.width / 2 + 58;
        //最远的那个位置
        let startY = this.displays.y + 4 * (candyHeiht + spacing) - 35;
        for (let i = 0; i < this.startRow; i++) {
            Laya.timer.frameOnce(delayed, this, function () {
                for (let j = 0; j < 2; j++) {
                    let candy = this.createCandy();
                    candy['Candy'].group = i;
                    candy.zOrder = this.startRow - i;//层级
                    if (j === 0) {
                        // 出生位置
                        candy.pos(this.displays.x + 160, this.displays.y - 50);
                        candy.scaleX = 0;
                        candy.scaleY = 0;
                        this.candyLaunch_01.play('launchLeft', false);
                        // 移动到陈列台位置
                        let targetY = startY - i * (candyHeiht + spacing);
                        this.candyFlipTheAni(candy, startX_01, targetY);
                    } else {
                        // 出生位置
                        candy.pos(this.displays.x - 160, this.displays.y - 50);
                        candy.scaleX = 0.5;
                        candy.scaleY = 0.5;
                        this.candyLaunch_02.play('launchRight', false);
                        // 陈列台位置
                        // 移动到陈列台位置
                        let targetY = startY - i * (candyHeiht + spacing);
                        this.candyFlipTheAni(candy, startX_02, targetY);
                    }
                }
            })
            delayed += 15;
        }
    }

    /**糖果发射动画时间线
     * @param candy 当前糖果
     * @param targetX 目标x位置
     * @param targetY 目标y位置
    */
    candyFlipTheAni(candy, targetX, targetY): void {
        // 基础时间参数，动画的时间会随着位置边近而缩小
        let timePar = 500 - candy['Candy'].group * 100;
        // 糖果本身
        // 第一步放大
        Laya.Tween.to(candy, { scaleX: 0.8, scaleY: 0.8, y: candy.y - 30 }, timePar / 2, null, Laya.Handler.create(this, function () {
            // 第二步飞天,位置是目标位置的一半
            let HalfX;
            let distancePer = 3;//在这个距离等分处飞到最高处
            if (candy.x > Laya.stage.width / 2) {
                HalfX = candy.x - (candy.x - targetX) / distancePer;
            } else {
                HalfX = candy.x + (targetX - candy.x) / distancePer;
            }
            let HalfY = candy.y + (targetY - candy.y) / distancePer;
            Laya.Tween.to(candy, { x: HalfX, y: HalfY, scaleX: 1.3, scaleY: 1.3 }, timePar * 3 / 4, null, Laya.Handler.create(this, function () {
                // 第三步降落
                Laya.Tween.to(candy, { x: targetX, y: targetY, scaleX: 1, scaleY: 1 }, timePar, null, Laya.Handler.create(this, function () {
                    // 落下特效并且播放禁止动画
                    this.explodeAni(this.owner, candy.x, candy.y, 'disappear', 8, 1000);
                    candy['Candy'].playSkeletonAni(1, 'static');
                    // 最后一组发射完毕后
                    if (candy['Candy'].group === 3) {
                        this.operating['OperationControl'].operateSwitch = true;
                        this.operating['OperationControl'].clickHint();
                        this.launchNum = 0;
                        this.launchSwitch = false;
                    }
                }), 0);
            }), 0);
        }), 10);
        // 糖果的影子处理
        let shadow = candy.getChildByName('shadow') as Laya.Image;
        // 第一步放大
        Laya.Tween.to(shadow, {}, timePar / 2, null, Laya.Handler.create(this, function () {
            // 第二步和糖果拉开距离
            Laya.Tween.to(shadow, { x: -20, y: 100, scaleX: 0.5, scaleY: 0.5, }, timePar * 3 / 4, null, Laya.Handler.create(this, function () {
                // 第三步降落
                Laya.Tween.to(shadow, { x: 0, y: 0, scaleX: 1, scaleY: 1 }, timePar, null, Laya.Handler.create(this, function () {
                }), 0);
            }), 0);
        }), 10);
    }

    /**产生糖果*/
    createCandy(): Laya.Sprite {
        // 通过对象池创建
        let candy = Laya.Pool.getItemByCreateFun('candy', this.candy.create, this.candy) as Laya.Sprite;
        // 随机创建一种颜色糖果
        // 糖果的名称结构是11位字符串加上索引值，方便查找，并且这样使他们的名称唯一
        let randomNum = Math.floor(Math.random() * 4);
        switch (randomNum) {
            case 0:
                candy.name = 'yellowCandy' + this.candyCount;
                break;
            case 1:
                candy.name = 'redCandy___' + this.candyCount;
                break;
            case 2:
                candy.name = 'blueCandy__' + this.candyCount;
                break;
            case 3:
                candy.name = 'greenCandy_' + this.candyCount;
                break;
            default:
                break;
        }
        // 随机点击次数
        let clicksLabel = candy.getChildByName('clicksLabel') as Laya.Label;
        clicksLabel.text = '';
        candy.pos(Laya.stage.width / 2, -100);
        candy.pivotX = candy.width / 2;
        candy.pivotY = candy.height / 2;
        this.candyParent.addChild(candy);
        candy.rotation = 0;
        this.candyCount++;
        return candy;
    }

    /**产生爆炸糖果*/
    createExplodeCandy(candyName: string): Laya.Sprite {
        // 通过对象池创建
        let explodeCandy = Laya.Pool.getItemByCreateFun('candy_Explode', this.candy_Explode.create, this.candy_Explode) as Laya.Sprite;
        explodeCandy.pos(Laya.stage.width / 2, -100);
        this.candy_ExplodeParent.addChild(explodeCandy);
        explodeCandy.rotation = 0;
        this.candyCount++;
        explodeCandy.name = candyName.substring(0, 11);
        return explodeCandy;
    }

    /**对爆炸糖果进行排序*/
    explodeCandyzOrder(): void {
        let len = this.candy_ExplodeParent._children.length;
        for (let i = 0; i < len; i++) {
            this.candy_ExplodeParent._children[i].zOrder = Math.round(this.candy_ExplodeParent._children[i].y);
        }
    }

    /**两个主角对话框的初始化*/
    roleSpeakBoxs(): void {
        for (let i = 0; i < 2; i++) {
            let speakBox = Laya.Pool.getItemByCreateFun('speakBox', this.speakBox.create, this.speakBox) as Laya.Sprite;
            this.speakBoxParent.addChild(speakBox);
            if (i === 0) {
                speakBox.pos(this.role_01.x, this.role_01.y);
                this.role_01speak = speakBox;
                this.role_01speak.alpha = 0;
                // 反向和偏移
                let pic = this.role_01speak.getChildByName('pic') as Laya.Sprite;
                let label = this.role_01speak.getChildByName('label') as Laya.Sprite;
                pic.scaleX = -1;
                label.x += 30;
            } else {
                speakBox.pos(this.role_02.x, this.role_02.y);
                this.role_02speak = speakBox;
                this.role_02speak.alpha = 0;
            }
        }
    }

    /**角色死亡复活状况*/
    roleDeathState(): void {
        // 角色死亡情况
        let len = this.roleParent._children.length;
        if (len === 0) {
            // 死亡
            this.enemySwitch_01 = false;
            this.enemySwitch_02 = false;

            return;
        } else if (len === 1) {
            let speak_01 = this.role_01speak.getChildByName('label') as Laya.Label;
            let speak_02 = this.role_02speak.getChildByName('label') as Laya.Label;
            // 复活
            if (this.rescueNum >= 5) {
                this.rescueNum = 0;
                if (this.roleParent._children[0].name === "role_01") {
                    this.roleParent.addChild(this.role_02);
                    this.role_02speak.x -= 150;
                    speak_02.text = '谢谢你啊！';
                } else {
                    this.roleParent.addChild(this.role_01);
                    speak_01.text = '谢谢你啊！';
                    this.role_01speak.x += 150;
                }
            } else {
                // 待复活提示
                if (this.roleParent._children[0].name === "role_01") {
                    this.role_02speak.alpha = 1;
                    this.role_02speak.x = this.role_02.x;
                    speak_02.text = '连续吃5个糖果不犯错的话我就复活了';
                } else {
                    this.role_01speak.alpha = 1;
                    this.role_01speak.x = this.role_01.x;
                    speak_01.text = '连续吃5个糖果不犯错的话我就复活了';
                }
            }
        } else if (len === 2) {
            // 保持，复活状态为空
            this.rescueNum === 0;
        }
    }

    /**出现敌人
     * 创建方式决定了敌人出生的位置
     * @param mode 创建模式是左边还是右边
     * @param tagRole 目标是哪个主角
    */
    careatEnemy(mode: string, tagRole: Laya.Sprite, type: string): Laya.Sprite {
        this.enemyCount++;
        if (tagRole !== null) {
            let enemy = Laya.Pool.getItemByCreateFun('enemy', this.enemy.create, this.enemy) as Laya.Sprite;
            this.enemyParent.addChild(enemy);
            enemy.name = 'enemy' + this.enemyCount;//名称唯一
            enemy.pivotX = enemy.width / 2;
            enemy.pivotY = enemy.height / 2;
            //出生位置判定,和攻击目标选择
            if (mode === 'left') {
                enemy.pos(-50, 300);
            } else if (mode === 'right') {
                enemy.pos(800, 300);
            } else if (mode === 'target') {
                if (tagRole.x < Laya.stage.width / 2 && tagRole.x > 0) {
                    enemy.pos(-50, 300);
                } else if (tagRole.x >= Laya.stage.width / 2 && tagRole.x < Laya.stage.width) {
                    enemy.pos(800, 300);
                }
            }
            enemy['Enemy'].slefTagRole = tagRole;
            enemy['Enemy'].enemyType = type;
            enemy['Enemy'].randomAttackPoint();
            enemy['Enemy'].createBoneAni();
            // 默认属性不可见
            let propertyShow = enemy.getChildByName('propertyShow') as Laya.Sprite;
            if (!this.suspend) {
                propertyShow.alpha = 0;
            } else {
                propertyShow.alpha = 1;
            }
            return enemy;
        }
    }
    /** 敌人的层级进行排序
     * 规则是判断y轴，y坐标越低的越靠前
     */
    enemyOrder(): void {
        for (let i = 0; i < this.enemyParent._children.length; i++) {
            this.enemyParent._children[i].zOrder = Math.round(this.enemyParent._children[i].y);
        }
    }
    /**属性刷新显示规则,血量显示一定是整数，并且是10的倍数
    * 根据时间线的增长，怪物的属性不断增强
    * 每隔600帧增长一次，大约是10秒钟
    */
    enemyPropertyUpdate(): void {
        if (this.timerControl % 600 === 0) {
            // 血量增长
            this.enemyProperty.blood += 50;
            // 攻击力增长
            this.enemyProperty.attackValue += 1;
            // 攻击速度增长，最短时间间隔为100
            this.enemyProperty.attackSpeed += 10;
            if (this.enemyProperty.attackSpeed < 100) {
                this.enemyProperty.attackSpeed = 100;
            }
            // 防御力增长
            this.enemyProperty.defense += 1;
            // 出怪时间增长,最短时间间隔为500
            this.enemyProperty.creatInterval += 50;
            if (this.enemyProperty.creatInterval < 500) {
                this.enemyProperty.creatInterval = 500;
            }
        }
    }

    /**爆炸动画
     * @param parent 父节点
     * @param x 位置
     * @param y
     * @param type 类型 
     * @param shul 数量 
     * @param zOrder 层级
    */
    explodeAni(parent, x, y, type, number, zOrder): void {
        for (let i = 0; i < number; i++) {
            let explode = Laya.Pool.getItemByCreateFun('explode', this.explode.create, this.explode) as Laya.Sprite;
            parent.addChild(explode);
            explode.zOrder = zOrder;
            explode.pos(x, y);
            // 类型
            explode['Explode'].type = type;
            explode['Explode'].initProperty(type);
        }
    }

    /**复活*/
    createResurgence(): void {
        this.assembly['Assembly'].pipeAnimation('static');
        let resurgence = Laya.Pool.getItemByCreateFun('resurgence', this.resurgence.create, this.resurgence) as Laya.Sprite;
        this.self.addChild(resurgence);
        resurgence.zOrder = 1000;
        resurgence.pos(0, 0);
    }

    /**属性增减动画*/
    createHintWord(target, proPertyType, numberValue): void {
        let hintWord = Laya.Pool.getItemByCreateFun('hintWord', this.hintWord.create, this.hintWord) as Laya.Sprite;
        target.addChild(hintWord);
        hintWord.pos(100, -10);
        hintWord['HintWord'].initProperty(proPertyType, numberValue);
    }

    /**重来，重置各种属性
     * 所有糖果和怪物都炸掉
     * 分数清零
     * 然后主角复活
    */
    restart(): void {
        // 消除敌人
        // 先隐藏在一并删除，否则可能会有length变化造成错误
        let enemyDelayed = 0;
        let len1 = this.enemyParent._children.length;
        for (let i = 0; i < this.enemyParent._children.length; i++) {
            Laya.timer.frameOnce(enemyDelayed, this, function () {
                if (!this.enemyParent._children[i]) {
                    return;
                }
                this.enemyParent._children[i].alpha = 0;
                let x = this.enemyParent._children[i].x;
                let y = this.enemyParent._children[i].y;
                if (this.enemyParent._children[i]['Enemy'] === 'infighting') {
                    this.explodeAni(this.owner, x, y, 'infighting', 15, 100);
                } else {
                    this.explodeAni(this.owner, x, y, 'range', 15, 100);
                }
                if (i === len1 - 1) {
                    this.enemyParent.removeChildren(0, len1 - 1);
                }
            });
            enemyDelayed += 20;
        }

        // 消除爆炸糖果
        // 先隐藏在一并删除，否则可能会有length变化造成错误
        let candyExpoleDelayed = 0;
        let len2 = this.candy_ExplodeParent._children.length;
        for (let j = 0; j < len2; j++) {
            Laya.timer.frameOnce(candyExpoleDelayed, this, function () {
                if (!this.candy_ExplodeParent._children[j]) {
                    return;
                }
                this.candy_ExplodeParent._children[j].alpha = 0;
                let name = this.candy_ExplodeParent._children[j].name.substring(0, 11);
                let x = this.candy_ExplodeParent._children[j].x;
                let y = this.candy_ExplodeParent._children[j].y;
                this.explodeAni(this.owner, x, y, 'disappear', 8, 1000);
                if (j === len2 - 1) {
                    this.candy_ExplodeParent.removeChildren(0, len2 - 1);
                }
            });
            candyExpoleDelayed += 20;
        }

        // 消除糖果,如果此时没有糖果直接初始化
        // 先隐藏在一并删除，否则可能会有length变化造成错误
        let candyDelayed = 0;
        let len3 = this.candyParent._children.length;
        if (len3 === 0) {
            this.roleResurgenceAni();
            this.candyParent.removeChildren(0, len3 - 1);
            return;
        }

        for (let k = 0; k < len3; k++) {
            Laya.timer.frameOnce(candyDelayed, this, function () {
                if (!this.candyParent._children[k]) {
                    return;
                }
                this.candyParent._children[k].alpha = 0;
                let name = this.candyParent._children[k].name.substring(0, 11);
                let x = this.candyParent._children[k].x;
                let y = this.candyParent._children[k].y;
                this.explodeAni(this.owner, x, y, 'disappear', 8, 1000);
                if (k === len3 - 1) {
                    this.roleResurgenceAni();
                    this.candyParent.removeChildren(0, len3 - 1);
                }
            });
            candyDelayed += 20;
        }
    }

    /**主角复活继续游戏*/
    roleResurgenceAni(): void {
        let skeleton1 = this.role_01.getChildByName('skeleton') as Laya.Skeleton;
        skeleton1.play('speak', true);
        Laya.Tween.to(this.role_01, { alpha: 1 }, 700, null, Laya.Handler.create(this, function () {
            this.restartProperties();
        }, []), 0);

        let skeleton2 = this.role_02.getChildByName('skeleton') as Laya.Skeleton;
        skeleton2.play('speak', true);
        Laya.Tween.to(this.role_02, { alpha: 1 }, 700, null, Laya.Handler.create(this, function () {
        }, []), 0);
    }

    /**重新开始所需改变的属性*/
    restartProperties(): void {
        this.startGame();
        //主角复活
        this.role_01['Role'].role_Warning = false;
        this.role_01['Role'].roleDeath = false;
        this.role_01['Role'].initProperty();

        this.role_02['Role'].role_Warning = false;
        this.role_02['Role'].roleDeath = false;
        this.role_02['Role'].initProperty();

        this.operating['OperationControl'].initProperty();

    }

    /**返回主界面清理场景*/
    returnStartSet(): void {
        // 分数清零
        this.scoreLabel.value = '0';
        this.noStarted();
        // 清空三个元素
        let len1 = this.enemyParent._children.length;
        this.enemyParent.removeChildren(0, len1 - 1);

        let len2 = this.candy_ExplodeParent._children.length;
        this.candy_ExplodeParent.removeChildren(0, len2 - 1);

        let len3 = this.candyParent._children.length;
        this.candyParent.removeChildren(0, len3 - 1);
        //主角复活
        this.role_01.alpha = 1;
        this.role_01['Role'].role_Warning = false;
        this.role_01['Role'].roleDeath = false;
        this.role_01['Role'].initProperty();

        this.role_02.alpha = 1;
        this.role_02['Role'].role_Warning = false;
        this.role_02['Role'].roleDeath = false;
        this.role_02['Role'].initProperty();

        // 操作台重置
        this.operating['OperationControl'].initProperty();
    }

    /** 更新微信排行榜的数据*/
    wxPostData() {
        if (Laya.Browser.onMiniGame) {
            let args = {
                type: 'scores', data: { scores: this.scoreLabel.value }
            }
            let wx: any = Laya.Browser.window.wx;
            let openDataContext: any = wx.getOpenDataContext();
            openDataContext.postMessage(args);
            console.log('上传了');
        } else {
            console.log('没有上传');
        }
    }

    /**分享*/
    wxShare() {
        if (Laya.Browser.onMiniGame) {
            let wx: any = Laya.Browser.window.wx;
            //下次测试
            wx.shareAppMessage({
                title: '怪星大作战'
            });
            console.log("主动进行了转发");
        } else {
            console.log("仅支持微信客户端");
        }

    }


    /**属性刷新显示规则*/
    onUpdate(): void {
        // 游戏结束
        if (this.gameOver) {
            return;
        }

        // 主角全部死亡则停止移动,并且弹出复活
        if (this.role_01['Role'].roleDeath && this.role_02['Role'].roleDeath) {
            this.gameOver = true;
            this.createResurgence();
            return;
        }

        // 时刻对敌人的层级进行排序
        this.enemyOrder();
        // 记录时间
        this.timerControl += 1;
        // 根据时间线，刷新怪物属性
        this.enemyPropertyUpdate();
        // 角色死亡复活状况
        this.roleDeathState();
        // 通过时间间隔产生敌人，左右产生的敌人不一样
        // 左
        if (this.enemySwitch_01) {
            let nowTime = Date.now();
            if (nowTime - this.enemyTime_01 > this.enemyProperty.creatInterval) {
                this.enemyTime_01 = nowTime;
                this.enemyTagRole = this.role_01;
                this.careatEnemy('left', this.role_01, 'infighting');
                this.careatEnemy('left', this.role_01, 'range');
                this.enemyTagRole = null;
            }
        }
        // 右
        if (this.enemySwitch_02) {
            let nowTime = Date.now();
            if (nowTime - this.enemyTime_02 > this.enemyProperty.creatInterval) {
                this.enemyTime_02 = nowTime;
                this.enemyTagRole = this.role_02;
                this.careatEnemy('right', this.role_02, 'infighting');
                this.careatEnemy('right', this.role_02, 'range');
                this.enemyTagRole = null;
            }
        }
    }

    onDisable(): void {
    }
}