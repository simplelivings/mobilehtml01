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
                <van-field
                        v-model="valueUser"
                        label="用户名"
                        placeholder="请输入用户名"/>
                <van-field v-model="valuePs"
                           label="密  码"
                           type="password"
                           placeholder="请输入密码"/>
            </van-cell-group>
        </div>


        <!--        3 项目选择器-->
        <van-field
                readonly
                clickable
                name="pickerIte"
                :value="valueIte"
                v-show="valueIteShow"
                label="项  目"
                placeholder="点击选择审核项目"
                @click="showPickerIte=true"
        />
        <van-popup v-model="showPickerIte" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="columnsIte"
                    @confirm="onConfirmIte"
                    @cancel="showPickerIte = false"
            />
        </van-popup>


        <!--        4 范围选择器-->
        <van-field
                readonly
                clickable
                name="pickerRen"
                :value="valueRen"
                label="范  围"
                placeholder="点击选择班组或工段等"
                @click="showPickerRen = true"
                v-show="valueRenShow"
        />
        <van-popup v-model="showPickerRen" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="columnsRen"
                    @confirm="onConfirmRen"
                    @cancel="showPickerRen = false"
            />
        </van-popup>

        <!--        5 对象选择器-->
        <van-field v-model="valueObj" label="对  象" v-show="valueObjShow" placeholder="请输入审核对象：如D11"/>


        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="loginBtn">登 录</van-button>
        </div>

        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="passwordBtn">忘记密码</van-button>
        </div>

        <!--        <van-button class="superBtn" @click="superBtn" size="small">..</van-button>-->
<!--        <van-button class="superBtn" @click="weixinBtn" size="large">weixin</van-button>-->

    </div>
</template>

<script CHARSET="UTF-8">
    import Toast from "vant/lib/toast";
    import {Dialog} from "vant";

    export default {
        name: "JxLogin",
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
                valueObj: '',//用户输入审核对象；
                valueRen: '',//用户选择审核范围；
                valueIte: '',//用户选择审核项目；
                valueNum: '',//审核表编号；
                columnsRen: ['班组级', '工段级', '科室级', '部门级', '公司级'],
                columnsIte: ['分层审核', '安全检查', '质量检验', '现场检查', '工艺检查', '综合检查'],
                showPickerRen: false,
                showPickerIte: false,
                valueIteShow: true,
                valueObjShow: true,
                valueRenShow: true,
                storage: '',
            };
        },
        created() {

            //判断浏览器，是否支持localstorage
            if (localStorage) {
                this.storage = localStorage;
            }

            //刷新或下次登录后，保留上次登录信息；
            if (this.storage.getItem("userName") != null) {
                this.valueUser = this.storage.getItem("userName");
            }

            if (this.storage.getItem("password") != null) {
                this.valuePs = this.storage.getItem("password")
            }

            if (this.storage.getItem("valueObj") != null) {
                this.valueObj = this.storage.getItem("valueObj");
            }

            if (this.storage.getItem("valueRen") != null) {
                this.valueRen = this.storage.getItem("valueRen");
            }


            if (this.storage.getItem("valueIte") != null) {
                this.valueIte = this.storage.getItem("valueIte");
                if (this.valueIte != "分层审核") {
                    this.valueRenShow = false;
                    this.valueObjShow = false;
                } else {
                    this.valueRenShow = true;
                    this.valueObjShow = true;
                }
            }

            //将登陆界面编号，放入localStorage中，以区分返回界面
            this.storage.setItem("loginNum",1);
        },
        methods: {
            weixinBtn() {
                // this.storage.remove("*");
                localStorage.clear();
                // window.location.href = "weixin://";
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
                if (this.valueIte != "分层审核") {
                    this.valueRenShow = false;
                    this.valueObjShow = false;
                } else {
                    this.valueRenShow = true;
                    this.valueObjShow = true;
                }
            },
            //忘记密码按钮
            passwordBtn() {
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
                var tempdata = await this.$http.post('basicinfo/jxLogin', this.model);

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
                this.storage.setItem("valueIte", this.valueIte);
                this.storage.setItem("valueRen", this.valueRen);
                this.storage.setItem("valueObj", this.valueObj);


                //判断服务器返回值，成功后跳转至审核页面，失败后显示失败提示信息；
                if (this.valueUser.length > 0) {
                    if (auditNum >= 0 && auditNum <= 34) {//分层审核
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
                    } else if (auditNum == 49) {//质量检验
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
                    } else if (auditNum == 35) {//安全检查
                        setTimeout(() => {
                            this.$router.push({
                                path: '/inspectPage',
                            });
                        }, 2000);
                        Toast.success('登录成功');
                    } else if (auditNum == 101) {//已有用户
                        Dialog({message: '重复登录'});
                    } else if (auditNum == 103) {
                        Dialog({message: '密码输入次数过多，请24小时后重试或重置密码'});
                    } else if (auditNum == 102) {
                        Dialog({message: '用户名不存在'});
                    } else {
                        Dialog({message: '密码错误'});
                    }
                } else {
                    Dialog({message: '请输入用户名'});
                }
            },

            //超级按钮，更新审核项目用
            superBtn() {
                setTimeout(() => {
                    this.$router.push({
                        path: '/superpage',
                    });
                }, 2000);
                Toast.success('super');
            },

            //退出按钮
            quitBtn() {
                //清除用户登录与审核信息，并退出窗口，未清除redis信息
                this.$quitAudit(this.valueUser);
            },

            //注册按钮
            registerBtn() {
                setTimeout(() => {
                    this.$router.push({
                        path: '/jxRegister',
                    });
                }, 2000);
                Toast.success('开始注册');
            }, sleep(n) {
                var start = new Date().getTime();
                console.log('休眠前：' + start);
                while (true) {
                    if (new Date().getTime() - start > n * 1000) {
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

