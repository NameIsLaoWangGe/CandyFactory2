export default class Settlement extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;
    /**黑色背景遮罩*/
    private background: Laya.Sprite;
    /**重来按钮*/
    private continue_But: Laya.Image;
    /**返回按钮*/
    private return_But: Laya.Image;

    /**时间线*/
    private timeLine: number;

    constructor() { super(); }

    onEnable(): void {
        this.init();
    }

    /**初始化*/
    init(): void {
        this.self = this.owner as Laya.Sprite;
        this.selfScene = this.self.scene as Laya.Scene;
        this.background = this.self.getChildByName('background') as Laya.Sprite;
        this.background.alpha = 0;
        this.return_But = this.self.getChildByName('return_But') as Laya.Image;
        this.return_But.x = -1200;
        this.continue_But = this.self.getChildByName('continue_But') as Laya.Image;
        this.continue_But.x = 1200;
       
        this.timeLine = 0;
    }

    onDisable(): void {
    }
}