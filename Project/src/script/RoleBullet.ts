import MainSceneControl from "./MainSceneControl";
export default class Bullet extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;
    /**主角父节点*/
    private roleParent: Laya.Sprite;
    /**主角1*/
    private role_01: Laya.Sprite;
    /**主角2*/
    private role_02: Laya.Sprite;
    /**场景脚本*/
    private mainSceneControl;
    /**怪物父节点*/
    private enemyParent: Laya.Sprite;
    /**子弹速度*/
    private selfSpeed: number;
    /**这个子弹属于哪个主角发射的*/
    private belongRole: Laya.Sprite;
    /**攻击目标，这个目标是最近的那个敌人*/
    private bulletTarget: Laya.Sprite;
    /**攻击目标的名称,每次创建的名称是唯一的，如果不唯一，那么这个目标可能从对象池中反复被创建*/
    private bulletTargetName: string;
    /**攻击力*/
    private attackValue: number;

    /**属性飘字提示*/
    private hintWord: Laya.Prefab;


    constructor() { super(); }

    onEnable(): void {
        this.init();
    }

    /**初始化一些属性*/
    init() {
        this.self = this.owner as Laya.Sprite;
        this.selfScene = this.self.scene;
        this.mainSceneControl = this.selfScene.getComponent(MainSceneControl);
        this.enemyParent = this.mainSceneControl.enemyParent;
        this.hintWord = this.mainSceneControl.hintWord;
        this.selfSpeed = 15;
        // 属性赋值
        this.role_01 = this.selfScene['MainSceneControl'].role_01;
        this.attackValue = this.role_01['Role'].role_property.attackValue;
        this.self['Bullet'] = this;
    }

    /**子弹移动
     * 子弹只有当目标对象和目标对象在父节点内的时候才会移动
     * 目标对象永远存在，只不过他被移除了，所以bulletTarget永不为空，只能判断父节点是否存在
     * 因为下次这个被移除的敌人被重新创建的时候，名称都不一样，所以要判断名称
     * 若果这个目标被移除了，那么发出去的子弹会沿着和主角的方向继续移动到500；
    */
    bulletMove(): void {
        if (this.bulletTarget && this.bulletTarget.parent && this.bulletTargetName === this.bulletTarget.name) {
            // x,y分别相减是两点连线向量
            let point = new Laya.Point(this.bulletTarget.x - this.self.x, this.bulletTarget.y - this.self.y);
            // 归一化，向量长度为1。
            point.normalize();
            //向量相加
            this.self.x += point.x * this.selfSpeed;
            this.self.y += point.y * this.selfSpeed;
        } else {

            // 沿着自己当前和发射自己的主角方向移动
            let point = new Laya.Point(this.self.x - this.belongRole.x, this.self.y - this.belongRole.y);
            // 归一化，向量长度为1。
            point.normalize();
            // 如果静止不动则消失
            if (point.x === 0) {
                this.self.removeSelf();
            }
            //向量相加
            this.self.x += point.x * this.selfSpeed;
            this.self.y += point.y * this.selfSpeed;
        }
    }

    onUpdate(): void {
        // 移动
        this.bulletMove();
        // 超出横向范围消失，一般不会触发
        if (this.self.x > 750 + this.self.width + 50 || this.self.x < -this.self.width) {
            this.self.removeSelf();
        }
        // 射程为500，超过射程消失
        if (this.self.y <= Laya.stage.width * 1 / 3) {
            this.self.removeSelf();
            return;
        }
        // 碰到任何一个怪物，子弹消失怪物掉血
        // 子弹击中近战怪物怪物会后退
        for (let i = 0; i < this.enemyParent._children.length; i++) {
            let enemy = this.enemyParent._children[i] as Laya.Sprite;
            let differenceX = Math.abs(enemy.x - this.self.x);
            let differenceY = Math.abs(enemy.y - this.self.y);
            if (differenceX < 10 && differenceY < 10) {
                if (enemy.name.substring(0, 5) === 'enemy') {
                    this.attackEnemy(enemy);
                } else {
                    this.attackCandy_Explode(enemy);
                }
                this.self.removeSelf();
            }
        }
    }

    /**子弹对敌人造成伤害的公式
     * 子弹击中敌人，敌人会被击退
      * 攻击力-敌人防御如果大于零则造成伤害，否则不造成伤害
      * 掉血显示值，伤害小于零则显示0
      * 并且有动画提示文字
     */
    attackEnemy(enemy: Laya.Sprite): void {
        // 通过攻击力计算掉血状况
        let damage = this.attackValue - enemy['Enemy'].enemyProperty.defense;
        if (damage > 0) {
            enemy['Enemy'].enemyProperty.blood -= damage;
        } else {
            damage = 0;
        }
        // 飘字
        // this.hintWordMove(enemy, damage);
        // 触发击退
        enemy['Enemy'].repelTimer = 2;
    }

    /**子弹对爆炸糖果伤害公式
     * 爆炸糖果暂时没有防御力
     * 攻击数次就死亡
     * 没有提示飘字动画*/
    attackCandy_Explode(enemy: Laya.Sprite): void {
        let health = enemy.getChildByName('health') as Laya.ProgressBar;
        health.value -= 3.4;
    }

    /**提示文字*/
    hintWordMove(enemy: Laya.Sprite, damage: number): void {
        // 敌人被消灭了，则不执行这个
        if (enemy.parent === null) {
            return;
        }
        // 创建提示动画对象
        let hintWord = Laya.Pool.getItemByCreateFun('candy', this.hintWord.create, this.hintWord) as Laya.Sprite;
        hintWord.pos(100, -150);
        enemy.addChild(hintWord);
        let proPertyType: string = '主角掉血';
        let numberValue: number;
        hintWord['HintWord'].initProperty(proPertyType, damage);
    }

    onDisable(): void {
        Laya.Pool.recover('bullet', this.self);
    }
}