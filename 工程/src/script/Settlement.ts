export default class Settlement extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Scene;
    /**黑色背景遮罩*/
    private background: Laya.Sprite;

    /**内容，除了背景图*/
    private content: Laya.Sprite;


    /**操作按钮父节点，主要方便动画制作*/
    private operation: Laya.Sprite;
    /**重来*/
    private again_But: Laya.Image;
    /**返回按钮*/
    private return_But: Laya.Image;
    /**游戏结束logo*/
    private GOLogo: Laya.Image;

    /**时间线*/
    private timeLine: number;

    /**分数节点*/
    private scoreLabel: Laya.FontClip;
    /**分数节点的父节点预制*/
    private score: Laya.Prefab;

    constructor() { super(); }

    onEnable(): void {
        this.init();
    }

    /**初始化*/
    init(): void {
        this.self = this.owner as Laya.Sprite;
        this.selfScene = this.self.scene as Laya.Scene;

        this.background = this.self.getChildByName('background') as Laya.Sprite;
        this.content = this.self.getChildByName('content') as Laya.Sprite;

        this.background.alpha = 0;
        this.operation = this.content.getChildByName('operation') as Laya.Sprite;
        this.operation.x = -1200;
        this.operation.alpha = 0;

        this.return_But = this.operation.getChildByName('return_But') as Laya.Image;
        this.again_But = this.operation.getChildByName('again_But') as Laya.Image;

        this.GOLogo = this.content.getChildByName('GOLogo') as Laya.Image;
        this.GOLogo.x = 1200;
        this.GOLogo.alpha = 0;

        this.scoreLabel = this.selfScene['MainSceneControl'].scoreLabel;
        this.score = this.selfScene['MainSceneControl'].score;
        this.timeLine = 0;

        this.adaptive();
        this.appearAni();
    }

    /**自适应*/
    adaptive(): void {
        this.background.width = Laya.stage.width;
        this.background.height = Laya.stage.height;
        this.content.x = Laya.stage.width / 2;
        this.content.y = Laya.stage.height / 2;
        this.self.width = Laya.stage.width;
        this.self.height = Laya.stage.height;
        this.self.x = 0;
        this.self.y = 0;
    }

    //*动画初始化*/ 
    appearAni(): void {
        // 操作按钮
        Laya.Tween.to(this.operation, { x: 375, rotation: 720, alpha: 1 }, 500, null, Laya.Handler.create(this, function () {
            this.operation.rotation = 0;

        }, []), 0);

        // 游戏结束logo
        Laya.Tween.to(this.GOLogo, { x: 375, rotation: 720, alpha: 1 }, 500, null, Laya.Handler.create(this, function () {
            this.GOLogo.rotation = 0;
        }, []), 0);

        // 背景
        Laya.Tween.to(this.background, { alpha: 0.8 }, 500, null, Laya.Handler.create(this, function () {
        }, []), 0);

        // 得分节点的动画
        this.scoreAni();
    }

    /**得分节点的动画*/
    scoreAni(): void {
        let score = Laya.Pool.getItemByCreateFun('score', this.score.create, this.score) as Laya.Sprite;

        // 复制分数
        let Label = score.getChildByName('scoreLabel') as Laya.FontClip;
        Label.value = this.scoreLabel.value;

        this.self.addChild(score);
        score.pos(Laya.stage.width / 2, 0);
        score.pivotX = score.width / 2;
        score.pivotY = score.height / 2;
        // 动画
        Laya.Tween.to(score, { x: 375, y: this.content.y - 200, rotation: 720 }, 500, null, Laya.Handler.create(this, function () {
            this.btnClink();
        }, []), 0);
    }

    /**点击重来按钮的消失动画*/
    vanishAni(): void {
        this.self.pivotX = Laya.stage.width / 2;
        this.self.pivotY = Laya.stage.height / 2;
        this.self.x = this.self.pivotX;
        this.self.y = this.self.pivotY;
        // 移动
        Laya.Tween.to(this.self, { x: 1500, rotation: 720, scaleX: 0, scaleY: 0, alpha: 0 }, 500, null, Laya.Handler.create(this, function () {
            this.self.removeSelf();
            this.selfScene['MainSceneControl'].restart();
        }, []), 0);
        // 移动
        Laya.Tween.to(this.background, { alpha: 0 }, 300, null, Laya.Handler.create(this, function () {
        }, []), 0);
    }

    /**按钮点击事件*/
    btnClink(): void {
        // 重来
        this.again_But.on(Laya.Event.MOUSE_DOWN, this, this.down);
        this.again_But.on(Laya.Event.MOUSE_MOVE, this, this.move);
        this.again_But.on(Laya.Event.MOUSE_UP, this, this.up);
        this.again_But.on(Laya.Event.MOUSE_OUT, this, this.out);
        // 返回
        this.return_But.on(Laya.Event.MOUSE_DOWN, this, this.down);
        this.return_But.on(Laya.Event.MOUSE_MOVE, this, this.move);
        this.return_But.on(Laya.Event.MOUSE_UP, this, this.up);
        this.return_But.on(Laya.Event.MOUSE_OUT, this, this.out);
    }
    down(event): void {
        event.currentTarget.scale(0.95, 0.95);
    }
    /**移动*/
    move(event): void {
        event.currentTarget.scale(1, 1);
    }
    /**抬起增加属性*/
    up(event): void {
        event.currentTarget.scale(1, 1);
        if (event.currentTarget.name === 'again_But') {
            this.vanishAni();
        }
    }
    /**出屏幕*/
    out(event): void {
        event.currentTarget.scale(1, 1);
    }

    onDisable(): void {
    }
}