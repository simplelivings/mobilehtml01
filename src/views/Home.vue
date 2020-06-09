<template>
    <div class="home">
        <p></p>
        <img alt="Vue logo" width="100vw" src="../assets/corplogo.png">
        <div class="textdiv">大连嘉翔科技有限公司</div>
        <div class="divdiven"></div>
        <div class="divimg">
            <img src="../assets/applogo.png">
            <div class="textdiv2">AuditAll</div>
        </div>


    </div>


</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'

    export default {
        name: 'Home',
        created() {
            console.log("-----created-----");
            this.reloadView();
        },
        methods:{
            reloadView(){
                var time = 2;
                var _this =this;

                var timer = setInterval(function () {
                    time--;

                    if (time == 0){
                        clearInterval(timer);
                        console.log("-----reloadView-----"+time);

                        _this.$router.push({path:'/login'});
                    }
                },1000);
            },
        }

    }
</script>
<style lang="less">
    .home {
        background-color: white;
        margin-bottom: 0vw;
        p:first-child {
            height: 40vw;
        }
    }

    .textdiv {
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
