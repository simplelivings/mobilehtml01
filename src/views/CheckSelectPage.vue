<template>
    <div>

        <div style="height: 20vw"></div>

        <div class="divFirst">
            <div class="divimg" @click="btnCheck">
                <img src="../assets/kachi.jpg">
                <div class="textdiv2">去检验</div>
            </div>

            <div class="divdivender1"></div>

            <div class="divimg" @click="btnStatu">
                <img src="../assets/eyes1.jpg">
                <div class="textdiv2">看状态</div>
            </div>
        </div>
    </div>
</template>

<script>
    import Toast from "vant/lib/toast";

    export default {
        name: "CheckSelectPage.vue",
        methods: {
            btnCheck(){
                setTimeout(() => {
                    this.$router.push({
                        path: '/checkPage',
                    });
                }, 2000);
                Toast.success('跳转成功');
            },
            btnStatu(){
                setTimeout(() => {
                    this.$router.push({
                        path: '/checkStatus',
                    });
                }, 2000);
                Toast.success('跳转成功');
            },
        },
    }
</script>

<style scoped lang="less">
    .divFirst{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .divimg {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin: 0;
        img {
            width: 35vw;
            margin: 0;
            opacity: 0.5;
            border-radius: 20vw;
        }

    }

    .divdivender1 {
        background-color: white;
        width: 5vw;
    }

    .textdiv2{
        color: chocolate;
        font-size: large;
    }
</style>
