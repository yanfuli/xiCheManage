
<template>
  <div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-tickets"></i>企业用户详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="table-title">企业信息</div>
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
    </div>
    <div class="table-title">车辆信息</div>
    <div class="container">
        <el-table :data="data" border style="width: 80%; margin:0 auto;" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column prop="wxhead" label="车牌号">
            </el-table-column>
            <el-table-column prop="wxname" label="类型">
            </el-table-column>
            <el-table-column prop="date" label="添加时间" sortable>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="small" type="success" @click="handleDelete(scope.$index, scope.row)">查看</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="table-title">消费记录</div>
    <div class="container">
        <el-table :data="data" border style="width: 80%; margin:0 auto;" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column prop="wxhead" label="订单号">
            </el-table-column>
            <el-table-column prop="wxname" label="服务项目">
            </el-table-column>
            <el-table-column prop="date" label="服务时间">
            </el-table-column>
            <el-table-column prop="date" label="消费金额">
            </el-table-column>
            <el-table-column prop="date" label="车辆信息">
            </el-table-column>
            <el-table-column prop="date" label="订单状态">
            </el-table-column>
        </el-table>
    </div>
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
    font-size: 18px;
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
      height: 60px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding-left: 30px;
      padding-right: 30px;
      border-bottom: 1px #dfdfdf dashed;
  }
  .label-text{
      color: #4c5763;
      text-align: right;
  }
  .el-form-item__label{
      font-size: 16px;
      width: 114px !important;
  }
</style>
<script>
    // import https from '../https.js'
    export default {
      data(){
          return {
           allData:''
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
      }
      
    }
  }
</script>