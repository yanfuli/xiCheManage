<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>服务项目</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="addItem">添加服务项目</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="服务项目名称">
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间">
                </el-table-column>
                <el-table-column label="操作" width="260">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="primary" @click="handleSee(scope.row)">查看价格</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="count">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="editVisible" width="35%">
            <el-form ref="form" :model="form" label-width="100px" :rules="rule">
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="form.name"></el-input>
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
    import https from '../../../https.js' 
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                dialogTitle:'',
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name: '',
                },
                rule: {
                    name: [{ required: true, message: '请填写分类名称', trigger: 'blur' },],
                },
                idx: -1,
                id:0,
                type_id:0,
                count:0,
                member_id:localStorage.getItem('member_id'),
            }
        },
        mounted() {
            
        },
        created() {
            console.log(this.$route.query.id)
            if(this.$route.query.id){
                this.getData();
            }
        },
        computed: {
            tables() {
                const search = this.select_word
                if(search) {
                    // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
                    // 注意： filter() 不会对空数组进行检测。
                    // 注意： filter() 不会改变原始数组。
                    return this.tableData.filter(data => {
                        // some() 方法用于检测数组中的元素是否满足指定条件;
                        // some() 方法会依次执行数组的每个元素：
                        // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
                        // 如果没有满足条件的元素，则返回false。
                        // 注意： some() 不会对空数组进行检测。
                        // 注意： some() 不会改变原始数组。
                        return Object.keys(data).some(key => {
                            // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
                            // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
                            return String(data[key]).toLowerCase().indexOf(search) > -1
                        })
                    })
                }
                return this.tableData
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
                var that = this;
                console.log(that.select_word)
                let params = {
                    member_id:that.member_id,
                    page:that.cur_page,
                    limit:10,
                    title:that.select_word,
                    type_id:this.$route.query.id
                }
                https.fetchPost('service/serviceList',params ).then((e) => {
                console.log(e)
                if(e.code==200){
                    that.tableData = e.data;
                    that.count = e.count;
                }
                if(e.code==5003){
                    this.$router.push('/login');
                }
                }).catch(err=>{
                    console.log(err)
                })
            },
            search() {
                this.is_search = true;
                this.getData();
            },
            addItem(){
                this.editVisible = true;
                this.dialogTitle = '添加';
            },
            handleSee(row){
                var id = row.id
                this.$router.push({ path: '/servicePrice', query: { service_id: id,type_id:this.$route.query.id }})
            },
            handleEdit(index, row) {
                this.idx = index;
                this.id = row.id;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                }
                this.dialogTitle = '编辑';
                this.editVisible = true;
            },
            handleDelete(index, row) {
                var idArr = [];
                idArr.push(row.id);
                this.idArr = idArr;
                this.idx = index;
                this.delVisible = true;
            },
            // 全选删除
            delAll() {
                this.idArr = this.multipleSelection.map(item=>item.id)
                this.delVisible = true;   
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit(form) {
                 var that = this;
                 this.$refs[form].validate(valid => {
                    if (valid) {
                        if(that.dialogTitle=='添加'){
                    let params = {
                        member_id:that.member_id,
                        type_id:that.$route.query.id,
                        name:that.form.name,
                    }
                    console.log(params)
                    https.fetchPost('service/serviceCreate',params ).then((e) => {
                    console.log(e)
                    if(e.code==200){
                        console.log('成功')
                        that.getData();
                        that.editVisible = false;
                        that.form.name = '';
                    }
                    }).catch(err=>{
                        console.log(err)
                    })
                }
                if(that.dialogTitle=='编辑'){
                    let params = {
                        member_id:that.member_id,
                        type_id:that.$route.query.id,
                        name:that.form.name,
                        id: that.id
                    }
                    console.log(params)
                    https.fetchPost('service/serviceUpdate',params ).then((e) => {
                        console.log(e)
                        if(e.code==200){
                            console.log('成功')
                            that.getData();
                            that.editVisible = false;
                            that.form.name = '';
                        }
                    }).catch(err=>{
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
                console.log(params)
                https.fetchPost('service/serviceDel',params ).then((e) => {
                    console.log(e)
                    if(e.code==200){
                        console.log('成功')
                        that.getData();
                        that.tableData.splice(this.idx, 1);
                        that.$message.success('删除成功');
                        that.delVisible = false;
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
</style>
