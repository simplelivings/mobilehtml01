<template>
    <div>

        <div style="height: 10vw"></div>
        <!--1        头部-->
        <div class="top">
            <p></p>
            <p>请输入以下信息</p>
            <p></p>
            <p></p>
            <p></p>
            <div>
                <van-button @click="registerBtn">注册</van-button>
                <van-button @click="quitBtn">退出</van-button>
            </div>
        </div>
        <!--        分割-->
        <div style="height: 13vw"></div>



        <!--        2 输入框-->
        <div class="divinput">
            <van-cell-group>
                <van-field v-model="valueUser" label="用户名" placeholder="请输入用户名"/>
                <van-field v-model="valuePs" label="密  码" type="password" placeholder="请输入密码"/>
                <van-field v-model="valueObj" label="对  象" v-show="valueObjShow" placeholder="请输入审核对象：如D11"/>
            </van-cell-group>
        </div>


        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="loginBtn">登 录</van-button>
        </div>

        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="passwordBtn">忘记密码</van-button>
        </div>

        <!--        分割-->
        <div style="height: 10vw"></div>
        <div class="tipWord">
            <img alt="Vue logo" width="50vw" src="../assets/lastapplogo.png">
            <p>无备份</p>
            <p>确保您的信息安全</p>
        </div>


        <div style="height: 15vw"></div>

        <div class="tipWord2" v-show="tipShow">
            <p>如有问题，可联系客服:</p>
        </div>

        <div class="tipWord3" v-show="tipShow">
            <p>微信： naturalife001</p>
            <p>Q Q: 157652879</p>
            <p>Email: 157652879@qq.com</p>
        </div>

<!--        <van-button class="superBtn" @click="superBtn" size="small">..</van-button>-->
        <div class="border">
            <van-button class="superBtn" @click="superBtn" v-show="true" size="small">weixin</van-button>
        </div>

    </div>
</template>

<script CHARSET="UTF-8">
    import Toast from "vant/lib/toast";
    import {Dialog} from "vant";

    export default {
        name: "Login",
        data() {
            return {
                model: {
                    userName: '',
                    password: '',
                    auditObj: '',
                    auditRen: '',
                    auditIte: '',
                    userStatu: '',
                },//POST至服务器数据，含用户名和密码；
                valueUser: '',//用户输入用户名；
                valuePs: '',//用户输入密码；
                valueObj: 'D11',//用户输入审核对象；
                valueRen: '班组级',//用户选择审核范围；
                valueIte: '安全检查',//用户选择审核项目；
                valueNum: '',//审核表编号；
                tipShow: true,
                valueObjShow:false,
                storage:'',
                lStorage:'',
            };
        },
        created() {

            //判断浏览器，是否支持localstorage
            if (localStorage) {
                this.storage = localStorage;
            }

            if (sessionStorage){
                this.lStorage = sessionStorage;
            }

            this.lStorage.clear();

            //刷新或下次登录后，保留上次登录信息；
            if (this.storage.getItem("userName") != null) {
                this.valueUser = this.storage.getItem("userName");
            }

            if (this.storage.getItem("password") != null) {
                this.valuePs = this.storage.getItem("password");
            }

            if (this.storage.getItem("valueObj") != null) {
                this.valueObj = this.storage.getItem("valueObj");
            }

            if (this.storage.getItem("valueRen") != null) {
                this.valueRen = this.storage.getItem("valueRen");
            }

            //将登陆界面编号，放入localStorage中，以区分返回界面
            this.storage.setItem("loginNum",2);


            if (this.storage.getItem("valueIte") != null) {
                // this.valueIte = this.storage.getItem("valueIte");
                if (this.valueIte!="分层审核"){
                    this.valueObjShow = false;
                }else {
                    this.valueObjShow = true;
                }
            }

        },
        methods: {
            weixinBtn(){
                window.location.href="weixin://";
            },
            //选择审核范围后，返回选择值；
            onConfirmRen(value) {
                this.valueRen = value;

                //将审核范围存入localStorage；
                this.storage.setItem("valueRen", value);
                this.showPickerRen = false;
            },

            //选择审核项目后，返回选择值；
            onConfirmIte(value) {
                this.valueIte = value;

                //将审核项目存入localStorage；
                this.storage.setItem("valueIte", value);
                this.showPickerIte = false;
                if (this.valueIte!="分层审核"){
                    this.valueRenShow = false;
                    this.valueObjShow = false;
                }else {
                    this.valueRenShow = true;
                    this.valueObjShow = true;
                }
            },
            passwordBtn(){
                setTimeout(() => {
                    this.$router.push({
                        path: '/passwordPage',
                    });
                }, 2000);
            },

            //登录按钮点击事件
            async loginBtn() {
                //用户名放入model中，以便POST至服务器；
                this.model.userName = this.valueUser;

                //密码放入model中，以便POST至服务器；
                this.model.password = this.valuePs;

                this.model.auditObj = this.valueObj;

                this.model.auditRen = this.valueRen;

                this.model.auditIte = this.valueIte;

                this.model.userStatu = 1;

                //向服务器发送请求，并将用户名与密码传给服务器，成功后返回auditNum；
                var tempdata = await this.$http.post('basicinfo/login', this.model,{headers:{
                    'token':'cccc0000000'
                    }});

                var auditNum = tempdata.data.auditNum;

                // var token = tempdata.data.token;
                var token = tempdata.headers['token'];


                //将token放入localStorage中
                this.storage.setItem("auditWay", token);

                //将审核表编号，放入localStorage中
                this.storage.setItem("auditNum", auditNum);

                //将用户名存入localStorage；
                this.storage.setItem("userName", this.valueUser);

                //将密码存入localStorage；
                this.storage.setItem("password", this.valuePs);

                //将审核对象存入localStorage；
                this.storage.setItem("valueObj", this.valueObj);


                //判断服务器返回值，成功后跳转至审核页面，失败后显示失败提示信息；
                if (this.valueUser.length > 0) {
                    if (auditNum >=0 && auditNum <=34){//分层审核
                        if (this.valueObj.length > 0) {
                            var reg = new RegExp(/冲|D|焊|W|剪|C|M|钣|E|设备|工装|L|物流|质量|Q/i);
                            if (reg.test(this.valueObj)) {
                                if (this.valueRen.length > 0) {
                                    if (this.valueIte.length > 0) {
                                            setTimeout(() => {
                                                this.$router.push({
                                                    path: '/auditpage',
                                                    query: {
                                                        valueNum: auditNum.data,
                                                        valueUser: this.valueUser
                                                    }
                                                });
                                            }, 2000);
                                            Toast.success('登录成功');
                                    } else {
                                        Dialog({message: '请输入审核项目'});
                                    }
                                } else {
                                    Dialog({message: '请选择审核范围'});
                                }
                            } else {
                                Dialog({message: '请输入正确审核对象：D11或者冲11'});
                            }
                        } else {
                            Dialog({message: '请输入审核对象'});
                        }
                    }else if (auditNum ==49){//质量检验
                        setTimeout(() => {
                            this.$router.push({
                                path: '/checkSelectPage',
                                query: {
                                    valueNum: auditNum.data,
                                    valueUser: this.valueUser
                                }
                            });
                        }, 2000);
                        Toast.success('登录成功');
                    }else if(auditNum == 35){//安全检查
                        setTimeout(() => {
                            this.$router.push({
                                path: '/inspectPage',
                            });
                        }, 2000);
                        Toast.success('登录成功');
                    }
                    else if (auditNum == 101){//已有用户
                        Dialog({message: '重复登录'});
                    }else if (auditNum == 103){
                        Dialog({message: '密码输入次数过多，请24小时后重试或重置密码'});
                    }else if (auditNum == 102){
                        Dialog({message: '用户名不存在'});
                    }
                    else if (auditNum == 105){
                        Dialog.alert({
                            message: '账户已过续费周期，请点击确定，去续费',
                        }).then(() => {
                            // on close
                        });
                    }
                    else if (auditNum == 106){
                        Dialog({message: '您已超过每日许用次数，如想增加次数，请联系客服'});
                    }
                    else {
                        Dialog({message: '密码错误'});
                    }
                } else {
                    Dialog({message: '请输入用户名'});
                }
            },
            superBtn() {
                setTimeout(() => {
                    this.$router.push({
                        path: '/superLogin',
                    });
                }, 2000);
                Toast.success('super');
            },
            quitBtn() {
                //清除用户登录与审核信息，并退出窗口，未清除redis信息
                this.$quitAudit(this.valueUser);
            },
            registerBtn() {
                setTimeout(() => {
                    this.$router.push({
                        path: '/register',
                    });
                }, 2000);
                Toast.success('开始注册');
            },sleep(n) {
                var start = new Date().getTime();
                console.log('休眠前：' + start);
                while (true) {
                    if (new Date().getTime() - start > n*1000) {
                        break;
                    }
                }
                console.log('休眠后：' + new Date().getTime());
            },
        },

    }
</script>

<style scoped lang="less">
    .top {
        background-color: #ffffff;
        height: 12.889vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 4vw;

        p {
            margin-left: 1vw;
            font-size: 4vw;
            font-weight: bold;
            color: #36C364;
        }

        button {
            background-color: #36C364;
            width: 15vw;
            height: 8vw;
            font-size: 3vw;
            color: #ffffff;
            border-radius: 2vw;
            border-color: white;
            text-align: center;
        }

    }
    .tipWord {
        margin-top: 0vw;
        p {
            margin-top: 0vw;
            margin-bottom: 0vw;
            margin-left: 0vw;
            text-align: center;
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
    .border {

        background-color: #ffffff;
        height: 10vw;
        width: 100%;
        display: flex;
        flex-direction: row;
        position: absolute;
        bottom: 0vw;
        /*justify-content: right;*/
        /*align-items: flex-start;*/
        margin-right: 0vw;
        margin-left: 0vw;
        margin-bottom: 0vw;

        button {
            background-color: #ffffff;
            width: 20vw;
            height: 10vw;
            font-size: 3vw;
            color: #ffffff;
            margin-right: 0vw;
            margin-left: 0vw;
            margin-bottom: 0vw;
            border-radius: 2vw;
            border-color: white;
            text-align: center;
        }

    }

    /*.divinput {*/
    /*    height: 25vw;*/
    /*    margin-left: 4vw;*/
    /*    margin-top: 0vw;*/
    /*    display: flex;*/
    /*    flex-direction: row;*/
    /*    flex-wrap: nowrap;*/
    /*    align-items: center;*/
    /*    justify-content: flex-start;*/

    /*    span {*/
    /*        width: 6vw;*/
    /*        height: 4vw;*/
    /*        font-size: 3vw;*/
    /*        text-align: center;*/
    /*        border-radius: 1vw;*/
    /*        color: black;*/
    /*        background-color: #36C364;*/
    /*    }*/
    /*}*/


</style>
