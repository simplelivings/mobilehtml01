<template>
    <div>

        <div style="height: 10vw"></div>
        <!--1        头部-->
        <div class="top">
            <p></p>
            <p>请输入以下注册信息</p>
            <p></p>
            <p></p>
            <p></p>
            <div>
                <van-button @click="quitBtn">退出</van-button>
            </div>
        </div>
        <!--        分割-->
        <div style="height: 13vw"></div>

        <!--        2 输入框-->
        <div class="divinput">

            <van-form>

                <van-field
                        v-model="valueUser"
                        label="用 户 名"
                        placeholder="请输入用户名"
                        @blur="userNameBlur"
                        :rules="[{ validator: userNameValidator, message: '用户名必须为字母、数字、汉字或下划线,且3位以上'}]"
                />
                <van-field
                        v-model="valuePs"
                        label="密    码"
                        type="password"
                        placeholder="请输入密码"
                        :rules="[{ validator: passwordValidator,message:'密码必须为字母、数字或下划线,且6位以上'}]"
                />
                <van-field
                        v-model="valuePsConfirm"
                        label="确认密码"
                        type="password"
                        placeholder="请再次输入密码"
                        :rules="[{validator:passConfirmValidator,message:'两次密码不一致'}]"
                />

                <van-field
                        v-model="valuePhone"
                        label="手机号"
                        placeholder="请输入手机号"
                        @blur="userPhoneBlur"
                        :rules="[{ validator: phoneValidator, message: '手机号不存在'}]"
                />

<!--                <van-field-->
<!--                        v-model="valueUserId"-->
<!--                        label="身份证"-->
<!--                        placeholder="请输入15或18位身份证号"-->
<!--                        @blur="userIdBlur"-->
<!--                        :rules="[{ validator: userIdValidator, message: '身份证号不存在'}]"-->
<!--                />-->


                <van-field v-model="familyName" label="姓    名" placeholder="请输入姓名"/>

            </van-form>

        </div>


        <van-form>
            <van-field
                    v-model="emailAddress"
                    label="邮   箱"
                    v-show="emailFieldShow"
                    placeholder="请输入邮箱"
                    :rules="[{ validator: emailValidator, message: '请输入正确邮箱地址' }]"
            />

            <van-field
                    v-model="recEmail"
                    label="主送邮箱"
                    v-show="emailFieldShow"
                    placeholder="请输入主要接收人邮箱  也可不输入"
                    :rules="[{ validator: recEmailValidator, message: '请输入正确邮箱地址' }]"
            />

            <van-field v-model="corpName" label="公    司" placeholder="请输入公司名称  也可不输入"/>

        </van-form>


        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="registerBtn">注册</van-button>
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
                    userPhone:'',
                    familyName: '',
                    emailAddress: '',
                    recEmail: '',
                    userRight: '',
                    corpName: '',
                },//POST至服务器数据，含用户名和密码；
                valueUser: '',//用户输入用户名；
                valuePs: '',//用户输入密码；
                valuePsConfirm: '',
                valuePhone: '',
                // valueUserId: '',
                familyName: '',
                emailAddress: '',
                recEmail: '',
                corpName: '',
                userRight: 6,
                nameNumber: -1,
                checked: true,
                emailFieldShow: true,
                userNameStatu: false,
                phoneStatue: false,
                userIdStatue: false,
                phoneNumber: -1,
                // userIdNumber: -1,
            };
        },
        created() {
            //判断浏览器，是否支持localstorage
            if (localStorage) {
                this.storage = localStorage;
            }


        },
        methods: {
            //验证数据库中是否有用户名
            async userNameBlur() {
                let tempReturn = await this.$http.get('register/findName', {
                    params: {
                        userName: this.valueUser,
                    }
                });
                if (this.userNameStatu && tempReturn.data > 0) {
                    Toast.success('用户名可用');
                    this.nameNumber = 10;
                } else {
                    this.nameNumber = -1;
                    Dialog({message: '用户名已存在，请重新输入或直接登录'});
                }
            },

            //验证数据库中是否有手机号
            async userPhoneBlur() {
                let tempReturn = await this.$http.get('register/findPhone', {
                    params: {
                        userPhone: this.valuePhone,
                    }
                });
                if (this.phoneStatue && tempReturn.data > 0) {
                    Toast.success('手机号可用');
                    this.phoneNumber = 10;
                } else {
                    this.phoneNumber = -1;
                    Dialog({message: '手机号有误，请重新输入'});
                }
            },

            // //验证数据库中是否有身份证号
            // async userIdBlur() {
            //     let tempReturn = await this.$http.get('register/findUserId', {
            //         params: {
            //             userId: this.valueUserId,
            //         }
            //     });
            //     if (this.userIdStatue && tempReturn.data > 0) {
            //         this.userIdNumber = 10;
            //     } else {
            //         this.userIdNumber = -1;
            //         Dialog({message: '身份证号有误，请重新输入'});
            //     }
            // },


            //再次输入密码验证
            passConfirmValidator(val) {
                if (val != null) {
                    if (val === this.valuePs) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            //密码有效性验证，密码只能为字母、数字、下划线
            passwordValidator(val) {
                return /^\w{6,}$/.test(val);
            },
            //用户名有效性验证，用户名只能为字母、数字、汉字、下划线
            userNameValidator(val) {
                let result = /^[\u4E00-\u9FA5A-Za-z0-9_]{3,}$/.test(val);
                if (result) {
                    this.userNameStatu = true;
                } else {
                    this.userNameStatu = false;
                }
                return result;
            },
            //email有效性验证
            emailValidator(val) {
                return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val);
            },
            recEmailValidator(val){
                // if (val != null || val.length > 0){
                //     return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val);
                // }else {
                //     return true;
                // }
                return true;
            },

            //电话号码有效性验证
            phoneValidator(val) {
                let result = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/.test(val);
                if (result) {
                    this.phoneStatue = true;
                } else {
                    this.phoneStatue = false;
                }
                return result;
            },

            // //身份证号码有效性验证
            // userIdValidator(val) {
            //     let result = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3})$/.test(val);
            //     if (result){
            //         this.userIdStatue = true;
            //     }else{
            //         this.userIdStatue = false;
            //     }
            //     return result;
            // },


            //登录按钮点击事件
            async registerBtn() {
                //用户名放入model中，以便POST至服务器；
                this.model.userName = this.valueUser;

                //密码放入model中，以便POST至服务器；
                this.model.password = this.valuePs;

                this.model.familyName = this.familyName;

                this.model.emailAddress = this.emailAddress;

                this.model.userPhone = this.valuePhone;

                this.model.recEmail = this.recEmail;

                this.model.userRight = this.userRight;

                this.model.corpName = this.corpName;

                //将用户名存入localStorage；
                this.storage.setItem("userName", this.valueUser);

                //将密码存入localStorage；
                this.storage.setItem("password", this.valuePs);

                //判断服务器返回值，成功后跳转至审核页面，失败后显示失败提示信息；
                if (this.valueUser.length > 0) {
                    if (this.valuePs.length > 0) {
                        if (this.valuePsConfirm.length > 0) {
                            if (this.familyName.length > 0) {
                                if (this.emailFieldShow) {
                                    if (this.emailAddress.length > 0) {
                                        if (this.nameNumber >= 0) {
                                            if (this.phoneNumber >=0){

                                                    await this.$http.post('register/insert', this.model);

                                                    setTimeout(() => {
                                                        this.$router.push({
                                                            path: '/login',
                                                        });
                                                    }, 2000);

                                                    Toast.success('注册成功');

                                            }else {
                                                Dialog({message: '手机号有误，请重新输入'});
                                            }
                                        } else {
                                            Dialog({message: '用户名有误，请重新输入'});
                                        }
                                    } else {
                                        Dialog({message: '请输入Email地址'});
                                    }
                                } else {
                                    if (this.nameNumber >= 0) {

                                        await this.$http.post('register/insert', this.model);

                                        setTimeout(() => {
                                            this.$router.push({
                                                path: '/login',
                                            });
                                        }, 2000);

                                        Toast.success('注册成功\n开始登录');
                                    } else {
                                        Dialog({message: '用户名有误，请重新输入'});
                                    }
                                }

                            } else {
                                Dialog({message: '请输入姓名'});
                            }

                        } else {
                            Dialog({message: '请确认密码'});
                        }
                    } else {
                        Dialog({message: '请输入密码'});
                    }
                } else {
                    Dialog({message: '请输入用户名'});
                }

            }
            ,
            quitBtn() {
                window.opener = null;
                window.open("", "_self");
                window.close();
            }
            ,
            onFailed(errorInfo) {
                // console.log('failed', errorInfo);
            }
            ,
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

        .superBtn {
            background-color: white;
            color: lightgrey;
            border: 0vw;
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
