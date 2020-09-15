
<template>
  <div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-tickets"></i>加盟商申请查看</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="table-title">产看信息</div>
    <div class="container">
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">企业名称</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.title}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">企业类别</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.title}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">联系人</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.attr}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">联系方式</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.username}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">备注</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.title}}</div>
            </el-col>
        </el-row>
  </div>
  
</template>

<style scoped>
  .page-header{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  .table-title{
    text-align:center;
    padding-top:20px;
    padding-bottom:20px; 
    color:#666666;
    font-size: 14px;
  }
  .detail-box{
      width: 86%;
      margin: 0 auto;
  }
  .pagination{
    margin-top: 30px;
    text-align: right;
  }
  .row,.form-item{
      width: 100%;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 20px 30px;
      border-bottom: 1px #dfdfdf dashed;
  }
  .label-text{
      color: #4c5763;
      text-align: right;
      font-size: 14px;
  }
</style>
<script>
    // import https from '../https.js'
    export default {
      data(){
          return {
           allData:'',
           radio: '1',
           dialogImageUrl: '',
           dialogVisible: false,
           status:2,
           fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
           url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        }
    },
    // created() {
    //     this.dataPost();
    // },
    methods: {
      dataPost(){
        var that = this;
        let params = {
            id:1
        }
        https.fetchPost('member_order/examine',params ).then((e) => {
          console.log(e)
          if(e.code==200){
            that.allData = e.data
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      goBack() {
        console.log('go back');
      },
      goAddClassify(){
        this.$router.push({path: '/AddClassify'})
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
      
    }
  }
</script>