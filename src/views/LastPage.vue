<template>
    <div class="home">
        <p></p>
        <div class="textdiv">审&nbsp;核&nbsp;完&nbsp;成</div>
        <div class="textdiv">谢&nbsp;&nbsp;谢</div>
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
        components: {
            HelloWorld
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
    .textdiv{
        font-size: 4vw;
        color: gray;
    }
    .divdiven {
        height: 60vw;
    }
    .textdiv2{
        margin-top: 0vw;
        font-size: 2vw;
        font-style: italic;
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
</style>

