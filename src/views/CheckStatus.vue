<template>
    <div>
        <div class="home">

            <van-button type="primary" size="large" @click="clickCheck">返回首页</van-button>

            <van-divider></van-divider>
            <p class="title" align="center">检验状态指示</p>
            <div class="viceTitleDiv">
                <p class="viceTitleText">日期：{{checkDate}}</p>
                <p class="viceTitleText" style="width: 15vw"></p>
            </div>

            <table width="100%" border="0" cellspacing="1" cellpadding="4" bgcolor="#cccccc" class="table"
                   align="center">
                <tr>
                    <td nowrap="true" width="15%" class="tableTitle" rowspan="2">零件号</td>
                    <td colspan="3" class="tableTitle">开工放行</td>
                    <td colspan="3" class="tableTitle">抽检（次）</td>
                    <td colspan="1" width="15%" class="tableTitle" rowspan="2">说明</td>
                </tr>

                <tr>
                    <td width="8%" nowrap="true" class="tableTitle">首检</td>
                    <td width="8%" nowrap="true" class="tableTitle">中检</td>
                    <td width="8%" nowrap="true" class="tableTitle">末检</td>
                    <td width="8%" nowrap="true" class="tableTitle">已抽</td>
                    <td width="8%" nowrap="true" class="tableTitle">合格</td>
                    <td width="8%" nowrap="true" class="tableTitle">异常</td>
                </tr>

                <tr v-for="(item,index) in checkInfoList">
                    <td nowrap="true" class="tableContent" v-for="cc in item"
                        :style="{background:(cc=='N1'||cc=='N2'||cc=='N3'||cc=='N4'||cc=='N5'||cc=='NO')?'#FFD700':'#00DD33'}">
                        {{cc}}
                    </td>
                </tr>
            </table>


        </div>
    </div>
</template>

<script>
    import Toast from "vant/lib/toast";

    export default {
        name: "CheckStatus",
        data() {
            return {
                checkInfoList: [],
                userName: '',//用户名
                token: '',
                lStorage:'',
                checkInfo: {
                    partNum: 'T21-8400321',
                    firstCheck: 'OK',
                    middleCheck: 'NO',
                    lastCheck: 'OK',
                    spotCheckNum: '10',
                    spotCheckOkNum: '10',
                    spotCheckNoNum: 'N5',
                    checkNote: '',
                },
                checkDate: "2020-07-24",
                checkClass: "白班",
            };

        },
        created() {

            if (localStorage){
                this.lStorage = localStorage;
            }

            this.userName = this.lStorage.getItem("userName");

            //获得当前日期，20xx年xx月xx日
            this.checkDate =new Date().getFullYear()+"年"+ new Date().getMonth()+"月"+ new Date().getDay()+"日";
            //获得当前小时
            let checkTime = new Date().getHours();
            //获得当前分钟
            let checkMinute = new Date().getMinutes();
            //依据当前时间，判断班次为白班/晚班
            if (checkTime=>8&&checkTime<18){
                this.checkClass="白班";
            }else if (checkMinute >30){
                this.checkClass="晚班";
            }

            this.$http.get('check/checkInfo',{
                headers: {'token': this.token}})
                .then((resp)=>{
                this.checkInfoList = resp.data.productInfoList;
                this.checkDate =resp.data.checkDate;
            })


            setTimeout(()=>{
                location.reload()
            },15000)


        },
        methods: {
            clickCheck(){
                this.$http.get('basicinfo/clearData',{params: {userName: this.userName}});

                setTimeout(() => {
                    this.$router.push({
                        path: '/login',
                    });
                }, 2000);
                Toast.success('跳转成功');
            },
        },
    }

</script>

<style scoped>
    .tableContent {
        font-size: 2vw;
        color: black;
        background-color: white;
    }

    .tableTitle {
        font-size: 2vw;
        font-weight: bold;
        color: black;
        background-color: lightskyblue;
    }

    .table {
        border-style: solid;
        border-color: lightgrey;
        border-width: 0.1vw;
        margin-top: 1.5vw;
    }

    .title {
        font-size: 6vw;
        font-family: 黑体;
        color: black;
        margin: 0;
    }

    .viceTitleDiv {
        height: 3vw;
        position: relative;
        margin: 0.5vw;
        margin-left: 3vw;
        font-size: 2vw;
    }

    .viceTitleText {
        float: left;
        margin: 0.5vw;
    }

    .home {
        display: flex;
        flex-direction: column;
        margin-left: 3vw;
        margin-right: 3vw;
        margin-top: 5vw;
    }
</style>
