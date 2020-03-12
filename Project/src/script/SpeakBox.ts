export default class SpeakBox extends Laya.Script {
    /** @prop {name:speakContent, tips:"说话内容", type:Node, default:true}*/
    public speakContent: Laya.Label;
    /**节点本身*/
    private self;
    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.Sprite;
        this.self['SpeakBox'] = this;
    }
    /**说话，通过参数告诉主角该说什么话
     * @param who 谁说了这个话,主角1，主角2，或者敌人
     * @param describe 说了什么话
    */
    speakingRules(who: string, describe: string): void {
        let content = ' ';
        if (who === 'role_01') {
            switch (describe) {
                case 'firstClick':
                    content = '第一排糖果是小箭头显示的位置哦~！'
                    break;
                default:
                    break;
            }
        } else if (who === 'role_02') {
            switch (describe) {
                case 'firstClick':
                    content = '点击和第一排和糖果颜色的按钮！'
                    break;
                default:
                    break;
            }
        } else {
        }
        this.speakContent.text = content;
    }

    onDisable(): void {
    }
}