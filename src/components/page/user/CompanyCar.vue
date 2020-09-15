<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>企业车辆</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="addUser">添加车辆</el-button>
            </div>
            <el-table :data="tables" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="type" label="车辆类型">
                </el-table-column>
                <el-table-column prop="energy" label="能源类型">
                </el-table-column>
                <el-table-column prop="number" label="车牌号">
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间">
                </el-table-column>
                <el-table-column label="操作" width="260">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
                <el-form-item label="车辆类型" prop="select_type" :rules="{required:true,message:'请选择债务人单位',trigger:'blur'}">
                    <el-select v-model="form.select_type" placeholder="请选择车辆类型" width="100%">
                        <el-option v-for="(item, index) in carType" :key="index" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="能源类型" prop="select_energy">
                    <el-select v-model="form.select_energy" placeholder="请选择能源类型">
                        <el-option v-for="(item, index) in carEnergy" :key="index" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车牌号" prop="number">
                    <el-input v-model="form.number"></el-input>
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
    import qs from 'qs'
    export default {
        name: 'basetable',
        data() {
            return {
                // url: './static/vuetable.json',
                tableData: [],
                otableData:[],
                carType:[],
                carEnergy:[],
                dialogTitle:'',
                path:'',
                count:0,
                title:'',
                member_id:localStorage.getItem('member_id'),
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    number: '',      
                    select_type:'',
                    select_energy:''
                },
                rule: {
                    select_type: [{ required: true, message: '请选择车辆类型', trigger: 'blur' },],
                    select_energy:[{ required: true, message: '请选择能源类型', trigger: 'blur'}],
                    number:[{ required: true, message: '请输入车牌号', trigger: 'blur'}],
                },
                idx: -1,
                id:0,
                idArr:''
            }
        },
        created() {
            this.getData();
            this.getCar();
        },
        watch: {
            '$route' (to, from) {
            this.getData();
            this.getCar();
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
            getData(){
                var that = this;
                let params = {
                    id:that.$route.query.id,
                    member_id:that.member_id,
                    title:that.select_word,
                    page:that.cur_page,
                    limit:20,
                }
                https.fetchPost('conpany/carList',params ).then((e) => {
                console.log(e)
                if(e.code==200){
                    that.tableData = e.data;
                    that.count = e.count;
                    that.path = e.path+'/'
                }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 获取车辆类型
            getCar(){
                var that = this;
                let params = {
                    member_id:that.member_id,
                }
                https.fetchPost('conpany/addCar',params ).then((e) => {
                console.log(e)
                if(e.code==200){
                    that.carType = e.type;
                    that.carEnergy = e.energy
                }
                }).catch(err=>{
                    console.log(err)
                })
            },
            search() {
                this.is_search = true;
                this.getData();
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            // 添加用户
            addUser(){
                this.editVisible = true;
                this.dialogTitle = '添加';
            },
            handleEdit(index, row) {
                this.idx = index;
                this.id = row.id
                const item = this.tableData[index];
                console.log(item)
                this.form = {
                    select_energy:item.energy,
                    select_type:item.type,
                    number:item.number
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
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
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
                        conpany_id: that.$route.query.id,
                        member_id:that.member_id,
                        energy_id:that.form.select_energy,
                        type_id:that.form.select_type,
                        number:that.form.number
                    }
                    console.log(params)
                    https.fetchPost('conpany/createCar',params ).then((e) => {
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
                if(that.dialogTitle=='编辑'){
                    let params = {
                        id: that.id,
                        member_id:that.member_id,
                        energy_id:that.form.select_energy,
                        type_id:that.form.select_type,
                        number:that.form.number
                    }
                    https.fetchPost('conpany/updateCar',params ).then((e) => {
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
                https.fetchPost('conpany/delCar',params ).then((e) => {
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
