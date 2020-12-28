<template>
    <div>
        <!--1        头部-->
        <div class="top">
            <p>分层审核</p>
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
        <div class="divconfirm">
            <van-radio-group v-model="radio" direction="vertical" >
                <van-radio class="vanradio" name="1" icon-size="4vw" checked-color="greenyellow" @click="conformClick">Y
                    | 符合
                </van-radio>
                <!--        分隔条-->
                <div class="divdivender1"></div>
                <van-radio class="vanradio" name="2" icon-size="4vw" checked-color="greenyellow"
                           @click="unconformClick">N | &#8195不符合
                </van-radio>
                <!--        分隔条-->
                <div class="divdivender1"></div>
                <van-radio class="vanradio" name="3" icon-size="4vw" checked-color="greenyellow"
                           @click="ncconformClick">N/C | 不符合（审核期已纠正）
                </van-radio>
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
            <div style="width: 5vw">{{etotalNum}}/{{totalNum}}</div>
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
                clickNum: '0',//判断是否点了上一页
                num: '1',//页码
                auditNum: '',//审核表编号
                userName: '',//用户名
                auditItem: '',//审核内容
                token: '',//验证令牌，key为用户名
                lastShow: true,
                nextShow: true,
                quitShow: false,
                totalNum: 0,//审核项目总数
                econformNum: 0,//符合项目总数
                eunconformNum: 0,//不符合项目总数
                etotalNum: 0,
                tempRadio: 0,
                radio: '0',//符合性判断，vant的单选框返回值
                storage: '',//存储数据至sessionStorage
                message: '',//审核发现
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
                    auditNum: '',
                    auditPhotoList: [],
                },
                conformRadio: {
                    conformNum: '',
                    unconformNum: '',
                    finishNum: ''
                },
                fileList: [],
                lastClickStatu: false,
                nextClickStatu: false,
                picValue: {
                    id: '',
                    picList: ''
                },
                indexedDB: '',//indexedDB
                inspectDB: '',//indexedDB
                tableName: 'audit',
                version: 2,//indexedDB版本号
                notSupportIndexed: true,//是否支持indexedDB
                quality: 0.8,//图片压缩质量
                comQuality: 2,//图片长宽比例
            };
        },
        async created() {
            //判断浏览器，是否支持sessionstorage
            if (sessionStorage) {
                this.storage = sessionStorage;
            }
            this.lStorage = localStorage;


            //indexedDB初始化
            this.openDB();

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
            this.econformNum = 0;
            this.eunconformNum = 0;
            let c = this.econformNum + this.eunconformNum;

            // AXIOS获取审核项目,共几处？
            this.$http.get('audititem/showone', {
                headers: {'token': this.token},
                params: {
                    page: this.num,
                    num: this.auditNum,
                    userName: this.userName,
                    auditWay: this.token,
                }
            }).then(function (resp) {
                _this.auditItem = resp.data.auditItem;
                _this.totalNum = resp.data.totalNum;
            });

        }, mounted() {
        },
        methods: {
            //点击下一页
            async NextPageClick() {

                const _this = this;
                this.lastShow = true;
                this.lastClickStatu = false;
                this.nextClickStatu = true;

                if (this.radio > 0) {//是否选择了符合性：符合-1，不符合-2，默认-0
                    this.auditInfo.auditPage = this.num;
                    this.auditInfo.auditCon = this.radio;
                    this.auditInfo.auditFind = this.message;
                    this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                    this.auditInfo.auditNum = this.auditNum;

                    //符合性判断与审核发现，存入localStorage
                    this.storage.setItem('auditCon' + this.num, this.radio);
                    this.storage.setItem('auditFind' + this.num, this.message);

                    // 数据存入数据库
                    var res = await this.$http.post('/auditinfo/insert', this.auditInfo, {
                        headers: {
                            'token': this.token
                        }
                    });
                    this.conformRadio.conformNum = res.data.conformNum;
                    this.conformRadio.unconformNum = res.data.unconformNum;
                    this.conformRadio.finishNum = res.data.finishNum;
                    this.econformNum = this.conformRadio.conformNum;
                    this.eunconformNum = this.conformRadio.unconformNum;

                    // 图片存入数据库
                    if (this.fileList.length > 0) {
                        await this.uploadPic();
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
                            headers: {'token': this.token},
                            params: {
                                page: this.num,
                                num: this.auditNum,
                                userName: this.userName,
                                auditWay: this.token
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

                    //4 判断存储信息与图片是否有被存储，如之前被存储，则取出（翻页用）
                    if (!this.notSupportIndexed) {
                        this.queryDB(this.num);
                    }

                    //获取localStorage中符合性判断，并重置radio值；
                    if (this.storage.getItem('auditCon' + this.num) > 0) {
                        this.radio = this.storage.getItem('auditCon' + this.num);
                        this.tempRadio = this.radio;
                    }


                    //获取localStorage中符合性判断，并重置message值；

                    if (this.storage.getItem('auditFind' + this.num) != null) {
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
                this.lastClickStatu = true;
                this.nextClickStatu = false;

                if (this.radio > 0) {
                    //本页内容
                    this.auditInfo.auditPage = this.num;
                    this.auditInfo.auditCon = this.radio;
                    this.auditInfo.auditFind = this.message;
                    this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                    this.auditInfo.auditNum = this.auditNum;

                    //符合性判断与审核发现，存入localStorage
                    this.storage.setItem('auditCon' + this.num, this.radio);
                    this.storage.setItem('auditFind' + this.num, this.message);


                    // 数据存入数据库
                    var res = await this.$http.post('/auditinfo/insert', this.auditInfo, {
                        headers: {
                            'token': this.token
                        }
                    });
                    this.conformRadio.conformNum = res.data.conformNum;
                    this.conformRadio.unconformNum = res.data.unconformNum;
                    this.conformRadio.finishNum = res.data.finishNum;
                    this.econformNum = this.conformRadio.conformNum;
                    this.eunconformNum = this.conformRadio.unconformNum;

                    // 图片存入数据库
                    if (this.fileList.length > 0) {
                        await this.uploadPic();
                    }


                    //上一页内容
                    if (this.num > 1) {
                        this.num--;
                        this.clickNum++;
                        this.storage.setItem('num', this.num);
                        this.storage.setItem('clickNum', this.clickNum);
                        this.$http.get('/audititem/showone', {
                            headers: {'token': this.token},
                            params: {
                                page: this.num,
                                num: this.auditNum,
                                userName: this.userName,
                                auditWay: this.token
                            }
                        }).then(function (resp) {
                            _this.auditItem = resp.data.auditItem;
                        });
                    } else {
                        Toast.fail('已是第一页')
                        this.lastShow = false;
                    }
                    //清空列表
                    this.fileList = [];
                    this.radio = '';
                    this.message = '';

                    //4 判断存储信息与图片是否有被存储，如之前被存储，则取出（翻页用）
                    if (!this.notSupportIndexed) {
                        this.queryDB(this.num);
                    }

                    //获取localStorage中符合性判断，并重置radio值；
                    if (this.storage.getItem('auditCon' + this.num) > 0) {
                        this.radio = this.storage.getItem('auditCon' + this.num);
                        this.tempRadio = this.radio;
                    }

                    //获取localStorage中符合性判断，并重置message值；
                    if (this.storage.getItem('auditFind' + this.num) != null) {
                        this.message = this.storage.getItem('auditFind' + this.num);
                    }
                } else {
                    Toast.fail('请判断符合性');
                }
            },
            clickReturn() {
                this.$http.get('basicinfo/clearData', {params: {userName: this.userName}});
                //清除sessionStorage中的内容
                this.storage.clear();

                //3 清空indexedDB中的内容
                if (!this.notSupportIndexed) {
                    this.$indexOpr.shutdownDB(this.indexedDB, this.inspectDB, this.tableName);
                }

                setTimeout(() => {
                    this.$router.push({
                        path: '/jxLogin'
                    });
                }, 1000);

            },
            async clickQuit() {
                if (this.radio > 0) {
                    this.quitShow = false;
                    this.auditInfo.auditPage = this.num;
                    this.auditInfo.auditCon = this.radio;
                    this.auditInfo.auditFind = this.message;
                    this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                    this.auditInfo.auditNum = this.auditNum;

                    // 数据存入数据库
                    var res = await this.$http.post('/auditinfo/insert', this.auditInfo, {
                        headers: {
                            'token': this.token
                        }
                    });

                    // 图片存入数据库并转成excel
                    if (this.fileList.length > 0) {
                        await this.uploadPicAndExcel();
                    } else {
                        this.sendPic.auditPhotoList = [];//重置发送照片列表
                        this.sendPic.auditPage = this.num;//设置发送页面编号
                        this.sendPic.userName = this.userName;//设置发送页面用户名
                        this.sendPic.auditNum = this.auditNum;
                        // 生成excel
                        var resP = await this.$http.post('/auditphoto/auditexcel', this.sendPic, {
                            headers: {
                                'token': this.token
                            }
                        });
                    }


                    Toast.success('审核完成\n可关闭');
                    //清除sessionStorage中的内容
                    this.storage.clear();

                    // 6 清空indexedDB数据
                    if (!this.notSupportIndexed) {
                        this.$indexOpr.shutdownDB(this.indexedDB, this.inspectDB, this.tableName);
                    }

                    if ((this.conformRadio.finishNum > 0 && ((this.conformRadio.finishNum) == this.totalNum)) || (this.num == this.totalNum)) {
                        setTimeout(() => {
                            this.$router.push({
                                path: '/lastpage'
                            });
                        }, 2000);

                    }
                } else {
                    Toast.fail('请判断符合性');
                }
            },

            //图片读取前
            // 保存按钮设为不可用
            beforeRead(file) {
                //1 保存按钮不可用
                this.quitShow = false;
                return true;
            },

            //图片读取后
            //1 图片列表放入indexedDB中
            //2 保存按钮可用
            afterRead(file) {
                //1 图片列表放入indexedDB中
                if (this.fileList.length > 0) {
                    if (!this.notSupportIndexed) {
                        this.picValue.id = this.num;
                        this.picValue.picList = this.fileList;
                        this.$indexOpr.insertDB(this.inspectDB, this.tableName, this.picValue);
                    }
                }
                //2 保存按钮可用
                this.quitShow = true;
            },

            //图片删除后
            // 图片列表放入indexedDB中
            onDelete(file) {
                //1 图片列表放入indexedDB中
                if (!this.notSupportIndexed) {
                    this.picValue.id = this.num;
                    this.picValue.picList = this.fileList;
                    this.$indexOpr.insertDB(this.inspectDB, this.tableName, this.picValue);
                }
            },

            //图片转成base64，并发送至服务器。
            //1 重置审核图片sendPic信息
            //2 遍历fileList
            //2.1 判断图片是否为file类型，是则传至服务器，否则不上传
            //2.2 判断图片是否大于500KB，大于则压缩图片尺寸与像素，否则不压缩
            //2.3 使用promiseList将图片发送至服务器，以确保图片操作完成，正确上传至服务器中
            //2.4 新建一张图片（新建画布只能传入图片,）
            //2.5 获得fileList中文件的URL,并赋给新建的图片
            //2.6 新建图片成功后，新建画布
            //2.7 设置画布类型与长宽参数
            //2.8 将图片载入画布，并压缩图片
            //2.9 得到画布的URL,并去除其头部(base64)
            //2.10 将去除头部的图片放入auditPhotoList中
            //2.11 图片处理成功后，将promise的resolve设为OK
            //2.12 promiseList全部处理完成，即fileList中图片全部放入sendPic中后，将图片上传至服务器
            uploadPic() {
                //1 重置审核信息
                this.sendPic.auditPhotoList = [];//重置发送照片列表
                this.sendPic.auditPage = this.num;//设置发送页面编号
                this.sendPic.userName = this.userName;//设置发送页面用户名
                this.sendPic.auditNum = this.auditNum;
                let tempImgList = [];//临时生成img的数组，用于画布canvas使用；
                let promiseList = [];//promis数组，避免不同步；
                let dataURL;//画布的URL

                //2 遍历fileList
                for (let i = 0; i < this.fileList.length; i++) {

                    //2.1 判断图片是否为file类型，是则传至服务器
                    var type = this.fileList[i].file.toString().search(/file/i);//判断file类型
                    if (type > 0) {

                        //2.2 图片大于500KB，压缩图片尺寸与像素
                        if (this.fileList[i].file.size / 1024 > 500) {

                            //2.3 使用promiseList将图片发送至服务器，以确保图片操作完成，正确上传至服务器中
                            promiseList[i] = new Promise((resolve, reject) => {

                                //2.4 新建一张图片
                                tempImgList[i] = new Image();

                                //2.5 获得fileList中文件的URL,并赋给新建的图片
                                tempImgList[i].src = URL.createObjectURL(this.fileList[i].file);//如果是文件类型，从fileList得到图片src

                                //2.6 新建图片成功后，新建画布
                                tempImgList[i].onload = () => {
                                    let tConvas = document.createElement("canvas");//创建画布；

                                    //2.7 设置画布类型与长宽参数
                                    let ctx = tConvas.getContext("2d");//设置画布类型
                                    tConvas.width = tempImgList[i].width/this.comQuality;//设置画布宽度
                                    tConvas.height = tempImgList[i].height/this.comQuality;//设置画布高度

                                    //2.8 将图片载入画布，并压缩图片
                                    ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width/this.comQuality, tempImgList[i].height/this.comQuality);//将图片载入画布

                                    //2.9 得到画布的URL,并去除其头部(base64)
                                    dataURL = tConvas.toDataURL('image/jpeg', this.quality);//得到画布的URL
                                    let s;
                                    s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部

                                    //2.10 将去除头部的图片放入auditPhotoList中
                                    this.sendPic.auditPhotoList.push(s);//将去头部base64图片，放入图片列表

                                    //2.11 图片处理成功后，将promist的resolve设为OK
                                    resolve("ok");
                                };
                            });
                        }
                        //2.2 图片小于500KB，不压缩图片
                        else {
                            //2.3 使用promiseList将图片发送至服务器，以确保图片操作完成，正确上传至服务器中
                            promiseList[i] = new Promise((resolve, reject) => {

                                //2.4 新建一张图片
                                tempImgList[i] = new Image();

                                //2.5 获得fileList中文件的URL,并赋给新建的图片
                                tempImgList[i].src = URL.createObjectURL(this.fileList[i].file);//如果是文件类型，从fileList得到图片src

                                //2.6 新建图片成功后，新建画布
                                tempImgList[i].onload = () => {
                                    let tConvas = document.createElement("canvas");//创建画布；

                                    //2.7 设置画布类型与长宽参数
                                    let ctx = tConvas.getContext("2d");//设置画布类型
                                    tConvas.width = tempImgList[i].width;//设置画布宽度
                                    tConvas.height = tempImgList[i].height;//设置画布高度

                                    //2.8 将图片载入画布，并压缩图片
                                    ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width, tempImgList[i].height);//将图片载入画布

                                    //2.9 得到画布的URL,并去除其头部(base64)
                                    dataURL = tConvas.toDataURL();//得到画布的URL
                                    let s;
                                    s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部

                                    //2.10 将去除头部的图片放入auditPhotoList中
                                    this.sendPic.auditPhotoList.push(s);//将去头部base64图片，放入图片列表

                                    //2.11 图片处理成功后，将promist的resolve设为OK
                                    resolve("ok");
                                };
                            });

                        }
                    }
                }

                //2.12 promiseList全部处理完成，即fileList中图片全部放入sendPic中后，将图片上传至服务器
                Promise.all(promiseList).then(() => {
                    this.$http.post('/auditphoto/insert', this.sendPic, {
                        headers: {
                            'token': this.token
                        }
                    }).then(function (resp) {
                    });
                });
            },

            //上传图片至后端并生成EXCEL
            //1 对图片处理并放入sendPic中，方法完全同uploadPic
            //2 通知服务器，生成excel
            uploadPicAndExcel() {

                //1 重置审核信息
                this.sendPic.auditPhotoList = [];//重置发送照片列表
                this.sendPic.auditPage = this.num;//设置发送页面编号
                this.sendPic.userName = this.userName;//设置发送页面用户名
                this.sendPic.auditNum = this.auditNum;
                let tempImgList = [];//临时生成img的数组，用于画布canvas使用；
                let promiseList = [];//promis数组，避免不同步；
                let dataURL;//画布的URL

                //2 遍历fileList
                for (let i = 0; i < this.fileList.length; i++) {

                    //2.1 判断图片是否为file类型，是则传至服务器
                    var type = this.fileList[i].file.toString().search(/file/i);//判断file类型
                    if (type > 0) {

                        //2.2 图片大于500KB，压缩图片尺寸与像素
                        if (this.fileList[i].file.size / 1024 > 500) {

                            //2.3 使用promiseList将图片发送至服务器，以确保图片操作完成，正确上传至服务器中
                            promiseList[i] = new Promise((resolve, reject) => {

                                //2.4 新建一张图片
                                tempImgList[i] = new Image();

                                //2.5 获得fileList中文件的URL,并赋给新建的图片
                                tempImgList[i].src = URL.createObjectURL(this.fileList[i].file);//如果是文件类型，从fileList得到图片src

                                //2.6 新建图片成功后，新建画布
                                tempImgList[i].onload = () => {
                                    let tConvas = document.createElement("canvas");//创建画布；

                                    //2.7 设置画布类型与长宽参数
                                    let ctx = tConvas.getContext("2d");//设置画布类型
                                    tConvas.width = tempImgList[i].width/this.comQuality;//设置画布宽度
                                    tConvas.height = tempImgList[i].height/this.comQuality;//设置画布高度

                                    //2.8 将图片载入画布，并压缩图片
                                    ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width/this.comQuality, tempImgList[i].height/this.comQuality);//将图片载入画布

                                    //2.9 得到画布的URL,并去除其头部(base64)
                                    dataURL = tConvas.toDataURL('image/jpeg', this.quality);//得到画布的URL
                                    let s;
                                    s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部

                                    //2.10 将去除头部的图片放入auditPhotoList中
                                    this.sendPic.auditPhotoList.push(s);//将去头部base64图片，放入图片列表

                                    //2.11 图片处理成功后，将promist的resolve设为OK
                                    resolve("ok");
                                };
                            });
                        }
                        //2.2 图片小于500KB，不压缩图片
                        else {
                            //2.3 使用promiseList将图片发送至服务器，以确保图片操作完成，正确上传至服务器中
                            promiseList[i] = new Promise((resolve, reject) => {

                                //2.4 新建一张图片
                                tempImgList[i] = new Image();

                                //2.5 获得fileList中文件的URL,并赋给新建的图片
                                tempImgList[i].src = URL.createObjectURL(this.fileList[i].file);//如果是文件类型，从fileList得到图片src

                                //2.6 新建图片成功后，新建画布
                                tempImgList[i].onload = () => {
                                    let tConvas = document.createElement("canvas");//创建画布；

                                    //2.7 设置画布类型与长宽参数
                                    let ctx = tConvas.getContext("2d");//设置画布类型
                                    tConvas.width = tempImgList[i].width;//设置画布宽度
                                    tConvas.height = tempImgList[i].height;//设置画布高度

                                    //2.8 将图片载入画布，并压缩图片
                                    ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width, tempImgList[i].height);//将图片载入画布

                                    //2.9 得到画布的URL,并去除其头部(base64)
                                    dataURL = tConvas.toDataURL();//得到画布的URL
                                    let s;
                                    s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部

                                    //2.10 将去除头部的图片放入auditPhotoList中
                                    this.sendPic.auditPhotoList.push(s);//将去头部base64图片，放入图片列表

                                    //2.11 图片处理成功后，将promist的resolve设为OK
                                    resolve("ok");
                                };
                            });

                        }
                    }
                }
                Promise.all(promiseList).then(() => {
                    //2.12 promiseList全部处理完成，即fileList中图片全部放入sendPic中后，将图片上传至服务器
                    this.$http.post('/auditphoto/insert', this.sendPic, {
                        headers: {
                            'token': this.token
                        }
                    }).then((resp) => {
                        //2 通知服务器，生成excel
                        var resP = this.$http.post('/auditphoto/auditexcel', this.sendPic, {
                            headers: {
                                'token': this.token
                            }
                        });
                    });
                });
            },
            conformClick() {//符合点击事件，控制底部计数变化
                //1 没到最后一页，数据库未满，在数据库基础上+1
                // console.log("radio===" + this.radio);
                if ((this.lastClickStatu || this.nextClickStatu) && (this.tempRadio == 1)) {
                    this.econformNum = this.conformRadio.conformNum;
                } else {
                    if (this.conformRadio.conformNum == this.totalNum) {
                        this.econformNum = this.conformRadio.conformNum;
                    } else {
                        this.econformNum = this.conformRadio.conformNum + 1;
                    }
                }

                //3 如果已审核信息的不符合数量>0,则不符合数量-1，否则不符合数量为0
                if ((this.nextClickStatu || this.lastClickStatu) && (this.radio == 1)) {
                    this.eunconformNum = this.conformRadio.unconformNum;
                } else {
                    if (this.conformRadio.finishNum < this.totalNum) {
                        if (this.lastClickStatu) {
                            this.eunconformNum = this.conformRadio.unconformNum - 1;
                        } else {
                            if (this.conformRadio.unconformNum > 0) {
                                this.eunconformNum = this.conformRadio.unconformNum;
                            } else {
                                this.eunconformNum = 0;
                            }
                        }
                    } else {
                        if (this.conformRadio.unconformNum > 0) {
                            this.eunconformNum = this.conformRadio.unconformNum - 1;
                        } else {
                            this.eunconformNum = 0;
                        }
                    }
                }


                if ((this.econformNum + this.eunconformNum) == 10) {
                    this.etotalNum = 1;
                } else {
                    this.etotalNum = this.econformNum + this.eunconformNum;
                }
            },
            unconformClick() {//不符合点击事件，控制底部计数变化

                if ((this.lastClickStatu || this.nextClickStatu) && (this.tempRadio == 2)) {
                    this.eunconformNum = this.conformRadio.unconformNum;
                } else {
                    if (this.conformRadio.unconformNum == this.totalNum) {
                        this.eunconformNum = this.conformRadio.unconformNum;
                    } else {
                        this.eunconformNum = this.conformRadio.unconformNum + 1;
                    }
                }

                if ((this.lastClickStatu || this.nextClickStatu) && (this.tempRadio == 2)) {
                    this.econformNum = this.conformRadio.conformNum;
                } else {
                    if (this.conformRadio.finishNum < this.totalNum) {
                        if (this.lastClickStatu) {
                            this.econformNum = this.conformRadio.conformNum - 1;
                        } else {
                            if (this.conformRadio.conformNum > 0) {
                                this.econformNum = this.conformRadio.conformNum;
                            } else {
                                this.econformNum = 0;
                            }
                        }
                    } else {
                        if (this.conformRadio.conformNum > 0) {
                            this.econformNum = this.conformRadio.conformNum - 1;
                        } else {
                            this.econformNum = 0;
                        }
                    }
                }
                if ((this.econformNum + this.eunconformNum) == 1) {
                    this.etotalNum = 1;
                } else {
                    this.etotalNum = this.econformNum + this.eunconformNum;
                }
            },
            ncconformClick() {

                if ((this.lastClickStatu || this.nextClickStatu) && (this.tempRadio == 3)) {
                    this.eunconformNum = this.conformRadio.unconformNum;
                } else {
                    if (this.conformRadio.unconformNum == this.totalNum) {
                        this.eunconformNum = this.conformRadio.unconformNum;
                    } else {
                        this.eunconformNum = this.conformRadio.unconformNum + 1;
                    }
                }

                if ((this.lastClickStatu || this.nextClickStatu) && (this.tempRadio == 3)) {
                    this.econformNum = this.conformRadio.conformNum;
                } else {
                    if (this.conformRadio.finishNum < this.totalNum) {
                        if (this.lastClickStatu) {
                            this.econformNum = this.conformRadio.conformNum - 1;
                        } else {
                            if (this.conformRadio.conformNum > 0) {
                                this.econformNum = this.conformRadio.conformNum;
                            } else {
                                this.econformNum = 0;
                            }
                        }
                    } else {
                        if (this.conformRadio.conformNum > 0) {
                            this.econformNum = this.conformRadio.conformNum - 1;
                        } else {
                            this.econformNum = 0;
                        }
                    }
                }
                if ((this.econformNum + this.eunconformNum) == 1) {
                    this.etotalNum = 1;
                } else {
                    this.etotalNum = this.econformNum + this.eunconformNum;
                }
            },
            sleep(n) {
                var start = new Date().getTime();
                while (true) {
                    if (new Date().getTime() - start > n * 1000) {
                        break;
                    }
                }
            },
            //新建与打开indexedDB数据库
            //判断浏览器是否支持indexedDB,支持notSupportIndexed设为false,并打开数据库

            //浏览器支持indexedDB数据库
            //1 打开IndexedDB请求
            //2 打开请求的处理结果，有三种结果：失败、成功、阻止
            //2.1 请求成功后，查询是否有数据，有则将数据赋给fileList中
            //2.2 请求失败
            //2.3 请求阻止，打开成功或版本有变化时执行，一初始化数据库
            openDB() {
                this.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
                //判断浏览器是否支持indexedDB,支持notSupportIndexed设为false,并打开数据库
                if (!this.indexedDB) {
                    Toast.fail('浏览器不支持indexedDB,翻页时图片将不显示预览，不影响使用');
                    this.notSupportIndexed = true;
                } else {
                    this.notSupportIndexed = false;


                    //1 打开IndexedDB请求
                    let reqDB = this.indexedDB.open(this.userName+'audit', this.version);

                    //2 打开请求的处理结果，有三种结果：失败、成功、阻止
                    //2.1 请求成功
                    reqDB.onsuccess = (e) => {
                        this.inspectDB = e.target.result;

                        //查询是否有数据，有则赋给fileList
                        this.queryDB(this.num);
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
                }
            },

            //查询indexedDB数据库
            //1 创建事务
            //2 通过事务获取store
            //3 尝试根据id即页面编码Num，查询数据
            //4 查询成功后，数据放入fileList中
            queryDB(id) {
                //1 创建事务
                let transaction = this.inspectDB.transaction(this.tableName, 'readwrite');

                //2 通过事务获取store
                let inspectStore = transaction.objectStore(this.tableName);

                //3 尝试根据id即页面编码Num，查询数据
                let request = inspectStore.get(id);

                //4 查询成功后，数据放入fileList中
                request.onsuccess = (e) => {
                    console.log("查询成功");
                    if (typeof (e.target.result) != 'undefined') {
                        this.fileList = e.target.result.picList;
                    }
                };
            },

        },
    }
</script>

<style scoped lang="less">
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

    .divconfirm {
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

    .divdivender1 {
        background-color: white;
        width: 5vw;
    }

    .vanradio {
        font-size: 3vw;
    }

</style>
