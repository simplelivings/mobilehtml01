<template>
    <div>

        <div style="height: 10vw"></div>
        <!--1        头部-->
        <div class="top">
            <p></p>
            <p>编辑界面：请输入以下信息</p>
            <p></p>
            <p></p>
            <p></p>
            <button @click="quitBtn">退出</button>
        </div>
        <!--        分割-->
        <div style="height: 3vw"></div>

        <!--        2 输入框-->
        <div>
            <van-cell-group>
                <van-field v-model="valueUser" label="用户名" placeholder="请输入用户名"/>
                <van-field v-model="valuePs" label="密  码" type="password" placeholder="请输入密码"/>
            </van-cell-group>
        </div>

        <!--        3 对象选择器-->
        <van-field
                readonly
                clickable
                name="pickerObj"
                :value="valueObj"
                label="对  象"
                placeholder="点击选择对象"
                @click="showPickerObj = true"
        />
        <van-popup v-model="showPickerObj" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="columnsObj"
                    @confirm="onConfirmObj"
                    @cancel="showPickerObj = false"
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
        />
        <van-popup v-model="showPickerRen" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="columnsRen"
                    @confirm="onConfirmRen"
                    @cancel="showPickerRen = false"
            />
        </van-popup>

        <!--        5 项目选择器-->
        <van-field
                readonly
                clickable
                name="pickerIte"
                :value="valueIte"
                label="项  目"
                placeholder="点击选择审核项目"
                @click="showPickerIte= true"
        />
        <van-popup v-model="showPickerIte" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="columnsIte"
                    @confirm="onConfirmIte"
                    @cancel="showPickerIte = false"
            />
        </van-popup>

        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="loginBtn">开始录入</van-button>
        </div>


    </div>
</template>

<script CHARSET="UTF-8">
    import Toast from "vant/lib/toast";
    import {Dialog} from "vant";

    export default {
        name: "SuperPage",
        data() {
            return {
                model: {
                    userName: '',
                    password: '',
                    auditObj: '',
                    auditRen: '',
                    auditIte: ''
                },//POST至服务器数据，含用户名和密码；
                valueUser: '',//用户输入用户名；
                valuePs: '',//用户输入密码；
                valueObj: '',//用户输入审核对象；
                valueRen: '',//用户选择审核范围；
                valueIte: '',//用户选择审核项目；
                valueNum: '',//审核表编号；
                auditNum:'',
                columnsObj: ['冲压', '焊接（凸点烧焊）', '剪板', '钣金', '设备/工装','物流','质量'],
                columnsRen: ['班组级', '工段级', '科室级', '部门级', '公司级'],
                columnsIte: ['分层审核', '安全检查', '现场检查', '质量检验', '工艺检查', '综合检查'],
                showPickerObj:false,
                showPickerRen: false,
                showPickerIte: false,
            };
        },
        created() {

            //判断浏览器，是否支持localstorage
            if (localStorage) {
                this.lStorage = localStorage;
            }

            if (sessionStorage){
                this.storage = sessionStorage;
            }

            //刷新或下次登录后，保留上次登录信息；
            if (this.lStorage.getItem("valueUserNameSup") != null) {
                this.valueUser = this.lStorage.getItem("valueUserNameSup");
            }

            if (this.lStorage.getItem("valuePasswordSup") != null) {
                this.valuePs = this.lStorage.getItem("valuePasswordSup");
            }

            if (this.lStorage.getItem("valueObjSup") != null) {
                this.valueObj = this.lStorage.getItem("valueObjSup");
            }

            if (this.lStorage.getItem("valueRenSup") != null) {
                this.valueRen = this.lStorage.getItem("valueRenSup");
            }

            if (this.lStorage.getItem("valueIteSup") != null) {
                this.valueIte = this.lStorage.getItem("valueIteSup");
            }

        },
        methods: {
            //选择审核对象后，返回选择值；
            onConfirmObj(value) {
                this.valueObj = value;

                //将审核范围存入localStorage；
                this.lStorage.setItem("valueObjSup", value);
                this.showPickerObj = false;
            },


            //选择审核范围后，返回选择值；
            onConfirmRen(value) {
                this.valueRen = value;

                //将审核范围存入localStorage；
                this.lStorage.setItem("valueRenSup", value);
                this.showPickerRen = false;
            },

            //选择审核项目后，返回选择值；
            onConfirmIte(value) {
                this.valueIte = value;

                //将审核项目存入localStorage；
                this.lStorage.setItem("valueIteSup", value);
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

                this.lStorage.setItem("valueUserNameSup",this.valueUser);
                this.lStorage.setItem("valuePasswordSup",this.valuePs);

                //向服务器发送请求，并将用户名与密码传给服务器，成功后服务器返回1，否则返回0；
                var auditNum = await this.$http.post('basicinfo/superlogin', this.model,{contentType:'application/x-www-form-urlencoded;charset=UTF-8'});
                this.storage.setItem("auditNumSup",auditNum.data);
                console.log("=========auditNum========"+auditNum.data);

                //判断服务器返回值，成功后跳转至审核页面，失败后显示失败提示信息；
                if (this.valueUser.length > 0) {
                    if (this.valueObj.length > 0) {
                        var reg = new RegExp(/冲|D|焊|W|剪|C|M|钣|E|设备|工装|L|物流|质量|Q/i);
                        if (reg.test(this.valueObj)){
                            if (this.valueRen.length > 0) {
                                if (this.valueIte.length > 0) {
                                    if (auditNum.data >= 0) {
                                        setTimeout(() => {
                                            this.$router.push({
                                                path: '/superpageinput',

                                            });
                                        }, 2000);

                                        Toast.success('登录成功');
                                    } else {
                                        Dialog({message: '密码输入错误，请重新输入'});
                                        console.log("--you can not log in--");
                                    }
                                } else {
                                    Dialog({message: '请输入审核项目'});
                                }
                            } else {
                                Dialog({message: '请选择审核范围'});
                            }
                        }else{
                            Dialog({message:'请输入正确审核对象：D11或者冲11'});
                        }
                    } else {
                        Dialog({message: '请输审核对象'});
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
        },

    }
</script>

<style lang="less">
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
