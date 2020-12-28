<template>
    <div>

        <div style="height: 10vw;"></div>
        <div class="top">
            <p></p>
            <p>用户信息如下</p>
            <p></p>
            <p></p>
            <p></p>
            <div>
                <van-button @click="quitBtn">退出</van-button>
            </div>
        </div>
        <div style="height: 5vw"></div>
        <div class="divinput">
            <van-cell-group>
                <van-field v-model="valueUser" v-show="userShow" label="用户名" placeholder="请输入用户名"/>
                <van-field v-model="valueRight" v-show="rightShow" label="用户权限"/>
                <van-field v-model="regDate" v-show="regShow" label="注册时间"></van-field>
                <van-field v-model="payDate" v-show="payShow" label="上次缴费"></van-field>
                <van-field v-model="restTime" v-show="restShow" label="剩余时间"/>
            </van-cell-group>
        </div>

        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="checkBtn">查看用户信息</van-button>
        </div>

        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="changeBtn">更改用户信息</van-button>
        </div>
    </div>
</template>

<script>
    import Toast from "vant/lib/toast";
    import {Dialog} from "vant";

    export default {
        name: "RegisterInfo",
        data() {
            return {
                model: {
                    userName: '',
                    familyName: ''
                },
                valueUser: '',
                valueRight: '',
                regDate: '',
                payDate: '',
                restTime: '',
                token: '',//验证令牌，key为用户名
                userShow: true,
                rightShow: false,
                regShow: false,
                payShow: false,
                restShow: false,
                lStorage: '',
                userName: '',
            };
        },
        created() {
            if (localStorage) {
                this.lStorage = localStorage;
            }

            //从lStorage中取出用户名和token,用于向服务器发送请求；
            if (this.lStorage.getItem("auditWay") != null){
                this.token = this.lStorage.getItem("auditWay");
            }
            if (this.lStorage.getItem("userName") != null){
                this.userName = this.lStorage.getItem("userName");
            }

        },
        methods: {
            //跳转至用户信息更改页面按钮
            changeBtn(){
                setTimeout(() => {
                    this.$router.push({
                        path: '/changeRegisterInfo',
                    });
                }, 2000);
                Toast.success('跳转成功');
            },

            //查询用户信息按钮
            async checkBtn() {
                //设置超级用户名，用于传输至服务器
                this.model.userName = this.userName;

                //设置要查询的用户名，用于传输至服务器
                this.model.familyName = this.valueUser;



                let userRight;
                let userRegDate;
                //发送请求至后端，获取用户注册信息
                await this.$http.get('/superRegister/findRegister', {
                    headers: {'token': this.token},
                    params: {
                        userName: this.userName,
                        checkName: this.valueUser,
                    }
                }).then((resp) => {
                    console.log("==resp==" + resp.data);
                    if (resp.data !=null && Object.keys(resp.data).length>0){
                        userRight = resp.data.userRight;
                        userRegDate = resp.data.createTime;
                        userUpdateDate = resp.data.updateTime;

                        //所有信息，都显示
                        this.userShow = true;
                        this.rightShow = true;
                        this.regShow = true;
                        this.payShow = true;
                        this.restShow = true;
                    }else{
                        Toast.fail('用户不存在');
                        this.rightShow = false;
                        this.regShow = false;
                        this.payShow = false;
                        this.restShow = false;
                    }
                });
                let userUpdateDate;

                let returnNum;


                //设置用户权限显示
                switch (userRight) {
                    case 6:
                        this.valueRight = '免费用户';
                        break;
                    case 7:
                        this.valueRight = '普通付费用户';
                    case 8:
                        this.valueRight = '高级付费用户';
                    case 9:
                        this.valueRight = '超级付费用户';
                }

                //设置用户注册时间
                if (userRegDate!=null){
                    this.regDate =userRegDate.substring(0,4)+"年"+ userRegDate.substring(5,7)+"月"+  userRegDate.substring(8,10)+"日";
                }

                if (userUpdateDate !=null){
                    //设置用户付款时间，更新时间
                    this.payDate =userUpdateDate.substring(0,4)+"年"+ userUpdateDate.substring(5,7)+"月"+ userUpdateDate.substring(8,10)+"日";
                    let tempDate = new Date();
                    tempDate.setFullYear(userUpdateDate.substring(0,4),(userUpdateDate.substring(5,7)-1),userUpdateDate.substring(8,10));
                    let nowDate = new Date();

                    //设置用户付款剩余天数
                    this.restTime = Math.round(365-(nowDate-tempDate)/1000/3600/24)+'天';
                }
            },

            //退出按钮
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
