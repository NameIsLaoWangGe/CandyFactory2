import { ui } from "../ui/layaMaxUI"

export default class BigRank extends ui.test.BigUI {
    public static instance: BigRank = null;

    constructor() {
        super();
        BigRank.instance = this;
    }

    /**获取好友排行榜时的key */
    //已经使用的_key有test10087，test10086
    public _key: String = 'test10088';
    /**list初始化使用的数据 */
    private arr: Array<any> = [
        { index: 1, avatarIP: 'rank/头像.png', UserName: "老王哥", RankValue: 0 },
        { index: 2, avatarIP: 'rank/头像.png', UserName: "王哥", RankValue: 100 },
        { index: 3, avatarIP: 'rank/头像.png', UserName: "老王哥", RankValue: 1000 },
        { index: 4, avatarIP: 'rank/头像.png', UserName: "狭路相逢", RankValue: 10000 },
        { index: 5, avatarIP: 'rank/头像.png', UserName: "我们来做游戏", RankValue: 100000 },
        { index: 6, avatarIP: 'rank/头像.png', UserName: "相逢何必曾相识", RankValue: 1000000 },
        { index: 7, avatarIP: 'rank/头像.png', UserName: "玩我游戏我很开心", RankValue: 10000000 },
        { index: 8, avatarIP: 'rank/头像.png', UserName: "玩我游戏我很开心", RankValue: 10000000 },
        { index: 9, avatarIP: 'rank/头像.png', UserName: "玩我游戏我很开心", RankValue: 10000000 }
    ]


    /**出场动画*/
    appear(): void {
        console.log('出现动画开始播放！')
        Laya.stage.addChild(this);
        this.alpha = 0;
        Laya.Tween.to(this, { alpha: 1 }, 700, null, Laya.Handler.create(this, function () {
        }, []), 500);
    }

    /**
     * 初始化
     */
    public init() {
        this.appear();
        //初始化list数据
        this.setlist(this.arr);
        if (Laya.Browser.onMiniGame) {
            //接受来自主域的信息
            wx.onMessage(this.recevieData.bind(this));
            // 直接展示数据
            this.getFriendData();
        }
    }

    /**
     * 获取好友排行
     */
    private getFriendData(): void {
        var _$this = this;
        wx.getFriendCloudStorage({
            keyList: [this._key],
            success: function (res): void {
                //关于拿到的数据详细情况可以产看微信文档
                //https://developers.weixin.qq.com/minigame/dev/api/UserGameData.html
                var listData;
                var obj;
                var kv;
                var arr = [];
                console.log('-----------------getFriendCloudStorage------------');
                if (res.data) {
                    for (var i = 0; i < res.data.length; i++) {
                        // res结构解析
                        /*
                        let res1: object = {
                            data: [
                                {
                                    obj1: {
                                        avatarIP: obj.avatarUrl,
                                        UserName: obj.nickname,
                                        openID: obj.openid,
                                        KVDataList: [
                                            {
                                                kvData: {
                                                    'key': this._key,
                                                    // data是我们上传的信息
                                                    'value': "'wxgame': {value1: 5000,update_time: Laya.Browser.now(),}}"
                                                }
                                            }
                                        ]
                                    }
                                },
                                { obj2: {} }, { obj3: {} }]
                        }
                        */

                        obj = res.data[i];
                        if (!(obj.KVDataList.length))
                            continue
                        //拉取数据是，使用了多少个key- KVDataList的数组就有多少
                        //更详细的KVData可以查看微信文档:https://developers.weixin.qq.com/minigame/dev/api/KVData.html

                        //kv ="'wxgame': {value1: 5000,update_time: Laya.Browser.now(),}}"
                        kv = obj.KVDataList[0];
                        if (kv.key != _$this._key)
                            continue
                        //kv.value ={'wxgame': {value1: 5000,update_time: Laya.Browser.now(),}}}
                        kv = JSON.parse(kv.value)
                        listData = {};
                        listData.avatarIP = obj.avatarUrl;
                        listData.UserName = obj.nickname;
                        listData.openID = obj.openid;
                        listData.RankValue = kv.wxgame.value1;//value1:5000
                        listData.update_time = kv.wxgame.update_time;
                        arr.push(listData);
                    }
                    //根据RankValue排序,字符串{value1: 5000}排序，省了一个步骤
                    arr = arr.sort(function (a, b) {
                        return b.RankValue - a.RankValue;
                    });
                    //增加一个用于查看的index排名
                    for (var i = 0; i < arr.length; i++) {
                        arr[i].index = i + 1;
                    }
                    //设置数组
                    _$this.setlist(arr);
                }
            }
            , fail: function (data): void {
                console.log('------------------获取托管数据失败--------------------');
                console.log(data);
            }
        });
    }

    /**
     * 接收信息
     * @param message 收到的主域传过来的信息
     */
    private recevieData(message): void {
        var _$this = this;
        var type: String = message.type;
        switch (type) {
            case 'scores':
                //对比并且上传
                this.correlationData(message.data);
                break;
            default:
                break;
        }
    }

    /**对比上次的数据上传数据*/
    correlationData(data): void {
        // 上传所需格式
        var kvDataList = [];
        var obj: any = {};
        obj.wxgame = {};
        obj.wxgame.value1 = data['scores'];
        obj.wxgame.update_time = Laya.Browser.now();
        kvDataList.push({ "key": this._key, "value": JSON.stringify(obj) });
        // 先获取上次的得分
        wx.getUserCloudStorage({
            keyList: [this._key],
            success: function (getres) {
                console.log(getres);
                if (getres.KVDataList.length === 0) {
                    console.log('第一次上传无法获取值直接上传');
                    // 上传
                    wx.setUserCloudStorage({
                        KVDataList: kvDataList,
                        success: function (e): void {
                            console.log('----第一次无论得了多少分都上传:' + JSON.stringify(e));
                        },
                        fail: function (e): void {
                            console.log('-----fail:' + JSON.stringify(e));
                        },
                        complete: function (e): void {
                            console.log('-----complete:' + JSON.stringify(e));
                        }
                    });
                } else {
                    console.log(getres);
                    console.log('不是第一次上传');
                    let kv = getres.KVDataList[0];
                    let kvData = JSON.parse(kv.value);
                    let lastValue1 = kvData.wxgame.value1;
                    console.log("上次的得分是:" + lastValue1);
                    console.log("这次的得分是:" + data['scores']);
                    if (Number(data['scores']) < Number(lastValue1)) {
                        console.log("这次的得分小于上的得分所以不上传!");
                        return;
                    }
                    // 上传
                    wx.setUserCloudStorage({
                        KVDataList: kvDataList,
                        success: function (e): void {
                            console.log('----新的得分大于以前的所以上传了:' + JSON.stringify(e));
                        },
                        fail: function (e): void {
                            console.log('-----fail:' + JSON.stringify(e));
                        },
                        complete: function (e): void {
                            console.log('-----complete:' + JSON.stringify(e));
                        }
                    });
                }
            }
            , fail: function (data): void {
                console.log('------------------获取托管数据失败--------------------');
                console.log(data);
            }
        });
    }

    /**
     * 上报自己的数据
     * @param data 上报数据
     */
    private setSelfData(data): void {
        // 上传所需格式
        var kvDataList = [];
        var obj: any = {};
        obj.wxgame = {};
        obj.wxgame.value1 = data['scores'];
        obj.wxgame.update_time = Laya.Browser.now();
        kvDataList.push({ "key": this._key, "value": JSON.stringify(obj) });
        // 上传
        wx.setUserCloudStorage({
            KVDataList: kvDataList,
            success: function (e): void {
                console.log('----新的得分大于以前的所以上传了:' + JSON.stringify(e));
            },
            fail: function (e): void {
                console.log('-----fail:' + JSON.stringify(e));
            },
            complete: function (e): void {
                console.log('-----complete:' + JSON.stringify(e));
            }
        });
        // 最终obj和kvDataList的关系
        // 最终obj的结构
        /*
        obj = {
            'wxgame': {
                value1: 5000,
                update_time: Laya.Browser.now(),
            }
        }
        kvDataList = [
            {
                kvData: {
                    "key": this._key,
                    "value": "'wxgame': {value1: {data: {score: 5000},update_time: Laya.Browser.now(),}}"
                }
            },
            {
                kvData: {
                    "key": this._key,
                    "value": "'wxgame': {value1: {data: {score: 5000},update_time: Laya.Browser.now(),}}"
                }
            }
        ]
        */
    }

    /**上传前对比一下当前传入的分数和上次传入的分数对比，如果小于就不上传*/
    sceorComparison(data): void {
        wx.getUserCloudStorage({
            keyList: [this._key],
            success: function (getres) {
                let kv = getres.KVDataList[0];
                let kvData = JSON.parse(kv.value);
                let value1 = kvData.wxgame.value1;
                console.log("上次的得分是:" + value1);
                let score = data['scores'];

            }
            , fail: function (data): void {
                console.log('------------------获取托管数据失败--------------------');
                console.log(data);
            }
        });
    }

    /**
     * 设置list arr
     * @param arr 赋值用的arr
     */
    private setlist(arr): void {
        this._list.array = arr;
        this._list.refresh();
    }
}
