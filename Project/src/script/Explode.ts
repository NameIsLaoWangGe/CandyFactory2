import tools from "./Tool";
export default class Explode extends Laya.Script {
    /**自己*/
    private self: Laya.Sprite;
    /**时间线*/
    private timer: number;
    /**角度*/
    private initialAngle: number;
    /**加速度*/
    private accelerated: number;
    /**基础速度*/
    private randomSpeed: number;
    /**移动开关*/
    private moveSwitch: boolean;
    /**随机大小*/
    private scale: number;
    /**随机消失时间*/
    private vinshTime: number;
    /**随机起始透明度*/
    private startAlpha: number;
    /**随机旋转方向和值*/
    private rotationD: number;
    /**爆炸类型，是什么颜色、形态的糖果或者敌人或者是烟雾等*/
    private effectsType: string;
    /**子节点图片*/
    private img: Laya.Image;

    constructor() { super(); }

    onEnable(): void {
        this.timer = 0;
        this.accelerated = 0.1;
        this.self = this.owner as Laya.Sprite;
        this.img = this.self.getChildByName('img') as Laya.Image;
        this.self['Explode'] = this;
        this.self.pivotX = this.self.width / 2;
        this.self.pivotY = this.self.height / 2;
    }

    /**初始化参数*/
    initProperty(type): void {
        this.effectsType = type;
        switch (type) {
            case 'starShining':
                this.starShiningProperty();
                break;
            case 'disappear':
                this.disappearProperty();
                break;
            case 'appear':
                this.appearProperty();
                break;
            case 'fireworks':
                this.fireworksProperty();
                break;
            case 'smokeEffects':
                this.smokeProperty();
                break;
            case 'fighting':
                this.fightingProperty();
                break;
            case 'range':
                this.rangeProperty();
                break;
            case 'redCandy___':
                this.redCandyProperty();
                break;
            case 'greenCandy_':
                this.greenCandyProperty();
                break;
            case 'blueCandy__':
                this.blueCandyProperty();
                break;
            case 'yellowCandy':
                this.yellowCandyProperty();
                break;
            default:
                break;
        }
        this.img.pivotX = this.img.width / 2;
        this.img.pivotY = this.img.height / 2;
    }

    /**敌人和糖果通用*/
    commonEnmeyAndCandy(): void {
        this.moveSwitch = true;
        this.randomSpeed = Math.floor(Math.random() * 5) + 10;
        this.initialAngle = Math.floor(Math.random() * 360);
        this.scale = Math.floor(Math.random() * 4) + 6;
        this.self.scaleX = this.scale / 10;
        this.self.scaleY = this.scale / 10;
        this.vinshTime = Math.floor(Math.random() * 5) + 2;
        this.startAlpha = (Math.floor(Math.random() * 10) + 5) / 10;
        this.self.alpha = this.startAlpha;
        this.rotationD = Math.floor(Math.random() * 2) === 1 ? -20 : 20;
    }
    /**近战敌人爆炸属性*/
    fightingProperty(): void {
        this.commonEnmeyAndCandy();
        this.img.skin = 'candy/特效/白色单元.png';
    }

    /**远程敌人爆炸属性*/
    rangeProperty(): void {
        this.commonEnmeyAndCandy();
        this.img.skin = 'candy/特效/黑色单元.png';
    }
    /**红色糖果*/
    redCandyProperty(): void {
        this.commonEnmeyAndCandy();
        this.img.skin = 'candy/特效/红色单元.png';
    }
    /**黄色糖果*/
    yellowCandyProperty(): void {
        this.commonEnmeyAndCandy();
        this.img.skin = 'candy/特效/黄色单元.png';
    }
    /**蓝色糖果*/
    blueCandyProperty(): void {
        this.commonEnmeyAndCandy();
        this.img.skin = 'candy/特效/蓝色单元.png';
    }
    /**蓝色糖果*/
    greenCandyProperty(): void {
        this.commonEnmeyAndCandy();
        this.img.skin = 'candy/特效/绿色单元.png';
    }
    /**普通爆炸移动规则
    * 爆炸
    * 减速
    * 停留在地上
    * 消失
    * 爆炸都在这里，包括敌人和糖果
   */
    commonExplosion(): void {
        this.accelerated += 0.2;
        if (this.timer > 0 && this.timer <= 5) {
            this.commonSpeedXYByAngle(this.initialAngle, this.randomSpeed);
        } else if (this.timer > 5 && this.timer < 10) {
            this.self.alpha -= 0.02;
            this.commonSpeedXYByAngle(this.initialAngle, this.randomSpeed);
        } else if (this.timer >= 10) {
            this.vinshTime -= 0.1;
            if (this.vinshTime < 0) {
                this.self.removeSelf();
            }
        }
    }

    /**烟花爆炸属性*/
    fireworksProperty(): void {
        this.moveSwitch = true;
        this.randomSpeed = Math.floor(Math.random() * 15) + 2;
        this.initialAngle = Math.floor(Math.random() * 360);
        this.scale = Math.floor(Math.random() * 8) + 4;
        this.self.scaleX = this.scale / 10;
        this.self.scaleY = this.scale / 10;
        this.vinshTime = Math.floor(Math.random() * 5) + 2;
        this.startAlpha = 1;
        this.self.alpha = this.startAlpha;
        this.rotationD = Math.floor(Math.random() * 2) === 1 ? -10 : 10;
        // 图片
        let number = Math.floor(Math.random() * 7) + 1;
        switch (number) {
            case 1:
                this.img.skin = 'candy/特效/星星1.png';
                break;
            case 2:
                this.img.skin = 'candy/特效/星星2.png';
                break;
            case 3:
                this.img.skin = 'candy/特效/星星3.png';
                break;
            case 4:
                this.img.skin = 'candy/特效/星星4.png';
                break;
            case 5:
                this.img.skin = 'candy/特效/星星5.png';
                break;
            case 6:
                this.img.skin = 'candy/特效/星星6.png';
                break;
            case 7:
                this.img.skin = 'candy/特效/星星7.png';
                break;
            default:
                break;
        }
    }

    /**烟花爆炸移动
    * 爆炸
    * 减速
    * 消失
   */
    fireworksExplosion(): void {
        this.img.rotation += this.rotationD;
        this.accelerated += 0.1;
        if (this.timer > 0 && this.timer <= 15) {
            this.commonSpeedXYByAngle(this.initialAngle, this.randomSpeed + 5);
        } else if (this.timer > 15 && this.timer < 18) {
            this.commonSpeedXYByAngle(this.initialAngle, this.randomSpeed - 5);
        } else if (this.timer >= 18) {
            this.self.removeSelf();
        }
    }

    /**烟囱烟雾属性*/
    smokeProperty(): void {
        this.moveSwitch = true;
        this.randomSpeed = Math.floor(Math.random() * 10) + 5;
        this.initialAngle = 90;
        this.scale = Math.floor(Math.random() * 4) + 2;
        this.self.scale(this.scale / 10, this.scale / 10);
        this.vinshTime = Math.floor(Math.random() * 5) + 2;
        this.startAlpha = 1;
        this.self.alpha = this.startAlpha;
        this.img.skin = 'candy/特效/白色单元.png';
    }

    /**烟囱烟雾特效移动
    * 出现
    * 上移
    * 消失
   */
    smokeEffects(): void {
        if (this.timer > 0 && this.timer <= 10) {
            this.self.scaleX += 0.08;
            this.self.scaleY += 0.08;
            this.self.y -= 0.01;
        } else if (this.timer > 10 && this.timer < 40) {
            this.self.y -= 2;
        } else if (this.timer > 40) {
            this.self.y -= 2;
            this.startAlpha -= 0.025;
            if (this.startAlpha < 0) {
                this.self.removeSelf();
            }
        }
    }

    /**变身消失动画属性*/
    disappearProperty(): void {
        this.moveSwitch = true;
        this.randomSpeed = Math.random() * 2 + 2;
        this.initialAngle = Math.floor(Math.random() * 360);
        this.scale = 7;
        this.self.scale(this.scale / 10, this.scale / 10);
        this.vinshTime = Math.floor(Math.random() * 5) + 2;
        this.startAlpha = (Math.floor(Math.random() * 6) + 4) / 10;
        this.self.alpha = this.startAlpha;
        this.rotationD = Math.floor(Math.random() * 2) === 1 ? -5 : 5;
        // 图片
        this.img.skin = 'candy/特效/白色单元.png';
        this.img.rotation = this.initialAngle - 90;
        let number = Math.floor(Math.random() * 2);
        switch (number) {
            case 0:
                this.img.skin = 'candy/特效/白色单元.png';
                break;
            case 1:
                this.img.skin = 'candy/特效/白色单元_02.png';
                break;
            default:
                break;
        }
    }

    /**变身消失动画移动*/
    disappearEffects(): void {
        this.accelerated += 0.01;
        if (this.timer > 0 && this.timer <= 15) {
            this.commonSpeedXYByAngle(this.initialAngle, this.randomSpeed);
        } else if (this.timer > 15 && this.timer < 25) {
            this.commonSpeedXYByAngle(this.initialAngle, this.randomSpeed - 2);
        } else if (this.timer >= 25) {
            this.self.alpha -= 0.02;
            if (this.self.alpha <= 0) {
                this.self.removeSelf();
            }
        }
    }

    /**出现动画属性*/
    appearProperty(): void {
        this.moveSwitch = true;
        this.randomSpeed = Math.random() * 2 + 2;
        this.initialAngle = Math.floor(Math.random() * 360);
        this.scale = 7;
        this.self.scale(this.scale / 10, this.scale / 10);
        this.vinshTime = Math.floor(Math.random() * 5) + 2;
        this.startAlpha = (Math.floor(Math.random() * 6) + 4) / 10;
        this.self.alpha = this.startAlpha;
        this.rotationD = Math.floor(Math.random() * 2) === 1 ? -5 : 5;
        // 图片
        this.img.skin = 'candy/特效/白色单元.png';
        this.img.rotation = this.initialAngle - 90;
        let number = Math.floor(Math.random() * 2);
        switch (number) {
            case 0:
                this.img.skin = 'candy/特效/白色单元.png';
                break;
            case 1:
                this.img.skin = 'candy/特效/白色单元_02.png';
                break;
            default:
                break;
        }
    }

    /**出现动画移动*/
    appearEffects(): void {
        this.accelerated += 0.01;
        if (this.timer > 0 && this.timer <= 20) {
            this.commonSpeedXYByAngle(this.initialAngle, this.randomSpeed);
        } else if (this.timer > 20 && this.timer < 30) {
            this.commonSpeedXYByAngle(this.initialAngle, this.randomSpeed - 2);
        } else if (this.timer >= 30) {
            this.self.alpha -= 0.02;
            if (this.self.alpha <= 0) {
                this.self.removeSelf();
            }
        }
    }

    /**星星闪烁动画属性*/
    starShiningProperty(): void {
        this.moveSwitch = true;
        this.randomSpeed = Math.floor(Math.random() * 15) + 2;
        this.scale = Math.floor(Math.random() * 8) + 4;
        this.self.scale(this.scale / 10, this.scale / 10);
        this.startAlpha = 0;
        this.self.alpha = this.startAlpha;
        this.rotationD = Math.floor(Math.random() * 2) === 1 ? -5 : 5;
        // 图片
        let number = Math.floor(Math.random() * 7) + 1;
        switch (number) {
            case 1:
                this.img.skin = 'candy/特效/星星1.png';
                break;
            case 2:
                this.img.skin = 'candy/特效/星星2.png';
                break;
            case 3:
                this.img.skin = 'candy/特效/星星3.png';
                break;
            case 4:
                this.img.skin = 'candy/特效/星星4.png';
                break;
            case 5:
                this.img.skin = 'candy/特效/星星5.png';
                break;
            case 6:
                this.img.skin = 'candy/特效/星星6.png';
                break;
            case 7:
                this.img.skin = 'candy/特效/星星7.png';
                break;
            default:
                break;
        }
    }

    /**星星闪烁动画*/
    starShiningEffects(): void {
        if (this.timer > 0 && this.timer <= 15) {
            this.self.alpha += 0.1;
            this.self.rotation += this.rotationD;
            this.self.scaleX += 0.01;
            this.self.scaleY += 0.01;
        } else if (this.timer > 15 && this.timer < 25) {
            this.self.rotation += this.rotationD;
        } else if (this.timer >= 25) {
            this.self.rotation -= this.rotationD;
            this.self.alpha -= 0.015;
            this.self.scaleX -= 0.01;
            this.self.scaleY -= 0.01;
            if (this.self.alpha <= 0) {
                this.self.removeSelf();
            }
        }
    }

    /**移动规则*/
    move(): void {
        if (this.effectsType === 'fireworks') {
            this.fireworksExplosion();
        } else if (this.effectsType === 'smokeEffects') {
            this.smokeEffects();
        } else if (this.effectsType === 'disappear') {
            this.disappearEffects();
        } else if (this.effectsType === 'appear') {
            this.appearEffects();
        } else if (this.effectsType === 'starShining') {
            this.starShiningEffects();
        } else {

            this.commonExplosion();
        }
    }

    /**
   * 通用子弹移动，按单一角度移动
   * @param angle 角度
   *  @param basedSpeed 基础速度
   */
    commonSpeedXYByAngle(angle, speed) {
        this.self.x += tools.speedXYByAngle(angle, speed + this.accelerated).x;
        this.self.y += tools.speedXYByAngle(angle, speed + this.accelerated).y;
    }

    onUpdate(): void {
        if (this.moveSwitch) {
            this.timer += 1;
            this.move();
        }
    }

    onDisable(): void {
        Laya.Pool.recover('explode', this.self);
    }
}