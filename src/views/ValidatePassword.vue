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
                        disabled
                />
                <van-field
                        v-model="valuePs"
                        label="新 密    码"
                        type="password"
                        placeholder="请输入新密码"
                        :rules="[{ validator: passwordValidator,message:'密码必须为字母、数字或下划线,且6位以上'}]"
                />
                <van-field
                        v-model="valuePsConfirm"
                        label="确认密码"
                        type="password"
                        placeholder="请再次输入新密码"
                        :rules="[{validator:passConfirmValidator,message:'两次密码不一致'}]"
                />
            </van-form>

        </div>


        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="registerBtn">重 置</van-button>
        </div>
    </div>

</template>

<script CHARSET="UTF-8">
    import Toast from "vant/lib/toast";
    import {Dialog} from "vant";

    export default {
        name: "ValidatePassword",
        data() {
            return {
                valueUser: '',//用户输入用户名；
                valuePs: '',
                valuePsConfirm: '',
                model: {
                    userName: '',
                    password: '',
                },
                loginNum:'',
                storage:'',
            };

        },
        created() {
            this.valueUser = this.$route.params.id;
            if (localStorage) {
                this.storage = localStorage;
            }
            this.loginNum = this.storage.getItem("loginNum");
        },
        mounted() {

        },
        methods: {
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
            async registerBtn() {
                this.model.userName = this.valueUser;
                this.model.password = this.valuePs;
                if (this.valuePs != null && this.valuePsConfirm != null && this.valuePs == this.valuePsConfirm) {
                    var returnData = await this.$http.post('register/update', this.model);
                    if (returnData.data > 0) {
                        this.storage.setItem("userName", this.valueUser);
                        this.storage.setItem("password", this.valuePs);
                        Dialog.confirm({
                            message: '密码重置成功，是否至登录页面？'
                        })
                        .then(()=>{
                            if (this.loginNum == 1){
                                setTimeout(() => {
                                    this.$router.push({
                                        path: '/jxLogin'
                                    });
                                }, 1000);
                            }else if (this.loginNum == 2){
                                setTimeout(() => {
                                    this.$router.push({
                                        path: '/login'
                                    });
                                }, 1000);
                            }
                        }).catch(()=>{
                                this.quitBtn();
                            });
                    }
                } else {
                    Dialog({message: '密码输入有误，请重新输入'});
                }
            },
            quitBtn() {
                //清除用户登录与审核信息，并退出窗口，未清除redis信息
                this.$quitAudit(this.valueUser);
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

</style>
