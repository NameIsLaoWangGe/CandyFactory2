import MainSceneControl from "./MainSceneControl";
export default class Candy extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;
    /**场景脚本组件*/
    private mainSceneControl;
    /**糖果运行的速度*/
    private selfSpeed: number;
    /**糖果移动对象*/
    private candyTagRole: Laya.Sprite;
    /**主角的父节点*/
    private roleParent: Laya.Sprite;
    /**得分显示*/
    private scoreLabel: Laya.FontClip;
    /**时间线*/
    private timerControl: number;
    /**每个糖果之间的间距*/
    private spaceY: number;

    /**初始化的10个糖果的位置记录*/
    private posYArr: Array<number>;
    /**属性飘字提示*/
    private hintWord: Laya.Prefab;

    /**组数，他是属于哪一组的*/
    private group: number;
    /**是否已经被点击了*/
    private selected: boolean;

    /**骨骼动画模板*/
    private templet: Laya.Templet;
    /**骨骼动画*/
    private skeleton: Laya.Skeleton;

    constructor() { super(); }
    onEnable(): void {
        this.initProperty();
    }

    /**初始化*/
    initProperty(): void {
        this.self = this.owner as Laya.Sprite;
        this.selfScene = this.self.scene as Laya.Scene;
        this.candyTagRole = null;
        this.mainSceneControl = this.selfScene.getComponent(MainSceneControl);
        this.roleParent = this.mainSceneControl.roleParent;
        this.scoreLabel = this.mainSceneControl.scoreLabel;
        this.selfSpeed = 10;
        this.timerControl = 0;
        this.spaceY = 5;

        this.hintWord = this.mainSceneControl.hintWord;

        this.selected = false;
        this.group = null;

        this.self['Candy'] = this;
        this.createBoneAni();
    }

    /**创建骨骼动画皮肤*/
    createBoneAni(): void {
        //创建动画模板
        this.templet = new Laya.Templet();
        this.templet.on(Laya.Event.COMPLETE, this, this.parseComplete);
        this.templet.on(Laya.Event.ERROR, this, this.onError);
        this.templet.loadAni("candy/糖果/candyCompilations.sk");
        (this.self.getChildByName('pic') as Laya.Image).alpha = 0;
    }

    onError(): void {
        console.log('骨骼动画加载错误');
    }

    parseComplete(): void {
        // 播放敌人动画
        var skeleton: Laya.Skeleton;
        this.skeleton = this.templet.buildArmature(0);//模板0
        this.self.addChild(this.skeleton);
        switch (this.self.name.substring(0, 11)) {
            case 'yellowCandy':
                this.skeleton.play('yellow_static', true);
                break;
            case 'redCandy___':
                this.skeleton.play('red_static', true);
                break;
            case 'blueCandy__':
                this.skeleton.play('blue_static', true);
                break;
            case 'greenCandy_':
                this.skeleton.play('green_static', true);
                break;
            default:
                break;
        }
        this.skeleton.x = this.self.width / 2 + 3;
        this.skeleton.y = this.self.height / 2;
        this.skeleton.playbackRate(1);
    }

    /**当第一个糖果被吃掉后的移动函数
     * 移动速度要非常快
    */
    moveRules(): void {
        Laya.Tween.to(this.self, { y: this.self.y + this.self.height + this.spaceY }, 10, null, Laya.Handler.create(this, function () {
        }, []), 0);
    }

    /**飞到主角身上增加主角属性
    * 并且播放属性增加动画
   */
    candyFlyToRole(): void {
        if (this.candyTagRole === null) {
            return
        }
        // 播放上下翻转动画
        if (this.skeleton) {
            switch (this.self.name.substring(0, 11)) {
                case 'yellowCandy':
                    this.skeleton.play('yellow_turnDown', true);
                    break;
                case 'redCandy___':
                    this.skeleton.play('red_turnDown', true);
                    break;
                case 'blueCandy__':
                    this.skeleton.play('blue_turnDown', true);
                    break;
                case 'greenCandy_':
                    this.skeleton.play('green_turnDown', true);
                    break;
                default:
                    break;
            }
            this.skeleton.playbackRate(2);
        }

        // 基础时间参数，动画的时间会随着位置边近而缩小
        let timePar = 500 + this.group * 100;
        let targetX;
        let targetY = this.candyTagRole.y;
        // x轴的位置偏移
        targetX = this.candyTagRole.x - 50;

        let HalfX;
        let distancePer = 4;
        if (this.self.x > Laya.stage.width / 2) {
            HalfX = this.self.x + (this.candyTagRole.x - this.self.x) * 3 / 5;
        } else {
            HalfX = this.self.x - (this.self.x - this.candyTagRole.x) * 3 / 5;
        }
        let HalfY = this.self.y + (this.candyTagRole.y - this.self.y) / distancePer;
        // 糖果本身
        // 第一步放大
        Laya.Tween.to(this.self, { x: HalfX, y: HalfY, scaleX: 1.5, scaleY: 1.5 }, timePar * 3 / 4, null, Laya.Handler.create(this, function () {
            // 第二步降落
            Laya.Tween.to(this.self, { x: targetX, y: this.candyTagRole.y, scaleX: 0.6, scaleY: 0.6 }, timePar / 2, null, Laya.Handler.create(this, function () {
                this.self.removeSelf();
                this.hintWordMove();
                this.roleAddProperty();
                this.candyTagRole = null;
            }), 0);
        }), 0);

        // 糖果的影子处理
        let shadow = this.self.getChildByName('shadow') as Laya.Image;
        // 拉开距离并缩小
        Laya.Tween.to(shadow, { x: - 20, y: 100, scaleX: 0.8, scaleY: 0.8, }, timePar * 3 / 4, null, Laya.Handler.create(this, function () {
            // 第二部回归
            Laya.Tween.to(shadow, { x: -10, y: 60, scaleX: 0.7, scaleY: 0.7 }, timePar, null, Laya.Handler.create(this, function () {
            }), 0);
        }), 0);
    }

    /**属性增加提示动画*/
    hintWordMove(): void {
        let MainSceneControl = this.selfScene['MainSceneControl'];
        switch (this.self.name.substring(0, 11)) {
            case 'yellowCandy':
                MainSceneControl.createHintWord(this.candyTagRole, '攻击里', 10);
                break;
            case 'redCandy___':
                MainSceneControl.createHintWord(this.candyTagRole, '生命', 5);
                break;
            case 'blueCandy__':
                MainSceneControl.createHintWord(this.candyTagRole, '公鸡速度', 10);
                break;
            case 'greenCandy_':
                MainSceneControl.createHintWord(this.candyTagRole, '防御力', 5);
                break;
            default:
        }
    }

    /**根据糖果的种类增加主角属性规则
     * 并且播放增加属性文字提示动画
    */
    roleAddProperty(): void {
        this.self.name = this.self.name.substring(0, 11);
        switch (this.self.name) {
            case 'yellowCandy':
                this.candyTagRole['Role'].role_property.attackValue += 10;
                break;

            case 'redCandy___':
                this.candyTagRole['Role'].role_property.blood += 5;
                break;

            case 'blueCandy__':
                this.candyTagRole['Role'].role_property.attackSpeed += 10;
                break;

            case 'greenCandy_':
                this.candyTagRole['Role'].role_property.defense += 5;
                break;

            default:
                break;
        }
    }

    onUpdate(): void {
    }

    onDisable(): void {
        if (this.skeleton) {
            this.skeleton.removeSelf();
        }
        // 清理动画
        Laya.Tween.clearAll(this);
        if (this.self.name === 'yellowCandy') {
            Laya.Pool.recover('yellowCandy', this.self);
        } else if (this.self.name === 'redCandy___') {
            Laya.Pool.recover('redCandy___', this.self);
        } else if (this.self.name === 'blueCandy__') {
            Laya.Pool.recover('blueCandy__', this.self);
        } else if (this.self.name === 'greenCandy_') {
            Laya.Pool.recover('greenCandy_', this.self);
        }
    }
}