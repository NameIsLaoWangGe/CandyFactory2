import MainSceneControl from "./MainSceneControl";
export default class Candy extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**糖果点击次数节点*/
    private clicksLabel: Laya.FontClip;
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
    /**属性飘字提示*/
    private hintWord: Laya.Prefab;
    /**组数，他是属于哪一组的,这个值可能会被标记成非number*/
    private group: any;
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
        this.selfSpeed = 10;
        this.spaceY = 5;

        // 随机点击次数
        let number = Math.floor(Math.random() * 5) + 1;
        this.clicksLabel = this.self.getChildByName('clicksLabel') as Laya.FontClip;
        this.clicksLabel.value = number.toString();
        this.clicksLabel.alpha = 0;

        this.hintWord = this.selfScene['MainSceneControl'].hintWord;
        this.scoreLabel = this.selfScene['MainSceneControl'].scoreLabel;

        this.group = null;

        this.skeleton = this.self.getChildByName('skeleton') as Laya.Skeleton;

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
    }

    onError(): void {
        console.log('骨骼动画加载错误！');
    }

    parseComplete(): void {
        this.playSkeletonAni(2, 'turnDown');
    }

    /**播放骨骼动画
     * @param speed 播放速度
     * @param type 播放动画类型
    */
    playSkeletonAni(speed: number, type: string): void {
        switch (this.self.name.substring(0, 11)) {
            case 'yellowCandy':
                this.skeleton.play('yellow_' + type, true);
                break;
            case 'redCandy___':
                this.skeleton.play('red_' + type, true);
                break;
            case 'blueCandy__':
                this.skeleton.play('blue_' + type, true);
                break;
            case 'greenCandy_':
                this.skeleton.play('green_' + type, true);
                break;
            default:
                break;
        }
        this.skeleton.x = this.self.width / 2 + 3;
        this.skeleton.y = this.self.height / 2;
        this.skeleton.playbackRate(speed);
    }

    /**飞到主角身上增加主角属性
    * 并且播放属性增加动画
    */
    candyFlyToRole(): void {
        if (this.self.x < Laya.stage.width / 2) {
            this.candyTagRole = this.selfScene['MainSceneControl'].role_01;
        } else {
            this.candyTagRole = this.selfScene['MainSceneControl'].role_02;
        }

        this.playSkeletonAni(2, 'turnDown');
        // 基础时间参数，动画的时间会随着位置边近而缩小
        let timePar = 300 + this.group * 100;
        // x轴的位置偏移
        let targetX = this.candyTagRole.x - 50;
        let targetY = this.candyTagRole.y;

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
                this.hintWordMove();
                this.roleAddProperty();
                this.self.removeSelf();
                this.selfScene['MainSceneControl'].addScores(100);
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
        if (this.self.x < Laya.stage.width / 2) {
            this.candyTagRole = MainSceneControl.role_01;
        } else {
            this.candyTagRole = MainSceneControl.role_02;
        }
        switch (this.self.name.substring(0, 11)) {
            case 'yellowCandy':
                MainSceneControl.createHintWord(this.candyTagRole, 100, -10, '攻击里', 10, 1);
                break;
            case 'redCandy___':
                MainSceneControl.createHintWord(this.candyTagRole, 100, -10, '生命', 5, 1);
                break;
            case 'blueCandy__':
                MainSceneControl.createHintWord(this.candyTagRole, 100, -10, '公鸡速度', 10, 1);
                break;
            case 'greenCandy_':
                MainSceneControl.createHintWord(this.candyTagRole, 100, -10, '防御力', 5, 1);
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

    /**飞到主角身上并且爆炸
    * 被消灭后会原地爆炸，但是不对主角造成伤害
    * 爆炸后通过对应的糖果减少主角的属性
   */
    asExplodeCandy(): void {
        if (this.self.x < Laya.stage.width / 2) {
            this.candyTagRole = this.selfScene['MainSceneControl'].role_01;
        } else {
            this.candyTagRole = this.selfScene['MainSceneControl'].role_02;
        }
        // 第二部回归
        Laya.Tween.to(this.self, { x: this.candyTagRole.x, y: this.candyTagRole.y }, 800, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
            this.selfScene['MainSceneControl'].explodeAni(this.selfScene, this.self.x, this.self.y, this.self.name.substring(0, 11), 15, 100);
            this.propertyHintWord();
            this.roleReduceProperty();
            this.self.removeSelf();
        }), 0);
    }

    /**属性减少提示动画*/
    propertyHintWord(): void {
        let MainSceneControl = this.selfScene['MainSceneControl'];
        switch (this.self.name.substring(0, 11)) {
            case 'yellowCandy':
                MainSceneControl.createHintWord(this.candyTagRole, 100, -10, '减少攻击里', 10, 1);
                break;
            case 'redCandy___':
                MainSceneControl.createHintWord(this.candyTagRole, 100, -10, '减少生命', 5, 1);
                break;
            case 'blueCandy__':
                MainSceneControl.createHintWord(this.candyTagRole, 100, -10, '减少公鸡速度', 10, 1);
                break;
            case 'greenCandy_':
                MainSceneControl.createHintWord(this.candyTagRole, 100, -10, '减少防御力', 5, 1);
                break;
            default:
        }
    }

    /**根据糖果的种类增加主角属性规则
     * 并且播放增加属性文字提示动画
    */
    roleReduceProperty(): void {
        this.self.name = this.self.name.substring(0, 11);
        let role_01 = this.selfScene['MainSceneControl'].role_01;
        let role_02 = this.selfScene['MainSceneControl'].role_02;
        switch (this.self.name) {
            case 'yellowCandy':
                if (this.candyTagRole === role_01) {
                    role_01['Role'].role_property.attackValue -= 10;
                } else {
                    role_02['Role'].role_property.attackValue -= 10;
                }
                break;
            case 'redCandy___':
                if (this.candyTagRole === role_01) {
                    role_01['Role'].role_property.blood -= 5;
                } else {
                    role_02['Role'].role_property.blood -= 5;
                }

                break;
            case 'blueCandy__':
                if (this.candyTagRole === role_01) {
                    role_01['Role'].role_property.attackSpeed -= 10;
                } else {
                    role_02['Role'].role_property.attackSpeed -= 10;
                }
                break;
            case 'greenCandy_':
                if (this.candyTagRole === role_01) {
                    role_01['Role'].role_property.defense -= 5;
                } else {
                    role_02['Role'].role_property.defense -= 5;
                }
                break;
            default:
                break;
        }
    }

    onUpdate(): void {
        // 如果目标主角存在且死亡，那么立即爆炸
        if (this.candyTagRole !== null && this.candyTagRole['Role'].roleDeath) {
            this.selfScene['MainSceneControl'].explodeAni(this.selfScene, this.self.x, this.self.y, this.self.name.substring(0, 11), 15, 100);
            this.self.removeSelf();
            this.candyFlyToRole = null;
        }
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