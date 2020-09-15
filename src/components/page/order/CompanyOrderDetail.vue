
<template>
  <div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-tickets"></i>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="table-title">订单详情</div>
    <div class="container">
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">订单编号</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.order_number}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">服务内容</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.title}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">预约联系人</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.yuyue}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">预约人电话</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.yuyue_phone}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">联系人</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.nickname}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">联系方式</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.phone}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">订单地址</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.allDataarea_info + allData.address}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">是否是企业</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.type==1?'企业':'个人'}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">支付方式</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.way}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">折扣</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.discount}}折</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">支付金额</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.price}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">订单状态</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.status==1?'已支付':allData.status==2?'已完成':allData.status==3?'申请退款':allData.status==4?'退款通过':allData.status==5?'退款失败':'退款成功'}}</div>
            </el-col>
        </el-row>
        
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">下单时间</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.create_time}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">备注</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple">{{allData.message}}</div>
            </el-col>
        </el-row>
        <!-- 已支付状态 -->
        <el-row :gutter="10" class="row" v-if="allData.status==1">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">是否完成</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <el-checkbox @change="getCheck">确定完成</el-checkbox>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" v-if="status==2">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">服务前图片</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" class="changeup">
                <el-upload
                    class="avatar-uploader"
                    action="http://xiche.aixiaoqu98.com/public/index.php/admin/login/uploads"
                    :show-file-list="false"
                    :on-success="handlePicSuccess"
                    :before-upload="beforePicUpload">
                    <img v-if="pic" :src="path+pic" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" v-if="status==2">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">服务后图片</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" class="changeup">
                <el-upload
                    class="avatar-uploader"
                    action="http://xiche.aixiaoqu98.com/public/index.php/admin/login/uploads"
                    :show-file-list="false"
                    :on-success="handlePicsSuccess"
                    :before-upload="beforePicsUpload">
                    <img v-if="pics" :src="path + pics" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-col>
        </el-row>
        <!-- 申请退款 -->
        <el-row :gutter="10" class="row" v-if="allData.status==3">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">退款原因</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">{{allData.liyou}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" v-if="allData.status==3">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">是否同意退款</div>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <template>
                    <el-radio-group v-model="radio" @change="selectRadio">
                        <el-radio label="4">同意</el-radio>
                        <el-radio label="5">不同意</el-radio>
                    </el-radio-group>
                </template>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" v-if="status==5">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">拒绝原因</div>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <div class="grid-content bg-purple label-text">
                    <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入拒绝理由"
                    v-model="textarea" @change="getRefuse">
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <!-- 退款状态 -->
        <el-row :gutter="10" class="row" v-if="allData.status==4">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">退款状态</div>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <div class="grid-content bg-purplet">退款通过</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" v-if="allData.status==6">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">退款状态</div>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <div class="grid-content bg-purple">退款成功</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" v-if="allData.status==5">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">退款状态</div>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <div class="grid-content bg-purple">退款失败</div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" v-if="allData.status==5">
            <el-col :span="4">
                <div class="grid-content bg-purple label-text">拒绝原因</div>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <div class="grid-content bg-purple">{{allData.refuse}}</div>
            </el-col>
        </el-row>
        <!-- 已完成 -->
        <!-- v-if="allData.status==2" -->
        <el-row :gutter="10" class="row" v-if="allData.status==2">
            <el-col :span="4">
                <div class="grid-content bg-purple label-text">服务前</div>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <div class="block" v-for="fit in fits" :key="fit">
                    <el-image
                    style="width: 100px; height: 100px"
                    :src="path + allData.pic"
                    :fit="fit"></el-image>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" v-if="allData.status==2">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="grid-content bg-purple label-text">服务后</div>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <div class="block" v-for="fit in fits" :key="fit">
                    <el-image
                    style="width: 100px; height: 100px"
                    :src="path + allData.pic"
                    :fit="fit"></el-image>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" v-if="allData.status==1||allData.status==3">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-button type="primary" @click="saveSub">提 交</el-button>
            </el-col>
        </el-row>
    </div>
    <div class="container">
        <el-table :data="carList" border style="width: 80%; margin:0 auto;" ref="multipleTable">
            <el-table-column label="序号" width="80">
                <template slot-scope="scope">
                    <p>{{scope.$index}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="car_number" label="车牌号">
            </el-table-column>
            <el-table-column prop="car_type" label="车型">
            </el-table-column>
            <el-table-column prop="car_energy" label="能源类型">
            </el-table-column>
            <el-table-column prop="yuyue_time" label="预约时间">
            </el-table-column>
            <el-table-column prop="type" label="车辆所属">
                <template slot-scope="scope">
                    <p>{{scope.row.type==1?'个人':'企业'}}</p>
                </template>
            </el-table-column>
        </el-table>
    </div>
    
  </div>
  
</template>
<script>
    import https from '../../../https.js' 
    export default {
      data(){
          return {
           allData:'',
           member_id:localStorage.getItem('member_id'),
           radio: '1',
           dialogImageUrl: '',
           dialogVisible: false,
           status:'',
           fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
           url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
           refuse:'',
           pic:'',
           pics:'',
           path:'',
           carList:[],
        }
    },
    created() {
        this.dataPost();
    },
    methods: {
      dataPost(){
        var that = this;
        let params = {
            id:that.$route.query.id,
            member_id:that.member_id
        }
        https.fetchPost('conpany_order/examine',params ).then((e) => {
          console.log(e)
          if(e.code==200){
            that.allData = e.data;
            that.carList = e.car_list;
            that.path = e.path+'/public/'
          }
        }).catch(err=>{
        console.log(err)
        })
        },
        //   单选
        selectRadio(val){
            this.status = val;
        },
        // 获取拒绝理由
        getRefuse(val){
            this.refuse = val
        },
        // 获取图片
        handlePicsSuccess(file){
            this.pics = file
        },
        handlePicSuccess(file){
            this.pic = file
        },
        // 获取去多选
        getCheck(val){
            console.log(val)
            if(val==true){
                this.status = 2;
            }else{
                this.status = 1;
            }
        },
        saveSub(){
            let that = this;
            let params = {
                member_id:that.member_id,
                refuse:that.refuse,
                status:that.status,
                pic:that.pic,
                pics:that.pics,
                id:that.$route.query.id
            }
            console.log(params)
            https.fetchPost('conpany_order/update',params ).then((e) => {
            console.log(e)
            if(e.code==200){
                console.log('成功')
                that.getData();
            }
            }).catch(err=>{
            console.log(err)
            })
        },
    }
  }
</script>
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
      
    .changeup .avatar-uploader .el-upload--text{
        width: auto !important;
    }
    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>