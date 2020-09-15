<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-view grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{allData.memberCount}}</div>
                                    <div>今日新增会员数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{allData.orderCount}}</div>
                                    <div>今日新增订单数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{allData.orderPrice}}</div>
                                    <div>今日订单金额</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover">
                            <div class="grid-content grid-con-4">
                                <i class="el-icon-view grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{allData.memberCounts}}</div>
                                    <div>累计会员总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover">
                            <div class="grid-content grid-con-5">
                                <i class="el-icon-message grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{allData.orderCount}}</div>
                                    <div>累计订单数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover">
                            <div class="grid-content grid-con-6">
                                <i class="el-icon-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{allData.orderPrices}}</div>
                                    <div>累计订单收入</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover">
                            <div class="grid-content grid-con-7">
                                <i class="el-icon-view grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{allData.join}}</div>
                                    <div>加盟商留言</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover">
                            <div class="grid-content grid-con-8">
                                <i class="el-icon-message grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{allData.feedback}}</div>
                                    <div>留言反馈</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    import https from '../../https.js' 
    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                member_id:localStorage.getItem('member_id'),
                allData:'',
            }
        },
        // computed: {
        //     role() {
        //         return this.name === 'admin' ? '超级管理员' : '普通用户';
        //     }
        // },
        created() {
        this.dataPost();
        },
        methods: {
            dataPost(){
                var that = this;
                let params = {
                    member_id:that.member_id
                }
                https.fetchPost('index/index',params ).then((e) => {
                console.log(e)
                if(e.code==200){
                    that.allData = e
                }
                if(e.code==5003){
                    this.$router.push('/login');
                }
                }).catch(err=>{
                console.log(err)
                })
            },        
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 12px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(64, 132, 206);
    }

    .grid-con-1 .grid-num {
        color: rgb(64, 132, 206);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }
    .grid-con-4 .grid-con-icon {
        background: rgb(97, 178, 224);
    }

    .grid-con-4 .grid-num {
        color: rgb(97, 178, 224);
    }

    .grid-con-5 .grid-con-icon {
        background: rgb(197, 76, 102);
    }

    .grid-con-5 .grid-num {
        color: rgb(197, 76, 102);
    }

    .grid-con-6 .grid-con-icon {
        background: rgb(69, 233, 233);
    }

    .grid-con-6 .grid-num {
        color: rgb(69, 233, 233);
    }
    .grid-con-7 .grid-con-icon {
        background: rgb(219, 205, 79);
    }

    .grid-con-7 .grid-num {
        color: rgb(219, 205, 79);
    }

    .grid-con-8 .grid-con-icon {
        background: rgb(137, 99, 207);
    }

    .grid-con-8 .grid-num {
        color: rgb(137, 99, 207);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

</style>
