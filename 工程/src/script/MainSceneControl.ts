import Enemy from "./Enemy";
import Candy from "./Candy";
export default class MainSceneControl extends Laya.Script {
    /** @prop {name:candy, tips:"糖果", type:Prefab}*/
    public candy: Laya.Prefab;
    /** @prop {name:candyParent, tips:"糖果父节点", type:Node}*/
    public candyParent: Laya.Sprite;
    /** @prop {name:candy_Explode, tips:"糖果", type:Prefab}*/
    public candy_Explode: Laya.Prefab;
    /** @prop {name:candyParent_Move, tips:"克隆糖果用来移动的父节点", type:Node}*/
    public candy_ExplodeParent: Laya.Sprite;
    /** @prop {name:explode, tips:"制作爆炸动画的预制体", type:Prefab}*/
    public explode: Laya.Prefab;

    /** @prop {name:roleParent, tips:"角色父节点", type:Node}*/
    public roleParent: Laya.Sprite;

    /** @prop {name:enemy, tips:"敌人", type:Prefab}*/
    public enemy: Laya.Prefab;
    /** @prop {name:enemy_Infighting, tips:"近战敌人", type:Prefab}*/
    public enemy_Infighting: Laya.Prefab;
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


    constructor() { super(); }

    onEnable(): void {
        this.initSecne();
        this.roleSpeakBoxs();
        this.candyMoveToDisplay();
    }

    /**场景初始化*/
    initSecne(): void {
        this.enemyAppear = false;
        this.enemyTagRole = null;
        this.enemyCount = 0;

        // 初始化怪物属性，依次为血量，
        this.enemyProperty = {
            blood: 200,
            attackValue: 20,
            attackSpeed: 1000,//暂时最小时间间隔为100
            defense: 15,
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

        this.owner['MainSceneControl'] = this;//脚本赋值

        this.suspend = false;
        this.startRow = 4;

        this.createLaunchAni();
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
        let spacing = 2;
        let startX_02 = Laya.stage.width / 2 - 42;
        let startX_01 = Laya.stage.width / 2 + 58;
        //最远的那个位置
        let startY = this.displays.y + 4 * (candyHeiht + spacing) - 30;
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
                    this.replaceCandyMap(candy);
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

    /**替换不同糖果贴图*/
    replaceCandyMap(candy): void {
        let url_01 = 'candy/糖果/黄色糖果.png';
        let url_02 = 'candy/糖果/红色糖果.png';
        let url_03 = 'candy/糖果/蓝色糖果.png';
        let url_04 = 'candy/糖果/绿色糖果.png';
        let pic = (candy.getChildByName('pic') as Laya.Image);
        // 创建消失变换特效
        this.explodeAni(this.owner, candy.x, candy.y, 'disappear', 8, 1000);
        switch (candy.name.substring(0, 11)) {
            case 'yellowCandy':
                pic.skin = url_01;
                break;
            case 'redCandy___':
                pic.skin = url_02;
                break;
            case 'blueCandy__':
                pic.skin = url_03;
                break;
            case 'greenCandy_':
                pic.skin = url_04;
                break;
            default:
                break;
        }
    }

    /**产生糖果*/
    createCandy(): Laya.Sprite {
        // 通过对象池创建
        let candy = Laya.Pool.getItemByCreateFun('candy', this.candy.create, this.candy) as Laya.Sprite;
        // 随机创建一种颜色糖果
        // 糖果的名称结构是11位字符串加上索引值，方便查找，并且这样使他们的名称唯一
        let randomNum = Math.floor(Math.random() * 4);
        let url_01 = 'candy/糖果/黄色糖果球.png';
        let url_02 = 'candy/糖果/红色糖果球.png';
        let url_03 = 'candy/糖果/蓝色糖果球.png';
        let url_04 = 'candy/糖果/绿色糖果球.png';
        let pic = (candy.getChildByName('pic') as Laya.Image);
        switch (randomNum) {
            case 0:
                candy.name = 'yellowCandy' + this.candyCount;
                pic.skin = url_01;
                break;
            case 1:
                candy.name = 'redCandy___' + this.candyCount;
                pic.skin = url_02;
                break;
            case 2:
                candy.name = 'blueCandy__' + this.candyCount;
                pic.skin = url_03;
                break;
            case 3:
                candy.name = 'greenCandy_' + this.candyCount;
                pic.skin = url_04;
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
    createExplodeCandy(name: string): Laya.Sprite {
        // 通过对象池创建
        let explodeCandy = Laya.Pool.getItemByCreateFun('candy_Explode', this.candy_Explode.create, this.candy_Explode) as Laya.Sprite;
        // 随机创建一种颜色糖果
        // 糖果的名称结构是11位字符串加上索引值，方便查找，并且这样使他们的名称唯一
        let url_01 = 'candy/糖果/黄色糖果.png';
        let url_02 = 'candy/糖果/红色糖果.png';
        let url_03 = 'candy/糖果/蓝色糖果.png';
        let url_04 = 'candy/糖果/绿色糖果.png';
        let pic = (explodeCandy.getChildByName('pic') as Laya.Image);
        switch (name.substring(0, 11)) {
            case 'yellowCandy':
                pic.skin = url_01;
                break;
            case 'redCandy___':
                pic.skin = url_02;
                break;
            case 'blueCandy__':
                pic.skin = url_03;
            case 'greenCandy_':
                pic.skin = url_04;
                break;
            default:
                break;
        }
        explodeCandy.pos(Laya.stage.width / 2, -100);
        this.enemyParent.addChild(explodeCandy);
        explodeCandy.rotation = 0;
        this.candyCount++;
        explodeCandy.name = name.substring(0, 11);
        return explodeCandy;
    }

    /**主角初始化，成对出现在两个固定位置，每次初始化后的位置可能会调换*/
    roletInit(): void {
        this.role_01 = this.owner.scene.role_01;
        this.role_02 = this.owner.scene.role_02;
        let pic_01 = (this.role_01.getChildByName('pic') as Laya.Sprite);
        let pic_02 = (this.role_02.getChildByName('pic') as Laya.Sprite);

        // 随机更换皮肤
        let imageUrl_01: string = 'candy/主角/主角1背面.png';
        let imageUrl_02: string = 'candy/主角/主角2背面.png';
        let randomNum = Math.floor(Math.random() * 2);
        if (randomNum === 0) {
            pic_01.loadImage(imageUrl_01);
            pic_01.name = 'redRole';
            pic_02.loadImage(imageUrl_02);
            pic_02.name = 'yellowRole';

        } else {
            pic_02.loadImage(imageUrl_01);
            pic_02.name = 'redRole';
            pic_01.loadImage(imageUrl_02);
            pic_01.name = 'yellowRole';
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

    /**属性刷新显示规则*/
    onUpdate(): void {
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