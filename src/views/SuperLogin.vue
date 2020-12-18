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
            <van-cell-group>
                <van-field v-model="valueUser" label="用户名" placeholder="请输入用户名"/>
                <van-field v-model="valuePs" label="密  码" type="password" placeholder="请输入密码"/>
            </van-cell-group>
        </div>

        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="checkBtn">查看用户信息</van-button>
        </div>

        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="changeBtn">更改用户权限</van-button>
        </div>
    </div>
</template>

<script>
    import Toast from "vant/lib/toast";
    import {Dialog} from "vant";
    export default {
        name: "SuperLogin",
        data(){
            return{
                valueUser:'',
                valuePs:'',
                model: {//POST至服务器数据，含用户名和密码；
                    userName: '',
                    password: '',
                },
                returnNum:'',//服务器返回值，用于判断是否是超级用户
                storage:'',
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
        },
        methods: {

            //跳转至用户信息查询页面按钮
            async checkBtn(){
                await this.checkUser();
                if (this.returnNum == 10){
                    setTimeout(() => {
                        this.$router.push({
                            path: '/registerInfo',
                        });
                    }, 2000);
                    Toast.success('跳转成功');
                }
            },

            //跳转至用户信息更改页面按钮
            async changeBtn(){
                await this.checkUser();
                if (this.returnNum == 10){
                    setTimeout(() => {
                        this.$router.push({
                            path: '/changeRegisterInfo',
                        });
                    }, 2000);
                    Toast.success('跳转成功');
                }
            },

            //退出按钮
            quitBtn() {
                //清除用户登录与审核信息，并退出窗口，未清除redis信息
                this.$quitAudit(this.valueUser);
            },

            //检查用户信息，是否为超级用户
            async checkUser(){
                this.model.userName = this.valueUser;
                this.model.password = this.valuePs;

                //将用户名存入localStorage；
                this.storage.setItem("userName", this.valueUser);

                //将密码存入localStorage；
                this.storage.setItem("password", this.valuePs);

                var tempData =await this.$http.post('basicinfo/superCheckLogin',this.model);

                this.returnNum = tempData.data.auditNum;

                var token = tempData.headers['token'];

                //将token放入localStorage中
                this.storage.setItem("auditWay", token);

                console.log("====token"+token);
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
