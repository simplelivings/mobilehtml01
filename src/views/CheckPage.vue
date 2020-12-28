<template>
    <div>
        <div class="top">
            <p>质量检验</p>
            <P></P>
            <P></P>
            <P></P>
            <P></P>
            <P></P>
            <P></P>
            <div>
                <van-button @click="clickReturn" size="small">首 页</van-button>
                <van-button @click="lastPageClick" :disabled="!lastShow" size="small">上一页</van-button>
                <van-button @click="nextPageClick" :disabled="!nextShow" size="small">下一页</van-button>
            </div>
        </div>

        <div class="divcontent">
            <span>{{checkNum}}</span>
            <p>--检验项目</p>
        </div>


        <!--       1 检验过程选择-->
        <div class="divconform">
            <van-radio-group v-model="checkType" direction="horizontal">
                <van-radio class="vanradio" name="1" icon-size="4vw" checked-color="greenyellow">
                    过程抽检
                </van-radio>

                <p style="color: lightgrey">|</p>
                <p style="width: 2vw"></p>
                <van-radio class="vanradio" name="2" icon-size="4vw" checked-color="greenyellow">首检
                </van-radio>
                <van-radio class="vanradio" name="3" icon-size="4vw" checked-color="greenyellow">中检
                </van-radio>
                <van-radio class="vanradio" name="4" icon-size="4vw" checked-color="greenyellow">末检
                </van-radio>
            </van-radio-group>
        </div>

        <!--        分隔条-->
        <div class="divdivender"></div>

        <!--    2    检验信息输入-->
        <div class="divinput">
            <div class="divinputP">
                <div style="width: 2vw"></div>
                <p >零件号</p>
                <div style="width: 7vw"></div>
                <input class="partNumInputDatalist" id="partNumInputs" list="partNumInputList" v-model="valuePartNum" placeholder="请输入零件号"/>
                <datalist id="partNumInputList" >
                    <option value="A1766510001" />
                    <option value="T21-2804711" />
                    <option value="T21-3301051" />
                    <option value="T21-5100301" />
                    <option value="T21-5300301" />
                    <option value="T21-5400103" />
                    <option value="T21-5701211" />
                    <option value="T21-6101075" />
                    <option value="T21-6201075" />
                    <option value="T21-8400131" />
                    <option value="61625-95J05" />
                    <option value="A2136370320" />
                    <option value="A1766510001" />
                    <option value="A2536371701" />
                    <option value="A1766370135" />
                    <option value="A2466360740" />
                    <option value="A2056510900" />
                    <option value="A2136120017" />
                    <option value="A1776261500" />
                    <option value="7372077-03" />
                    <option value="64124 5NNOA" />
                    <option value="77634 5NNOB" />
                    <option value="74532 5NN1A" />
                    <option value="76340 5NNOA" />
                    <option value="74532 5NN1A" />
                    <option value="78136 5NN1A" />
                    <option value="78142 5NN1A" />
                    <option value="76666 DF30A" />
                    <option value="77662 DF30A" />
                    <option value="509000483AA" />
                </datalist>

            </div>

            <van-cell-group>
<!--                <van-field class="field1" v-model="valuePartNum" label="零件号" placeholder="请输入零件号"/>-->
                <van-field class="field1" v-model="valueProuductNum" label="生产数量" type="number" placeholder="请输入生产数量"/>
                <van-field class="field1" v-model="valueCheckNum" label="检验数量" type="number" placeholder="请输入检验数量"/>
            </van-cell-group>
        </div>


        <p class="ptitle">--检验结果</p>
        <!--     3   检验结果输入-->
        <div class="divconform1">
            <van-radio-group v-model="checkStatu" direction="horizontal">
                <van-radio class="vanradio" name="1" icon-size="4vw" checked-color="greenyellow">
                    合格
                </van-radio>
                <div class="divdivender1"></div>
                <van-radio class="vanradio" name="2" icon-size="4vw" checked-color="greenyellow">异常
                </van-radio>
            </van-radio-group>
        </div>


        <!--        分隔条-->
        <div class="divdivender"></div>

        <!--     4   检验说明-->
        <p class="ptitle">--检验说明</p>
        <!--        检验说明，输入框-->
        <van-field class="field1"
                   v-model="checkNote"
                   size="large"
                   rows="3"
                   autosize
                   label=""
                   label-width="0"
                   type="textarea"
                   maxlength="50"
                   placeholder="请输入检验说明（如需要）"/>


        <!--5        图片证据，标题-->
        <p class="ptitle">--图片证据（如需要）</p>

        <!--        图片上传模块-->
        <div class="img">
            <van-uploader :before-read="beforeRead" :after-read="afterRead" id="uploads" v-model="fileList" multiple :max-count="2"
                          @delete="onDelete"/>
        </div>

        <!--  6   保存按钮-->
        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="saveBtn" :disabled="!quitShow">保存并退出</van-button>
        </div>


    </div>
</template>

<script>
    import Toast from "vant/lib/toast";

    export default {
        name: "CheckPage.vue",
        data() {
            return {
                userName: '',//用户名
                auditNum: '',//审核表编号
                token: '',//验证令牌，key为用户名
                checkNum: 1,//页面编号
                storage: '',//sessionStorage
                lastShow: true,//上一页是否显示
                nextShow: true,//下一页是否显示
                quitShow: true,//退出按钮是否显示

                checkType: '0',//检验模式选择radio,抽检：1，首检：2，中检：3，末检：4
                valuePartNum: '',//零件号
                valueProuductNum: '',//产品生产数量
                valueCheckNum: '',//检验数量
                checkStatu: '0',//检验结果选择radio,合格：1,不合格：2
                checkNote: '',//检验信息备注
                fileList: [],//检验图片存放列表

                valueRen: '',//用户选择审核范围；
                showPickerRen: false,
                selectPartNum: '',
                checkInfo: {//返回后端数据库检验信息
                    userName: '',
                    auditNum: '',
                    checkPage: '',//当前页码
                    checkType: '',//检验模式
                    partNum: '',//零件号
                    productNum: '',//生产数量
                    checkNum: '',//检验数量
                    checkStatu: '',//检验结果
                    checkNote: '',//检验信息备注
                    produceTime: '',//生产时间
                    checkTime: '',//检验时间,excel用
                },
                checkPhoto: {//检验图片：回传服务器的JOSN对象，经base64转码并去头部的。
                    userName: '',
                    checkType: '',
                    partNum: '',
                    produceTime: '',
                    checkPhotoList: [],
                },
                storage:'',

                picValue: {//indexedDB存放对象
                    id: '',
                    picList: ''
                },
                indexedDB: '',//indexedDB
                inspectDB: '',//indexedDB
                tableName: 'check',
                version: 2,//indexedDB版本号
                notSupportIndexed: true,//是否支持indexedDB
                quality: 0.8,//图片压缩质量
                comQuality: 2,//图片长宽比例
            };
        },
        created() {
            if (sessionStorage) {
                this.storage = sessionStorage;
            }
            this.lStorage = localStorage;

            //从localStorage获取审核表编号和用户名
            this.userName = this.lStorage.getItem("userName");
            this.auditNum = this.lStorage.getItem("auditNum");
            this.token = this.lStorage.getItem("auditWay");

            //indexedDB初始化
            this.openDB();

            //刷新后，仍保留当前页码
            if (this.storage.getItem('checkNum') > 1) {
                this.checkNum = this.storage.getItem('checkNum');
            } else {
                this.checkNum = 1;
            }

            //保留this,也可以用箭头函数
            const _this = this;
        },
        methods: {
            onConfirmRen(value) {
                this.valueRen = value;

                //将审核范围存入localStorage；
                this.storage.setItem("valueRen", value);
                this.showPickerRen = false;
            },
            /*
            * 点击下一页，处理逻辑：
            * 1-处理本页内容
            * 1.1 判断是否选择了各种数据
            * 1.2 将各输入框数据，放入checkInfo中，返回后端用
            * 1.3 将各种信息，放入sessionStorage中，页面切换调用
            *     文字信息和图片分开处理
            * 1.4 数据和图片分别存入数据库
            *     文字信息和图片分开处理
            *
            * 2-处理下一页内容
            * 2.1 页码自增
            * 2.2 页码放入sessionStorage中
            * 2.3 清空各类输入框信息
            * 2.4 查看sessionStorage中，是否有数据，如有数据，调取
            *
            * */
            async nextPageClick() {
                const _this = this;
                this.lastShow = true;
                this.quitShow = true;

                //1.1 判断是否选择了各种数据
                if (this.checkType > 0) {
                    if (this.checkStatu > 0) {
                        if ((this.valuePartNum.length > 0) && (this.valueProuductNum.length > 0) && (this.valueCheckNum.length > 0)) {

                            this.valuePartNum = this.valuePartNum.replace(/\//g, '-');
                            //处理本页内容
                            // 1.2 将各输入框数据，放入checkInfo中，返回后端用
                            this.checkInfo.userName = this.userName;
                            this.checkInfo.auditNum = this.auditNum;
                            this.checkInfo.checkPage = this.checkNum;
                            this.checkInfo.checkType = this.checkType;
                            this.checkInfo.partNum = this.valuePartNum;
                            this.checkInfo.productNum = this.valueProuductNum;
                            this.checkInfo.checkNum = this.valueCheckNum;
                            this.checkInfo.checkStatu = this.checkStatu;
                            this.checkInfo.checkNote = this.checkNote;
                            let checkDate = new Date();
                            this.checkInfo.produceTime = checkDate.getHours() + "-" + parseInt(checkDate.getMinutes() / 10);
                            this.checkInfo.checkTime = checkDate.getHours() + ":" + parseInt(checkDate.getMinutes());

                            // 1.3 将各种信息，放入sessionStorage中，页面切换调用
                            this.storage.setItem('checkType' + this.checkNum, this.checkType);
                            this.storage.setItem('checkPartNum' + this.checkNum, this.valuePartNum);
                            this.storage.setItem('checkProuductNum' + this.checkNum, this.valueProuductNum);
                            this.storage.setItem('checkCheckNum' + this.checkNum, this.valueCheckNum);
                            this.storage.setItem('checkStatu' + this.checkNum, this.checkStatu);
                            this.storage.setItem('checkNote' + this.checkNum, this.checkNote);


                            // 获取localStorage中图片数据，并存入fileList中(点击上一页后，再点击下一页，如果未
                            // 重新选择图片时使用
                            if ((this.fileList != null) && (this.fileList.length == 0)) {
                                if (this.storage.getItem('checkPic' + this.checkNum + 0) != null) {
                                    var jsons = this.storage.getItem('checkPic' + this.checkNum);
                                    this.fileList = JSON.parse(jsons);
                                }
                            }

                            // 1.4 数据和图片分别存入数据库
                            var res = await this.$http.post('/check/insert', this.checkInfo,{headers:{
                                'token':this.token}});
                            if (this.fileList.length > 0) {
                              await this.uploadPic();
                            }

                            //处理下一页内容
                            // 2.1 页码自增
                            this.checkNum++;

                            // 2.2 页码放入sessionStorage中
                            this.storage.setItem('checkNum', this.checkNum);

                            // 2.3 清空各类输入框信息
                            this.checkType = 0;
                            this.valuePartNum = '';
                            this.valueProuductNum = '';
                            this.valueCheckNum = '';
                            this.checkStatu = 0;
                            this.checkNote = '';
                            this.fileList = [];

                            // 2.4 查看sessionStorage中，是否有数据，如有数据，调取
                            if ((this.storage.getItem('checkType' + this.checkNum) != null) && (this.storage.getItem('checkType' + this.checkNum) > 0)) {
                                this.checkType = this.storage.getItem('checkType' + this.checkNum);
                            }
                            if ((this.storage.getItem('checkPartNum' + this.checkNum) != null) && (this.storage.getItem('checkPartNum' + this.checkNum).length > 0)) {
                                this.valuePartNum = this.storage.getItem('checkPartNum' + this.checkNum);
                            }
                            if ((this.storage.getItem('checkProuductNum' + this.checkNum) != null) && (this.storage.getItem('checkProuductNum' + this.checkNum).length > 0)) {
                                this.valueProuductNum = this.storage.getItem('checkProuductNum' + this.checkNum);
                            }
                            if ((this.storage.getItem('checkCheckNum' + this.checkNum) != null) && (this.storage.getItem('checkCheckNum' + this.checkNum).length > 0)) {
                                this.valueCheckNum = this.storage.getItem('checkCheckNum' + this.checkNum);
                            }
                            if ((this.storage.getItem('checkStatu' + this.checkNum) != null) && (this.storage.getItem('checkStatu' + this.checkNum) > 0)) {
                                this.checkStatu = this.storage.getItem('checkStatu' + this.checkNum);
                            }
                            if ((this.storage.getItem('checkNote' + this.checkNum) != null) && (this.storage.getItem('checkNote' + this.checkNum).length > 0)) {
                                this.checkNote = this.storage.getItem('checkNote' + this.checkNum);
                            }

                            if (!this.notSupportIndexed) {
                                this.queryDB(this.checkNum);
                            }
                        } else {
                            Toast.fail('请将检验信息输入完整');
                        }
                    } else {
                        Toast.fail('请选择检验结果');
                    }
                } else {
                    Toast.fail('请选择检验类型');
                }
            },
            /*
       * 点击上一页，处理逻辑：
       * 1-处理本页内容
       * 1.1 判断是否选择了各种数据
       * 1.2 将各输入框数据，放入checkInfo中，返回后端用
       * 1.3 将各种信息，放入sessionStorage中，页面切换调用
       *     文字信息和图片分开处理
       * 1.4 数据和图片分别存入数据库
       *     文字信息和图片分开处理
       *
       * 2-处理上一页内容
       * 2.1 页码自减
       * 2.2 页码放入sessionStorage中
       * 2.3 清空各类输入框信息
       * 2.4 查看sessionStorage中，是否有数据，如有数据，调取
       *
       * */
            async lastPageClick() {
                const _this = this;
                this.nextShow = true;
                this.quitShow = true;

                //1.1 判断是否选择了各种数据
                if (this.checkType > 0) {
                    if (this.checkStatu > 0) {
                        if ((this.valuePartNum.length > 0) && (this.valueProuductNum.length > 0) && (this.valueCheckNum.length > 0)) {

                            this.valuePartNum = this.valuePartNum.replace(/\//g, '-');
                            //处理本页内容
                            // 1.2 将各输入框数据，放入checkInfo中，返回后端用
                            this.checkInfo.userName = this.userName;
                            this.checkInfo.auditNum = this.auditNum;
                            this.checkInfo.checkPage = this.checkNum;
                            this.checkInfo.checkType = this.checkType;
                            this.checkInfo.partNum = this.valuePartNum;
                            this.checkInfo.productNum = this.valueProuductNum;
                            this.checkInfo.checkNum = this.valueCheckNum;
                            this.checkInfo.checkStatu = this.checkStatu;
                            this.checkInfo.checkNote = this.checkNote;

                            let checkDate = new Date();
                            this.checkInfo.produceTime = checkDate.getHours() + "-" + parseInt(checkDate.getMinutes() / 10);
                            this.checkInfo.checkTime = checkDate.getHours() + ":" + parseInt(checkDate.getMinutes());

                            // 1.3 将各种信息，放入sessionStorage中，页面切换调用
                            this.storage.setItem('checkType' + this.checkNum, this.checkType);
                            this.storage.setItem('checkPartNum' + this.checkNum, this.valuePartNum);
                            this.storage.setItem('checkProuductNum' + this.checkNum, this.valueProuductNum);
                            this.storage.setItem('checkCheckNum' + this.checkNum, this.valueCheckNum);
                            this.storage.setItem('checkStatu' + this.checkNum, this.checkStatu);
                            this.storage.setItem('checkNote' + this.checkNum, this.checkNote);


                            // 1.4 数据和图片分别存入数据库
                            //1.4.1 数据存入数据库
                            var res = await this.$http.post('/check/insert', this.checkInfo,{headers:{
                                'token':this.token}});
                            if (this.fileList.length > 0) {
                              await this.uploadPic();
                            }

                            //处理下一页内容
                            // 2.1 页码自增
                            if (this.checkNum > 1) {
                                this.checkNum--;
                            } else {
                                Toast.fail('已是第一页')
                                this.lastShow = false;
                            }

                            // 2.2 页码放入sessionStorage中
                            this.storage.setItem('checkNum', this.checkNum);

                            // 2.3 清空各类输入框信息
                            this.checkType = 0;
                            this.valuePartNum = '';
                            this.valueProuductNum = '';
                            this.valueCheckNum = '';
                            this.checkStatu = 0;
                            this.checkNote = '';
                            this.fileList = [];

                            // 2.4 查看sessionStorage中，是否有数据，如有数据，调取
                            if ((this.storage.getItem('checkType' + this.checkNum) != null) && (this.storage.getItem('checkType' + this.checkNum) > 0)) {
                                this.checkType = this.storage.getItem('checkType' + this.checkNum);
                            }
                            if ((this.storage.getItem('checkPartNum' + this.checkNum) != null) && (this.storage.getItem('checkPartNum' + this.checkNum).length > 0)) {
                                this.valuePartNum = this.storage.getItem('checkPartNum' + this.checkNum);
                            }
                            if ((this.storage.getItem('checkProuductNum' + this.checkNum) != null) && (this.storage.getItem('checkProuductNum' + this.checkNum).length > 0)) {
                                this.valueProuductNum = this.storage.getItem('checkProuductNum' + this.checkNum);
                            }
                            if ((this.storage.getItem('checkCheckNum' + this.checkNum) != null) && (this.storage.getItem('checkCheckNum' + this.checkNum).length > 0)) {
                                this.valueCheckNum = this.storage.getItem('checkCheckNum' + this.checkNum);
                            }
                            if ((this.storage.getItem('checkStatu' + this.checkNum) != null) && (this.storage.getItem('checkStatu' + this.checkNum) > 0)) {
                                this.checkStatu = this.storage.getItem('checkStatu' + this.checkNum);
                            }
                            if ((this.storage.getItem('checkNote' + this.checkNum) != null) && (this.storage.getItem('checkNote' + this.checkNum).length > 0)) {
                                this.checkNote = this.storage.getItem('checkNote' + this.checkNum);
                            }

                            if (!this.notSupportIndexed) {
                                this.queryDB(this.checkNum);
                            }

                        } else {
                            Toast.fail('请将检验信息输入完整');
                        }
                    } else {
                        Toast.fail('请选择检验结果');
                    }
                } else {
                    Toast.fail('请选择检验类型');
                }
            },
            beforeRead(file){
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

                //1 重置审核图片sendPic信息
                this.checkPhoto.userName = this.userName;//设置发送页面用户名
                this.checkPhoto.checkType = this.checkType;
                this.checkPhoto.partNum = this.valuePartNum;
                let checkDate = new Date();
                this.checkPhoto.produceTime = checkDate.getHours() + "-" + parseInt(checkDate.getMinutes() / 10);
                this.checkPhoto.checkPhotoList = [];//重置发送照片列表
                let dataURL;//画布的URL
                let tempImgList = [];//临时生成img的数组，用于画布canvas使用；
                let promiseList = [];//promis数组，避免不同步；

                //2 遍历fileList
                for (let i = 0; i < this.fileList.length; i++) {

                    //2.1 判断图片是否为file类型，是则传至服务器，否则不上传
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
                                    tConvas.width = tempImgList[i].width / this.comQuality;//设置画布宽度
                                    tConvas.height = tempImgList[i].height / this.comQuality;//设置画布高度

                                    //2.8 将图片载入画布，并压缩图片
                                    ctx.drawImage(tempImgList[i], 0, 0, tempImgList[i].width / this.comQuality, tempImgList[i].height / this.comQuality);//将图片载入画布

                                    //2.9 得到画布的URL,并去除其头部(base64)
                                    dataURL = tConvas.toDataURL('image/jpeg', this.quality);//得到画布的URL
                                    let s;
                                    s = dataURL.replace(/^data:image\/\w+;base64,/, "");//去base64头部

                                    //2.10 将去除头部的图片放入auditPhotoList中
                                    this.checkPhoto.checkPhotoList.push(s);//将去头部base64图片，放入图片列表

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
                                    this.checkPhoto.checkPhotoList.push(s);//将去头部base64图片，放入图片列表

                                    //2.11 图片处理成功后，将promist的resolve设为OK
                                    resolve("ok");
                                };
                            });
                        }
                    }
                }
                //2.12 promiseList全部处理完成，即fileList中图片全部放入sendPic中后，将图片上传至服务器
                Promise.all(promiseList).then(() => {
                    this.$http.post('/checkphoto/insert', this.checkPhoto,{headers:{
                            'token':this.token}}).then(function (resp) {
                    });
                });
            },

            //返回按钮，点击返回首页
            async clickReturn() {
                this.$http.get('basicinfo/clearData',{params: {userName: this.userName}});
                //清除sessionStorage中的内容
                this.storage.clear();
                setTimeout(() => {
                    this.$router.push({
                        path: '/jxLogin'
                    });
                }, 1000);
            },

            //保存按钮，点击后，保存最后一页数据，将数据发送至数据库，并跳转至尾页
            async saveBtn() {
                //1.1 判断是否选择了各种数据
                if (this.checkType > 0) {
                    if (this.checkStatu > 0) {
                        if ((this.valuePartNum.length > 0) && (this.valueProuductNum.length > 0) && (this.valueCheckNum.length > 0)) {
                            this.valuePartNum = this.valuePartNum.replace(/\//g, '-');

                            this.quitShow = false;
                            //处理最后一页内容
                            // 1 将各输入框数据，放入checkInfo中，返回后端用
                            this.checkInfo.userName = this.userName;
                            this.checkInfo.auditNum = this.auditNum;
                            this.checkInfo.checkPage = this.checkNum;
                            this.checkInfo.checkType = this.checkType;
                            this.checkInfo.partNum = this.valuePartNum;
                            this.checkInfo.productNum = this.valueProuductNum;
                            this.checkInfo.checkNum = this.valueCheckNum;
                            this.checkInfo.checkStatu = this.checkStatu;
                            this.checkInfo.checkNote = this.checkNote;

                            let checkDate = new Date();
                            this.checkInfo.produceTime = checkDate.getHours() + "-" + parseInt(checkDate.getMinutes() / 10);
                            this.checkInfo.checkTime = checkDate.getHours() + ":" + parseInt(checkDate.getMinutes());

                            // 2 数据和图片分别存入数据库
                            var res = await this.$http.post('/check/insert', this.checkInfo,{headers:{
                                    'token':this.token}});
                            if (this.fileList.length > 0) {
                               await this.uploadPic();
                            }

                            //清除sessionStorage中的内容
                            this.storage.clear();

                            //  清空indexedDB数据
                            if (!this.notSupportIndexed) {
                                this.$indexOpr.shutdownDB(this.indexedDB, this.inspectDB, this.tableName);
                            }

                            // 3 清空登录数据，并跳转至最后一页
                            this.$http.get('basicinfo/clearData',{params: {userName: this.userName}});
                            setTimeout(() => {
                                this.$router.push({
                                    path: '/lastpage'
                                });
                            }, 2000);

                        } else {
                            Toast.fail('请将检验信息输入完整');
                        }
                    } else {
                        Toast.fail('请选择检验结果');
                    }
                } else {
                    Toast.fail('请选择检验类型');
                }
            },
            sleep(n) {
                var start = new Date().getTime();
                while (true) {
                    if (new Date().getTime() - start > n*1000) {
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
                    let reqDB = this.indexedDB.open(this.userName+'check', this.version);

                    //2 打开请求的处理结果，有三种结果：失败、成功、阻止
                    //2.1 请求成功
                    reqDB.onsuccess = (e) => {
                        this.inspectDB = e.target.result;

                        // this.lStorage.setItem("inspectVersion",s);
                        console.log("请求成功" + this.inspectDB.version);
                        //查询是否有数据，有则赋给fileList
                        this.queryDB(this.checkNum);
                        ++this.version;
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

        },
    };

</script>

<style scoped lang="less">
    .field1 {
        margin: 0vw;
        color: chocolate;
        font-size: 3.5vw;
    }

    .divinput {
        margin: 0vw;
        font-size: 4vw;
        color: chocolate;
    }
    .divinputP{
        margin: 0;
        margin-left: 9vw;
        display: flex;
        flex-direction: row;
        justify-content: left;
        font-size: 3.5vw;
    }
    .partNumInputDatalist{
        margin: 0;
        border-width: 0;
        color: black;
        input::-webkit-input-placeholder{
            color:#fffafa;
        }
        input::-moz-placeholder{   /* Mozilla Firefox 19+ */
            color:#fffafa;
        }
        input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
            color:#fffafa;
        }
        input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
            color:#fffafa;
        }
    }

    .ptitle {
        margin-left: 3vw;
        margin-top: 2vw;
        margin-bottom: 2vw;
        text-align: left;
        font-size: 4vw;
        font-weight: normal;
        color: chocolate;
    }

    .divdivender {
        background-color: rgba(188, 193, 213, 0.28);
        height: 0.5vw;
        margin-top: 0vw;
        margin-bottom: 0vw;
    }

    .divdivender1 {
        background-color: white;
        width: 5vw;
    }

    .vanradio {
        font-size: 3vw;
    }

    .divconform1 {
        margin-left: 4vw;
        margin-top: 2vw;
        margin-bottom: 3vw;
        display: flex;
        justify-content: left;
    }

    .divconform {
        margin-left: 4vw;
        margin-top: 6vw;
        margin-bottom: 3vw;
        display: flex;
        justify-content: left;

        p {
            margin: 0vw;
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

    //logo样式
    .img {
        display: flex;
        margin-left: 3vw;
        margin-top: 0vw;
        justify-content: left;
    }

    .divcontent {
        height: 6vw;
        margin: 6vw;
        margin-left: 3vw;
        margin-top: 3vw;
        margin-bottom: 0vw;
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
            margin-top: 2vw;
            margin-left: 0vw;
            margin-bottom: 2vw;
            text-align: left;
            font-size: 4vw;
            font-weight: normal;
            color: chocolate;
        }


    }
</style>
