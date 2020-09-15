<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 留言反馈</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="tableData" border style="width: 100%; margin:0 auto;" ref="multipleTable">
                <el-table-column prop="serialNumber" label="序号" width="80">
                    <!-- <template slot-scope="scope">
                        <p>{{scope.$index}}</p>
                    </template> -->
                </el-table-column>
                <el-table-column prop="content" label="反馈内容">
                </el-table-column>
                <el-table-column prop="contact" label="联系方式">
                </el-table-column>
                <el-table-column prop="title" label="反馈类别">
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="toDetail(scope.$index, scope.row)">查看</el-button>
                        <el-button size="small" type="danger" @click="handleEdit(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 详情弹窗 -->
        <el-dialog title="留言详情" :visible.sync="detailVisible" width="600px" center @close="closeDialog">
            <el-row :gutter="10" class="row">
                <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                    <div class="grid-content bg-purple label-text">联系方式</div>
                </el-col>
                <el-col>
                    <div class="grid-content bg-purple">{{allData.contact}}</div>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="row">
                <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                    <div class="grid-content bg-purple label-text">行业类别</div>
                </el-col>
                <el-col>
                    <div class="grid-content bg-purple">{{allData.title}}</div>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="row">
                <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                    <div class="grid-content bg-purple label-text">留言内容</div>
                </el-col>
                <el-col>
                    <div class="grid-content bg-purple">{{allData.content}}</div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import https from '../../../https.js'
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                editVisible: false,
                allData:{},
                delVisible: false,
                detailVisible: false,
                cur_page: 1,
                form: {
                    count: '',
                },
                rule: {
                    count:[{ required: true, message: '请输入企业人数', trigger: 'blur'}],
                },
                dialogTitle:'',
                idx: -1,
                status:0,
                member_id: localStorage.getItem('member_id'),
            }
        },
        created() {
            this.getData();
        },
        methods: {
            closeDialog(){
                this.allData = {}
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                const that = this;
                let params = {
                    member_id: that.member_id,
                    limit: 20,
                    page: that.cur_page,
                }
                https.fetchPost('feed_back/backList', params).then((e) => {
                    console.log(e)
                    if (e.code == 200) {
                        that.tableData = e.data;
                        for (let i = 0; i < that.tableData.length; i++) {
                            that.tableData[i].serialNumber = i + 1;
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            toDetail(index, row){
                this.detailVisible = true;
                this.allData = row;
                // this.$router.push({ path: '/mesDetail', query: { row: row }})
            },
            handleEdit(index, row) {
                var idArr = [];
                idArr.push(row.id);
                this.idArr = idArr;
                this.idx = index;
                this.delVisible = true;
            },
            // 确定删除
            deleteRow(){
                var that = this;
                let params = {
                    member_id:that.member_id,
                    id: that.idArr
                }
                https.fetchPost('feed_back/backDel',params ).then((e) => {
                    console.log(e)
                    if(e.code==200){
                        console.log('成功')
                        that.getData();
                        that.$message.success('删除成功');
                        that.delVisible = false;
                        that.idArr = [];
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }

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
