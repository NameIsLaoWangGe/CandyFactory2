export default class RewardWords extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Sprite;
    /**Y轴的位置*/
    private locationY: number;
    /**分数*/
    private scoreLabel: Laya.FontClip;
    /**需要增加的分数*/
    private addScoreNumber: number;
    /**分数飘字的提示*/
    private hintWord: Laya.Prefab;
    /**类型*/
    private wordsType: string;

    constructor() { super(); }

    onEnable(): void {
        this.initProperty();
    }

    initProperty(): void {
        this.self = this.owner as Laya.Sprite;
        this.self['RewardWords'] = this;
        this.selfScene = this.self.scene;
        this.self.alpha = 0;//出现的时候隐身，方便做动画
        this.locationY = Laya.stage.height * 2 / 5;
        this.self.y = this.locationY;
        this.self.pivotX = this.self.width / 2;
        this.self.pivotY = this.self.height / 2;
        this.scoreLabel = this.selfScene['MainSceneControl'].scoreLabel;
        this.self.x = 1200;
        this.hintWord = this.selfScene['MainSceneControl'].hintWord;
    }

    /**通过传入的参数来，设置属性图片字的格式
     * @param word 具体字样
     * */
    createWordsAni(word: string): void {
        let url_01 = 'candy/提示文字/牛皮.png';
        let url_02 = 'candy/提示文字/太棒了.png';
        let url_03 = 'candy/提示文字/干得漂亮.png';
        // 避免从对象池拿出来后重复添加
        let sprite: Laya.Image;
        if (!this.self.getChildByName('word')) {
            sprite = new Laya.Image;
            this.self.addChild(sprite);
        } else {
            sprite = this.self.getChildByName('word') as Laya.Image;
        }

        sprite.name = 'word';
        sprite.anchorX = 0.5;
        sprite.anchorY = 0.5;
        switch (word) {
            case '牛皮':
                sprite.loadImage(url_01);
                sprite.pos(150, 20);
                this.addScoreNumber = 500;
                break;
            case '太棒了':
                sprite.loadImage(url_02);
                sprite.pos(105, 20);
                this.addScoreNumber = 1000;
                break;
            case '干得漂亮':
                sprite.loadImage(url_03);
                sprite.pos(55, 20);
                this.addScoreNumber = 2000;
                break;
            default:
                break;
        }
        this.wordsType = word;
        this.RewardWordsMove();

    };

    /**飘字动画时间线*/
    RewardWordsMove(): void {
        let standingTime;
        switch (this.wordsType) {
            case '牛皮':
                standingTime = 1600;
                break;
            case '太棒了':
                standingTime = 2000;
                break;
            case '干得漂亮':
                standingTime = 2400;
                break;
            default:
                standingTime = 1600;
                break
        }
        // 创建底板
        let baseboard = new Laya.Image;
        baseboard.skin = 'candy/ui/文字提示底.png';
        this.selfScene.addChild(baseboard);
        baseboard.pos(-800, this.locationY);
        baseboard.anchorX = 0.5;
        baseboard.anchorY = 0.5;
        baseboard.alpha = 0;
        baseboard.scale(0, 0);
        //注意层级
        baseboard.zOrder = 100;
        this.self.zOrder = 110;
        // 底板动画
        let timeLine_baseboard_01 = new Laya.TimeLine;
        timeLine_baseboard_01
            .addLabel('overturn_01', 0).to(baseboard, { scaleX: 1, scaleY: 1, x: Laya.stage.width / 2, rotation: 360, alpha: 1 }, 400, null, 0)
        timeLine_baseboard_01.play('overturn_01', false);
        timeLine_baseboard_01.on(Laya.Event.COMPLETE, this, function () {
            this.letOffFireworks();
            // 第二段
            let timeLine_baseboard_02 = new Laya.TimeLine;
            timeLine_baseboard_02
                .addLabel('pause', 0).to(baseboard, {}, standingTime, null, 0)
                .addLabel('vanish_01', 0).to(baseboard, { scaleX: 0.2, scaleY: 0.2, x: 800, rotation: -360, alpha: 0 }, 650, Laya.Ease.circInOut, 0)
            timeLine_baseboard_02.play('pause', false);
            timeLine_baseboard_02.on(Laya.Event.COMPLETE, this, function () {
                baseboard.removeSelf();
            });
        });

        // 增加分数延迟用于配合上面的动画
        Laya.timer.frameOnce(150, this, function () {
            this.addScoreAni();
        });

        // 字体动画
        let timeLine_self = new Laya.TimeLine;
        timeLine_self.addLabel('appear', -300).to(this.self, { rotation: 360, x: Laya.stage.width / 2, alpha: 1 }, 400, null, 0)
            .addLabel('pause', 0).to(this.self, { x: Laya.stage.width / 2 }, standingTime - 400, null, 0)
            .addLabel('vanish_02', 0).to(this.self, { rotation: -360, x: -1200 }, 650, Laya.Ease.circInOut, 0)
        timeLine_self.play('appear', false);
        timeLine_self.on(Laya.Event.COMPLETE, this, function () {
            this.self.removeSelf();
        });
    }

    /**烟花规则
     *得分越高爆炸越多
    */
    letOffFireworks(): void {
        let count;
        let delayed = 0;
        switch (this.wordsType) {
            case '牛皮':
                count = 5;
                break;
            case '太棒了':
                count = 7;
                break;
            case '干得漂亮':
                count = 10;
                break;
            default:
                count = 6;
                break;
        }
        for (let i = 0; i < count; i++) {
            Laya.timer.frameOnce(delayed, this, function () {
                let randomX = Math.floor(Math.random() * 100);
                let locationX_01;
                if (i % 2 !== 0) {
                    locationX_01 = Laya.stage.width / 2 + 50 + randomX;
                } else {
                    locationX_01 = Laya.stage.width / 2 - 50 - randomX;
                }
                this.selfScene['MainSceneControl'].explodeAni(this.selfScene, locationX_01, this.locationY, 'fireworks', 20, 105);
            })
            delayed += 15;
        }
    }

    /**分数增加动画*/
    addScoreAni(): void {
        let hintWord = Laya.Pool.getItemByCreateFun('candy', this.hintWord.create, this.hintWord) as Laya.Sprite;
        this.selfScene.addChild(hintWord);
        hintWord.zOrder = 110;
        hintWord.pos(Laya.stage.width / 2, this.locationY);
        let proPertyType: string = '增加分数';
        hintWord['HintWord'].initProperty(proPertyType, this.addScoreNumber);
    }

    onDisable(): void {
    }
}