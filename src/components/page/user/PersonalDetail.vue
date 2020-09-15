
<template>
  <div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-tickets"></i>企业用户详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="table-title">个人信息</div>
    <div class="container">
        <el-table :data="memberData" border style="width: 90%; margin:0 auto;" ref="multipleTable">
            <el-table-column prop="avatar" label="微信头像">
            </el-table-column>
            <el-table-column prop="nickname" label="微信名称">
            </el-table-column>
            <el-table-column prop="name" label="用户名称">
            </el-table-column>
            <el-table-column prop="username" label="手机号码">
            </el-table-column>
            <el-table-column prop="update_time" label="创建时间">
            </el-table-column>
            <!-- <el-table-column prop="wxname" label="车牌">
            </el-table-column> -->
            <el-table-column prop="balance" label="账户余额">
            </el-table-column>
        </el-table>
    </div>
    <div class="table-title">车辆信息</div>
    <div class="container">
        <el-table :data="carData" border style="width: 90%; margin:0 auto;" ref="multipleTable">
            <!-- <el-table-column prop="wxhead" label="订单号">
            </el-table-column> -->
            <el-table-column prop="number" label="车牌号">
            </el-table-column>
            <el-table-column prop="type" label="车辆类型">
            </el-table-column>
            <el-table-column prop="energy" label="能源类型">
            </el-table-column>
            <el-table-column prop="create_time" label="添加时间">
            </el-table-column>
        </el-table>
    </div>
    <div class="table-title">消费记录</div>
    <div class="container">
        <el-table :data="payData" border style="width: 90%; margin:0 auto;" ref="multipleTable">
            <el-table-column prop="way" label="消费项目">
            </el-table-column>
            <el-table-column prop="order_number" label="订单号">
            </el-table-column>
            <el-table-column prop="price" label="支付金额">
            </el-table-column>
            <el-table-column prop="balance" label="用户余额">
            </el-table-column>
            <el-table-column prop="status" label="支付类别">
            </el-table-column>
            <el-table-column prop="create_time" label="支付时间">
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
    import https from '../../../https.js' 
    export default {
      data(){
          return {
           memberData:[],
           carData:[],
           payData:[],
           id:'',
           member_id:localStorage.getItem('member_id'),
        }
    },
    mounted: function () {
    },
    created() {
        this.getData();
    },
    methods: {
      getData(){
        var that = this;
        let params = {
            id:that.$route.query.id,
            member_id:that.member_id,
        }
        https.fetchPost('member/details',params ).then((e) => {
          console.log(e)
          if(e.code==200){
            var memberArr = [];
            memberArr.push(e.member)
            console.log(memberArr)
            that.memberData = memberArr;
            that.carData = e.carList;
            that.payData = e.withdraw;
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