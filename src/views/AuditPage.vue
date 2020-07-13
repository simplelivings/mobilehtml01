<template>
    <div>
        <!--1        头部-->
        <div class="top">
            <P></P>
            <p>分层审核</p>
            <P></P>
            <P></P>
            <P></P>
            <P></P>
            <P></P>
            <P></P>
            <P></P>
            <P></P>
            <div>
                <van-button @click="clickReturn" size="small">首 页</van-button>
                <van-button @click="LastPageClick" :disabled="!lastShow" size="small">上一页</van-button>
                <van-button @click="NextPageClick" :disabled="!nextShow" size="small">下一页</van-button>
            </div>
        </div>

        <!--2  审核内容 -->
        <div class="divcontent" v-model="num">
            <span>{{num}}</span>
            <p>{{auditItem}}</p>
        </div>

        <!--        符合性判断-->
        <div class="divconform">
            <van-radio-group v-model="radio" direction="horizontal">
                <van-radio name="1" icon-size="4vw" checked-color="greenyellow" @click="conformClick">符合</van-radio>
                <van-radio name="2" icon-size="4vw" checked-color="greenyellow" @click="unconformClick">不符合</van-radio>
            </van-radio-group>
        </div>

        <!--        分隔条-->
        <div class="divdivender"></div>


        <!--3        图片证据，标题-->
        <p class="ptitle">图片证据</p>

        <!--        图片上传模块-->
        <div class="img">
            <van-uploader :after-read="afterRead" id="uploads" v-model="fileList" multiple :max-count="2"
                          @delete="onDelete"/>
        </div>

        <!--        分隔条-->
        <div class="divdivender"></div>

        <!-- 4       审核发现，标题-->
        <p class="ptitle">审核发现</p>

        <!--        审核发现，输入框-->
        <van-field class="field1"
                   v-model="message"
                   size="large"
                   rows="3"
                   autosize
                   label=""
                   label-width="0"
                   type="textarea"
                   maxlength="50"
                   border="false"
                   placeholder="请输入审核内容"/>

        <!--        分隔条-->
        <div class="divdivender"></div>

        <!--5 确认部分-->
        <div class="divfinal">
            <van-button square color="#36C364" type="primary" size="small" @click="clickQuit" :disabled="!quitShow">
                保存并提交
            </van-button>
            <!--            <p></p>-->
            <!--            <van-button plain icon="coupon" square color="#90EE90" type="primary" size="small">提交</van-button>-->
            <div style="width: 30vw"></div>
            <van-icon name="checked" size="6vw" color="#36C364"/>
            <!--符合项目数量，点击单选按钮时，数值更改；下一页时，由auditInfo回传-->
            <div style="width: 5vw">{{econformNum}}</div>
            <van-icon name="clear" size="6vw" color="#ff0000"/>
            <!--不符合项目数量，点击单选按钮时，数值更改；下一页时，由auditInfo回传-->
            <div style="width: 5vw">{{eunconformNum}}</div>
            <van-icon name="clock" size="6vw" color="#D3D3D3"/>
            <!--审核项目总数，created时，由auditItem回传-->
            <div style="width: 5vw">{{conformRadio.finishNum }}/{{totalNum}}</div>
        </div>
    </div>

</template>

<script charset="UTF-8">
    import axios from "axios";
    import Toast from "vant/lib/toast";

    export default {
        data() {
            return {
                imgURL: '',
                clickNum: '0',//判断是否点了上一页
                num: '1',//页码
                auditNum: '',//审核表编号
                userName: '',//用户名
                auditItem: '',//审核内容
                token:'',
                lastShow: true,
                nextShow: true,
                quitShow: false,
                totalNum: '',//审核项目总数
                econformNum: '',//符合项目总数
                eunconformNum: '',//不符合项目总数
                radio: '0',//符合性判断，vant的单选框返回值
                storage: '',//存储数据至localStorage
                message: '',//审核发现
                // file: '',//vant的uploader返回文件
                auditInfo: {//审核内容：回传至服务器的JSON对象，全部为审核内容
                    userName: '',
                    auditFind: '',
                    auditCon: '',
                    auditPage: '',
                    auditNum: ''
                },
                sendPic: {//审核图片：回传服务器的JOSN对象，经base64转码并去头部的。
                    auditPage: '',
                    userName: '',
                    auditNum:'',
                    auditPhotoList: [],
                },
                conformRadio: {
                    conformNum: '',
                    unconformNum: '',
                    finishNum: ''
                },
                fileList: [],
            };
        },
        created() {
            //判断浏览器，是否支持localstorage
            if (sessionStorage) {
                this.storage = sessionStorage;
            }
            this.lStorage = localStorage;

            // this.storage.clear();

            //从localStorage获取审核表编号和用户名
            this.userName = this.lStorage.getItem("userName");
            this.auditNum = this.lStorage.getItem("auditNum");
            this.token = this.lStorage.getItem("auditWay");
            //刷新后，仍保留当前页码
            if (this.storage.getItem('num') > 1) {
                this.num = this.storage.getItem('num');
                this.clickNum = this.storage.getItem('clickNum');
            } else {
                this.num = 1;
                this.clickNum = 0;
            }



            //保留this,也可以用箭头函数
            const _this = this;

            //AXIOS获取审核项目,共几处？
            this.$http.get('/audititem/showone', {
                params: {
                    page: this.num,
                    num: this.auditNum,
                    userName:this.userName,
                    auditWay:this.token
                }
            }).then(function (resp) {
                _this.auditItem = resp.data.auditItem;
                _this.totalNum = resp.data.totalNum;
            });

        }, mounted() {
            console.log("=======mounted======" + "mounted");
        },
        methods: {
            //点击下一页
            async NextPageClick() {

                const _this = this;
                this.lastShow = true;

                if (this.radio > 0) {//是否选择了符合性：符合-1，不符合-2，默认-0
                    this.auditInfo.auditPage = this.num;
                    this.auditInfo.auditCon = this.radio;
                    this.auditInfo.auditFind = this.message;
                    this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                    this.auditInfo.auditNum = this.auditNum;
                    console.log("-----by next---num--" + this.num);
                    //符合性判断与审核发现，存入localStorage
                    this.storage.setItem('auditCon' + this.num, this.radio);
                    this.storage.setItem('auditFind' + this.num, this.message);
                    console.log("-----by next---storage--" + this.num+"=="+this.storage.getItem('auditFind' + this.num));


                    // 获取localStorage中图片数据，并存入fileList中(点击上一页后，再点击下一页，如果未
                    // 重新选择图片时使用
                    if (this.fileList.length == 0) {
                        if (this.storage.getItem('pic' + this.num + 0) != null) {
                            var jsons = this.storage.getItem('pic' + this.num);
                            this.fileList = JSON.parse(jsons);
                        }
                    }

                    // 数据存入数据库
                    var res = await this.$http.post('/auditinfo/insert', this.auditInfo);
                    this.conformRadio.conformNum = res.data.conformNum;
                    this.conformRadio.unconformNum = res.data.unconformNum;
                    this.conformRadio.finishNum = res.data.finishNum;
                    this.econformNum = this.conformRadio.conformNum;
                    this.eunconformNum = this.conformRadio.unconformNum;

                    // 图片存入数据库
                    if (this.fileList.length >= 0) {
                        this.uploadPic();
                    }

                    if (this.num == this.totalNum - 1) {
                        this.quitShow = true;
                    }


                    // 下一页内容
                    // 数据库获得审核信息
                    if (this.num < this.totalNum) {
                        this.num++;//页码自增
                        this.storage.setItem('num', this.num);//页码存入storage
                        this.$http.get('/audititem/showone', {
                            params: {
                                page: this.num,
                                num: this.auditNum,
                                userName:this.userName,
                                auditWay:this.token
                            }
                        }).then(function (resp) {
                            _this.auditItem = resp.data.auditItem;
                        });
                    } else {
                        this.nextShow = false;
                        this.quitShow = true;
                        Toast.fail('已是最后一页')
                    }


                    //清空列表
                    this.fileList = [];
                    this.radio = '';
                    this.message = '';

                    //获取localStorage中图片数据，并存入fileList中
                    if (this.fileList.length == 0) {
                        if (this.storage.getItem('pic' + this.num) != null) {
                            var jsons = this.storage.getItem('pic' + this.num);
                            this.fileList = JSON.parse(jsons);
                        }
                    }

                    //获取localStorage中符合性判断，并重置radio值；
                    if (this.storage.getItem('auditCon' + this.num) > 0) {
                        this.radio = this.storage.getItem('auditCon' + this.num);
                    }



                    //获取localStorage中符合性判断，并重置message值；

                    if (this.storage.getItem('auditFind' + this.num) !=null) {
                        this.message = this.storage.getItem('auditFind' + this.num);
                    }

                } else {
                    Toast.fail('请判断符合性');
                }
            },

            //点击上一页
            async LastPageClick() {
                const _this = this;
                this.nextShow = true;

                if (this.radio > 0) {
                    //本页内容
                    this.auditInfo.auditPage = this.num;
                    this.auditInfo.auditCon = this.radio;
                    this.auditInfo.auditFind = this.message;
                    this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                    this.auditInfo.auditNum = this.auditNum;

                    console.log("-----by last---num--" + this.num);
                    //符合性判断与审核发现，存入localStorage
                    this.storage.setItem('auditCon' + this.num, this.radio);
                    this.storage.setItem('auditFind' + this.num, this.message);
                    console.log("-----by last---storage--" + this.num+"=="+this.storage.getItem('auditFind' + this.num));

                    // 获取localStorage中图片数据，并存入fileList中(点击上一页后，再点击下一页，如果未
                    // 重新选择图片时使用)
                    if (this.fileList.length == 0) {
                        if (this.storage.getItem('pic' + this.num + 0) != null) {
                            var jsons = this.storage.getItem('pic' + this.num);
                            this.fileList = JSON.parse(jsons);
                        }
                    }

                    // 数据存入数据库
                    var res = await this.$http.post('/auditinfo/insert', this.auditInfo);
                    this.conformRadio.conformNum = res.data.conformNum;
                    this.conformRadio.unconformNum = res.data.unconformNum;
                    this.conformRadio.finishNum = res.data.finishNum;
                    this.econformNum = this.conformRadio.conformNum;
                    this.eunconformNum = this.conformRadio.unconformNum;
                    console.log("----by last---conformNum-----" + this.conformRadio.conformNum);

                    // 图片存入数据库
                    if (this.fileList.length >= 0) {
                        this.uploadPic();
                    }


                    //上一页内容
                    if (this.num > 1) {
                        this.num--;
                        this.clickNum++;
                        this.storage.setItem('num', this.num);
                        this.storage.setItem('clickNum', this.clickNum);
                        this.$http.get('/audititem/showone', {
                            params: {
                                page: this.num,
                                num: this.auditNum,
                                userName:this.userName,
                                auditWay:this.token
                            }
                        }).then(function (resp) {
                            _this.auditItem = resp.data.auditItem;
                        });
                        console.log("--------By last--num-----" + this.num);
                    } else {
                        Toast.fail('已是第一页')
                        this.lastShow = false;
                    }
                    //清空列表
                    this.fileList = [];
                    this.radio = '';
                    this.message = '';

                    //获取localStorage中图片数据，并存入fileList中
                    if (this.storage.getItem('pic' + this.num) != null) {
                        console.log("--------By last 增加-------" + this.num);
                        var jsons = this.storage.getItem('pic' + this.num);
                        this.fileList = JSON.parse(jsons);
                    }

                    //获取localStorage中符合性判断，并重置radio值；
                    if (this.storage.getItem('auditCon' + this.num) > 0) {
                        this.radio = this.storage.getItem('auditCon' + this.num);
                    }

                    //获取localStorage中符合性判断，并重置message值；


                    if (this.storage.getItem('auditFind' + this.num) !=null) {
                        this.message = this.storage.getItem('auditFind' + this.num);
                    }
                } else {
                    Toast.fail('请判断符合性');
                }
            },
            clickReturn() {
                setTimeout(() => {
                    this.$router.push({
                        path: '/login'
                    });
                }, 1000);

            },
            afterRead(file) {

                //图片存入localStorage中，供返回页面时，调取；
                if (this.fileList.length > 0) {
                    // this.uploadPic();
                    var s = JSON.stringify(this.fileList);
                    this.storage.setItem('pic' + this.num, s);//图片存入localStorage中

                    var picSrc = [];//图片src存入数组中
                    for (var i = 0; i < this.fileList.length; i++) {
                        picSrc.push(URL.createObjectURL(this.fileList[i].file));
                    }
                    this.storage.setItem('picSrc' + this.num, JSON.stringify(picSrc));//src数组放入localStorage中
                }
            },

            //图片src存入localStorage中，供返回页面后，重新向服务器发送图片用
            onDelete(file) {
                if (this.fileList.length > 0) {
                    var s = JSON.stringify(this.fileList);
                    this.storage.setItem('pic' + this.num, s);//图片存入localStorage中
                } else {
                    this.storage.removeItem('pic' + this.num);//清除图片内容
                }
            },
            //图片转成base64，并发送至服务器。
            uploadPic() {

                //1 重置审核信息
                this.sendPic.auditPhotoList = [];//重置发送照片列表
                this.sendPic.auditPage = this.num;//设置发送页面编号
                this.sendPic.userName = this.userName;//设置发送页面用户名
                this.sendPic.auditNum = this.auditNum;
                let tempImgList = [];//临时生成img的数组，用于画布canvas使用；
                let promiseList = [];//promis数组，避免不同步；


                //2 判断file类型
                for (let i = 0; i < this.fileList.length; i++) {
                    var type = this.fileList[i].file.toString().search(/file/i);//判断file类型
                    if (type > 0) {//2.1 文件类型，直接处理
                        promiseList[i] = new Promise((resolve, reject) => {

                            tempImgList[i] = new Image();
                            tempImgList[i].src = URL.createObjectURL(this.fileList[i].file);//如果是文件类型，从fileList得到图片src

                            tempImgList[i].onload = () => {
                                let tConvas = document.createElement("canvas");//创建画布；
                                let ctx = tConvas.getContext("2d");//设置画布类型
                                tConvas.width = tempImgList[i].width;//设置画布宽度
                                tConvas.height = tempImgList[i].height;//设置画布高度

                                ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width, tempImgList[i].height);//将图片载入画布
                                let dataURL = tConvas.toDataURL();//得到画布的URL

                                let s;
                                s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部
                                this.sendPic.auditPhotoList.push(s);//将去头部base64图片，放入图片列表
                                resolve("ok");
                            };
                        });

                    } else {//2.2 object类型处理
                        if (this.storage.getItem('picSrc' + this.num) != null) {//如果是object类型，从localStorage中取值
                            let tempPicSrcList = [];//临时存放localStorage中的src的数组
                            let tempImgStorageList = [];

                            tempPicSrcList = JSON.parse(this.storage.getItem('picSrc' + this.num));
                            promiseList[i] = new Promise((resolve, reject) => {

                                tempImgStorageList[i] = new Image();
                                tempImgStorageList[i].src = tempPicSrcList[i];

                                tempImgStorageList[i].onload = () => {
                                    let tConvas = document.createElement("canvas");//创建画布；
                                    tConvas.width = tempImgStorageList[i].width;//设置画布宽度
                                    tConvas.height = tempImgStorageList[i].height;//设置画布高度

                                    let ctx = tConvas.getContext("2d");//设置画布类型
                                    ctx.drawImage(tempImgStorageList[i], 0, 0, tempImgStorageList[i].width, tempImgStorageList[i].height);//将图片载入画布
                                    let dataURL = tConvas.toDataURL();//得到画布的URL
                                    let s;
                                    s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部
                                    this.sendPic.auditPhotoList.push(s);//将去头部base64图片，放入图片列表
                                    resolve("ok");
                                };
                            });
                        }
                    }

                }
                Promise.all(promiseList).then(() => {
                    this.$http.post('/auditphoto/insert', this.sendPic).then(function (resp) {
                        console.log("-----图片存入数据库------" + resp.data);
                    });
                });
            },
            //图片转成base64，并发送至服务器。
            uploadPicAndExcel() {

                //1 重置审核信息
                this.sendPic.auditPhotoList = [];//重置发送照片列表
                this.sendPic.auditPage = this.num;//设置发送页面编号
                this.sendPic.userName = this.userName;//设置发送页面用户名
                this.sendPic.auditNum = this.auditNum;
                let tempImgList = [];//临时生成img的数组，用于画布canvas使用；
                let promiseList = [];//promis数组，避免不同步；


                //2 判断file类型
                for (let i = 0; i < this.fileList.length; i++) {
                    var type = this.fileList[i].file.toString().search(/file/i);//判断file类型
                    if (type > 0) {//2.1 文件类型，直接处理
                        promiseList[i] = new Promise((resolve, reject) => {

                            tempImgList[i] = new Image();
                            tempImgList[i].src = URL.createObjectURL(this.fileList[i].file);//如果是文件类型，从fileList得到图片src

                            tempImgList[i].onload = () => {
                                let tConvas = document.createElement("canvas");//创建画布；
                                let ctx = tConvas.getContext("2d");//设置画布类型
                                tConvas.width = tempImgList[i].width;//设置画布宽度
                                tConvas.height = tempImgList[i].height;//设置画布高度

                                ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width, tempImgList[i].height);//将图片载入画布
                                let dataURL = tConvas.toDataURL();//得到画布的URL

                                let s;
                                s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部
                                this.sendPic.auditPhotoList.push(s);//将去头部base64图片，放入图片列表
                                resolve("ok");
                            };
                        });

                    } else {//2.2 object类型处理
                        if (this.storage.getItem('picSrc' + this.num) != null) {//如果是object类型，从localStorage中取值
                            let tempPicSrcList = [];//临时存放localStorage中的src的数组
                            let tempImgStorageList = [];

                            tempPicSrcList = JSON.parse(this.storage.getItem('picSrc' + this.num));
                            promiseList[i] = new Promise((resolve, reject) => {

                                tempImgStorageList[i] = new Image();
                                tempImgStorageList[i].src = tempPicSrcList[i];

                                tempImgStorageList[i].onload = () => {
                                    let tConvas = document.createElement("canvas");//创建画布；
                                    tConvas.width = tempImgStorageList[i].width;//设置画布宽度
                                    tConvas.height = tempImgStorageList[i].height;//设置画布高度

                                    let ctx = tConvas.getContext("2d");//设置画布类型
                                    ctx.drawImage(tempImgStorageList[i], 0, 0, tempImgStorageList[i].width, tempImgStorageList[i].height);//将图片载入画布
                                    let dataURL = tConvas.toDataURL();//得到画布的URL
                                    let s;
                                    s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部
                                    this.sendPic.auditPhotoList.push(s);//将去头部base64图片，放入图片列表
                                    resolve("ok");
                                };
                            });
                        }
                    }

                }
                Promise.all(promiseList).then(() => {
                    this.$http.post('/auditphoto/insertandexcel', this.sendPic).then(function (resp) {
                        console.log("-----图片存入数据库------" + resp.data);
                    });
                });
            },
            conformClick() {//符合点击事件，控制底部计数变化
                this.econformNum = this.conformRadio.conformNum + 1;
                if (this.eunconformNum > 0) {
                    this.eunconformNum = this.conformRadio.unconformNum - 1;
                } else {
                    this.eunconformNum = 0;
                }

            },
            unconformClick() {//不符合点击事件，控制底部计数变化
                this.eunconformNum = this.conformRadio.unconformNum + 1;
                if (this.econformNum > 0) {
                    this.econformNum = this.conformRadio.conformNum - 1;
                } else {
                    this.econformNum = 0;
                }
            },
            async clickQuit() {
                if (this.radio > 0) {
                    this.quitShow =false;
                    Toast.success('审核完成\n可关闭');
                    this.auditInfo.auditPage = this.num;
                    this.auditInfo.auditCon = this.radio;
                    this.auditInfo.auditFind = this.message;
                    this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                    this.auditInfo.auditNum = this.auditNum;

                    // 数据存入数据库
                    var res = await this.$http.post('/auditinfo/insert', this.auditInfo);

                    // 图片存入数据库并转成excel
                    if (this.fileList.length >= 0) {
                        await this.uploadPicAndExcel();
                    }

                }

                console.log("=======this.conformRadio.finishNum===="+this.conformRadio.finishNum);
                console.log("=======this.totalNum===="+this.totalNum);
                console.log("=======this.Num===="+this.num);
                console.log("")
                if ((this.conformRadio.finishNum > 0 && ((this.conformRadio.finishNum) == this.totalNum)) || (this.num == this.totalNum)) {

                    //审核信息数据库与审核项目数据库大小一致，或最后一页，发送excel与发送请求，并退出网页
                    //通知服务器，把数据写入excel表中
                    // await this.$http.post('auditinfo/generate', this.auditInfo);

                    setTimeout(() => {
                        this.$router.push({
                            path: '/lastpage'
                        });
                    }, 2000);

                } else {
                    Toast.fail('请判断符合性');
                }
            }

        },
    }
</script>

<style lang="less">
    .divfinal {
        margin-left: 4vw;
        display: flex;
        justify-content: left;
        align-items: center;

        p {
            width: 1vw;
        }

        div {
            margin-left: 0.3vw;
            margin-right: 1vw;
            text-align: center;
            font-size: 3vw;
        }
    }

    .divconform {
        margin-left: 4vw;
        display: flex;
        justify-content: left;
    }

    .divcontent {
        height: 20vw;
        margin-left: 4vw;
        margin-top: 0vw;
        display: flex;
        flex-direction: column;
        justify-content: left;

        span {
            width: 6vw;
            height: 4vw;
            font-size: 3vw;
            text-align: center;
            border-radius: 1vw;
            color: black;
            background-color: #36C364;
        }

        p {
            margin-top: 0vw;
            margin-left: 2vw;
            text-align: left;
            font-size: 4vw;
            font-weight: normal;
            color: black;
        }
    }

    .top {
        background-color: #ffffff;
        height: 12.889vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 4vw;

        p {
            margin-left: 4vw;
            font-size: 4vw;
            font-weight: bold;
            color: chocolate;
        }

        button {
            background-color: #36C364;
            width: 25vw;
            height: 8vw;
            font-size: 3vw;
            font-weight: bold;
            color: chocolate;
            border-color: white;
            border-radius: 2vw;
            text-align: center;
        }
    }

    .ptitle {
        margin-left: 4vw;
        margin-top: 2vw;
        margin-bottom: 2vw;
        text-align: left;
        font-size: 4vw;
        font-weight: bold;
        color: chocolate;
    }

    .img {
        display: flex;
        margin-left: 3vw;
        margin-top: 0vw;
        justify-content: left;
    }

    .divdivender {
        background-color: rgba(188, 193, 213, 0.28);
        height: 1vw;
        margin-top: 1vw;
        margin-bottom: 1vw;
    }

</style>
