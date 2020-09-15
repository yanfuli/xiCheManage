<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>车辆类型</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
<!--                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
<!--                <el-button type="primary" icon="search" @click="search">搜索</el-button>-->
                <el-button type="primary" icon="search" @click="search">添加类型</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="title" label="类型名称">
                </el-table-column>
<!--                <el-table-column prop="mobile" label="是否启用">-->
<!--                    <el-switch-->
<!--                    v-model="value"-->
<!--                    active-color="#13ce66"-->
<!--                    inactive-color="#ff4949">-->
<!--                    </el-switch>-->
<!--                </el-table-column>-->
                <el-table-column prop="create_time" label="创建时间">
                </el-table-column>
                <el-table-column label="操作" width="240">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="editVisible" width="30%" @close="closeDialog">
            <el-form ref="form" :model="form" label-width="100px" :rules="rule">
                <el-form-item label="类型名称" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import https from "../../https";

    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                dialogTitle: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                value: true,
                form: {
                    id: '',
                    title: '',
                    member_id: localStorage.getItem('member_id'),
                },
                isAdd: 0,
                rule: {
                    title: [{required: true, message: '请输入类型名称', trigger: 'blur'},]
                },
                idArr: [],
                idx: -1,
                member_id: localStorage.getItem('member_id'),
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            closeDialog(){
                this.form.title = '';
                this.form.id = '';
                console.log(this.form)
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
                https.fetchPost('type/index', params).then((e) => {
                    console.log(e)
                    if (e.code == 200) {
                        that.tableData = e.data
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            search() {
                this.isAdd = 1;
                this.dialogTitle = '添加车辆类型';
                this.editVisible = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.isAdd = 2;
                this.dialogTitle = '编辑车辆类型';
                this.form.title = row.title;
                this.form.id = row.id;
                this.editVisible = true;
            },
            handleDelete(index, row) {
                var idArr = [];
                idArr.push(row.id);
                this.idArr = idArr;
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                for(let i=0;i<this.multipleSelection.length;i++){
                    this.idArr[i] = this.multipleSelection[i].id;
                }
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit(form) {
                const that = this;
                this.$refs[form].validate(valid => {
                    if (valid) {
                        if(this.isAdd === 2){
                            https.fetchPost('type/update', that.form).then((e) => {
                                console.log(e)
                                if (e.code == 200) {
                                    console.log('成功')
                                    this.$message.success('编辑成功');
                                    this.getData();
                                    this.editVisible = false;
                                    this.isAdd = 0;
                                } else {
                                    this.$message({
                                        message: e.msg,
                                        type: "warning"
                                    });
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        }else if(this.isAdd === 1){
                            https.fetchPost('type/create', that.form).then((e) => {
                                console.log(e)
                                if (e.code == 200) {
                                    console.log('成功')
                                    this.$message.success('添加成功');
                                    this.getData();
                                    this.editVisible = false;
                                    this.isAdd =0;
                                } else {
                                    this.$message({
                                        message: e.msg,
                                        type: "warning"
                                    });
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            // 确定删除
            deleteRow(){
                var that = this;
                let params = {
                    member_id:that.member_id,
                    id: that.idArr
                }
                https.fetchPost('type/del',params ).then((e) => {
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
