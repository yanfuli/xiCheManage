<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 管理员列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" style="width: 300px"></el-input>
                <el-button type="primary" icon="search" @click="getData">搜索</el-button>
                <el-button type="primary" icon="search" @click="search">添加管理员</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="id" width="180">
                </el-table-column>
                <el-table-column prop="username" label="用户账户">
                </el-table-column>
                <el-table-column prop="telephone" label="手机号">
                </el-table-column>
                <el-table-column prop="nickname" label="用户昵称">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="props">
                        <el-switch v-model="props.row.status" active-color="#13ce66"
                                   inactive-color="#ff4949" @change="statusModify(props.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间">
                </el-table-column>
                <el-table-column label="操作" width="180">
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
            <el-form ref="form" :model="form" label-width="120px" :rules="rule">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="pass">
                    <el-input v-model="form.pass"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="telephone">
                    <el-input v-model="form.telephone"></el-input>
                </el-form-item>
                <el-form-item label="用户组" prop="group_id">
                    <el-select v-model="form.group_id" placeholder="请选择">
                        <el-option :label="item.title" :value="item.id" v-for="(item,index) in statusList" :key="index"/>
                    </el-select>
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
                statusList: [],
                dialogTitle:'添加管理员',
                del_list: [],
                idArr:[],
                is_search: false,
                editVisible: false,
                delVisible: false,
                isAdd: 0,
                form: {
                    member_id: localStorage.getItem('member_id'),
                    id: '',
                    username: '',
                    password: '',
                    nickname: '',
                    telephone: '',
                    status: '',
                    group_id: '',
                    pass: '',
                },
                rule: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'},],
                    nickname: [{required: true, message: '请输入昵称', trigger: 'blur'}],
                    telephone: [{required: true, message: '请输入手机号', trigger: 'blur'},
                        {
                            required: true,
                            pattern: /^1[3456789]\d{9}$/,
                            message: '请输入正确的电话号码',
                            trigger: 'blur'
                        }
                    ],
                    group_id: [{required: true, message: '请输入用户组', trigger: 'blur'},
                        {required: true, message: '请输入上架状态', trigger: 'change'}
                    ],
                    status: [{required: true, message: '请输入状态', trigger: 'blur'},
                        {required: true, message: '请输入状态', trigger: 'change'}],
                },
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
            getStatus(){
                let params = {
                    member_id: this.form.member_id,
                }
                https.fetchPost('admin/add',params ).then((e) => {
                    console.log(e)
                    if(e.code==200){
                        this.statusList = e.data;
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            statusModify(row){
                console.log(row);
                const that = this;
                let status = '';
                row.status == true ? status = 1 : row.status == false ? status = 2 : '';
                let params = {
                    member_id : that.member_id,
                    id: row.id,
                    status: status,
                }
                https.fetchPost('admin/status',params ).then((e) => {
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
                    page :that.cur_page,
                    title:that.select_word
                }
                https.fetchPost('admin/index',params ).then((e) => {
                    console.log(e)
                    if(e.code==200){
                        that.tableData = e.data;
                        for (let i = 0; i < that.tableData.length; i++) {
                            that.tableData[i].status == 1 ? that.tableData[i].status = true : that.tableData[i].status == 2 ? that.tableData[i].status = false : '';
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            //  添加管理员
            search() {
                this.getStatus();
                this.editVisible = true;
                this.isAdd = 1;
                this.rule['password'] = [{required: true, message: '请输入密码', trigger: 'blur'}]; // 新增键值对
                this.rule['pass'] = [{required: true, message: '请输入确认密码', trigger: 'blur'}]; // 新增键值对
                // this.is_search = true;
                // this.$router.push('/addAdmin');
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            closeDialog(){
                this.form.username = '';
                this.form.nickname = '';
                this.form.telephone = '';
                this.form.type = '';
                this.form.start_time = '';
                this.form.end_time = ''
                this.form.status = '';
                this.form.id = '';
                this.form.group_id = '';
                console.log(this.form)
            },
            //  编辑管理员
            handleEdit(index, row) {
                this.getStatus();
                this.isAdd = 2;
                this.form.username = row.username;
                this.form.nickname = row.nickname;
                this.form.telephone = row.telephone;
                this.form.type = row.type;
                this.form.start_time = row.start_time;
                this.form.end_time = row.end_time;
                if(row.status === true){
                    this.form.status = '1';
                }else{
                    this.form.status = '2';
                }
                this.form.group_id = row.group_id;
                this.form.id = row.id;
                this.editVisible = true;
                if(this.rule.password){
                    delete this.rule.password
                    delete this.rule.pass
                }
                console.log(this.rule);

                // this.idx = index;
                // const item = this.tableData[index];
                // this.form = {
                //     name: item.name,
                //     date: item.date,
                //     address: item.address
                // }
                // this.editVisible = true;
                // this.$router.push({ path: '/addAdmin', query: { row: row }})
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
                console.log(this.multipleSelection);
            },
            // 保存编辑
            saveEdit(form) {
                // this.$set(this.tableData, this.idx, this.form);
                // this.editVisible = false;
                // this.$message.success(`修改第 ${this.idx+1} 行成功`);
                const that = this;
                this.$refs[form].validate(valid => {
                    if (valid) {
                        if(this.isAdd === 2){
                            https.fetchPost('admin/update', that.form).then((e) => {
                                console.log(e)
                                if (e.code == 200) {
                                    console.log('成功')
                                    this.$message.success('编辑成功');
                                    this.getData();
                                    this.editVisible = false;
                                } else {
                                    this.$message({
                                        message: e.msg,
                                        type: "warning"
                                    });
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                            this.isAdd = 0;
                        }else if(this.isAdd === 1){
                            https.fetchPost('admin/create', that.form).then((e) => {
                                console.log(e)
                                if (e.code == 200) {
                                    console.log('成功')
                                    this.$message.success('添加成功');
                                    this.getData();
                                    this.editVisible = false;
                                } else {
                                    this.$message({
                                        message: e.msg,
                                        type: "warning"
                                    });
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                            this.isAdd = 0;
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
                https.fetchPost('admin/del',params ).then((e) => {
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
