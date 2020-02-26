import { ui } from "../ui/layaMaxUI"
export default class BigItem extends ui.test.BigItemUI {
    constructor() {
        super();
    }

    public set dataSource(value) {
        if (!value)
            return;

        // 名次
        this.rankNum = this.getChildByName('rankNum') as Laya.Sprite;
        let rankNum_Num = this.rankNum.getChildByName('rankNum_Num') as Laya.FontClip;
        let rankNum_pic = this.rankNum.getChildByName('rankNum_pic') as Laya.Image;
        switch (value.index) {
            case 1:
                rankNum_Num.value = ' ';
                rankNum_pic.skin = 'rank/NO1.png';
                break;
            case 2:
                rankNum_Num.value = ' ';
                rankNum_pic.skin = 'rank/NO2.png';
                break;
            case 3:
                rankNum_Num.value = ' ';
                rankNum_pic.skin = 'rank/NO3.png';
                break;
            default:
                rankNum_Num.value = value.index;
                rankNum_pic.visible = false;
                break;
        }
        // 头像
        this.img_head.skin = value.avatarIP;

        // 名字格式设置
        this.text_name.text = value.UserName;
        this.text_name.pivotX = this.text_name.width / 2;
        this.text_name.pivotY = this.text_name.height / 2;
        let len1 = value.UserName.length;
        switch (len1) {
            case 5:
                this.text_name.fontSize = 27;
                this.text_name.y = 53;
                break;
            case 6:
                this.text_name.fontSize = 25;
                this.text_name.y = 54;
                break;
            case 7:
                this.text_name.fontSize = 23;
                this.text_name.y = 55;
                break;
            case 8:
                this.text_name.fontSize = 21;
                this.text_name.y = 56;
                break;
            default:
                this.text_name.fontSize = 29;
                this.text_name.y = 51;
                break;
        }
        // 分数格式
        this.text_score = this.getChildByName('text_score') as Laya.FontClip;
        this.text_score.align = 'center';
        this.text_score.y = 57;
        this.text_score.value = value.RankValue;
        this.text_score.pivotX = this.text_score.width / 2;
        this.text_score.pivotY = this.text_score.height / 2;
        let len2 = this.text_score.value.length;
        switch (len1) {
            case 5:
                this.text_score.scale(0.93, 0.93);
                this.text_score.y = 59;
                break;
            case 6:
                this.text_score.scale(0.86, 0.86);
                this.text_score.y = 60;
                break;
            case 7:
                this.text_score.scale(0.79, 0.79);
                this.text_score.y = 61;
                this.text_score.x += 1
                break;
            case 8:
                this.text_score.scale(0.72, 0.72);
                this.text_score.y = 62;
                this.text_score.x += 2;
                break;
            default:
                this.text_score.y = 58;
                break;
        }

    }
}  
