<template>
    <div>
        <div style="height: 5vw"></div>
        <!--1        头部-->

        <div class="top">
            <p></p>
            <p>对象:{{valueObj}}--范围:{{valueRen}}--层级:{{valueIte}}<br>(最多可输入50条)</p>
            <p></p>
            <p></p>
            <p></p>
            <button @click="quitBtn">退出</button>
        </div>

        <!--        分割-->
        <div class="tempDiv" style="height: 3vw">
            <!--            {{valueTemp}}-->
        </div>

        <!--      1 输入框-->
        <div class="divinput">
            <span>{{inputNum+1}}</span>
            <van-field v-model="valueInput1" placeholder="请输入条款"/>
            <van-divider/>
        </div>

        <!--      2 输入框-->
        <div class="divinput">
            <span>{{inputNum+2}}</span>
            <van-field v-model="valueInput2" placeholder="请输入条款"/>
            <van-divider/>
        </div>

        <!--      3 输入框-->
        <div class="divinput" v-show="inputShow">
            <span>{{inputNum+3}}</span>
            <van-field v-model="valueInput3" placeholder="请输入条款"/>
            <van-divider/>
        </div>

        <!--      4 输入框-->
        <div class="divinput" v-show="inputShow">
            <span>{{inputNum+4}}</span>
            <van-field v-model="valueInput4" placeholder="请输入条款"/>
            <van-divider/>
        </div>

        <!--      5 输入框-->
        <div class="divinput" v-show="inputShow">
            <span>{{inputNum+5}}</span>
            <van-field v-model="valueInput5" placeholder="请输入条款"/>
            <van-divider/>
        </div>

        <!--      6 输入框-->
        <div class="divinput" v-show="inputShow">
            <span>{{inputNum+6}}</span>
            <van-field v-model="valueInput6" placeholder="请输入条款"/>
            <van-divider/>
        </div>

        <!--      7 输入框-->
        <div class="divinput" v-show="inputShow">
            <span>{{inputNum+7}}</span>
            <van-field v-model="valueInput7" placeholder="请输入条款"/>
            <van-divider/>
        </div>

        <!--      8 输入框-->
        <div class="divinput" v-show="inputShow">
            <span>{{inputNum+8}}</span>
            <van-field v-model="valueInput8" placeholder="请输入条款"/>
            <van-divider/>
        </div>

        <div class="middleBtn">
            <van-button type="primary" size="large" @click="loginBtnNextPage" :disabled="!nextAble">下一页</van-button>
            <div style="width: 4vw"></div>
            <van-button type="primary" size="large" @click="loginBtnLastPage" :disabled="!lastAble">上一页</van-button>
        </div>
        <!--        分割-->
        <div style="height: 1vw"></div>
        <div style="margin: 2vw">
            <van-button type="primary" size="large" @click="logoutBtn">全 部 录 入</van-button>
        </div>
    </div>
</template>

<script CHARSET="UTF-8">

    import Toast from "vant/lib/toast";
    import {Dialog} from "vant";

    export default {
        name: "SuperPageInput",
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
                valueObj: '冲压',//用户输入审核对象；
                valueRen: '车间',//用户选择审核范围；
                valueIte: '分层',//用户选择审核项目；
                valueNum: '',//审核表编号；
                inputNum: 0,
                valueInput1: '',
                valueInput2: '',
                valueInput3: '',
                valueInput4: '',
                valueInput5: '',
                valueInput6: '',
                valueInput7: '',
                valueInput8: '',
                valueInputList: [],
                inputShow: true,
                nextAble: true,
                lastAble: true,
                auditItem: {
                    userName: '',
                    auditNum: '',
                    auditItemList: []
                }
            };
        },
        created() {
            if (localStorage) {
                this.lStorage = localStorage;
            }
            if (sessionStorage) {
                this.storage = sessionStorage;
            }

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

            if (this.storage.getItem("auditNumSup") != null) {
                this.valueNum = this.storage.getItem("auditNumSup");
            }

            var slist = new Array(50);
            this.valueInputList = slist;
            // console.log("======length====" + this.valueInputList.length);
        },
        methods: {
            loginBtnNextPage() {
                //处理本页内容
                this.lastAble = true;
                var s = (this.valueInput1.length != '')
                    && (this.valueInput2 != '')
                    && (this.valueInput3 != '')
                    && (this.valueInput4 != '')
                    && (this.valueInput5 != '')
                    && (this.valueInput6 != '')
                    && (this.valueInput7 != '')
                    && (this.valueInput8 != '');

                if (s) {
                    if (this.inputNum < 48) {

                        let tempI1 = 0;
                        this.valueInputList[tempI1 + this.inputNum] = this.valueInput1;
                        tempI1++;

                        this.valueInputList[tempI1 + this.inputNum] = this.valueInput2;
                        tempI1++;

                        this.valueInputList[tempI1 + this.inputNum] = this.valueInput3;
                        tempI1++;

                        this.valueInputList[tempI1 + this.inputNum] = this.valueInput4;
                        tempI1++;

                        this.valueInputList[tempI1 + this.inputNum] = this.valueInput5;
                        tempI1++;

                        this.valueInputList[tempI1 + this.inputNum] = this.valueInput6;
                        tempI1++;

                        this.valueInputList[tempI1 + this.inputNum] = this.valueInput7;
                        tempI1++;

                        this.valueInputList[tempI1 + this.inputNum] = this.valueInput8;
                        tempI1++;

                        //处理下页内容
                        this.inputNum += 8;
                        let tempI = 0;
                        this.valueInput1 = this.valueInputList[tempI + this.inputNum];
                        tempI++;

                        this.valueInput2 = this.valueInputList[tempI + this.inputNum];
                        tempI++;

                        this.valueInput3 = this.valueInputList[tempI + this.inputNum];
                        tempI++;

                        this.valueInput4 = this.valueInputList[tempI + this.inputNum];
                        tempI++;

                        this.valueInput5 = this.valueInputList[tempI + this.inputNum];
                        tempI++;

                        this.valueInput6 = this.valueInputList[tempI + this.inputNum];
                        tempI++;

                        this.valueInput7 = this.valueInputList[tempI + this.inputNum];
                        tempI++;

                        this.valueInput8 = this.valueInputList[tempI + this.inputNum];
                        tempI++;

                    } else {
                        this.nextAble = false;
                        // Dialog({message: '已经是最后一页'});
                    }
                    if (this.inputNum > 40) {
                        this.inputShow = false;
                    }
                } else {
                    Toast.fail('请输入每个审核条款');
                }

            },
            loginBtnLastPage() {
                //处理本页内容
                this.nextAble = true;
                if (this.inputNum >= 8) {
                    let tempI1 = 0;
                    this.valueInputList[tempI1 + this.inputNum] = this.valueInput1;
                    tempI1++;

                    this.valueInputList[tempI1 + this.inputNum] = this.valueInput2;
                    tempI1++;

                    this.valueInputList[tempI1 + this.inputNum] = this.valueInput3;
                    tempI1++;

                    this.valueInputList[tempI1 + this.inputNum] = this.valueInput4;
                    tempI1++;

                    this.valueInputList[tempI1 + this.inputNum] = this.valueInput5;
                    tempI1++;

                    this.valueInputList[tempI1 + this.inputNum] = this.valueInput6;
                    tempI1++;

                    this.valueInputList[tempI1 + this.inputNum] = this.valueInput7;
                    tempI1++;

                    this.valueInputList[tempI1 + this.inputNum] = this.valueInput8;
                    tempI1++;


                    //处理下页内容
                    this.inputNum -= 8;
                    let tempI = 0;

                    this.valueInput1 = this.valueInputList[tempI + this.inputNum];
                    tempI++;

                    this.valueInput2 = this.valueInputList[tempI + this.inputNum];
                    tempI++;

                    this.valueInput3 = this.valueInputList[tempI + this.inputNum];
                    tempI++;

                    this.valueInput4 = this.valueInputList[tempI + this.inputNum];
                    tempI++;

                    this.valueInput5 = this.valueInputList[tempI + this.inputNum];
                    tempI++;

                    this.valueInput6 = this.valueInputList[tempI + this.inputNum];
                    tempI++;

                    this.valueInput7 = this.valueInputList[tempI + this.inputNum];
                    tempI++;

                    this.valueInput8 = this.valueInputList[tempI + this.inputNum];
                    tempI++;

                    this.inputShow = true;

                } else {
                    // Dialog({message: '已经是第一页'});
                    this.lastAble = false;
                }
            },
            async logoutBtn() {
                //处理最后一页数据

                let tempI1 = 0;
                this.valueInputList[tempI1 + this.inputNum] = this.valueInput1;
                tempI1++;

                this.valueInputList[tempI1 + this.inputNum] = this.valueInput2;
                tempI1++;

                this.valueInputList[tempI1 + this.inputNum] = this.valueInput3;
                tempI1++;

                this.valueInputList[tempI1 + this.inputNum] = this.valueInput4;
                tempI1++;

                this.valueInputList[tempI1 + this.inputNum] = this.valueInput5;
                tempI1++;

                this.valueInputList[tempI1 + this.inputNum] = this.valueInput6;
                tempI1++;

                this.valueInputList[tempI1 + this.inputNum] = this.valueInput7;
                tempI1++;

                this.valueInputList[tempI1 + this.inputNum] = this.valueInput8;
                tempI1++;


                this.auditItem.auditNum = this.valueNum;
                this.auditItem.userName = this.userName;
                this.auditItem.auditItemList = this.valueInputList;


                if (this.auditItem.auditItemList[2] != '') {
                    //数据传至数据库
                    await this.$http.post('/audititem/insert', this.auditItem);

                    //登出
                    setTimeout(() => {
                        this.$router.push({
                            path: '/lastpage'
                        });
                    }, 2000);

                    Toast.success('录入成功');
                } else {
                    Toast.fail('请输入每个审核条款');
                }
            },
            quitBtn() {
                window.opener = null;
                window.open("", "_self");
                window.close();
            },

        }
    }

</script>

<style scoped lang="less">
    .tempDiv {
        color: white;
    }

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

    .divinput {
        height: 15vw;
        margin-left: 4vw;
        margin-top: 0vw;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;

        span {
            width: 6vw;
            height: 4vw;
            font-size: 3vw;
            text-align: center;
            border-radius: 1vw;
            color: black;
            background-color: #36C364;
        }
    }

    .middleBtn {
        height: 10vw;
        margin: 2vw;
        display: flex;
        flex-direction: row;
    }

</style>
