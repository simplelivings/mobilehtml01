<template>
    <div>

        <div style="height: 10vw"></div>
        <!--1        头部-->
        <div class="top">
            <p></p>
            <p style="text-align: center">请输入以下注册时信息<br/>点击 发送 按钮后<br/>至邮箱重置密码</p>
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
                        :rules="[{ validator: userNameValidator, message: '用户名必须为字母、数字、汉字或下划线,且3位以上'}]"
                />
            </van-form>

        </div>


        <van-form>
            <van-field
                    v-model="emailAddress"
                    label="邮   箱"
                    placeholder="请输入邮箱"
                    @blur="emailAddressBlur"
                    :rules="[{ validator: emailValidator, message: '请输入正确邮箱地址' }]"
            />
        </van-form>


        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="registerBtn" :disabled="abledBtn">发 送</van-button>
        </div>


    </div>
</template>

<script CHARSET="UTF-8">
    import Toast from "vant/lib/toast";
    import {Dialog} from "vant";
    import http from "../../http";

    export default {
        name: "PasswordPage",
        data() {
            return {
                valueUser: '',//用户输入用户名；
                emailAddress: '',
                nameSta: '',
                addressSta: '',
                abledBtn: false,

            };

        },
        created() {
            if (localStorage) {
                this.storage = localStorage;
            }

            //刷新或下次登录后，保留上次登录信息；
            if (this.storage.getItem("userName") != null) {
                this.valueUser = this.storage.getItem("userName");
            }
        },
        methods: {
            async registerBtn() {

                await this.userNameBlur();

                if (this.valueUser.length > 0 && this.nameSta > 0) {

                    let tempReturn = await this.$http.get('register/emailVal', {
                        params: {
                            userName: this.valueUser,
                            emailAddress: this.emailAddress
                        }
                    });
                    if (tempReturn.data > 0) {
                        this.addressSta = 1;
                    }


                    if (this.emailAddress.length > 0 && this.addressSta > 0) {
                        Dialog({message: '请移步至邮箱，点击链接，重置密码'});
                        await this.$http.get('register/emailVal', {
                            params: {
                                userName: this.valueUser,
                                emailAddress: this.emailAddress
                            }
                        });

                        setTimeout(() => {
                            window.opener = null;
                            window.open("", "_self");
                            window.close();
                        }, 2000);

                    } else {
                        Dialog({message: '请输入正确邮箱地址'});
                    }
                } else {
                    Dialog({message: '请输入正确用户名'});
                }

                this.abledBtn = false;

            },
            quitBtn() {
                //清除用户登录与审核信息，并退出窗口，未清除redis信息
                this.$quitAudit(this.valueUser);
            },
            //用户名有效性验证，用户名只能为字母、数字、汉字、下划线
            userNameValidator(val) {
                if (/^[\u4E00-\u9FA5A-Za-z0-9_]{3,}$/.test(val)) {
                    this.userNameStatu = true;
                } else {
                    this.userNameStatu = false;
                }
                return /^[\u4E00-\u9FA5A-Za-z0-9_]{3,}$/.test(val);
            },
            //email有效性验证
            emailValidator(val) {
                return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val);
            },
            //验证数据库中是否有用户名
            async userNameBlur() {
                let tempReturn = await this.$http.get('register/find', {
                    params: {
                        userName: this.valueUser,
                    }
                });
                if (this.userNameStatu && tempReturn.data > 0) {
                    Dialog({message: '用户名不存在，请重新输入'});
                    this.nameSta = -1;
                } else {
                    this.nameSta = 1;
                    // Dialog({message: '用户名已存在，请重新输入或直接登录'});
                }
                this.abledBtn =false;
            },
            async emailAddressBlur() {

                this.abledBtn =false;

            //     let tempReturn = await this.$http.get('register/emailVal', {
            //         params: {
            //             userName: this.valueUser,
            //             emailAddress: this.emailAddress
            //         }
            //     });
            //     if (tempReturn.data > 0) {
            //         this.addressSta = 1;
            //         this.showBtn = true;
            //     } else {
            //         this.addressSta = -1;
            //         Dialog({message: '邮箱地址不正确'});
            //     }
            //
            }
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


    /*.superBtn {*/
    /*    background-color: white;*/
    /*    color: lightgrey;*/
    /*    border: 0vw;*/
    /*}*/

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
