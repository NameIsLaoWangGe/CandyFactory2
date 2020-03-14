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

    /** @prop {name:clickHintSign, tips:"点击提示标志", type:Node}*/
    public clickHintSign: Laya.Sprite;

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

    /** @prop {name:enemyHint , tips:"倒计时", type:Prefab}*/
    public enemyHint: Laya.Prefab;

    /**怪物攻击对象,也是上个吃糖果对象,一次性，赋一次值只能用一次*/
    private enemyTagRole: Laya.Sprite;
    /**敌人产生的总个数记录*/
    private enemyCount: number;

    /**糖果生产的总个数记录*/
    private candyCount: number;
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

    /**糖果波次记录*/
    private launcheCount: number;

    /**游戏结束*/
    private gameOver: boolean;

    constructor() { super(); }

    onEnable(): void {
        this.noStarted('startInterface');
        this.createStartInterface('start');
        this.createLaunchAni();
        this.wxPostInit();
        this.adaptive();
    }

    /**自适应*/
    adaptive(): void {
        this.assembly.y = Laya.stage.height / 2 - 150;
        this.role_01.y = Laya.stage.height * 0.71;
        this.role_02.y = Laya.stage.height * 0.71 - 24;
        this.operating.y = Laya.stage.height * 0.85;
        this.owner.scene.height = Laya.stage.height;
    }

    /**第一次场景初始化
      * 第一次和后面正式开始只有两个个却别，
      * 1、是场景时间时间线关闭怪物不出现
      * 2、糖果点击倒计时关闭
     */
    firstStart(): void {
        // 流水线水管动画
        this.assembly['Assembly'].pipeAnimation('flow');
        this.roleAppear();
        this.candyLaunch_01.play('prepare', false);
        this.candyLaunch_02.play('prepare', false);
    }

    /**第二次开始场景初始化
     * 第一次和后面正式开始只有两个个却别，
     * 1、是场景时间时间线关闭怪物不出现
     * 2、糖果点击倒计时关闭
    */
    secondAfterStart(): void {
        this.timerControl = 0;
        this.candyLaunch_01.play('prepare', false);
        this.candyLaunch_02.play('prepare', false);
        this.createEnemyHint();
    }

    /**游戏没有开始的时候设置的属性
     * @param type 这个是重来初始化还是返回主界面的初始化
    */
    noStarted(type): void {
        this.self = this.owner as Laya.Scene;
        //脚本赋值
        this.owner['MainSceneControl'] = this;
        // 关闭多点触控
        Laya.MouseManager.multiTouchEnabled = false;
        this.scoreLabel.value = '0';
        this.timeSchedule = this.timer.getChildByName('timeSchedule') as Laya.ProgressBar;
        this.timeSchedule.value = 1;
        this.suspend = false;
        this.gameOver = false;
        this.launcheCount = 0;
        if (type === 'reStart') {
            this.role_01['Role'].skeleton.play('speak', true);
            this.role_02['Role'].skeleton.play('speak', true);
        } else if (type === 'startInterface') {
            this.role_01.x = -500;
            this.role_02.x = 1834;
        }
        this.enemyPropertyInit();
    }

    /**敌人的属性初始化
     * 怪物属性依次为血量，攻击力，攻速，移动速度，攻击速度
    */
    enemyPropertyInit(): void {
        this.enemyProperty = {
            blood: 200,
            attackValue: 10,
            attackSpeed: 1500,//暂时最小时间间隔为100
            defense: 10,
            moveSpeed: 10,
            creatInterval: 8000
        }
        this.enemyCount = 0;
        this.enemyTime_01 = Date.now();
        this.enemyTime_02 = Date.now();
        this.enemyInterval_01 = this.enemyProperty.creatInterval;
        this.enemyInterval_02 = this.enemyProperty.creatInterval;
        this.enemySwitch_01 = false;
        this.enemySwitch_02 = false;
        this.enemyTagRole = null;
    }

    /**创建开始游戏界面*/
    createStartInterface(type): void {
        let startInterface = Laya.Pool.getItemByCreateFun('startInterface', this.startInterface.create, this.startInterface) as Laya.Sprite;
        this.owner.addChild(startInterface);
        startInterface.pivotX = startInterface.width / 2;
        startInterface.pivotY = startInterface.height / 2;
        startInterface.x = Laya.stage.width / 2;
        startInterface.y = Laya.stage.height / 2;

        startInterface['StartGame'].aniTypeInit(type);
    }

    /**两个发射口的骨骼动画
     * 这两个骨骼动画播放意味着发射出糖果
    */
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
     * 分开监听，因为有些操作只会执行一次
    */
    candyLaunchListen_01(e): void {
        if (e.name === 'launch') {
        } else if (e.name === 'getReady') {
            this.candyMoveToDisplay();
            this.timeSchedule.value = 1;
        }
    }
    /**发射口监听监听1*/
    candyLaunchListen_02(e): void {
        if (e.name === 'launch') {
        } else if (e.name === 'getReady') {

        }
    }

    /**生产8个糖果移动到操作台的动画
     * 4次，每次2个移动
     * 倒过来遍历
    */
    candyMoveToDisplay(): void {
        //行数
        let row = 4;
        //每组循环的延时数，逐步增加
        let delayed = 10;
        //糖果高度
        let candyHeiht = 100;
        //间距
        let spacing = -1;
        //两个初始X位置
        let startX_01 = Laya.stage.width / 2 + 60;
        let startX_02 = Laya.stage.width / 2 - 50;
        //陈列台父节点
        let displaysPar = this.displays.parent as Laya.Sprite;
        // 流水线内部转换为世界坐标Y所需要的差值
        let worldDevY = displaysPar.y - displaysPar.pivotY;
        // 第一个糖果的是陈列台位置，后面糖果往后排
        let startY = this.displays.y + worldDevY + row * (candyHeiht + spacing) - 35;
        for (let i = 0; i < row; i++) {
            Laya.timer.frameOnce(delayed, this, function () {
                for (let j = 0; j < 2; j++) {
                    let candy = this.createCandy();
                    candy['Candy'].group = i;
                    candy.zOrder = row - i;//层级
                    // 出生Y轴位置是发射口相对世界坐标
                    let BirthY = this.candyLaunch_01.y + worldDevY - 20;
                    if (j === 0) {
                        candy.pos(this.candyLaunch_02.x, BirthY);
                        candy.scaleX = 0;
                        candy.scaleY = 0;
                        this.candyLaunch_01.play('launchLeft', false);
                        // 移动到陈列台位置
                        let targetY = startY - i * (candyHeiht + spacing);
                        this.candyFlipTheAni(i, j, candy, startX_01, targetY);
                    } else {
                        // 出生位置
                        candy.pos(this.candyLaunch_01.x, BirthY);
                        candy.scaleX = 0.5;
                        candy.scaleY = 0.5;
                        this.candyLaunch_02.play('launchRight', false);
                        // 陈列台位置
                        // 移动到陈列台位置
                        let targetY = startY - i * (candyHeiht + spacing);
                        this.candyFlipTheAni(i, j, candy, startX_02, targetY);
                    }
                }
            })
            delayed += 15;
        }
    }
    /**糖果发射动画时间线
     * @param i 当前组
     * @param j 当前列
     * @param candy 当前糖果
     * @param targetX 目标x位置
     * @param targetY 目标y位置
    */
    candyFlipTheAni(i, j, candy, targetX, targetY): void {
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
                Laya.Tween.to(candy, { x: targetX, y: targetY, scaleX: 1, scaleY: 1 }, timePar * 1.3, null, Laya.Handler.create(this, function () {
                    // 落下特效并且播放禁止动画,并且显示点击次数
                    this.explodeAni(this.owner, candy.x, candy.y, 'disappear', 8, 1000);
                    candy['Candy'].playSkeletonAni(1, 'bonbonniere');
                    candy['Candy'].clicksLabel.alpha = 1;
                    // 最后一组发射完毕后
                    if (i === 3 && j === 1) {
                        this.launcheCount++;
                        console.log('弟' + this.launcheCount + '次发射！');
                        // 第一次需要引导玩家操作，通过说话完成，并且第一轮不计算时间
                        if (this.launcheCount === 1) {
                            this.roleSpeakBoxs('role_01', 'firstClick');
                            this.roleSpeakBoxs('role_02', 'firstClick');
                            this.operating['OperationControl'].firstClick = true;
                        } else if (this.launcheCount === 2) {
                            // 第二轮的时候开启倒计时
                            this.operating['OperationControl'].firstClick = false;
                        }
                        this.operating['OperationControl'].operateSwitch = true;
                        this.operating['OperationControl'].initHint();
                    }
                }), 0);
            }), 0);
        }), 10);
        // 糖果的影子处理
        let shadow = candy.getChildByName('shadow') as Laya.Image;
        // 第一步放大
        Laya.Tween.to(shadow, {}, timePar / 2, null, Laya.Handler.create(this, function () {
            // 第二步和糖果拉开距离
            Laya.Tween.to(shadow, { x: -20 + 52, y: 100 + 60, scaleX: 0.5, scaleY: 0.5, }, timePar * 3 / 4, null, Laya.Handler.create(this, function () {
                // 第三步降落
                Laya.Tween.to(shadow, { x: 0 + 52, y: 0 + 60, scaleX: 1, scaleY: 1 }, timePar * 1.3, null, Laya.Handler.create(this, function () {
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
        candy.pos(0, 0);
        candy.pivotX = candy.width / 2;
        candy.pivotY = candy.height / 2;
        this.candyParent.addChild(candy);
        candy.rotation = 0;
        this.candyCount++;

        return candy;
    }

    /**主角出现动画*/
    roleAppear(): void {
        Laya.Tween.to(this.role_01, { x: 139 }, 1000, null, Laya.Handler.create(this, function () {
            this.role_01['Role'].skeleton.play('speak', true);
        }, []), 0);
        Laya.Tween.to(this.role_02, { x: 669 }, 1000, null, Laya.Handler.create(this, function () {
            this.role_02['Role'].skeleton.play('speak', true);
        }, []), 0);
    }

    /**主角消失动画*/
    roleVanish(): void {
        Laya.Tween.to(this.role_01, { x: -500 }, 1000, null, Laya.Handler.create(this, function () {
            this.role_01['Role'].skeleton.play('frontMove', true);

        }, []), 0);
        Laya.Tween.to(this.role_02, { x: 1834 }, 1000, null, Laya.Handler.create(this, function () {
            this.role_02['Role'].skeleton.play('frontMove', true);
        }, []), 0);
    }

    /**两个主角对话框的初始化*/
    roleSpeakBoxs(who, describe): void {
        let speakBox = Laya.Pool.getItemByCreateFun('speakBox', this.speakBox.create, this.speakBox) as Laya.Sprite;
        speakBox.name = 'speakBox';
        if (who === 'role_01') {
            this.role_01.addChild(speakBox);
        } else if (who === 'role_02') {
            this.role_02.addChild(speakBox);
        }
        speakBox['SpeakBox'].speakingRules(who, describe);
        speakBox.pos(70, -110);
    }

    /**角色死亡复活状况*/
    roleDeathState(): void {
    }

    /**敌人出现倒计时*/
    createEnemyHint(): void {
        let enemyHint = Laya.Pool.getItemByCreateFun('enemyHint', this.enemyHint.create, this.enemyHint) as Laya.Sprite;
        this.owner.addChild(enemyHint);
        enemyHint.zOrder = 1000;
    }

    /**出现敌人
     * 创建方式决定了敌人出生的位置
     * @param mode 创建模式是左边还是右边
     * @param tagRole 目标是哪个主角
    */
    createEnemy(mode: string, tagRole: Laya.Sprite, type: string): Laya.Sprite {
        this.enemyCount++;
        if (tagRole !== null) {
            let enemy = Laya.Pool.getItemByCreateFun('enemy', this.enemy.create, this.enemy) as Laya.Sprite;
            this.enemyParent.addChild(enemy);
            enemy.name = 'enemy' + this.enemyCount;//名称唯一
            enemy.pivotX = enemy.width / 2;
            enemy.pivotY = enemy.height / 2;
            //出生位置判定,和攻击目标选择
            let y = Laya.stage.height * 0.23;
            if (mode === 'left') {
                enemy.pos(-50, y);
            } else if (mode === 'right') {
                enemy.pos(800, y);
            } else if (mode === 'target') {
                if (tagRole.x < Laya.stage.width / 2 && tagRole.x > 0) {
                    enemy.pos(-50, y);
                } else if (tagRole.x >= Laya.stage.width / 2 && tagRole.x < Laya.stage.width) {
                    enemy.pos(800, y);
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
        if (this.timerControl % 600 === 0 && this.enemySwitch_01) {
            // 血量增长
            this.enemyProperty.blood += 25;
            // 攻击力增长
            this.enemyProperty.attackValue += 1;
            // 攻击速度增长，最短时间间隔为100
            this.enemyProperty.attackSpeed += 5;
            if (this.enemyProperty.attackSpeed < 100) {
                this.enemyProperty.attackSpeed = 100;
            }
            // 防御力增长
            this.enemyProperty.defense += 1;
            // 出怪时间增长,最短时间间隔为500
            this.enemyProperty.creatInterval += 25;
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

    /**属性增减动画和分数增加动画
     * @param target 父节点
     * @param x 位置
     * @param y 类型
     * @param proPertyType 类型
     * @param numberValue 增减动画值
    */
    createHintWord(target, x, y, proPertyType, numberValue, scale): void {
        let hintWord = Laya.Pool.getItemByCreateFun('hintWord', this.hintWord.create, this.hintWord) as Laya.Sprite;
        target.addChild(hintWord);
        hintWord.pos(x, y);
        hintWord.scale(scale, scale);
        hintWord.zOrder = 300;
        hintWord['HintWord'].initProperty(proPertyType, numberValue);
    }

    /**重来，重置各种属性
     * 所有糖果和怪物都炸掉
     * 分数清零
     * 然后主角复活
    */
    restart(): void {
        //需要对比他们的数量，复活重来需要在动画的最后一个
        let len1 = this.enemyParent._children.length;
        let len2 = this.candyParent._children.length;
        // 消除敌人
        // 先隐藏在一并删除，否则可能会有length变化造成错误
        this.clearAllEnemy('reStart', len2);
        // 再消除糖果
        let candyDelayed = 0;
        for (let k = 0; k < len2; k++) {
            Laya.timer.frameOnce(candyDelayed, this, function () {
                if (!this.candyParent._children[k]) {
                    return;
                }
                this.candyParent._children[k].alpha = 0;
                let name = this.candyParent._children[k].name.substring(0, 11);
                let x = this.candyParent._children[k].x;
                let y = this.candyParent._children[k].y;
                this.explodeAni(this.owner, x, y, 'disappear', 8, 1000);
                if (k === len2 - 1) {
                    //对比数量，数量多的后播放完，然后执行主角复活
                    if (len1 < len2) {
                        this.roleResurgenceAni('reStart');
                    }
                    this.candyParent.removeChildren(0, len2 - 1);
                }
            });
            candyDelayed += 5;
        }
    }

    /**清除所有怪物
     * 用不同的参数执行在不同的地方执行
     * 目前有两个地方使用，一个是复活，一个是重来
     * @param type 
     * @param number
    */
    clearAllEnemy(type, len2): void {
        let len1 = this.enemyParent._children.length;
        let enemyDelayed = 0;
        for (let i = 0; i < len1; i++) {
            let enemy = this.enemyParent._children[i];
            Laya.timer.frameOnce(enemyDelayed, this, function () {
                if (!this.enemyParent._children[i]) {
                    return;
                }
                if (this.enemyParent._children[i]['Enemy'].enemyType === 'fighting') {
                    this.explodeAni(this.owner, enemy.x, enemy.y, 'fighting', 15, 100);
                } else {
                    this.explodeAni(this.owner, enemy.x, enemy.y, 'range', 15, 100);
                }
                enemy.alpha = 0;
                if (i === len1 - 1) {
                    if (type === 'reStart' && len2 !== null) {
                        //对比数量，数量多的后播放完，然后执行主角复活
                        if (len1 >= len2) {
                            this.roleResurgenceAni('reStart');
                        }
                    } else if (type === 'resurgence') {
                        // 直接复活这是复活模式
                        this.roleResurgenceAni('resurgence');
                    }
                    this.enemyParent.removeChildren(0, len1 - 1);
                }
            });
            enemyDelayed += 5;
        }
    }

    /**重新开始主角所初始化的属性
     * @param type 是复活界面的复活还是重来的复活
    */
    roleResurgenceAni(type): void {
        let skeleton1 = this.role_01.getChildByName('skeleton') as Laya.Skeleton;
        Laya.Tween.to(this.role_01, { alpha: 1 }, 700, null, Laya.Handler.create(this, function () {
            if (type === 'reStart') {
                this.resetGame('reStart');
            } else if (type === 'resurgence') {
                this.resurgenceHintWord();
            }
        }, []), 0);

        let skeleton2 = this.role_02.getChildByName('skeleton') as Laya.Skeleton;
        Laya.Tween.to(this.role_02, { alpha: 1 }, 700, null, Laya.Handler.create(this, function () {
        }, []), 0);
    }

    /**重新开始或者复活所需改变的属性
     * 重新开始不会经过新手引导  this.launcheCount从2开始;
     * 这里面有两个情况，一个是重新开始，一个是复活；
    */
    resetGame(type): void {
        if (type === 'reStart') {
            this.noStarted('reStart');
            this.secondAfterStart();
            this.role_01.x = 139;
            this.role_02.x = 669;
            this.launcheCount = 2;
            //主角复活
            this.role_01['Role'].initProperty();
            this.role_02['Role'].initProperty();

            this.operating['OperationControl'].initProperty();
        } else if (type === 'resurgence') {
            this.gameOver = false;
            this.operating['OperationControl'].operateSwitch = true;
        }
        this.role_01['Role'].role_Warning = false;
        this.role_01['Role'].roleDeath = false;
        this.role_02['Role'].role_Warning = false;
        this.role_02['Role'].roleDeath = false;
    }

    /**主角复活提示动画*/
    resurgenceHintWord(): void {
        let delayed = 0;
        this.role_01;
        this.role_02;
        let x = 80;
        let y = -20;
        for (let i = 0; i < 4; i++) {
            Laya.timer.frameOnce(delayed, this, function () {
                switch (i) {
                    case 0:
                        this.createHintWord(this.role_01, x, y, '攻击里', 20, 1);
                        this.createHintWord(this.role_02, x - 10, y, '攻击里', 20, 1);
                        this.role_01['Role'].role_property.attackValue += 20;
                        this.role_02['Role'].role_property.attackValue += 20;
                        break;
                    case 1:
                        this.createHintWord(this.role_01, x, y, '生命', 1000, 1);
                        this.createHintWord(this.role_02, x - 10, y, '生命', 1000, 1);
                        this.role_01['Role'].role_property.blood = 1000;
                        this.role_02['Role'].role_property.blood = 1000;
                        break;
                    case 2:
                        this.createHintWord(this.role_01, x, y, '公鸡速度', 20, 1);
                        this.createHintWord(this.role_02, x - 10, y, '公鸡速度', 20, 1);
                        this.role_01['Role'].role_property.attackSpeed += 20;
                        this.role_02['Role'].role_property.attackSpeed += 20;
                        break;
                    case 3:
                        this.createHintWord(this.role_01, x, y, '防御力', 10, 1);
                        this.createHintWord(this.role_02, x - 10, y, '防御力', 10, 1);
                        this.role_01['Role'].role_property.defense += 10;
                        this.role_02['Role'].role_property.defense += 10;
                        break;
                    default:
                        break;
                }
                // 播放完毕之后开始游戏
                if (i === 3) {
                    this.resetGame('resurgence');
                }
            })
            delayed += 25;
        }
    }

    /**返回主界面清理场景*/
    returnStartSet(): void {
        this.noStarted('startInterface');
        // 清空怪物和糖果
        let len1 = this.enemyParent._children.length;
        this.enemyParent.removeChildren(0, len1 - 1);
        let len2 = this.candyParent._children.length;
        this.candyParent.removeChildren(0, len2 - 1);
        //主角复活
        this.role_01.alpha = 1;
        this.role_01['Role'].role_Warning = false;
        this.role_01['Role'].roleDeath = false;
        this.role_01['Role'].initProperty();

        this.role_02.alpha = 1;
        this.role_02['Role'].role_Warning = false;
        this.role_02['Role'].roleDeath = false;
        this.role_02['Role'].initProperty();
        // 重置怪物属性
        this.enemyPropertyInit();
        // 操作台重置
        this.operating['OperationControl'].initProperty();
    }

    /** 微信排行榜初始化*/
    wxPostInit() {
        if (Laya.Browser.onMiniGame) {
            Laya.loader.load(["res/atlas/rank.atlas"], Laya.Handler.create(null, function () {
                //加载完成
                //使用接口将图集透传到子域
                Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/rank.atlas");

                let wx: any = Laya.Browser.window.wx;
                let openDataContext: any = wx.getOpenDataContext();
                openDataContext.postMessage({ action: 'init' });
            }));
        }
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
    /**得分*/
    addScores(number: number): void {
        this.scoreLabel.value = (Number(this.scoreLabel.value) + number).toString();
    }

    /**得分的动画*/

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
                this.createEnemy('left', this.role_01, 'fighting');
                this.createEnemy('left', this.role_01, 'range');
                this.enemyTagRole = null;
            }
        }
        // 右
        if (this.enemySwitch_02) {
            let nowTime = Date.now();
            if (nowTime - this.enemyTime_02 > this.enemyProperty.creatInterval) {
                this.enemyTime_02 = nowTime;
                this.enemyTagRole = this.role_02;
                this.createEnemy('right', this.role_02, 'fighting');
                this.createEnemy('right', this.role_02, 'range');
                this.enemyTagRole = null;
            }
        }
    }

    onDisable(): void {
    }
}