export default class Candy extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;
    /**自己的血量*/
    private selfHealth: Laya.ProgressBar;
    /**自己移动速度*/
    private selfSpeed: number;
    /**自己的图片*/
    private pic: Laya.Sprite;
    /**糖果移动对象*/
    private explodeTarget: Laya.Sprite;
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
    /**爆炸元素*/
    private explode: Laya.Prefab;

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
        this.pic = this.self.getChildByName('pic') as Laya.Sprite;
        this.selfScene = this.self.scene as Laya.Scene;
        this.explodeTarget = null;
        this.roleParent = this.selfScene['MainSceneControl'].roleParent;
        this.scoreLabel = this.selfScene['MainSceneControl'].scoreLabel;
        this.selfSpeed = 10;
        this.selfHealth = this.self.getChildByName('health') as Laya.ProgressBar;
        this.timerControl = 0;

        this.explode = this.selfScene['MainSceneControl'].explode;
        this.spaceY = 5;

        this.hintWord = this.selfScene['MainSceneControl'].hintWord;
        // 开启敌人预警
        this.selfScene['MainSceneControl'].role_01['Role'].role_Warning = true;
        this.selfScene['MainSceneControl'].role_02['Role'].role_Warning = true;
        this.self['Candy_Explode'] = this;

        this.skeleton = this.self.getChildByName('skeleton') as Laya.Skeleton;

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
        console.log('骨骼动画加载错误');
    }

    parseComplete(): void {
        // 播放敌人动画
        var skeleton: Laya.Skeleton;
        switch (this.self.name.substring(0, 11)) {
            case 'yellowCandy':
                this.skeleton.play('yellow_explode', true);
                break;
            case 'redCandy___':
                this.skeleton.play('red_explode', true);
                break;
            case 'blueCandy__':
                this.skeleton.play('blue_explode', true);
                break;
            case 'greenCandy_':
                this.skeleton.play('green_explode', true);
                break;
            default:
                break;
        }
        this.skeleton.playbackRate(1);
    }

    /**飞到主角身上并且爆炸
     * 被消灭后会原地爆炸，但是不对主角造成伤害
     * 爆炸后通过对应的糖果减少主角的属性
    */
    flyToRole(): void {
        // 如果是暂停或者是游戏结束,则不会移动
        if (this.selfScene['MainSceneControl'].gameOver) {
            return;
        }
        if (this.explodeTarget !== null) {
            // x,y分别相减是两点连线向量
            // 向量计算并且归一化，向量长度为1。
            let point = new Laya.Point(this.explodeTarget.x - this.self.x, this.explodeTarget.y - this.self.y);
            point.normalize();
            //向量相加移动
            this.self.x += point.x * this.selfSpeed;
            this.self.y += point.y * this.selfSpeed;
            // 到达对象位置后开启攻击开关进行攻击，攻击速度依照时间间隔而定
            // 此时移动速度为零
            let differenceX = Math.abs(this.self.x - this.explodeTarget.x);
            let differenceY = Math.abs(this.self.y - this.explodeTarget.y);
            if (differenceX < 50 && differenceY < 50) {
                this.self.removeSelf();
                this.selfScene['MainSceneControl'].explodeAni(this.selfScene, this.self.x, this.self.y, this.self.name.substring(0, 11), 15, 100);
                this.propertyHintWord();
                this.roleReduceProperty();
                // 关闭预警
                this.selfScene['MainSceneControl'].role_01['Role'].role_Warning = true;
                this.selfScene['MainSceneControl'].role_02['Role'].role_Warning = true;
                this.explodeTarget = null;
            }
        }
    }

    /**属性减少提示动画*/
    propertyHintWord(): void {
        let MainSceneControl = this.selfScene['MainSceneControl'];
        switch (this.self.name.substring(0, 11)) {
            case 'yellowCandy':
                MainSceneControl.createHintWord(this.explodeTarget, '减少攻击里', 10);
                break;
            case 'redCandy___':
                MainSceneControl.createHintWord(this.explodeTarget, '减少生命', 5);
                break;
            case 'blueCandy__':
                MainSceneControl.createHintWord(this.explodeTarget, '减少公鸡速度', 10);
                break;
            case 'greenCandy_':
                MainSceneControl.createHintWord(this.explodeTarget, '减少防御力', 5);
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
                if (this.explodeTarget === role_01) {
                    role_01['Role'].role_property.attackValue -= 10;
                } else {
                    role_02['Role'].role_property.attackValue -= 10;
                }
                break;
            case 'redCandy___':
                if (this.explodeTarget === role_01) {
                    role_01['Role'].role_property.blood -= 5;
                } else {
                    role_02['Role'].role_property.blood -= 5;
                }

                break;
            case 'blueCandy__':
                if (this.explodeTarget === role_01) {
                    role_01['Role'].role_property.attackSpeed -= 10;
                } else {
                    role_02['Role'].role_property.attackSpeed -= 10;
                }
                break;
            case 'greenCandy_':
                if (this.explodeTarget === role_01) {
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
        // 死亡
        if (this.selfHealth.value <= 0) {
            this.self.removeSelf();
            this.selfScene['MainSceneControl'].explodeAni(this.self.x, this.self.y, this.self.name.substring(0, 11));
        }
        // 飞到主角身上
        this.flyToRole();
    }

    onDisable(): void {
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