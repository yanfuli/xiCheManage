<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 优惠券管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button type="primary" icon="search" @click="search">添加优惠券</el-button>
            </div>
            <el-table :data="allData" border style="width: 100%" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="serialNumber" label="序号" width="55">
                </el-table-column>
                <el-table-column prop="title" label="优惠券标题">
                </el-table-column>
                <el-table-column prop="types" label="优惠券种类">
                    <template slot-scope="props">{{props.row.types == 1 ? '满减' : '分类'}}
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="优惠券分类">
                    <template slot-scope="props">{{props.row.type == 1 ? '全部' : props.row.type == 2 ? '新人' :
                        props.row.type == 3 ? '分享' : ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="actual_price" label="可使用价格">
                </el-table-column>
                <el-table-column prop="virtual_price" label="满减价格">
                </el-table-column>
                <el-table-column prop="number" label="剩余数量">
                </el-table-column>
                <el-table-column prop="name" label="开始时间 / 结束时间">
                    <template slot-scope="props">{{props.row.start_time +'至'+props.row.end_time}}</template>
                </el-table-column>
                <el-table-column prop="status" label="上架状态">
                    <template slot-scope="props">
                        <el-switch v-model="props.row.status" active-color="#13ce66"
                                   inactive-color="#ff4949" @change="statusModify(props.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
         <el-dialog :title="dialogTitle" :visible.sync="editVisible" width="40%" @close="closeDialog">
             <el-form ref="form" :model="form" label-width="140px" :rules="rule">
                 <el-form-item label="优惠券标题" prop="title">
                     <el-input v-model="form.title"></el-input>
                 </el-form-item>
                 <el-form-item label="优惠券描述" prop="content">
                     <el-input type="textarea" rows="5" v-model="form.content"></el-input>
                 </el-form-item>
                 <el-form-item label="优惠券种类" prop="types">
                     <el-radio-group v-model="form.types">
                         <el-radio label="1" v-model="form.types">满减</el-radio>
                         <el-radio label="2" v-model="form.types">分类</el-radio>
                     </el-radio-group>
                 </el-form-item>
                 <el-form-item label="服务项目" prop="service_id">
                     <el-select v-model="form.service_id" placeholder="请选择">
                        <el-option-group
                        v-for="itm in classify"
                        :key="itm.name"
                        :label="itm.name">
                        <el-option
                            v-for="item in itm.list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                        </el-option-group>
                    </el-select>
                 </el-form-item>
                 <el-form-item label="优惠券分类" prop="type">
                     <el-radio-group v-model="form.type">
                         <el-radio label="1">全部</el-radio>
                         <el-radio label="2">新人</el-radio>
                         <el-radio label="3">分享</el-radio>
                     </el-radio-group>
                 </el-form-item>
                 <el-form-item label="上架状态" prop="status">
                     <el-radio-group v-model="form.status">
                         <el-radio label="1">上架</el-radio>
                         <el-radio label="2">下架</el-radio>
                     </el-radio-group>
                 </el-form-item>
                 <el-form-item label="可使用价格" prop="actual_price">
                     <el-input v-model="form.actual_price"
                               onkeyup="value=value.replace(/[^\d]/g, '').replace(/^0{1,}/g,'')"></el-input>
                 </el-form-item>
                 <el-form-item label="满减价格" prop="virtual_price">
                     <el-input v-model="form.virtual_price"
                               onkeyup="value=value.replace(/[^\d]/g, '').replace(/^0{1,}/g,'')"></el-input>
                 </el-form-item>
                 <el-form-item label="派发数量" prop="number">
                     <el-input v-model="form.number"
                               onkeyup="value=value.replace(/[^\d]/g, '').replace(/^0{1,}/g,'')"></el-input>
                 </el-form-item>
                 <el-form-item label="使用区间时间" prop="value1">
                     <el-date-picker
                         v-model="form.value1"
                         type="daterange"
                         range-separator="至"
                         start-placeholder="开始日期"
                         end-placeholder="结束日期"
                         @change="startTimeEndtimeBtn">
                     </el-date-picker>
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
    import https from "../../../https";

    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                classify:[
                ],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                dialogTitle: '',
                select_word: '',
                del_list: [],
                allData: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    member_id: localStorage.getItem('member_id'),
                    title: '',
                    actual_price: '',
                    virtual_price: '',
                    content: '',
                    number: '',
                    start_time: '',
                    end_time: '',
                    status: '',
                    type: '',
                    types:'1',
                    value1: '',
                    id:'',
                    service_id:'',
                },
                rule: {
                    title: [{required: true, message: '请输入优惠券标题', trigger: 'blur'},],
                    actual_price: [{required: true, message: '请输入可使用价格', trigger: 'blur'}],
                    virtual_price: [{required: true, message: '请输入满减价格', trigger: 'blur'}],
                    content: [{required: true, message: '请输入优惠券描述', trigger: 'blur'}],
                    number: [{required: true, message: '请输入派发数量', trigger: 'blur'}],
                    value1: [{required: true, message: '请输入使用区间时间', trigger: 'blur'}],
                    status: [{required: true, message: '请输入上架状态', trigger: 'blur'},
                        {required: true, message: '请输入上架状态', trigger: 'change'}],
                    type: [{required: true, message: '请输入优惠券分类', trigger: 'blur'},
                        {required: true, message: '请输入优惠券分类', trigger: 'change'}],
                    types: [{required: true, message: '请输入优惠券种类', trigger: 'blur'},
                        {required: true, message: '请输入优惠券种类', trigger: 'change'}],
                    service_id:[{required: true, message: '请选择服务项目', trigger: 'blur'},
                        {required: true, message: '请选择服务项目', trigger: 'change'}]
                },
                isAdd: 0,
                idx: -1,
                idArr: [],
                member_id: localStorage.getItem('member_id'),
            }
        },
        created() {
            this.getData();
            this.getClassify();
        },
        computed: {
        },
        // watch: {
        //     $route (to, from) {
        //         this.getData();
        //     }
        // },
        methods: {
            startTimeEndtimeBtn(e) {
                this.form.end_time = e
                    ? this.timeTransverter(this.form.value1[1])
                    : "";
                this.form.start_time = e
                    ? this.timeTransverter(this.form.value1[0])
                    : "";
            },
            // 时间转化
            timeTransverter(date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? "0" + m : m;
                var d = date.getDate();
                d = d < 10 ? "0" + d : d;
                return y + "-" + m + "-" + d;
            },
            closeDialog(){
                this.form.title = '';
                this.form.actual_price = '';
                this.form.virtual_price = '';
                this.form.content = '';
                this.form.number = '';
                this.form.type = '';
                this.form.start_time = '';
                this.form.end_time = '';
                this.form.status = '';
                this.form.value1 = '';
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
                    limit: 10,
                    page: that.cur_page,
                    title: that.select_word
                }
                https.fetchPost('coupon/index', params).then((e) => {
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
            // 获取分类服务
            getClassify(){
                const that = this;
                let params = {
                    member_id: that.member_id,
                    limit: 10,
                    page: that.cur_page,
                    title: that.select_word
                }
                https.fetchPost('coupon/add', params).then((e) => {
                    console.log(e)
                    if (e.code == 200) {
                        that.classify = e.data;
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            search() {
                this.isAdd = 1;
                this.pageTitle = '添加优惠券';
                this.editVisible = true;
                // this.$router.push('/addCoupon');
                console.log(this.form)
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
                https.fetchPost('coupon/status',params ).then((e) => {
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
            handleEdit(index, row) {
                this.isAdd = 2;
                this.pageTitle = '编辑优惠券';
                this.form.title = row.title;
                this.form.actual_price = row.actual_price;
                this.form.virtual_price = row.virtual_price;
                this.form.content = row.content;
                this.form.number = row.number;
                this.form.type = row.type;
                this.form.start_time = row.start_time;
                this.form.end_time = row.end_time;
                if(row.status === true){
                    this.form.status = '1';
                }else{
                    this.form.status = '2';
                }
                this.form.value1 = [row.start_time, row.end_time];
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
                            https.fetchPost('coupon/updateCoupon', that.form).then((e) => {
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
                            https.fetchPost('coupon/createCoupon', that.form).then((e) => {
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
                https.fetchPost('coupon/delCoupon',params ).then((e) => {
                    console.log(e)
                    if(e.code==200){
                        console.log('成功')
                        that.getData();
                        that.$message.success('删除成功');
                        that.delVisible = false;
                    }else if(e.code == 201){
                        this.$message({
                            message: e.msg,
                            type: "warning"
                        });
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

    .del-dialog-cnt {
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
