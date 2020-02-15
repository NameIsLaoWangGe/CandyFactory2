import MainSceneControl from "./MainSceneControl";

export default class EnemyBullet extends Laya.Script {
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
    /**攻击力*/
    private attackValue: number;
    /**目标，这个目标是最近的那个敌人*/
    private bulletTarget: Laya.Sprite;
    /**子弹速度*/
    private selfSpeed: number;
    /**这个子弹属于哪个主角发射的*/
    private belongEnemy: Laya.Sprite;
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
        this.selfSpeed = 15;
        this.attackValue = this.mainSceneControl.enemyProperty.attackValue;
        this.roleParent = this.selfScene['MainSceneControl'].roleParent;
        this.self['EnemyBullet'] = this;
    }

    /**始终攻击一个主角，如果这个主角死了，
     * 若果这个目标被移除了，那么发出去的子弹会沿着和怪物的方向继续移动到500
     * */
    bulletMove(): void {
        if (this.bulletTarget && this.bulletTarget.parent) {
            // x,y分别相减是两点连线向量
            let point = new Laya.Point(this.bulletTarget.x - this.self.x, this.bulletTarget.y - this.self.y);
            // 归一化，向量长度为1。
            point.normalize();
            //向量相加
            this.self.x += point.x * this.selfSpeed;
            this.self.y += point.y * this.selfSpeed;
        } else {
            // 沿着自己和发射自己的敌人方向移动
            let point = new Laya.Point(this.self.x - this.belongEnemy.x, this.self.y - this.belongEnemy.y);
            // 归一化，向量长度为1。
            point.normalize();
            //向量相加
            this.self.x += point.x * this.selfSpeed;
            this.self.y += point.y * this.selfSpeed;
        }
    }

    /**子弹对主角造成伤害的公式
       * 攻击力-主角防御如果大于零则造成伤害，否则不造成伤害
       * 并且有动画提示文字
      */
    bulletAttackRules(role): void {
        // 掉血显示值，伤害小于零则显示0
        let numberValue: number;
        // 伤害
        let damage = this.attackValue - role['Role'].role_property.defense;
        if (damage > 0) {
            role['Role'].role_property.blood -= damage;
            numberValue = damage;
        } else {
            numberValue = 0;
        }
    }

    onUpdate(): void {
        // 移动
        this.bulletMove();
        // 超出横向范围消失，一般不会触发
        if (this.self.x > 750 + this.self.width + 50 || this.self.x < -this.self.width) {
            this.self.removeSelf();
        }
        // 碰到任何一个主角，子弹消失怪物掉血
        for (let i = 0; i < this.roleParent._children.length; i++) {
            let role = this.roleParent._children[i] as Laya.Sprite;
            let differenceX = Math.abs(role.x - this.self.x);
            let differenceY = Math.abs(role.y - this.self.y);
            if (differenceX < 10 && differenceY < 10) {
                this.bulletAttackRules(role);
                this.self.removeSelf();
            }
        }

    }

    onDisable(): void {

    }
}