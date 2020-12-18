<template>
    <div>
        <!--1        头部-->
        <div class="top">
            <!--            <p>检查内容</p>-->
            <div class="divcontent">
                <span>第{{checkNum}}页</span>
            </div>
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


        <!--        分隔条-->
        <div class="divdivender"></div>

        <!--3       问题属性判读-->
        <p class="ptitle">问题性质（可不选）</p>
        <!--3       问题属性判读-->
        <div class="divconfirm">
            <van-radio-group v-model="radio" direction="horizontal">
                <van-radio class="vanradio" name="1" icon-size="4vw" checked-color="greenyellow">批评
                </van-radio>
                <!--        分隔条-->
                <div class="divdivender1"></div>
                <van-radio class="vanradio" name="2" icon-size="4vw" checked-color="greenyellow">表扬
                </van-radio>
                <!--        分隔条-->
                <div class="divdivender1"></div>
                <van-radio class="vanradio" name="3" icon-size="4vw" checked-color="greenyellow">展示
                </van-radio>
            </van-radio-group>
        </div>

        <!--        分隔条-->
        <div class="divdivender"></div>


        <!-- 2       审核发现，标题-->
        <p class="ptitle">检查发现</p>

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
                   placeholder="请输入发现内容"/>

        <!--        分隔条-->
        <div class="divdivender"></div>


        <!-- 2       审核发现，标题-->
        <p class="ptitle">责任单位</p>

        <!--        审核发现，输入框-->
        <van-field class="field1"
                   v-model="auditCharger"
                   size="large"
                   rows="1"
                   autosize
                   label=""
                   label-width="0"
                   type="textarea"
                   maxlength="50"
                   placeholder="请输入责任单位/也可不输"/>


        <!--        分隔条-->
        <div class="divdivender"></div>


        <!--4        图片证据，标题-->
        <p class="ptitle">图片证据</p>

        <!--        图片上传模块-->
        <div class="img">
            <van-uploader :before-read="beforeRead" :after-read="afterRead" id="uploads" v-model="fileList" multiple
                          :max-count="2"
                          @delete="onDelete"/>
        </div>

        <!--        分隔条-->
        <div class="divdivender"></div>


        <!--5 确认部分-->
        <div class="divfinal">
            <van-button square color="#36C364" type="primary" size="small" @click="clickQuit" :disabled="!quitShow">
                保存并提交
            </van-button>
        </div>

        <div class="tipWord" v-show="tipShow">
            <p>谨慎点击此按钮 点击后, 页面将退出</p>
        </div>

        <!--        <div style="height: 5vw" v-show="tipShow"></div>-->
        <img alt="Vue logo" v-show="tipShow" width="50vw" src="../assets/lastapplogo.png">


        <div class="tipWord2" v-show="tipShow">
            <p>如有问题，可联系客服:</p>
        </div>

        <div class="tipWord3" v-show="tipShow">
            <p>微信： naturalife001</p>
            <p>Q Q: 157652879</p>
            <p>Email: 157652879@qq.com</p>
        </div>

    </div>

</template>

<script charset="UTF-8">
    import axios from "axios";
    import Toast from "vant/lib/toast";
    import http from "../../http";

    export default {
        data() {
            return {
                imgURL: '',
                userName: '',//用户名
                token: '',//验证令牌，key为用户名
                lastShow: true,
                nextShow: true,
                quitShow: true,
                tipShow: false,
                radio: 0,
                storage: '',//存储数据至localStorage
                message: '',//审核发现
                auditCharger: '',
                checkNum: 1,//页码
                auditInfo: {//审核内容：回传至服务器的JSON对象，全部为审核内容
                    userName: '',
                    auditFind: '',
                    auditPage: '',
                    auditCon: '',
                    auditCharger: '',
                    auditPicStatue: '',
                },
                sendPic: {//审核图片：回传服务器的JOSN对象，经base64转码并去头部的。
                    auditPage: '',
                    userName: '',
                    loginNum: '',
                    auditPhotoList: [],
                },
                fileList: [],
                loginNum: '',//登陆页面编号，返回首页用
                indexedDB: '',
                inspectDB: '',
                tableName: 'inspectss',
                picValue: {
                    id: '',
                    picList: ''
                },
                quality: 0.8,
                version: 2,
                notSupportIndexed: true,
            };
        },
        async created() {
            //判断浏览器，是否支持localstorage
            if (sessionStorage) {
                this.storage = sessionStorage;
            }
            this.lStorage = localStorage;


            //从localStorage获取审核表编号和用户名
            this.userName = this.lStorage.getItem("userName");
            this.token = this.lStorage.getItem("auditWay");
            this.loginNum = this.lStorage.getItem("loginNum");
            this.sendPic.loginNum = this.loginNum;

            // if (this.lStorage.getItem("inspectVersion")!=null){
            //     this.version = this.lStorage.getItem("inspectVersion")+1;
            // }else {
            //     this.version = 10;
            // }

            console.log("version====" + (--this.version));

            //indexedDB初始化
            this.openDB();

            if (this.loginNum == 1) {
                this.tipShow = false;
            } else if (this.loginNum == 2) {
                this.tipShow = true;
            }

            //刷新后，仍保留当前页码
            if (this.storage.getItem('checkNum') > 1) {
                this.checkNum = this.storage.getItem('checkNum');
            } else {
                this.checkNum = 1;
            }

            if (this.storage.getItem('auditFind' + this.checkNum) != null) {
                this.message = this.storage.getItem('auditFind' + this.checkNum);
            }

            if (this.storage.getItem('auditCharger' + this.checkNum) != null) {
                this.auditCharger = this.storage.getItem('auditCharger' + this.checkNum);
            }

        }, mounted() {
        },
        methods: {

            //点击下一页
            async NextPageClick() {
                if (this.radio > 0 || this.auditCharger.length > 0 || this.message.length > 0) {
                    const _this = this;
                    this.lastShow = true;
                    this.quitShow = true;
                    this.tipShow = false;

                    this.auditInfo.auditCon = this.radio;
                    this.auditInfo.auditPage = this.checkNum;
                    this.auditInfo.auditFind = this.message;
                    this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                    this.auditInfo.auditCharger = this.auditCharger;
                    if (this.fileList.length > 0) {
                        this.auditInfo.auditPicStatue = 1;
                    }


                    //检查发现存入sessionStorage中
                    this.storage.setItem('checkFind' + this.checkNum, this.message);
                    this.storage.setItem('inspectCon' + this.checkNum, this.radio);

                    //责任人放入sessionStorage中
                    this.storage.setItem('checkCharger' + this.checkNum, this.auditCharger);
                    this.lStorage.setItem('checkCharger', this.auditCharger);


                    // 获取localStorage中图片数据，并存入fileList中(点击上一页后，再点击下一页，如果未
                    // 重新选择图片时使用
                    if (this.fileList.length == 0) {
                        // if (this.storage.getItem('checkPic' + this.checkNum) != null) {
                        //     var jsons = this.storage.getItem('checkPic' + this.checkNum);
                        //     //会变成JSON对象
                        //     this.fileList = JSON.parse(jsons);
                        // }
                        if (!this.notSupportIndexed) {
                            this.queryDB(this.checkNum);
                        }
                    }

                    // 数据存入数据库
                    var res = await this.$http.post('/inspectInfo/insert', this.auditInfo, {
                        headers: {
                            'token': this.token
                        }
                    });

                    // 图片存入数据库
                    if (this.fileList.length > 0) {
                        await this.uploadPic();
                    }

                    // 下一页内容

                    //页码最多为30页
                    if (this.checkNum < 30) {

                        //页面自增
                        this.checkNum++;
                        this.storage.setItem('checkNum', this.checkNum);//页码存入storage

                        //清空列表
                        this.fileList = [];
                        this.message = '';
                        this.radio = '';
                        this.auditCharger = '';

                        //获取localStorage中图片数据，并存入fileList中
                        // if (this.storage.getItem('checkPic' + this.checkNum) != null) {
                        //     var jsons = this.storage.getItem('checkPic' + this.checkNum);
                        //     this.fileList = JSON.parse(jsons);
                        // }
                        if (!this.notSupportIndexed) {
                            this.queryDB(this.checkNum);
                        }

                        //获取sessionStorage中问题点，并重置message值；
                        if (this.storage.getItem('checkFind' + this.checkNum) != null) {
                            this.message = this.storage.getItem('checkFind' + this.checkNum);
                        }
                        if (this.storage.getItem('inspectCon' + this.checkNum) != null) {
                            this.radio = this.storage.getItem('inspectCon' + this.checkNum);
                        }

                        //获取local或sessionStorage中的auditCharger值；
                        if (this.storage.getItem('checkCharger' + this.checkNum) != null) {
                            this.auditCharger = this.storage.getItem('checkCharger' + this.checkNum);
                        } else if (this.lStorage.getItem('checkCharger') != null) {
                            this.auditCharger = this.lStorage.getItem('checkCharger');
                        }

                    } else {
                        Toast.fail('已是最后一页');
                        this.nextShow = false;
                    }
                } else {
                    Toast.fail('请填写/选择一些信息！');
                }
            },

            //点击上一页
            async LastPageClick() {
                if (this.radio > 0 || this.auditCharger.length > 0 || this.message.length > 0) {
                    const _this = this;
                    this.nextShow = true;
                    this.quitShow = true;

                    //本页内容
                    this.auditInfo.auditCon = this.radio;
                    this.auditInfo.auditPage = this.checkNum;
                    this.auditInfo.auditFind = this.message;
                    this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                    this.auditInfo.auditCharger = this.auditCharger;
                    if (this.fileList.length > 0) {
                        this.auditInfo.auditPicStatue = 1;
                    }

                    //符合性判断与审核发现，存入sessionStorage
                    this.storage.setItem('checkFind' + this.checkNum, this.message);
                    this.storage.setItem('inspectCon' + this.checkNum, this.radio);
                    this.storage.setItem('checkCharger' + this.checkNum, this.auditCharger);
                    this.lStorage.setItem('checkCharger', this.auditCharger);

                    // 获取localStorage中图片数据，并存入fileList中(点击上一页后，再点击下一页，如果未
                    // 重新选择图片时使用)
                    if (this.fileList.length == 0) {
                        // if (this.storage.getItem('checkPic' + this.checkNum) != null) {
                        //     var jsons = this.storage.getItem('checkPic' + this.checkNum);
                        //     this.fileList = JSON.parse(jsons);
                        // }
                        // this.queryDB(this.checkNum);
                    }

                    // 数据存入数据库
                    var res = await this.$http.post('/inspectInfo/insert', this.auditInfo, {
                        headers: {
                            'token': this.token
                        }
                    });

                    // 图片存入数据库
                    if (this.fileList.length > 0) {
                        await this.uploadPic();
                    }

                    //上一页内容
                    //处理下一页内容
                    // 2.1 页码自减少
                    if (this.checkNum > 1) {
                        this.checkNum--;
                        this.storage.setItem('checkNum', this.checkNum);


                        //清空列表
                        this.fileList = [];
                        this.radio = '';
                        this.message = '';
                        this.auditCharger = '';

                        //获取localStorage中图片数据，并存入fileList中
                        // if (this.storage.getItem('checkPic' + this.checkNum) != null) {
                        //     var jsons = this.storage.getItem('checkPic' + this.checkNum);
                        //     this.fileList = JSON.parse(jsons);
                        // }
                        // this.queryDB(this.checkNum);

                        //获取localStorage中发现问题点，并重置message值；
                        if (this.storage.getItem('checkFind' + this.checkNum) != null) {
                            this.message = this.storage.getItem('checkFind' + this.checkNum);
                        }
                        if (this.storage.getItem('inspectCon' + this.checkNum) != null) {
                            this.radio = this.storage.getItem('inspectCon' + this.checkNum);
                        }

                        //获取local或sessionStorage中的auditCharger值；
                        if (this.storage.getItem('checkCharger' + this.checkNum) != null) {
                            this.auditCharger = this.storage.getItem('checkCharger' + this.checkNum);
                        } else if (this.lStorage.getItem('checkCharger') != null) {
                            this.auditCharger = this.lStorage.getItem('checkCharger');
                        }


                    } else {
                        Toast.fail('已是第一页')
                        this.lastShow = false;
                    }
                } else {
                    Toast.fail('请填写/选择一些信息！');
                }

            },
            async clickQuit() {

                if (this.fileList.length > 0) {
                    this.auditInfo.auditPicStatue = 1;
                    if (this.radio > 0 || this.auditCharger.length > 0 || this.message.length > 0) {
                        this.quitShow = false;
                        Toast.success('审核完成\n可关闭');
                        this.auditInfo.auditCon = this.radio;
                        this.auditInfo.auditPage = this.checkNum;
                        this.auditInfo.auditFind = this.message;
                        this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                        this.auditInfo.auditCharger = this.auditCharger;//用户名传入对象中，有点重复

                        // 数据存入数据库
                        var res = await this.$http.post('/inspectInfo/insert', this.auditInfo, {
                            headers: {
                                'token': this.token
                            }
                        });

                        // 图片存入数据库
                        if (this.fileList.length > 0) {
                            console.log("=====发送图片====")
                            this.uploadPicAndExcel();
                        } else {
                            this.sendPic.auditPhotoList = [];//重置发送照片列表
                            this.sendPic.auditPage = this.checkNum;//设置发送页面编号
                            this.sendPic.userName = this.userName;//设置发送页面用户名
                            // 生成excel
                            var resP = await this.$http.post('/inspectPhoto/inspectExcel', this.sendPic, {
                                headers: {
                                    'token': this.token
                                }
                            });
                        }

                        //清除sessionStorage中的内容
                        this.storage.clear();

                        this.$indexOpr.shutdownDB(this.indexedDB, this.inspectDB, this.tableName);


                        setTimeout(() => {
                            this.$router.push({
                                path: '/lastpage'
                            });
                        }, 2000);
                    } else {
                        Toast.fail('请填写/选择一些信息！');
                    }
                } else {
                    this.quitShow = false;
                    Toast.success('审核完成\n可关闭');
                    this.auditInfo.auditCon = this.radio;
                    this.auditInfo.auditPage = this.checkNum;
                    this.auditInfo.auditFind = this.message;
                    this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                    this.auditInfo.auditCharger = this.auditCharger;//用户名传入对象中，有点重复

                    // 数据存入数据库
                    var res = await this.$http.post('/inspectInfo/insert', this.auditInfo, {
                        headers: {
                            'token': this.token
                        }
                    });


                    this.sendPic.auditPhotoList = [];//重置发送照片列表
                    this.sendPic.auditPage = this.checkNum;//设置发送页面编号
                    this.sendPic.userName = this.userName;//设置发送页面用户名
                    // 生成excel
                    var resP = await this.$http.post('/inspectPhoto/inspectExcel', this.sendPic, {
                        headers: {
                            'token': this.token
                        }
                    });

                    //清除sessionStorage中的内容
                    this.storage.clear();

                    this.$indexOpr.shutdownDB(this.indexedDB, this.inspectDB, this.tableName);


                    setTimeout(() => {
                        this.$router.push({
                            path: '/lastpage'
                        });
                    }, 2000);

                }

            },
            clickReturn() {
                this.$http.get('basicinfo/clearData', {params: {userName: this.userName}});

                //清除sessionStorage中的内容
                this.storage.clear();

                this.$indexOpr.shutdownDB(this.indexedDB, this.inspectDB, this.tableName);


                if (this.loginNum == 1) {
                    setTimeout(() => {
                        this.$router.push({
                            path: '/jxLogin'
                        });
                    }, 1000);
                } else if (this.loginNum == 2) {
                    setTimeout(() => {
                        this.$router.push({
                            path: '/login'
                        });
                    }, 1000);
                }

            },

            beforeRead(file) {
                this.quitShow = false;
                console.log("beforeRead----");

                return true;

            },
            //图片存入localStorage中，供返回页面时，调取；

            afterRead(file) {
                // this.uploadPic();
                console.log("afterRead----" + this.fileList);
                var s = JSON.stringify(this.fileList);

                if (this.fileList.length > 0) {
                    // this.storage.setItem('checkPic' + this.checkNum,s);//图片存入localStorage中

                    //fileList放入indexedDB中
                    this.picValue.id = this.checkNum;
                    this.picValue.picList = this.fileList;
                    this.$indexOpr.insertDB(this.inspectDB, this.tableName, this.picValue);
                    // var picSrc = [];//图片src存入数组中
                    // for (var i = 0; i < this.fileList.length; i++) {
                    //     picSrc.push(URL.createObjectURL(this.fileList[i].file));
                    // }
                    // this.storage.setItem('checkPicSrc' + this.checkNum, JSON.stringify(picSrc));//src数组放入localStorage中
                }
                this.quitShow = true;
            },

            //图片src存入localStorage中，供返回页面后，重新向服务器发送图片用
            onDelete(file) {
                var s = JSON.stringify(this.fileList);
                if (this.fileList.length > 0) {
                    // console.log("s=delete=="+s);
                    this.picValue.id = this.checkNum;
                    this.picValue.picList = this.fileList;
                    this.$indexOpr.insertDB(this.inspectDB, this.tableName, this.picValue);
                    // this.storage.setItem('checkPic' + this.checkNum, s);//图片存入localStorage中
                }
                // else {
                //     this.storage.removeItem('checkPic' + this.checkNum);//清除图片内容
                // }
            },

            //图片转成base64，并发送至服务器。
            uploadPic() {

                //1 重置审核信息
                this.sendPic.auditPhotoList = [];//重置发送照片列表
                this.sendPic.auditPage = this.checkNum;//设置发送页面编号
                this.sendPic.userName = this.userName;//设置发送页面用户名
                let tempImgList = [];//临时生成img的数组，用于画布canvas使用；
                let promiseList = [];//promise数组，避免不同步；
                let comQuality = 2;
                let srcc;
                let dataURL;
                //2 判断file类型
                for (let i = 0; i < this.fileList.length; i++) {
                    var type = this.fileList[i].file.toString().search(/file/i);//判断file类型
                    if (type > 0) {//2.1 文件类型，直接处理
                        if (this.fileList[i].file.size / 1024 > 500) {
                            promiseList[i] = new Promise((resolve, reject) => {

                                tempImgList[i] = new Image();
                                tempImgList[i].src = URL.createObjectURL(this.fileList[i].file);//如果是文件类型，从fileList得到图片src

                                tempImgList[i].onload = () => {
                                    let tConvas = document.createElement("canvas");//创建画布；
                                    let ctx = tConvas.getContext("2d");//设置画布类型
                                    tConvas.width = tempImgList[i].width / comQuality;//设置画布宽度
                                    tConvas.height = tempImgList[i].height / comQuality;//设置画布高度

                                    ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width / comQuality, tempImgList[i].height / comQuality);//将图片载入画布
                                    dataURL = tConvas.toDataURL('image/jpeg', this.quality);//得到画布的URL
                                    // dataURL = tConvas.toDataURL();//得到画布的URL
                                    let s;
                                    s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部
                                    this.sendPic.auditPhotoList.push(s);//将去头部base64图片，放入图片列表
                                    resolve("ok");
                                };
                            });
                        } else {

                            promiseList[i] = new Promise((resolve, reject) => {
                                tempImgList[i] = new Image();
                                tempImgList[i].src = URL.createObjectURL(this.fileList[i].file);//如果是文件类型，从fileList得到图片src

                                tempImgList[i].onload = () => {
                                    let tConvas = document.createElement("canvas");//创建画布；
                                    let ctx = tConvas.getContext("2d");//设置画布类型
                                    tConvas.width = tempImgList[i].width;//设置画布宽度
                                    tConvas.height = tempImgList[i].height;//设置画布高度

                                    ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width, tempImgList[i].height);//将图片载入画布
                                    dataURL = tConvas.toDataURL('image/jpeg', 1);//得到画布的URL
                                    // let dataURL = tConvas.toDataURL();//得到画布的URL
                                    let s;
                                    s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部
                                    this.sendPic.auditPhotoList.push(s);//将去头部base64图片，放入图片列表
                                    resolve("ok");
                                };
                            });

                        }
                    } else {//2.2 object类型处理
                        if (this.storage.getItem('checkPicSrc' + this.checkNum) != null) {//如果是object类型，从localStorage中取值
                            let tempPicSrcList = [];//临时存放localStorage中的src的数组
                            let tempImgStorageList = [];

                            tempPicSrcList = JSON.parse(this.storage.getItem('checkPicSrc' + this.checkNum));
                            promiseList[i] = new Promise((resolve, reject) => {

                                tempImgStorageList[i] = new Image();
                                tempImgStorageList[i].src = tempPicSrcList[i];

                                tempImgStorageList[i].onload = () => {
                                    let tConvas = document.createElement("canvas");//创建画布；
                                    tConvas.width = tempImgStorageList[i].width / comQuality;//设置画布宽度
                                    tConvas.height = tempImgStorageList[i].height / comQuality;//设置画布高度

                                    let ctx = tConvas.getContext("2d");//设置画布类型
                                    ctx.drawImage(tempImgStorageList[i], 0, 0, tempImgStorageList[i].width / comQuality, tempImgStorageList[i].height / comQuality);//将图片载入画布
                                    dataURL = tConvas.toDataURL();//得到画布的URL
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
                    console.log("DATA==" + dataURL);
                    this.$http.post('/inspectPhoto/insert', this.sendPic, {
                        headers: {
                            'token': this.token
                        }
                    }).then(function (resp) {
                    });
                });
            },
            uploadPicAndExcel() {

                //1 重置审核信息
                this.sendPic.auditPhotoList = [];//重置发送照片列表
                this.sendPic.auditPage = this.checkNum;//设置发送页面编号
                this.sendPic.userName = this.userName;//设置发送页面用户名
                let tempImgList = [];//临时生成img的数组，用于画布canvas使用；
                let promiseList = [];//promise数组，避免不同步；
                let comQuality = 2;

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
                                tConvas.width = tempImgList[i].width / comQuality;//设置画布宽度
                                tConvas.height = tempImgList[i].height / comQuality;//设置画布高度

                                ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width / comQuality, tempImgList[i].height / comQuality);//将图片载入画布
                                let dataURL = tConvas.toDataURL('image/jpeg', this.quality);//得到画布的URL
                                // let dataURL = tConvas.toDataURL();//得到画布的URL

                                let s;
                                s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部
                                this.sendPic.auditPhotoList.push(s);//将去头部base64图片，放入图片列表
                                resolve("ok");
                            };
                        });

                    } else {//2.2 object类型处理
                        if (this.storage.getItem('checkPicSrc' + this.checkNum) != null) {//如果是object类型，从localStorage中取值
                            let tempPicSrcList = [];//临时存放localStorage中的src的数组
                            let tempImgStorageList = [];

                            tempPicSrcList = JSON.parse(this.storage.getItem('checkPicSrc' + this.checkNum));
                            promiseList[i] = new Promise((resolve, reject) => {

                                tempImgStorageList[i] = new Image();
                                tempImgStorageList[i].src = tempPicSrcList[i];

                                tempImgStorageList[i].onload = () => {
                                    let tConvas = document.createElement("canvas");//创建画布；
                                    tConvas.width = tempImgStorageList[i].width / comQuality;//设置画布宽度
                                    tConvas.height = tempImgStorageList[i].height / comQuality;//设置画布高度

                                    let ctx = tConvas.getContext("2d");//设置画布类型
                                    ctx.drawImage(tempImgStorageList[i], 0, 0, tempImgStorageList[i].width / comQuality, tempImgStorageList[i].height / comQuality);//将图片载入画布
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
                    this.$http.post('/inspectPhoto/insert', this.sendPic, {
                        headers: {
                            'token': this.token
                        }
                    }).then((resp) => {
                        this.$http.post('/inspectPhoto/inspectExcel', this.sendPic, {
                            headers: {
                                'token': this.token
                            }
                        });
                    });
                });
            },
            sleep(n) {
                var start = new Date().getTime();
                while (true) {
                    if (new Date().getTime() - start > n * 1000) {
                        break;
                    }
                }
            },
            //indexedDB数据库操作
            openDB() {
                this.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
                if (!this.indexedDB) {
                    Toast.fail('浏览器不支持indexedDB,翻页时图片将不显示预览，不影响使用');
                    this.notSupportIndexed = true;
                } else {
                    this.notSupportIndexed = false;
                }

                //1 打开IndexedDB请求
                let reqDB = this.indexedDB.open(this.userName, this.version);

                //2 打开请求的处理结果，有三种结果：失败、成功、阻止
                //2.1 请求成功
                reqDB.onsuccess = (e) => {
                    this.inspectDB = e.target.result;
                    ++this.version;
                    // this.lStorage.setItem("inspectVersion",s);
                    console.log("请求成功" + this.inspectDB.version);
                };

                //2.2 请求失败
                reqDB.onerror = (e) => {
                };

                //2.3 请求阻止，打开成功或版本有变化时执行，一般用于初始化数据库
                reqDB.onupgradeneeded = (e) => {
                    this.inspectDB = e.target.result;//获取到数据库实例

                    if (!this.inspectDB.objectStoreNames.contains(this.tableName)) {
                        let inspectStore = this.inspectDB.createObjectStore(this.tableName, {
                            keyPath: 'id',
                            // autoIncrement: true
                        });
                        console.log("数据库创建成功");
                    }
                    console.log("进入阻止");
                };
            },
            queryDB(id) {
                //创建事务
                let transaction = this.inspectDB.transaction(this.tableName, 'readwrite');
                //通过事务获取store
                let inspectStore = transaction.objectStore(this.tableName);

                let request = inspectStore.get(id);

                request.onsuccess = (e) => {
                    console.log("查询成功");
                    if (typeof (e.target.result) != 'undefined') {
                        console.log("e==flieList==" + e.target.result.picList);
                        // this.fileList= JSON.parse(e.target.result.picList);
                        this.fileList = e.target.result.picList;
                    }
                    console.log("获取fileList成功：" + this.fileList);
                };
            },


        }
    }
    ;
</script>

<style scoped lang="less">
    .divfinal {
        margin-left: 4vw;
        display: flex;
        justify-content: left;
        align-items: center;

        div {
            margin-left: 0.3vw;
            margin-right: 1vw;
            text-align: center;
            font-size: 3vw;
        }

    }

    .tipWord {
        margin-top: 0vw;

        p {
            margin-top: 0vw;
            margin-bottom: 0vw;
            margin-left: 4vw;
            text-align: left;
            font-size: 3vw;
            color: lightgrey;
        }
    }

    .tipWord2 {
        margin-top: 0vw;

        p {
            margin-top: 0vw;
            margin-bottom: 0vw;
            margin-left: 4vw;
            text-align: center;
            font-size: 3vw;
            color: lightgrey;
        }
    }

    .tipWord3 {
        margin-left: 31vw;

        p {
            margin-top: 0vw;
            margin-bottom: 0vw;
            margin-left: 4vw;
            text-align: left;
            font-size: 3vw;
            color: lightgrey;
        }
    }

    .divconform {
        margin-left: 4vw;
        display: flex;
        justify-content: left;
    }

    .divcontent {
        width: 14vw;
        height: 6vw;
        margin-left: 4vw;
        margin-top: 0vw;
        margin-bottom: 0vw;
        border-radius: 2vw;
        justify-content: left;
        background-color: #36C364;

        span {
            width: 14vw;
            height: 6vw;
            font-size: 3vw;
            text-align: center;
            line-height: 7vw;
            border-radius: 3vw;
            color: chocolate;
            font-weight: bold;
            background-color: #36C364;
        }
    }

    .top {
        background-color: #ffffff;
        height: 12.889vw;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-right: 4vw;
        margin-top: 6vw;

        p {
            margin-left: 4vw;
            font-size: 4vw;
            font-weight: bold;
            color: #36C364;
        }
    }

    .ptitle {
        margin-left: 4vw;
        margin-top: 0vw;
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

    .divdivender1 {
        background-color: white;
        height: 5vw;
    }

    .divconfirm {
        margin-left: 4vw;
        display: flex;
        justify-content: left;
    }

    .vanradio {
        font-size: 3vw;
    }

</style>

