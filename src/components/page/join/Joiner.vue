<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>加盟商信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>   
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" @click="addInfo">添加信息</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="序号" width="80">
                    <template slot-scope="scope">
                        <p>{{scope.$index}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="加盟商名称">
                </el-table-column>
                <el-table-column prop="type" label="行业类别">
                </el-table-column>
                <el-table-column prop="phone" label="联系电话">
                </el-table-column>
                <el-table-column prop="pic" label="显示宣传图片">
                    <template slot-scope="scope">
                        <img :src="path + scope.row.pic" alt="">
                    </template> 
                </el-table-column>
                <el-table-column prop="address" label="加盟商地址">
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间">
                </el-table-column>
                <el-table-column label="操作" width="180">
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
        <el-dialog :title="dialogTitle" :visible.sync="editVisible" width="34%">
            <el-form ref="form" :model="form" label-width="120px" :rules="rule">
                <el-form-item label="加盟商名称" prop="name">
                     <el-input v-model="form.name"></el-input>
                 </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="加盟商类别" prop="type">
                    <el-input v-model="form.type"></el-input>
                </el-form-item>
                <el-form-item label="加盟商地址" prop="address">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="展示图片" class="changeup" prop="pic">
                    <el-upload
                        class="avatar-uploader"
                        action="http://xiche.aixiaoqu98.com/public/index.php/admin/login/uploads"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
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
        data() {
            var checkPhone = (rule, value, callback) => {
                const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
                if (!value) {
                return callback(new Error('电话号码不能为空'))
                }
                setTimeout(() => {
                // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
                // 所以我就在前面加了一个+实现隐式转换

                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'))
                } else {
                    if (phoneReg.test(value)) {
                    callback()
                    } else {
                    callback(new Error('电话号码格式不正确'))
                    }
                }
                }, 100)
            }
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_status: '',
                select_service:'',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name:'',
                    phone:'',
                    type:'',
                    address:''
                },
                
                rule: {
                    name: [{ required: true, message: '请填写加盟商名称', trigger: 'blur' },],
                    phone:[{ required: true, validator: checkPhone, trigger: 'blur' }],
                    type:[{ required: true, message: '请填写加盟商类型', trigger: 'blur'}],
                    address:[{ required: true, message: '请填写加盟商地址', trigger: 'blur' }],
                    // pic: [{ required: true, message: '请上传图片', trigger: 'change'}]
                },
                path:'',
                id:0,
                dialogTitle:'',
                idx: -1,
                status:0,
                select_date:'',
                count:0,
                fileList:[],
                imageUrl:'',
                imgUrl:'',
                member_id:localStorage.getItem('member_id'),
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
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                var that = this;
                let params = {
                    member_id:that.member_id,
                    page:that.cur_page,
                    title:that.select_word,
                    limit:20,
                }
                console.log(params)
                https.fetchPost('cooperation/index',params ).then((e) => {
                console.log(e)
                if(e.code==200){
                    that.tableData = e.data;
                    that.count = e.count;
                    that.path = e.path+'/public/';
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
            },
            addInfo(){
                this.dialogTitle = '添加'
                this.editVisible = true;
            },
            handleEdit(index, row) {
                console.log(row)
                this.dialogTitle = '编辑'
                this.idx = index;
                const item = this.tableData[index];
                this.id = row.id;
                console.log(this.path)
                console.log(row)
                // if(row.pic){
                //     this.imageUrl = this.path + row.pic
                // }else{
                //     this.imageUrl = '';
                // }
                
                this.form.name = row.name;
                this.form.phone = row.phone;
                this.form.type = row.type;
                this.form.address = row.address;
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.id = row.id;
                var idArr = [];
                idArr.push(row.id)
                this.idArr = idArr;
                this.delVisible = true;
            },
            delAll() {
                this.idArr = this.multipleSelection.map(item=>item.id)
                this.delVisible = true;   
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 上传图片成功
            handleAvatarSuccess(res, file) {
                console.log(file)
                this.imageUrl = URL.createObjectURL(file.raw);
                this.imgUrl = file.response
            },
            // 上传前
            beforeAvatarUpload(file) {
                if(this.dialogTitle=='添加'){
                    this.imageUrl = ''
                }else{
                    this.imageUrl = this.imageUrl
                }
            },
            // 保存编辑
            saveEdit(form) {
                var that = this;
                 this.$refs[form].validate(valid => {
                    if (valid) {
                    if(that.dialogTitle=='添加'){
                    let params = {
                        member_id:that.member_id,
                        name:that.form.name,
                        phone:that.form.phone,
                        type:that.form.type,
                        pic:that.imgUrl,
                        address:that.form.address
                    }
                    console.log(params)
                    https.fetchPost('cooperation/create',params ).then((e) => {
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
                        member_id:that.member_id,
                        name:that.form.name,
                        phone:that.form.phone,
                        type:that.form.type,
                        pic:that.imgUrl,
                        address:that.form.address,
                        id: that.id
                    }
                    https.fetchPost('cooperation/update',params ).then((e) => {
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
                var idArr = {id:that.idArr}
                let params = {
                    member_id:that.member_id,
                    id: that.idArr
                }
                https.fetchPost('cooperation/del',params ).then((e) => {
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

<style>
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
    /* el-upload el-upload--text */
    .changeup .avatar-uploader .el-upload--text{
        width: auto !important;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
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
