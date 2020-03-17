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
    roleSpeakRules(who: string, describe: string): void {
        let content = ' ';
        if (who === 'role_01') {
            switch (describe) {
                case 'firstClick':
                    content = '点击和第一排和糖果颜色的按钮！'
                    break;
                case 'clickError':
                    content = '抱歉你点击错了！'
                    break;
                case 'clickRight':
                    content = '你真棒，点对了！'
                default:
                    break;
            }
        } else if (who === 'role_02') {
            switch (describe) {
                case 'firstClick':
                    content = '第一排糖果是小箭头显示的位置哦~！'
                    break;
                case 'clickError':
                    content = '请看准颜色！'
                    break;
                case 'clickRight':
                    content = '数字表示要点击几次！'
                    break;
                default:
                    break;
            }
        }
        this.speakContent.text = content;
    }

    /**每轮*/ 

    /**敌人说话*/
    enemySpeakRules(): void {
        let content = ' ';
        let talkObj = {
            talk1: '打败他们我们就可以吃到糖果了！',
            talk2: '各位，我帅不帅！',
            talk3: '身体好像被掏空！',
            talk4: '拆散他们。',
            talk5: '。。。',
            talk6: '美女们，看这里！',
            talk7: '我的颜值已经达到了巅峰',
            talk8: '这种感觉就像。。。',
            talk9: '飞翔在缘分天空！',
            talk10: '老铁，没毛病',
            talk11: '呱呱呱！',
            talk12: '我们会越来越强！',
            talk13: '干得漂亮，男孩们。',
        }
        let random = 1 + Math.floor(Math.random() * 13);
        switch (random) {
            case 1:
                content = talkObj.talk1;
                break;
            case 2:
                content = talkObj.talk2;
                break;
            case 3:
                content = talkObj.talk3;
                break;
            case 4:
                content = talkObj.talk4;
                break;
            case 5:
                content = talkObj.talk5;
                break;
            case 6:
                content = talkObj.talk6;
                break;
            case 7:
                content = talkObj.talk7;
                break;
            case 8:
                content = talkObj.talk8;
                break;
            case 9:
                content = talkObj.talk9;
                break;
            case 10:
                content = talkObj.talk10;
                break;
            case 11:
                content = talkObj.talk11;
                break;
            case 12:
                content = talkObj.talk12;
                break;
            case 12:
                content = talkObj.talk13;
                break;
            default:
                break;
        }
        this.speakContent.text = content;
    }

    onDisable(): void {
    }
}