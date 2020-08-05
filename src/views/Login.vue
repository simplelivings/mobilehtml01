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


        <!--        4 项目选择器-->
        <van-field
                readonly
                clickable
                name="pickerIte"
                :value="valueIte"
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

        <!--        2 输入框-->
        <div class="divinput">
            <van-cell-group>
                <van-field v-model="valueUser" label="用户名" placeholder="请输入用户名"/>
                <van-field v-model="valuePs" label="密  码" type="password" placeholder="请输入密码"/>
                <van-field v-model="valueObj" label="对  象" placeholder="请输入审核对象：如D11"/>
            </van-cell-group>
        </div>


        <!--        3 范围选择器-->
        <van-field
                readonly
                clickable
                name="pickerRen"
                :value="valueRen"
                label="范  围"
                placeholder="点击选择班组或工段等"
                @click="showPickerRen = true"
        />
        <van-popup v-model="showPickerRen" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="columnsRen"
                    @confirm="onConfirmRen"
                    @cancel="showPickerRen = false"
            />
        </van-popup>


        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="loginBtn">登 录</van-button>
        </div>

        <!--        分割-->
        <div style="height: 60vw"></div>

        <van-button class="superBtn" @click="superBtn" size="small">..</van-button>
        <van-button class="superBtn" @click="weixinBtn" size="large">weixin</van-button>

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
                    userStatu:'0'
                },//POST至服务器数据，含用户名和密码；
                valueUser: '',//用户输入用户名；
                valuePs: '',//用户输入密码；
                valueObj: '',//用户输入审核对象；
                valueRen: '',//用户选择审核范围；
                valueIte: '',//用户选择审核项目；
                valueNum: '',//审核表编号；
                columnsRen: ['班组级', '工段级', '科室级', '部门级', '公司级'],
                columnsIte: ['分层审核', '质量检验', '安全检查', '现场检查', '工艺检查', '综合检查'],
                showPickerRen: false,
                showPickerIte: false,
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
                this.valuePs = this.storage.getItem("password");
            }

            if (this.storage.getItem("valueObj") != null) {
                this.valueObj = this.storage.getItem("valueObj");
            }

            if (this.storage.getItem("valueRen") != null) {
                this.valueRen = this.storage.getItem("valueRen");
            }

            if (this.storage.getItem("valueIte") != null) {
                this.valueIte = this.storage.getItem("valueIte");
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

                //向服务器发送请假，并将用户名与密码传给服务器，成功后服务器返回1，否则返回0；
                var tempdata = await this.$http.post('basicinfo/login', this.model);

                var auditNum = tempdata.data.auditNum;

                var token = tempdata.data.token;

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
                    if (auditNum >=0 && auditNum <=34){
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
                    }else if (auditNum ==49){
                        setTimeout(() => {
                            this.$router.push({
                                path: '/checkStatus',
                                query: {
                                    valueNum: auditNum.data,
                                    valueUser: this.valueUser
                                }
                            });
                        }, 2000);
                        Toast.success('登录成功');
                    }else {
                        Dialog({message: '请选择审核对象'});

                    }
                } else {
                    Dialog({message: '请输入用户名'});
                }


                console.log("----" + this.model.userName);
            },
            superBtn() {
                setTimeout(() => {
                    this.$router.push({
                        path: '/superpage',
                    });
                }, 2000);
                Toast.success('super');
            },
            quitBtn() {
                // window.opener = null;
                // window.open("", "_self");
                // window.close();
                setTimeout(() => {
                    this.$router.push({
                        path: '/lastpage'
                    });
                }, 2000);
            },
            registerBtn() {
                setTimeout(() => {
                    this.$router.push({
                        path: '/register',
                    });
                }, 2000);
                Toast.success('开始注册');
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


    .superBtn {
        background-color: white;
        color: lightgrey;
        border: 0vw;
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
