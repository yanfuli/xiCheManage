<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>反馈类型</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>        
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="addMes">添加类型</el-button>
            </div>
            <el-table :data="allData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="title" label="名称">
                </el-table-column>
                <el-table-column prop="status" label="是否启用">
                    <template slot-scope="props">
                        <el-switch v-model="props.row.status" active-color="#13ce66"
                                   inactive-color="#ff4949" @change="statusModify(props.row)">
                        </el-switch>
                    </template>
                </el-table-column>
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
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="count">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="120px" :rules="rule">
                <el-form-item label="反馈类型" prop="title">
                     <el-input v-model="form.title"></el-input>
                 </el-form-item>
                <el-form-item label="启用状态" prop="status">
                     <el-radio-group v-model="form.status">
                         <el-radio label="1">启用</el-radio>
                         <el-radio label="2">禁用</el-radio>
                     </el-radio-group>
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
                url: './static/vuetable.json',
                allData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                value: true,
                form: {
                    title:'',
                    status:''
                },
                rule:{
                    title: [{required: true, message: '请输入反馈类型标题', trigger: 'blur'},
                    {required: true, message: '请输入反馈类型标题', trigger: 'change'}],
                    status: [{required: true, message: '请选择状态', trigger: 'blur'},
                        {required: true, message: '请选择状态', trigger: 'change'}],
                },
                idArr:[],
                idx: -1,
                count:0,
                member_id:localStorage.getItem('member_id'),
                dialogTitle:''
            }
        },
        created() {
            this.getData();
        },
        computed: {
            tables() {
                const search = this.select_word
                if(search) {
                    // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
                    // 注意： filter() 不会对空数组进行检测。
                    // 注意： filter() 不会改变原始数组。
                    return this.allData.filter(data => {
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
                return this.allData
            }
        },
        methods: {
            
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData() { 
                const that = this;
                let params = {

                    member_id: that.member_id,
                    limit: 10,
                    page: that.cur_page,
                }
                https.fetchPost('feed_back/index', params).then((e) => {
                    console.log(e)
                    if (e.code == 200) {
                        that.allData = e.data;
                        that.count = e.count;
                        for (let i = 0; i < that.allData.length; i++) {
                            that.allData[i].status == 1 ? that.allData[i].status = true : that.allData[i].status == 2 ? that.allData[i].status = false : '';
                            that.allData[i].serialNumber = i + 1;
                        }
                        console.log(that.allData)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 修改状态
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
                console.log(params)
                https.fetchPost('feed_back/status',params ).then((e) => {
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
                this.is_search = true;
            },
            handleEdit(index, row) {
                this.dialogTitle = '编辑';
                this.idx = index;
                this.id = row.id;
                const item = this.allData[index];
                if(row.status === true){
                    this.form.status = '1';
                }else{
                    this.form.status = '2';
                }
                this.form.title = row.title;
                this.editVisible = true;
            },
            // 添加
            addMes(){
                this.dialogTitle = '添加';
                this.form = {
                }
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
                            title:that.form.title,
                            status:that.form.status,
                        }
                        console.log(params)
                        https.fetchPost('feed_back/create',params ).then((e) => {
                        console.log(e)
                        if(e.code==200){
                            console.log('成功')
                            that.getData();
                            that.editVisible = false;
                            that.form.title = '';
                            that.form.status = '';
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }
                if(that.dialogTitle=='编辑'){
                    let params = {
                        member_id:that.member_id,
                        title:that.form.title,
                        status:that.form.status,
                        id:that.id
                    }
                    console.log(params)
                    https.fetchPost('feed_back/update',params ).then((e) => {
                        console.log(e)
                        if(e.code==200){
                            console.log('成功')
                            that.getData();
                            that.editVisible = false;
                            that.form.title = '';
                            that.form.status = '';
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
                https.fetchPost('feed_back/del',params ).then((e) => {
                    console.log(e)
                    if(e.code==200){
                        console.log('成功')
                        that.getData();
                        that.allData.splice(this.idx, 1);
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
