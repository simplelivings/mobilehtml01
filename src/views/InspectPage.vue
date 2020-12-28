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
                storage: '',//存储数据至sessionStorage
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
                picValue: {
                    id: '',
                    picList: ''
                },
                indexedDB: '',//indexedDB
                inspectDB: '',//indexedDB
                tableName: 'inspect',
                version: 2,//indexedDB版本号
                notSupportIndexed: true,//是否支持indexedDB
                quality: 0.8,//图片压缩质量
                comQuality: 2,//图片长宽比例
            };
        },
        //1 判断浏览器是否支持Storage
        //2 从sessionStorage中获取用户名，token,审核编号（区分嘉翔与付费），把审核编号放入sendPic中
        //3 初始化indexedDB,如果浏览器不支持，则不使用（用notSupportIndexed），翻页时图片将不保存
        //4 根据审核编号，显示或隐藏提示信息
        //5 刷新后，保留当前页面信息
        async created() {
            //判断浏览器，是否支持sessionStorage
            if (sessionStorage) {
                this.storage = sessionStorage;
            }
            this.lStorage = localStorage;


            //从localStorage获取审核表编号和用户名
            this.userName = this.lStorage.getItem("userName");
            this.token = this.lStorage.getItem("auditWay");
            this.loginNum = this.lStorage.getItem("loginNum");
            this.sendPic.loginNum = this.loginNum;

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

            if (this.storage.getItem('inspectCon' + this.checkNum) != null) {
                this.radio = this.storage.getItem('inspectCon' + this.checkNum);
            }

        },
        //空
        mounted() {
        },
        methods: {

            //点击下一页
            // 判断用户是否有填入必要的信息

            // 处理本页内容
            //1 关闭提示，重置上一页、下一页按钮状态
            //2 把审核信息放入auditInfo中，并发送至服务器
            //3 如果有审核图片，把审核图片发送至服务器（审核图片本地存储，在afterRead与delete中实现）
            //4 将当前页审核信息，存入sessionStorage中

            //处理下页内容
            //1 最多30页
            //2 自增页面编号checkNum，并将页面编号存储至sessionStorage中
            //3 重置审核信息与审核图片列表
            //4 判断存储信息与图片是否有被存储，如之前被存储，则取出（翻页用）

            async NextPageClick() {
                //判断用户是否有填入必要的信息
                if (this.radio > 0 || this.auditCharger.length > 0 || this.message.length > 0) {
                    const _this = this;
                    //处理本页内容
                    //1 关闭提示，重置上一页、下一页按钮状态
                    this.lastShow = true;
                    this.quitShow = true;
                    this.tipShow = false;

                    //2 把审核信息放入auditInfo中，并发送至服务器
                    this.auditInfo.auditCon = this.radio;
                    this.auditInfo.auditPage = this.checkNum;
                    this.auditInfo.auditFind = this.message;
                    this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                    this.auditInfo.auditCharger = this.auditCharger;
                    if (this.fileList.length > 0) {
                        this.auditInfo.auditPicStatue = 1;
                    }
                    var res = await this.$http.post('/inspectInfo/insert', this.auditInfo, {
                        headers: {
                            'token': this.token
                        }
                    });

                    //3 如果有审核图片，把审核图片发送至服务器
                    if (this.fileList.length > 0) {
                        await this.uploadPic();
                    }


                    //4 将当前页审核信息，存入sessionStorage中
                    this.storage.setItem('checkFind' + this.checkNum, this.message);
                    this.storage.setItem('inspectCon' + this.checkNum, this.radio);
                    this.storage.setItem('checkCharger' + this.checkNum, this.auditCharger);
                    this.lStorage.setItem('checkCharger', this.auditCharger);


                    //处理下一页内容
                    //1 页码最多为30页
                    if (this.checkNum < 30) {

                        //2 自增页面编号checkNum，并将页面编号存储至sessionStorage中
                        this.checkNum++;
                        this.storage.setItem('checkNum', this.checkNum);//页码存入storage

                        //3 重置审核信息与审核图片列表
                        this.fileList = [];
                        this.message = '';
                        this.radio = '';
                        this.auditCharger = '';

                        //4 判断存储信息与图片是否有被存储，如之前被存储，则取出（翻页用）
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
                        //获取local或sessionStorage中的auditCharger值
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
            // 判断用户是否有填入必要的信息

            // 处理本页内容
            //1 重置上一页、下一页按钮状态
            //2 把审核信息放入auditInfo中，并发送至服务器
            //3 如果有审核图片，把审核图片发送至服务器（审核图片本地存储，在afterRead与delete中实现）
            //4 将当前页审核信息，存入sessionStorage中

            //处理下页内容
            //1 判断是否是第一页
            //2 自减页面编号checkNum，并将页面编号存储至sessionStorage中
            //3 重置审核信息与审核图片列表
            //4 判断存储信息与图片是否有被存储，如之前被存储，则取出（翻页用）

            async LastPageClick() {
                // 判断用户是否有填入必要的信息
                if (this.radio > 0 || this.auditCharger.length > 0 || this.message.length > 0) {
                    // 处理本页内容
                    //1 重置上一页、下一页按钮状态
                    const _this = this;
                    this.nextShow = true;
                    this.quitShow = true;

                    //2 把审核信息放入auditInfo中，并发送至服务器
                    this.auditInfo.auditCon = this.radio;
                    this.auditInfo.auditPage = this.checkNum;
                    this.auditInfo.auditFind = this.message;
                    this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                    this.auditInfo.auditCharger = this.auditCharger;
                    if (this.fileList.length > 0) {
                        this.auditInfo.auditPicStatue = 1;
                    }
                    var res = await this.$http.post('/inspectInfo/insert', this.auditInfo, {
                        headers: {
                            'token': this.token
                        }
                    });

                    //3 如果有审核图片，把审核图片发送至服务器（审核图片本地存储，在afterRead与delete中实现）
                    if (this.fileList.length > 0) {
                        await this.uploadPic();
                    }

                    //4 将当前页审核信息，存入sessionStorage中
                    this.storage.setItem('checkFind' + this.checkNum, this.message);
                    this.storage.setItem('inspectCon' + this.checkNum, this.radio);
                    this.storage.setItem('checkCharger' + this.checkNum, this.auditCharger);
                    this.lStorage.setItem('checkCharger', this.auditCharger);

                    //处理下一页内容
                    //1 判断是否是第一页
                    if (this.checkNum > 1) {

                        //2 自减页面编号checkNum，并将页面编号存储至sessionStorage中
                        this.checkNum--;
                        this.storage.setItem('checkNum', this.checkNum);


                        //3 重置审核信息与审核图片列表
                        this.fileList = [];
                        this.radio = '';
                        this.message = '';
                        this.auditCharger = '';

                        //4 判断存储信息与图片是否有被存储，如之前被存储，则取出（翻页用）
                        if (!this.notSupportIndexed) {
                            this.queryDB(this.checkNum);
                        }

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
                    Toast.fail('请选择一些信息！');
                }

            },

            //保存按钮
            // 判断当前页，是否已选择图片

            // 当前页面已选择图片
            // 1 要求用户输入部分审核信息
            // 2 保存按钮设为不可用
            // 3 将审核信息发送至服务器
            // 4 将审核图片发送至服务器，并通知服务器生成excel
            // 5 提示用户，审核完成
            // 6 清空sessionStorage数据
            // 7 清空indexedDB数据
            // 8 跳转至最后一页，完成审核

            //当前页面未选择图片
            // 1 保存按钮设为不可用
            // 2 将审核信息发送至服务器
            // 3 将审核图片置为空，并通知服务器生成excel
            // 4 提示用户，审核完成
            // 5 清空sessionStorage数据
            // 6 清空indexedDB数据
            // 7 跳转至最后一页，完成审核
            async clickQuit() {

                // 判断当前页，是否已选择图片
                if (this.fileList.length > 0) {
                    this.auditInfo.auditPicStatue = 1;
                    // 当前页面已选择图片
                    // 1 要求用户输入部分审核信息
                    if (this.radio > 0 || this.auditCharger.length > 0 || this.message.length > 0) {
                        // 2 保存按钮设为不可用
                        this.quitShow = false;

                        // 3 将审核信息发送至服务器
                        this.auditInfo.auditCon = this.radio;
                        this.auditInfo.auditPage = this.checkNum;
                        this.auditInfo.auditFind = this.message;
                        this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                        this.auditInfo.auditCharger = this.auditCharger;//用户名传入对象中，有点重复
                        var res = await this.$http.post('/inspectInfo/insert', this.auditInfo, {
                            headers: {
                                'token': this.token
                            }
                        });

                        // 4 将审核图片发送至服务器，并通知服务器生成excel
                        this.uploadPicAndExcel();

                        // 5 提示用户，审核完成
                        Toast.success('审核完成\n可关闭');

                        // 6 清空sessionStorage数据
                        this.storage.clear();

                        // 7 清空indexedDB数据
                        if (!this.notSupportIndexed) {
                            this.$indexOpr.shutdownDB(this.indexedDB, this.inspectDB, this.tableName);
                        }

                        // 8 跳转至最后一页，完成审核
                        setTimeout(() => {
                            this.$router.push({
                                path: '/lastpage'
                            });
                        }, 2000);
                    } else {
                        Toast.fail('请填写/选择一些信息！');
                    }
                } else {
                    //当前页面未选择图片
                    // 1 保存按钮设为不可用
                    this.quitShow = false;

                    // 2 将审核信息发送至服务器
                    this.auditInfo.auditCon = this.radio;
                    this.auditInfo.auditPage = this.checkNum;
                    this.auditInfo.auditFind = this.message;
                    this.auditInfo.userName = this.userName;//用户名传入对象中，有点重复
                    this.auditInfo.auditCharger = this.auditCharger;//用户名传入对象中，有点重复
                    var res = await this.$http.post('/inspectInfo/insert', this.auditInfo, {
                        headers: {
                            'token': this.token
                        }
                    });

                    // 3 将审核图片发送至服务器，并通知服务器生成excel
                    this.sendPic.auditPhotoList = [];//重置发送照片列表
                    this.sendPic.auditPage = this.checkNum;//设置发送页面编号
                    this.sendPic.userName = this.userName;//设置发送页面用户名
                    var resP = await this.$http.post('/inspectPhoto/inspectExcel', this.sendPic, {
                        headers: {
                            'token': this.token
                        }
                    });

                    // 4 提示用户，审核完成
                    Toast.success('审核完成\n可关闭');

                    // 5 清空sessionStorage数据
                    this.storage.clear();

                    // 6 清空indexedDB数据
                    if (!this.notSupportIndexed) {
                        this.$indexOpr.shutdownDB(this.indexedDB, this.inspectDB, this.tableName);
                    }

                    // 7 跳转至最后一页，完成审核
                    setTimeout(() => {
                        this.$router.push({
                            path: '/lastpage'
                        });
                    }, 2000);
                }

            },
            //首页按钮
            //1 通知服务器，清理用户审核数据
            //2 清空sessionStorage中的内容
            //3 清空indexedDB中的内容
            //4 依据审核编号，跳转至对用登录界面
            clickReturn() {
                //1 通知服务器，清理用户审核数据
                this.$http.get('basicinfo/clearData', {params: {userName: this.userName}});

                //2 清空sessionStorage中的内容
                this.storage.clear();

                //3 清空indexedDB中的内容
                if (!this.notSupportIndexed) {
                    this.$indexOpr.shutdownDB(this.indexedDB, this.inspectDB, this.tableName);
                }

                //4 依据审核编号，跳转至对用登录界面
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
                        this.picValue.id = this.checkNum;
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
                    this.picValue.id = this.checkNum;
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
                //1 重置图片审核信息
                this.sendPic.auditPhotoList = [];//重置发送照片列表
                this.sendPic.auditPage = this.checkNum;//设置发送页面编号
                this.sendPic.userName = this.userName;//设置发送页面用户名
                let tempImgList = [];//临时生成img的数组，用于画布canvas使用；
                let promiseList = [];//promise数组，避免不同步；
                let dataURL;//画布的URL
                //2 遍历fileList
                for (let i = 0; i < this.fileList.length; i++) {

                    //2.1 判断图片是否为file类型，是则传至服务器
                    var type = this.fileList[i].file.toString().search(/file/i);
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
                                    tConvas.width = tempImgList[i].width / this.comQuality;//设置画布宽度
                                    tConvas.height = tempImgList[i].height / this.comQuality;//设置画布高度

                                    //2.8 将图片载入画布，并压缩图片
                                    ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width / this.comQuality, tempImgList[i].height / this.comQuality);//将图片载入画布

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

                                    //2.8 将图片载入画布，不压缩
                                    ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width, tempImgList[i].height);//将图片载入画布
                                    dataURL = tConvas.toDataURL('image/jpeg', 1);//得到画布的URL

                                    //2.9 得到画布的URL,并去除其头部(base64)
                                    let s;
                                    s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部

                                    //2.11 图片处理成功后，将promist的resolve设为OK
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
                    this.$http.post('/inspectPhoto/insert', this.sendPic, {
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

                //1 对图片处理并放入sendPic中，方法完全同uploadPic
                this.sendPic.auditPhotoList = [];//重置发送照片列表
                this.sendPic.auditPage = this.checkNum;//设置发送页面编号
                this.sendPic.userName = this.userName;//设置发送页面用户名
                let tempImgList = [];//临时生成img的数组，用于画布canvas使用；
                let promiseList = [];//promise数组，避免不同步；
                let dataURL;

                //2 遍历fileList
                for (let i = 0; i < this.fileList.length; i++) {

                    //2.1 判断图片是否为file类型，是则传至服务器
                    var type = this.fileList[i].file.toString().search(/file/i);
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
                                    tConvas.width = tempImgList[i].width / this.comQuality;//设置画布宽度
                                    tConvas.height = tempImgList[i].height / this.comQuality;//设置画布高度

                                    //2.8 将图片载入画布，并压缩图片
                                    ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width / this.comQuality, tempImgList[i].height / this.comQuality);//将图片载入画布

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

                                    //2.8 将图片载入画布，不压缩
                                    ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width, tempImgList[i].height);//将图片载入画布
                                    dataURL = tConvas.toDataURL('image/jpeg', 1);//得到画布的URL

                                    //2.9 得到画布的URL,并去除其头部(base64)
                                    let s;
                                    s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部

                                    //2.11 图片处理成功后，将promist的resolve设为OK
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
                    this.$http.post('/inspectPhoto/insert', this.sendPic, {
                        headers: {
                            'token': this.token
                        }
                    }).then((resp) => {
                        //2 通知服务器，生成excel
                        this.$http.post('/inspectPhoto/inspectExcel', this.sendPic, {
                            headers: {
                                'token': this.token
                            }
                        });
                    });
                });
            },

            //进程睡眠n秒
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
                    let reqDB = this.indexedDB.open(this.userName+'inspect', this.version);

                    //2 打开请求的处理结果，有三种结果：失败、成功、阻止
                    //2.1 请求成功
                    reqDB.onsuccess = (e) => {
                        this.inspectDB = e.target.result;

                        //查询是否有数据，有则赋给fileList
                        this.queryDB(this.checkNum);
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
            //3 尝试根据id即页面编码checkNum，查询数据
            //4 查询成功后，数据放入fileList中
            queryDB(id) {
                //1 创建事务
                let transaction = this.inspectDB.transaction(this.tableName, 'readwrite');

                //2 通过事务获取store
                let inspectStore = transaction.objectStore(this.tableName);

                //3 尝试根据id即页面编码checkNum，查询数据
                let request = inspectStore.get(id);

                //4 查询成功后，数据放入fileList中
                request.onsuccess = (e) => {
                    console.log("查询成功");
                    if (typeof (e.target.result) != 'undefined') {
                        this.fileList = e.target.result.picList;
                    }
                };
            },


        }
    }
    ;
</script>

<style scoped lang="less">
    //保存按钮样式
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

    //提示信息样式
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

    /*.divconform {*/
    /*    margin-left: 4vw;*/
    /*    display: flex;*/
    /*    justify-content: left;*/
    /*}*/

    //头部，第*页样式
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

    //头部样式
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

    //审核信息，表头样式
    .ptitle {
        margin-left: 4vw;
        margin-top: 0vw;
        margin-bottom: 2vw;
        text-align: left;
        font-size: 4vw;
        font-weight: bold;
        color: chocolate;
    }

    //图片上传模块样式
    .img {
        display: flex;
        margin-left: 3vw;
        margin-top: 0vw;
        justify-content: left;
    }

    //段落分隔条样式
    .divdivender {
        background-color: rgba(188, 193, 213, 0.28);
        height: 1vw;
        margin-top: 1vw;
        margin-bottom: 1vw;
    }

    //问题性质内，分割条样式
    .divdivender1 {
        background-color: white;
        height: 5vw;
    }

    //问题性质div样式
    .divconfirm {
        margin-left: 4vw;
        display: flex;
        justify-content: left;
    }

    //问题性质，radio样式
    .vanradio {
        font-size: 3vw;
    }

</style>

