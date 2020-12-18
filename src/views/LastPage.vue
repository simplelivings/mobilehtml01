<template>
    <div class="homes">
        <p></p>
        <div class="textdiv">审&nbsp;核&nbsp;完&nbsp;成</div>
        <div class="textdiv">谢&nbsp;&nbsp;谢</div>
        <div class="divdiven"></div>

        <div class="divimg" v-show="tipShow">
            <img class="img1"@click="clickImg" src="../assets/lastapplogo.png">
            <div class="textdiv2">AuditAll</div>
        </div>
    </div>



</template>

<script CHARSET="UTF-8">
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'

    export default {
        name: 'Home',
        data(){
            return {
                tipShow: false,
                loginNum: '',
                storage:'',
            }
        },

        created() {
            if (localStorage) {
                this.storage = localStorage;
            }
            this.loginNum = this.storage.getItem("loginNum");
            if (this.loginNum == 1) {
                this.tipShow = false;
            } else if (this.loginNum == 2) {
                this.tipShow = true;
            }
        },
        methods:{
            clickImg(){
                window.opener = null;
                window.open("", "_self");
                window.close();
            }
        }
    }
</script>
<style scoped lang="less">
    .homes {
        background-color: white;
        margin-bottom: 0vw;
        p:first-child {
            height: 40vw;
        }
    }
    .textdiv{
        font-size: 4vw;
        color: gray;
    }
    .divdiven {
        height: 60vw;
    }
    .divimg{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin: 0;
        img{
            width: 50px;
            margin: 0;
            opacity: 0.5;
        }
    }
    .textdiv2 {
        margin-top: 0vw;
        font-size: 2vw;
        font-style: italic;
    }

</style>

