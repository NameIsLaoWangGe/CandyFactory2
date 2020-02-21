var __extends=this&&this.__extends||function(){var extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b}||function(d,b){for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p])};return function(d,b){function __(){this.constructor=d}extendStatics(d,b),d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)}}();!function(){return function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){return o(e[i][1][r]||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}}()({1:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var bigItem_1=require("./view/bigItem"),GameConfig=function(){function GameConfig(){}return GameConfig.init=function(){(0,Laya.ClassUtils.regClass)("view/bigItem.ts",bigItem_1.default)},GameConfig.width=640,GameConfig.height=1136,GameConfig.scaleMode="fixedwidth",GameConfig.screenMode="none",GameConfig.alignV="top",GameConfig.alignH="left",GameConfig.startScene="test/Big.scene",GameConfig.sceneRoot="",GameConfig.debug=!1,GameConfig.stat=!1,GameConfig.physicsDebug=!1,GameConfig.exportSceneToJson=!0,GameConfig}();exports.default=GameConfig,GameConfig.init()},{"./view/bigItem":5}],2:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var GameConfig_1=require("./GameConfig"),BigRank_1=require("./view/BigRank");new(function(){function Main(){Laya.isWXOpenDataContext=!0,Laya.isWXPosMsg=!0,Laya.init(GameConfig_1.default.width,GameConfig_1.default.height,!1),Laya.stage.scaleMode=GameConfig_1.default.scaleMode,Laya.stage.screenMode=GameConfig_1.default.screenMode,Laya.stage.alignV=GameConfig_1.default.alignV,Laya.stage.alignH=GameConfig_1.default.alignH,Laya.Browser.onMiniGame?wx.onMessage(function(data){console.log("子域收到消息： "+JSON.stringify(data)),"ranking"==data.action&&(null==BigRank_1.default.instance?Laya.loader.load("res/atlas/rank.atlas",Laya.Handler.create(this,this.onComplete)):(BigRank_1.default.instance.visible=!0,BigRank_1.default.instance.init())),"close"==data.action&&(BigRank_1.default.instance.visible=!1)}.bind(this)):Laya.loader.load("res/atlas/rank.atlas",Laya.Handler.create(this,this.onComplete))}return Main.prototype.onComplete=function(){(new BigRank_1.default).init()},Main}())},{"./GameConfig":1,"./view/BigRank":4}],3:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var REG=Laya.ClassUtils.regClass;!function(ui){!function(test){var BigUI=function(_super){function BigUI(){return _super.call(this)||this}return __extends(BigUI,_super),BigUI.prototype.createChildren=function(){_super.prototype.createChildren.call(this),this.createView(BigUI.uiView)},BigUI.uiView={type:"Scene",props:{x:0,width:600,height:802},compId:2,child:[{type:"List",props:{y:0,x:7,width:600,var:"_list",vScrollBarSkin:" ",spaceY:2,repeatX:1,height:649,elasticEnabled:!0},compId:3,child:[{type:"bigItem",props:{runtime:"view/bigItem.ts",renderType:"render"},compId:5}]}],loadList:[],loadList3D:[]},BigUI}(Laya.Scene);test.BigUI=BigUI,REG("ui.test.BigUI",BigUI);var BigItemUI=function(_super){function BigItemUI(){return _super.call(this)||this}return __extends(BigItemUI,_super),BigItemUI.prototype.createChildren=function(){_super.prototype.createChildren.call(this),this.createView(BigItemUI.uiView)},BigItemUI.uiView={type:"View",props:{width:593,height:122},compId:2,child:[{type:"Sprite",props:{y:0,x:0,width:593,texture:"rank/排行栏.png",height:122},compId:19},{type:"Sprite",props:{y:9.5,x:109.5,texture:"rank/头像框描边.png",name:"contour"},compId:27},{type:"Image",props:{y:19,x:117,width:80,var:"img_head",skin:"rank/头像.png",height:80},compId:3,child:[{type:"Sprite",props:{y:-4.5,x:-4.5,texture:"rank/头像框.png",renderType:"mask"},compId:26}]},{type:"Label",props:{y:66,x:284,width:131,var:"text_name",valign:"middle",text:"老王哥",strokeColor:"#3b5785",stroke:1,pivotY:19,pivotX:66,overflow:"visible",height:38,fontSize:29,font:"Microsoft YaHei",color:"#3b5785",align:"left"},compId:4},{type:"FontClip",props:{y:63,x:470,width:140,value:"10000",spaceX:-5,skin:"rank/分数字体.png",sheet:"0123456789",pivotY:19,pivotX:70,name:"text_score",height:37,align:"center"},compId:17},{type:"Sprite",props:{y:-2,x:0,name:"rankNum"},compId:30,child:[{type:"Image",props:{y:20,x:16,skin:"rank/NO1.png",name:"rankNum_pic"},compId:32},{type:"FontClip",props:{y:64,x:54,width:70,value:"99",spaceX:-9,skin:"rank/排行字体.png",sheet:"0123456789",pivotY:23,pivotX:35,name:"rankNum_Num",height:45,align:"center"},compId:31}]}],loadList:["rank/排行栏.png","rank/头像框描边.png","rank/头像.png","rank/头像框.png","rank/分数字体.png","rank/NO1.png","rank/排行字体.png"],loadList3D:[]},BigItemUI}(Laya.View);test.BigItemUI=BigItemUI,REG("ui.test.BigItemUI",BigItemUI)}(ui.test||(ui.test={}))}(exports.ui||(exports.ui={}))},{}],4:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var BigRank=function(_super){function BigRank(){var _this=_super.call(this)||this;return _this._key="test10086",_this.arr=[{index:1,avatarIP:"rank/头像.png",UserName:"哥",RankValue:10},{index:2,avatarIP:"rank/头像.png",UserName:"王哥",RankValue:100},{index:3,avatarIP:"rank/头像.png",UserName:"老王哥",RankValue:1e3},{index:4,avatarIP:"rank/头像.png",UserName:"狭路相逢",RankValue:1e4},{index:5,avatarIP:"rank/头像.png",UserName:"我们来做游戏",RankValue:1e5},{index:6,avatarIP:"rank/头像.png",UserName:"相逢何必曾相识",RankValue:1e6},{index:7,avatarIP:"rank/头像.png",UserName:"玩我游戏我很开心",RankValue:1e7}],BigRank.instance=_this,_this}return __extends(BigRank,_super),BigRank.prototype.appear=function(){console.log("出现动画开始播放！"),Laya.stage.addChild(this),this.alpha=0,Laya.Tween.to(this,{alpha:1},700,null,Laya.Handler.create(this,function(){},[]),500)},BigRank.prototype.init=function(){this.appear(),this.setlist(this.arr),Laya.Browser.onMiniGame&&(wx.onMessage(this.recevieData.bind(this)),this.getFriendData())},BigRank.prototype.getFriendData=function(){var _$this=this;wx.getFriendCloudStorage({keyList:[this._key],success:function(res){var listData,obj,kv,arr=[];if(console.log("-----------------getFriendCloudStorage------------"),res.data){for(var i=0;i<res.data.length;i++)(obj=res.data[i]).KVDataList.length&&(kv=obj.KVDataList[0]).key==_$this._key&&(kv=JSON.parse(kv.value),(listData={}).avatarIP=obj.avatarUrl,listData.UserName=obj.nickname,listData.openID=obj.openid,listData.RankValue=kv.wxgame.value1,listData.update_time=kv.wxgame.update_time,arr.push(listData));arr=arr.sort(function(a,b){return b.RankValue-a.RankValue});for(i=0;i<arr.length;i++)arr[i].index=i+1;_$this.setlist(arr)}},fail:function(data){console.log("------------------获取托管数据失败--------------------"),console.log(data)}})},BigRank.prototype.recevieData=function(message){switch(message.type){case"scores":this.setSelfData(message.data)}},BigRank.prototype.setSelfData=function(data){var kvDataList=[],obj={wxgame:{}};obj.wxgame.value1=data.scores,obj.wxgame.update_time=Laya.Browser.now(),kvDataList.push({key:this._key,value:JSON.stringify(obj)}),wx.getUserCloudStorage({keyList:[this._key],success:function(getres){var kv=getres.KVDataList[0],lastValue1=JSON.parse(kv.value).wxgame.value1;console.log("上次的得分是:"+lastValue1),console.log("这次的得分是:"+data.scores),Number(data.scores)<Number(lastValue1)?console.log("这次的得分小于上的得分所以不上传!"):wx.setUserCloudStorage({KVDataList:kvDataList,success:function(e){console.log("----新的得分大于以前的所以上传了:"+JSON.stringify(e))},fail:function(e){console.log("-----fail:"+JSON.stringify(e))},complete:function(e){console.log("-----complete:"+JSON.stringify(e))}})},fail:function(data){console.log("------------------获取托管数据失败--------------------"),console.log(data)}})},BigRank.prototype.sceorComparison=function(data){wx.getUserCloudStorage({keyList:[this._key],success:function(getres){var kv=getres.KVDataList[0],value1=JSON.parse(kv.value).wxgame.value1;console.log("上次的得分是:"+value1);data.scores},fail:function(data){console.log("------------------获取托管数据失败--------------------"),console.log(data)}})},BigRank.prototype.setlist=function(arr){this._list.array=arr,this._list.refresh()},BigRank.instance=null,BigRank}(require("../ui/layaMaxUI").ui.test.BigUI);exports.default=BigRank},{"../ui/layaMaxUI":3}],5:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var BigItem=function(_super){function BigItem(){return _super.call(this)||this}return __extends(BigItem,_super),Object.defineProperty(BigItem.prototype,"dataSource",{set:function(value){if(value){var rankNum=this.getChildByName("rankNum"),rankNum_Num=rankNum.getChildByName("rankNum_Num"),rankNum_pic=rankNum.getChildByName("rankNum_pic");switch(value.index){case 1:rankNum_Num.value="",rankNum_pic.skin="rank/NO1.png";break;case 2:rankNum_Num.value="",rankNum_pic.skin="rank/NO2.png";break;case 3:rankNum_Num.value="",rankNum_pic.skin="rank/NO3.png";break;default:rankNum_Num.value=value.index,rankNum_pic.visible=!1}this.img_head.skin=value.avatarIP,this.text_name.text=value.UserName,this.text_name.pivotX=this.text_name.width/2,this.text_name.pivotY=this.text_name.height/2;var len1=value.UserName.length;switch(len1){case 5:this.text_name.fontSize=27,this.text_name.y=53;break;case 6:this.text_name.fontSize=25,this.text_name.y=54;break;case 7:this.text_name.fontSize=23,this.text_name.y=55;break;case 8:this.text_name.fontSize=21,this.text_name.y=56;break;default:this.text_name.fontSize=29,this.text_name.y=51}var text_score=this.getChildByName("text_score");text_score.align="center",text_score.y=57,text_score.value=value.RankValue,text_score.pivotX=text_score.width/2,text_score.pivotY=text_score.height/2;text_score.value.length;switch(len1){case 5:text_score.scale(.93,.93),text_score.y=59;break;case 6:text_score.scale(.86,.86),text_score.y=60;break;case 7:text_score.scale(.79,.79),text_score.y=61,text_score.x+=1;break;case 8:text_score.scale(.72,.72),text_score.y=62,text_score.x+=2;break;default:text_score.y=58}}},enumerable:!0,configurable:!0}),BigItem}(require("../ui/layaMaxUI").ui.test.BigItemUI);exports.default=BigItem},{"../ui/layaMaxUI":3}]},{},[2]);