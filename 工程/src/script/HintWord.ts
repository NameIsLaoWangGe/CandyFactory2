export default class HintWord extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**所属场景*/
    private selfScene: Laya.Sprite;
    /**增加属性属性标签*/
    private propertyType: Laya.FontClip;
    /**增加属性值属性值*/
    private addNumber: Laya.FontClip;
    /**减少属性值属性值*/
    private subNumber: Laya.FontClip;
    /**分数增加*/
    private addScore: Laya.FontClip;
    /**分数节点*/
    private scoreLabel: Laya.FontClip;

    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.Sprite;
        this.self['HintWord'] = this;
        this.selfScene = this.self.scene;
        this.self.alpha = 0;//出现的时候隐身，方便做动画
        this.self.pivotX = this.self.width / 2;

        this.propertyType = this.self.getChildByName('propertyType') as Laya.FontClip;
        this.addNumber = this.self.getChildByName('addNumber') as Laya.FontClip;
        this.subNumber = this.self.getChildByName('subNumber') as Laya.FontClip;
        this.addScore = this.self.getChildByName('addScore') as Laya.FontClip;
        // 开始全是空
        this.propertyType.value = null;
        this.addNumber.value = null;
        this.subNumber.value = null;
        this.addScore.value = null;

        this.scoreLabel = this.selfScene['MainSceneControl'].scoreLabel;
    }

    /**通过传入的参数来，设置属性图片字的格式
     * @param propertyType 属性类型
     * @param numberValue 属性值
     * */
    initProperty(propertyType: string, numberValue: number): void {

        // 位置偏移，因为字符长度不一样
        switch (propertyType) {
            // 属性增加
            case '公鸡速度':
                this.propertyType.value = '公鸡速度';
                this.propertyType.x -= 40;
                this.addNumber.value = "+" + numberValue;
                this.propertyMove();
                break;
            case '攻击里':
                this.propertyType.value = '攻击里';
                this.propertyType.x -= 20;
                this.addNumber.x -= 20;
                this.addNumber.value = "+" + numberValue;
                this.propertyMove();
                break;
            case '生命':
                this.propertyType.value = '生命';
                this.addNumber.x -= 40;
                this.addNumber.value = "+" + numberValue;
                this.propertyMove();
                break;
            case '防御力':
                this.propertyType.value = '防御力';
                this.propertyType.x -= 20;
                this.addNumber.x -= 20;
                this.addNumber.value = "+" + numberValue;
                this.propertyMove();
                break;

            // 属性减少
            case '减少公鸡速度':
                this.propertyType.value = '公鸡速度';
                this.subNumber.x -= 40;
                this.subNumber.value = "-" + numberValue;
                this.propertyMove();
                break;
            case '减少攻击里':
                this.propertyType.value = '攻击里';
                this.propertyType.x -= 20;
                this.subNumber.x -= 20;
                this.subNumber.value = "-" + numberValue;
                this.propertyMove();
                break;
            case '减少生命':
                this.propertyType.value = '生命';
                this.subNumber.x -= 40;
                this.subNumber.value = "-" + numberValue;
                this.propertyMove();
                break;
            case '减少防御力':
                this.propertyType.value = '防御力';
                this.propertyType.x -= 20;
                this.subNumber.x -= 20;
                this.subNumber.value = "-" + numberValue;
                this.propertyMove();
                break;

            // 敌我减血
            case '主角掉血':
                this.subNumber.x -= 80;
                this.subNumber.value = "-" + numberValue;
                this.propertyMove();

                break;
            case '敌人掉血':
                this.subNumber.x -= 80;
                this.subNumber.value = "-" + numberValue;
                this.propertyMove();
                break;

            // 增加分数
            case '增加分数':
                this.addScore.value = "+" + numberValue;
                this.addScoreMove(numberValue);
                break;
            default:
                break;
        }
    }

    /**属性飘字动画时间线*/
    propertyMove(): void {
        let timeLine = new Laya.TimeLine;
        timeLine.addLabel('appear', 0).to(this.self, { y: this.self.y - 60, alpha: 1 }, 100, null, 0)
            .addLabel('pause', 0).to(this.self, { y: this.self.y - 120 }, 800, null, 0)
            .addLabel('vanish', 0).to(this.self, { y: this.self.y - 150, alpha: 0 }, 100, null, 0)
        timeLine.play('appear', false);
        timeLine.on(Laya.Event.COMPLETE, this, function () {
            this.self.removeSelf();
        });
    }

    /**增加分数时的动画*/
    addScoreMove(numberValue): void {
        // 把scoreLabel的坐标转换成全局坐标
        let scoreLabel_p = this.scoreLabel.parent as Laya.Sprite;
        let scoreLabel_p_p = scoreLabel_p.parent as Laya.Sprite;
        let stageX = this.scoreLabel.x + scoreLabel_p.x + scoreLabel_p_p.x;
        let stageY = this.scoreLabel.y + scoreLabel_p.y + scoreLabel_p_p.y;

        let timeLine = new Laya.TimeLine;
        timeLine.addLabel('appear', 0).to(this.self, { y: this.self.y - 60, alpha: 1 }, 100, null, 0)
            .addLabel('pause', 0).to(this.self, { y: this.self.y - 120 }, 600, null, 0)
            .addLabel('moveUp', 0).to(this.self, { y: this.self.y - 150, alpha: 1 }, 100, null, 0)
            .addLabel('moveTo', 0).to(this.self, { scaleX: 0.5, scaleY: 0.5, rotation: -360, x: stageX, y: stageY, alpha: 1 }, 600, Laya.Ease.cubicIn, 0)
            .addLabel('vanish', 0).to(this.self, { y: stageY - 100, alpha: 0 }, 100, Laya.Ease.cubicIn, 0)
        timeLine.play('appear', false);
        timeLine.on(Laya.Event.COMPLETE, this, function () {
            this.self.removeSelf();
            this.scoreLabel.value = (Number(this.scoreLabel.value) + numberValue).toString();
        });
    }

    onDisable(): void {
    }
}