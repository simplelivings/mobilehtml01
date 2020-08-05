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
                <van-field v-model="familyName" label="姓    名" placeholder="请输入姓名"/>

            </van-form>

        </div>


        <van-cell value="是否用邮箱接收审核表? 绿：接收，红：不接收">
            <template #right-icon>
                <van-switch v-model="checked" @click="switchClick" active-color="#36C364" inactive-color="#ee0a24"
                            size="24"/>
            </template>
        </van-cell>

        <van-form>
            <van-field
                    v-model="emailAddress"
                    label="邮   箱"
                    v-show="emailFieldShow"
                    placeholder="请输入邮箱"
                    :rules="[{ validator: emailValidator, message: '请输入正确邮箱地址' }]"
            />
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
                    familyName: '',
                    emailAddress: '',
                },//POST至服务器数据，含用户名和密码；
                valueUser: '',//用户输入用户名；
                valuePs: '',//用户输入密码；
                valuePsConfirm: '',
                familyName: '',
                emailAddress: '',
                nameNumber: -1,
                checked: true,
                emailFieldShow: true,
                userNameStatu:false,
            };
        },
        created() {

        },
        methods: {
            //验证数据库中是否有用户名
            async userNameBlur() {
                let tempReturn = await this.$http.get('register/find', {
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
                if (/^[\u4E00-\u9FA5A-Za-z0-9_]{3,}$/.test(val)){
                    this.userNameStatu = true;
                }else {
                    this.userNameStatu =false;
                }
                return /^[\u4E00-\u9FA5A-Za-z0-9_]{3,}$/.test(val);
            },
            //email有效性验证
            emailValidator(val) {
                return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val);
            },

            //滑动开关点击事件
            switchClick() {
                console.log("checked========" + this.checked)
                if (this.checked) {
                    this.emailFieldShow = false;
                } else {
                    this.emailFieldShow = true;
                }
            },
            //登录按钮点击事件
            async registerBtn() {
                //用户名放入model中，以便POST至服务器；
                this.model.userName = this.valueUser;

                //密码放入model中，以便POST至服务器；
                this.model.password = this.valuePs;

                this.model.familyName = this.familyName;

                this.model.emailAddress = this.emailAddress;

                //判断服务器返回值，成功后跳转至审核页面，失败后显示失败提示信息；
                if (this.valueUser.length > 0) {
                    if (this.valuePs.length > 0) {
                        if (this.valuePsConfirm.length > 0) {
                            if (this.familyName.length > 0) {
                                if (this.emailFieldShow){
                                    if (this.emailAddress.length > 0) {
                                        if (this.nameNumber >= 0) {

                                            await this.$http.post('register/insert', this.model);

                                            setTimeout(() => {
                                                this.$router.push({
                                                    path: '/login',
                                                });
                                            }, 2000);

                                            Toast.success('注册成功');
                                        } else {
                                            Dialog({message: '用户名有误，请重新输入'});
                                        }
                                    } else {
                                        Dialog({message: '请输入Email地址'});
                                    }
                                }else {
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


                console.log("----" + this.model.userName);
            },
            quitBtn() {
                window.opener = null;
                window.open("", "_self");
                window.close();
            },
            onFailed(errorInfo) {
                console.log('failed', errorInfo);
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
