<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>管理员分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="getData">搜索</el-button>
                <el-button type="primary" icon="search" @click="search">添加管理员</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="id" width="180">
                </el-table-column>
                <el-table-column prop="title" label="角色名称">
                </el-table-column>
                <el-table-column prop="description" label="角色描述">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="props">
                        <el-switch v-model="props.row.status" active-color="#13ce66"
                                   inactive-color="#ff4949" @change="statusModify(props.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">权限</el-button>
                        <el-button size="small" @click="toEdit(scope.$index, scope.row)">编辑</el-button>
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
            <el-form ref="form" :model="form" label-width="120px" :rules="rule">
                <el-form-item label="用户组名称" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="用户组描述" prop="description">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="用户组所属模块" prop="module">
                    <el-input v-model="form.module"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="2">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
<!--                <el-form-item>-->
<!--                    <el-button type="primary" @click="onSubmit('form')">表单提交</el-button>-->
<!--                    <el-button>取消</el-button>-->
<!--                </el-form-item>-->
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
    import https from "../../../https";

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
                del_list: [],
                idArr: [],
                dialogTitle: '添加管理组',
                rule: {
                    title: [{required: true, message: '请输入用户组名称', trigger: 'blur'},],
                    description: [{required: true, message: '请输入用户组描述', trigger: 'blur'}],
                    module: [{required: true, message: '请输入用户组所属模块', trigger: 'blur'}],
                    status: [{required: true, message: '请输入状态', trigger: 'blur'},
                        {required: true, message: '请输入状态', trigger: 'change'}],
                },
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    id: '',
                    title: '',
                    description: '',
                    module: '',
                    status: '',
                    member_id: localStorage.getItem('member_id'),
                },
                isAdd: 0,
                idx: -1,
                member_id: localStorage.getItem('member_id'),
            }
        },
        created() {
            this.getData();
        },
        // watch: {
        //     $route (to, from) {
        //         this.getData();
        //     }
        // },
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
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                const that = this;
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/ms/table/list';
                }
                let params = {
                    member_id: that.member_id,
                    limit: 20,
                    page: that.cur_page,
                    title: that.select_word
                }
                https.fetchPost('auth_group/index', params).then((e) => {
                    console.log(e)
                    if (e.code == 200) {
                        that.tableData = e.data
                        for (let i = 0; i < that.tableData.length; i++) {
                            that.tableData[i].status == 1 ? that.tableData[i].status = true : that.tableData[i].status == 2 ? that.tableData[i].status = false : '';
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            statusModify(row){
                const that = this;
                let status = '';
                row.status == true ? status = 1 : row.status == false ? status = 2 : '';
                let params = {
                    member_id : that.member_id,
                    id: row.id,
                    status: status,
                }
                https.fetchPost('auth_group/status',params ).then((e) => {
                    console.log(e)
                    if(e.code==200){
                        console.log('成功')
                        that.getData();
                        that.$message.success('状态修改成功');
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            search() {
                this.isAdd = 1;
                this.pageTitle = '添加管理组';
                this.editVisible = true;
                // this.$router.push('/addAdminClass');
            },
            toEdit(index, row){
                this.isAdd = 2;
                this.pageTitle = '编辑管理组';
                this.form.title = row.title;
                this.form.description = row.description;
                this.form.module = row.module;
                if(row.status === true){
                    this.form.status = '1';
                }else{
                    this.form.status = '2';
                }
                this.form.id = row.id;
                this.editVisible = true;
                // this.$router.push({ path: '/addAdminClass', query: { row: row }})
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                // this.idx = index;
                // const item = this.tableData[index];
                // this.form = {
                //     name: item.name,
                //     date: item.date,
                //     address: item.address
                // }
                // this.editVisible = true;
                this.$router.push({ path: '/quanxianList', query: { row: row }})
            },
            handleDelete(index, row) {
                var idArr = [];
                idArr.push(row.id);
                this.idArr = idArr;
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                // const length = this.multipleSelection.length;
                // let str = '';
                // this.del_list = this.del_list.concat(this.multipleSelection);
                // for (let i = 0; i < length; i++) {
                //     str += this.multipleSelection[i].name + ' ';
                // }
                // this.$message.error('删除了' + str);
                // this.multipleSelection = [];
                for(let i=0;i<this.multipleSelection.length;i++){
                    this.idArr[i] = this.multipleSelection[i].id;
                }
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            closeDialog(){
                this.form.title = '';
                this.form.description = '';
                this.form.module = '';
                this.form.status = '';
                this.form.id = '';
                console.log(this.form)
            },
            // 保存编辑
            saveEdit(form) {
                const that = this;
                this.$refs[form].validate(valid => {
                    if (valid) {
                        if(this.isAdd === 2){
                            https.fetchPost('auth_group/update', that.form).then((e) => {
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
                            https.fetchPost('auth_group/create', that.form).then((e) => {
                                console.log(e)
                                if (e.code == 200) {
                                    console.log('成功')
                                    this.$message.success('添加成功');
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
                https.fetchPost('auth_group/del',params ).then((e) => {
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
    .el-table__header{
        width: 100%!important;
    }
    .el-table__body{
        width: 100%!important;
    }
</style>
