<template>
    <div>
        <div style="height: 15vw"></div>
        <p>测试页面</p>
        <van-button square color="#36C364" type="primary" size="large" @click="clickBtn1" :disabled="!quitShow">
           关闭数据库
        </van-button>
        <div style="height: 2vw"></div>

        <van-button square color="#36C364" type="primary" size="large" @click="clickBtn2" :disabled="!quitShow">
            插入数据
        </van-button>

        <div style="height: 2vw"></div>

        <van-button square color="#36C364" type="primary" size="large" @click="clickBtn3" :disabled="!quitShow">
            删除数据库
        </van-button>

        <div style="height: 2vw"></div>

        <van-button square color="#36C364" type="primary" size="large" @click="clickBtn4" :disabled="!quitShow">
            查询数据库
        </van-button>

        <div style="height: 2vw"></div>

        <van-button square color="#36C364" type="primary" size="large" @click="clickBtn5" :disabled="!quitShow">
            根据id删除数据
        </van-button>
    </div>

</template>

<script>
    import Toast from "vant/lib/toast";
    import {openDB} from "../../indexOpr";

    export default {
        name: "Test",
        data(){
            return{
                quitShow:true,
                requestDB:'',
                indexedDB:'',
                inspectDB:'',
                userName:'fan',
                tele:'11111222',
                version:1,

            };
        },
        async created(){

            //indexedDB操作，用于存储图片，以便来回翻页时，保留图片
            //1 判断浏览器是否支出IndexedDB

            this.openDB();
        },
        methods:{
            clickBtn1(){
                this.$indexOpr.shutdownDB(this.indexedDB,this.inspectDB,'inspect');
            },
            clickBtn2(){
                console.log("===cc=="+this.inspectDB);
                let tempValue = {
                    id:1,
                    name:'fan',
                    tel:this.tele
                };
                this.$indexOpr.insertDB(this.inspectDB,'inspect',tempValue);
                //创建事务

            },
            clickBtn3(){

                let request = this.indexedDB.deleteDatabase('inspect');
                request.onsuccess = (e)=>{
                    console.log("数据库删除成功");
                }
            },
            clickBtn4(){
                this.$indexOpr.queryByID(this.inspectDB,'inspect',1);
            },
            clickBtn5(){
                this.$indexOpr.deleteByID(this.inspectDB,'inspect',1);
            },
            openDB(){
                this.indexedDB =window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
                if (!this.indexedDB){Toast.fail('浏览器不支持indexedDB,请更换其他浏览器');}
                //1 打开IndexedDB请求
                let reqDB = this.indexedDB.open(this.userName, this.version);
                //2 打开请求的处理结果，有三种结果：失败、成功、阻止
                //2.1 请求成功
                reqDB.onsuccess = (e) => {
                    this.inspectDB = e.target.result;
                    ++this.version;
                    console.log("请求成功" + this.inspectDB);
                };

                //2.2 请求失败
                reqDB.onerror = (e)=>{};

                //2.3 请求阻止，打开成功或版本有变化时执行，一般用于初始化数据库
                reqDB.onupgradeneeded = (e)=>{
                    this.inspectDB = e.target.result;//获取到数据库实例

                    if (!this.inspectDB.objectStoreNames.contains('inspect')){
                        let inspectStore = this.inspectDB.createObjectStore('inspect',{
                            keyPath: 'id',
                            // autoIncrement: true
                        });
                        console.log("数据库创建成功");
                    }
                    console.log("进入阻止");
                };
            },
        },
    }
</script>

<style scoped>

</style>
