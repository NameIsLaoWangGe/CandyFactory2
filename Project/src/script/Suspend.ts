export default class Suspend extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;
    /**场景脚本组件*/
    private mainSceneControl;
    /**主角父节点*/
    private roleParent: Laya.Sprite;
    /**敌人父节点*/
    private enemyParent: Laya.Sprite;

    constructor() { super(); }

    onEnable(): void {
        this.init();
        this.bucketClink();
    }

    /**初始化必要属性*/
    init(): void {
        this.self = this.owner as Laya.Sprite;
        this.selfScene = this.self.scene as Laya.Scene;
        this.roleParent = this.selfScene['MainSceneControl'].roleParent;
        this.enemyParent = this.selfScene['MainSceneControl'].enemyParent;
    }

    /**主角的点击事件
    * 和长按出现属性展示页面
    * 滑动可以拖动主角到规定的位置
   */
    bucketClink(): void {
        this.self.on(Laya.Event.MOUSE_DOWN, this, this.down);
        this.self.on(Laya.Event.MOUSE_MOVE, this, this.move);
        this.self.on(Laya.Event.MOUSE_UP, this, this.up);
        this.self.on(Laya.Event.MOUSE_OUT, this, this.out);
    }
    /**按下,给予目标位置，糖果走向目标位置;
     * 并且分数增加*/
    down(event): void {
        let suspend = this.selfScene['MainSceneControl'].suspend;
        if (!suspend) {
            this.selfScene['MainSceneControl'].suspend = true;
            // Laya.timer.pause();
        } else {
            this.selfScene['MainSceneControl'].suspend = false;
            // Laya.timer.resume();
        }
        // 打开和关闭敌人的属性
        for (let i = 0; i < this.enemyParent._children.length; i++) {
            let enemy = this.enemyParent._children[i] as Laya.Sprite;
            let propertyShow = enemy.getChildByName('propertyShow') as Laya.Sprite;
            if (!suspend) {
                propertyShow.alpha = 1;
            } else {
                propertyShow.alpha = 0;
            }
        }
        // 主角的属性
        for (let i = 0; i < this.roleParent._children.length; i++) {
            let role = this.roleParent._children[i] as Laya.Sprite;
            let propertyShow = role.getChildByName('propertyShow') as Laya.Sprite;
            if (!suspend) {
                this.selfScene['MainSceneControl'].suspend = true;
                propertyShow.alpha = 1;
            } else {
                this.selfScene['MainSceneControl'].suspend = false;
                propertyShow.alpha = 0;
            }
        }
    }
    /**移动*/
    move(event): void {
    }
    /**抬起*/
    up(): void {
        this.self.scale(1, 1);
    }
    /**出屏幕*/
    out(): void {
        this.self.scale(1, 1);
    }
    /**暂停状态显示所有属性框，非暂停状态不显示属性框*/
    suspendedState(): void {
    }
    onDisable(): void {
    }
}