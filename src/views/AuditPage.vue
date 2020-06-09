<template>
    <div>
        <!--1        头部-->
        <div class="top">
            <p>分层审核</p>
            <div>
                <button @click="clickReturn">首 页</button>
                <button @click="LastPageClick">上一页</button>
                <button @click="NextPageClick">下一页</button>
            </div>
        </div>

        <!--2  审核内容 -->
        <div class="divcontent" v-model="num">
            <span>{{num}}</span>
            <p>{{auditItem.auditItem}}</p>
        </div>

        <!--        符合性判断-->
        <div class="divconform">
            <van-radio-group v-model="radio" direction="horizontal">
                <van-radio name="1" icon-size="2vw" checked-color="greenyellow">符合</van-radio>
                <van-radio name="2" icon-size="2vw" checked-color="greenyellow">不符合</van-radio>
            </van-radio-group>
        </div>

        <!--        分隔条-->
        <div class="divdivender"></div>


        <!--3        图片证据，标题-->
        <p class="ptitle">图片证据</p>

        <!--        图片上传模块-->
        <div class="img">
            <van-uploader :after-read="afterRead" id="uploads" v-model="fileList" multiple :max-count="2"/>
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
                   placeholder="请输入审核内容"
        />

        <!--        分隔条-->
        <div class="divdivender"></div>

        <!--5 确认部分-->
        <div class="divfinal">
            <van-button plain icon="star-o" square color="#90EE90" type="primary" size="small">保存并提交</van-button>
<!--            <p></p>-->
<!--            <van-button plain icon="coupon" square color="#90EE90" type="primary" size="small">提交</van-button>-->
            <div style="width: 30vw"></div>
            <van-icon name="checked" size="6vw" color="#90EE90"/>
            <div style="width: 5vw">12</div>
            <van-icon name="clear" size="6vw" color="#ff0000"/>
            <div style="width: 5vw">22</div>
            <van-icon name="clock" size="6vw" color="#D3D3D3"/>
            <div style="width: 5vw">22</div>
        </div>

        <img id='img1' border="0" src='' alt="Pulpit rock" width="304" height="228">

        <button @click="tempaa">测试</button>
        <button @click="tempss">清空localStorage</button>
    </div>

</template>

<script>
    import axios from "axios";

    export default {
        data() {
            return {
                clickNum: '0',//判断是否点了上一页
                num: '1',//页码
                auditItem: '',//审核内容
                radio: '0',//符合性判断，vant的单选框返回值
                storage: '',//存储页码至localStorage
                picStorage: '',//存储图片至localStorage
                message: '',//审核发现
                file: '',//vant的uploader返回文件
                auditInfo: {//审核内容：回传至服务器的JSON对象，全部为审核内容
                    userName: '',
                    auditFind: '',
                    auditCon: '',
                    auditPage: ''
                },
                sendPic: {//审核图片：回传服务器的JOSN对象，经base64转码并去头部的。
                    auditPage: '',
                    userName: '',
                    auditPhoto: [],
                },
                fileList: [],
            };
        },
        created() {
            //判断浏览器，是否支持localstorage
            if (localStorage) {
                this.storage = localStorage;
                this.picStorage = localStorage;
            }
            console.log("-----created this num------" + this.num);
            //刷新后，仍保留当前页
            if (this.storage.getItem('num') > 1) {
                this.num = this.storage.getItem('num');
                this.clickNum = this.storage.getItem('clickNum');
                console.log("-----created storage  num ------" + this.num);
                console.log("-----created storage   clickNUm------" + this.clickNum);
            } else {
                this.num = 1;
                this.clickNum = 0;
            }

            //保留this,也可以用箭头函数
            const _this = this;

            //AXIOS获取审核项目
            this.$http.get('/audititem/showone?id=' + this.num).then(function (resp) {
                _this.auditItem = resp.data;
                console.log("--------created-------" + resp.data.auditItem);
            });

            console.log("=============" + this.$route.query.valueObj);


        }, mounted() {
            console.log("--------mounted-------");
        },
        methods: {
            //点击下一页
            async NextPageClick() {

                const _this = this;
                this.auditInfo.auditPage = this.num;
                this.auditInfo.auditCon = this.radio;
                this.auditInfo.auditFind = this.message;
                this.auditInfo.userName = "王五";

                console.log("-----by next---num--" + this.num);

                //获取localStorage中数据，并存入fileList中
                if (this.fileList.length == 0) {
                    if (this.picStorage.getItem('pic' + this.num) != null) {
                        var jsons = this.picStorage.getItem('pic' + this.num);
                        this.fileList = JSON.parse(jsons);
                    }
                }


                //数据存入数据库
                const insertR = await this.$http.post('/auditinfo/insert', this.auditInfo);
                console.log("----by next---fileList-----" + this.fileList);

                if (this.clickNum > 0) {
                    this.clickNum--;
                    this.storage.setItem('clickNum', this.clickNum);
                } else {
                    //图片存入数据库
                    if (this.fileList.length > 0) {
                        this.uploadPic();
                    }
                    console.log("------by next --clickNum---" + this.clickNum);
                }


                //下一页内容
                //数据库获得审核信息
                console.log("------auditInfo.userName---------" + this.auditInfo.userName)
                if (this.num < 40) {
                    this.num++;
                    this.storage.setItem('num', this.num);
                    await this.$http.get('/audititem/showone?id=' + this.num).then(function (resp) {
                        _this.auditItem = resp.data;
                    });
                }

                //获取localStorage中数据，并存入fileList中
                if (this.fileList.length == 0) {
                    if (this.picStorage.getItem('pic' + this.num) != null) {
                        var jsons = this.picStorage.getItem('pic' + this.num);
                        this.fileList = JSON.parse(jsons);
                    }
                }

                //清空列表
                this.fileList = [];

            },

            //点击上一页
            LastPageClick() {
                const _this = this;
                if (this.num > 1) {
                    this.num--;
                    this.clickNum++;
                    this.storage.setItem('num', this.num);
                    this.storage.setItem('clickNum', this.clickNum);
                    this.$http.get('/audititem/showone?id=' + this.num).then(function (resp) {
                        _this.auditItem = resp.data;
                    });
                    console.log("--------By last--num-----" + this.num);
                    console.log("--------By last--clicknum-----" + this.clickNum);
                }
                //清空列表
                this.fileList = [];
                //获取localStorage中数据，并存入fileList中
                if (this.picStorage.getItem('pic' + this.num) != null) {
                    console.log("--------By last 增加-------" + this.num);
                    var jsons = this.picStorage.getItem('pic' + this.num);
                    this.fileList = JSON.parse(jsons);
                }

                // window.location.reload();
            },
            clickReturn() {
                setTimeout(() => {
                    this.$router.push({
                        path: '/login'
                    });
                }, 1000);

            },
            afterRead(file) {
                var s = JSON.stringify(this.fileList);
                this.picStorage.setItem('pic' + this.num, s);

            },
            //测试
            tempaa() {

                console.log("=============" + this.$route.query.valueObj);

            },
            tempss() {
                this.storage.clear();
                this.picStorage.clear();
            },
            uploadPic() {
                this.sendPic.auditPhoto = [];
                this.sendPic.auditPage = this.num;
                for (var i = 0; i < this.fileList.length; i++) {
                    var reader = new FileReader();
                    reader.readAsDataURL(this.fileList[i].file);//用FileReader将图片转成base64
                    var s;
                    reader.onload = (e) => {
                        var base64 = e.target.result;
                        s = base64.replace(/^data:image\/\w+;base64,/, "");//去base64头部
                        this.sendPic.auditPhoto.push(s);
                    };

                }
                reader.onloadend = f => {
                    this.$http.post('/auditphoto/insert', this.sendPic);
                    console.log("-----图片存入数据库i------" + this.sendPic.auditPage);
                }
            },

        },
    };
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
            background-color: #90EE90;
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
            background-color: #90EE90;
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
