<template>
    <div>

        <div style="height: 10vw"></div>
        <!--1        头部-->
        <div class="top">
            <p></p>
            <p>请输入用户信息，多个用户用 , 分隔</p>
            <p></p>
            <p></p>
            <p></p>
            <div>
                <van-button @click="quitBtn">退出</van-button>
            </div>
        </div>
        <!--        分割-->
        <div style="height: 13vw"></div>


        <div class="divinput">
            <van-cell-group>
                <van-field v-model="valueUser" label="用户名" placeholder="请输入用户名"/>
            </van-cell-group>

            <!--        3 权限选择器-->
            <van-field
                    readonly
                    clickable
                    name="pickerRight"
                    :value="valueRight"
                    label="设置权限"
                    placeholder="点击设置用户权限"
                    @click="showPickerRight = true"
                    v-show="valueRightShow"
            />
            <van-popup v-model="showPickerRight" position="bottom">
                <van-picker
                        show-toolbar
                        :columns="columnsRight"
                        @confirm="onConfirmRight"
                        @cancel="showPickerRight = false"
                />
            </van-popup>
        </div>

        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="changeBtn">确认更改</van-button>
        </div>
    </div>
</template>

<script>
    import Toast from "vant/lib/toast";
    import {Dialog} from "vant";

    export default {
        name: "CheckRegisterInfo",
        data() {
            return {
                model: {},
                token:'',
                userName:'',
                valueUser: '',
                valuePs: '',
                regDate: '',
                payDate: '',
                restTime: '',
                valueRight:'',
                columnsRight: ['普通付费', '高级付费', '超级付费', '删除用户'],
                showPickerRight: false,
                valueRightShow: true,
                lStorage:''
            };
        },
        created() {
            if (localStorage) {
                this.lStorage = localStorage;
            }

            //从lStorage中取出用户名和token,用于向服务器发送请求；
            if (this.lStorage.getItem("auditWay") !=null){
                this.token = this.lStorage.getItem("auditWay");
            }
            if (this.lStorage.getItem("userName") !=null){
                this.userName = this.lStorage.getItem("userName");
            }

            //刷新或下次登录后，保留权限信息；
            if (this.lStorage.getItem("superRight") !=null){
                this.valueRight = this.lStorage.getItem("superRight");
            }
        },
        methods: {
            //更改信息，提交按钮
            async changeBtn(){

                //保存用户本次选择的权限信息
                this.lStorage.setItem("superRight",this.valueRight);

                //发送请求至后端，获取用户注册信息
                await this.$http.get('/superRegister/changeRegister', {
                    headers: {'token': this.token},
                    params: {
                        userName: this.userName,
                        checkName: this.valueUser,
                        userRight: this.valueRight
                    }
                }).then((resp) => {

                    // console.log("====="+resp.data)
                    if (resp.data == 2){
                        Toast.success('更改成功');
                    }else if (resp.data == 1){
                        Toast.success('用户已删除');
                    }else {
                        Toast.success('操作失败');
                    }
                });
            },

            //选择审核范围后，返回选择值；
            onConfirmRight(value) {
                this.valueRight = value;
                //将审核范围存入localStorage；
                this.showPickerRight = false;
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
