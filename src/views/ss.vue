<template>
    <div>

     <table>
         <tr>
             <td>序号</td>
             <td>姓名</td>
             <td>行不</td>
         </tr>

<!--         {{user}}-->
         <tr v-for="item in user">
             <td>{{item.id}}}</td>
             <td>{{item.name}}}</td>
             <td>{{item.age}}</td>
         </tr>
     </table>

        <button class="btn1" @click="showss">sssss</button>



        <van-uploader  v-model="fileList" multiple :preview-size="10" />


    </div>
</template>

<script>
    export default {
        name: "ss",
        data(){
            return{
                user:'',
                show:true,
                model:{
                    name:'王王3'
                },
                fileList: [
                    { url: '' },
                    // Uploader 根据文件后缀来判断是否为图片文件
                    // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
                    { url: 'https://cloud-image', isImage: true },
                ],
            }
        },
        created() {
            const _this = this;
            // const rest = this.$http.get('/list')
            // this.user = rest.data
            // console.log("---------------"+rest)
            this.$http.get('/list?id=15').then(function (resp) {
                _this.user = resp.data;
                console.log("---------------"+resp)
            })
        },
        methods:{
            async showss(){
                const res = await this.$http.post('/showss',this.model)
                console.log("+++++++++++"+res.data)
            },
            afterRead(file) {
                // 此时可以自行将文件上传至服务器
                console.log(file);
            }
        }
    }
</script>

<style scoped>
    .btn1,text_9X1{
        width: 40vw;
        height: 44px;
        left: 113px;
        top: 573px;
        color: rgba(255, 255, 255, 1);
        background-color: rgba(255, 68, 68, 1);
        border-radius: 22px;
        font-size: 14px;
        line-height: 150%;
        text-align: center;
    }
    .div1{
        width: 20px;
        height: 20px;
    }

</style>
