<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 人数管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="tableData" border style="width: 60%; margin:0 auto;" ref="multipleTable">
                <el-table-column label="序号" width="80">
                    <p>1</p>
                </el-table-column>
                <el-table-column prop="count" label="企业人数">
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px" :rules="rule">
                <el-form-item label="企业人数">
                    <el-input v-model="form.count"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import https from '../../https.js' 
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                editVisible: false,
                delVisible: false,
                form: {
                    count: '',
                },
                rule: {
                    count:[{ required: true, message: '请输入企业人数', trigger: 'blur'}],
                },
                dialogTitle:'',
                idx: -1,
                status:0,
                member_id:localStorage.getItem('member_id'),
            }
        },
        created() {
            this.getData();
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                var that = this;
                let params = {
                    member_id:that.member_id,
                }
                console.log(params)
                https.fetchPost('conpany_count/index',params ).then((e) => {
                console.log(e)
                let numArr = [];
                numArr.push(e.data)
                if(e.code==200){
                    that.tableData = numArr;
                }
                if(e.code==5003){
                    this.$router.push('/login');
                }
                }).catch(err=>{
                    console.log(err)
                })
            },
            handleEdit(index, row) {
                this.idx = index;
                this.id = row.id;
                const item = this.tableData[index];
                this.form = {
                    count: item.count,
                }
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit(form) {
                var that = this;
                 this.$refs[form].validate(valid => {
                    if (valid) {
                        let params = {
                            id: that.id,
                            member_id:that.member_id,
                            count:that.form.count
                        }
                        console.log(params)
                        https.fetchPost('conpany_count/update',params ).then((e) => {
                            console.log(e)
                            if(e.code==200){
                                console.log('成功')
                                that.getData();
                                that.editVisible = false;
                                that.form = {}
                            }
                        }).catch(err=>{
                            console.log(err)
                        })
                    }
                })
            },
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
</style>
