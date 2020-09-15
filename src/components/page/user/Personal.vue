<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 个人用户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column
                    prop="avatar"
                    label="微信头像"
                    sortable
                    width="180">
                
                    <!--插入图片链接的代码-->
                    <template slot-scope="scope">
                        <img  :src="path+scope.row.avatar" alt="" style="width: 50px;height: 50px">
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="微信名称">
                </el-table-column>
                <el-table-column prop="name" label="用户名称">
                </el-table-column>
                <el-table-column prop="username" label="手机号码">
                </el-table-column>
                <el-table-column prop="type" label="会员类型" width="180">
                </el-table-column>
                <el-table-column prop="status" label="用户类型" width="180">
                </el-table-column>
                <el-table-column prop="update_time" label="日期" sortable>
                </el-table-column>

                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handleSee(scope.$index, scope.row.id)">查看</el-button>
                        <el-button size="small" type="primary" @click="handleShare(scope.$index, scope.row.id)">分享用户</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="count">
                </el-pagination>
            </div>
        </div>

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
                member_id:localStorage.getItem('member_id'),
                tableData: [],
                path:'',
                count:0,
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
                    date: '',
                    address: ''
                },
                idx: -1
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
            getData(){
                var that = this;
                let params = {
                    title:'',
                    page:that.cur_page,
                    limit:20,
                    member_id:that.member_id,
                }
                https.fetchPost('member/index',params ).then((e) => {
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
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
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
            handleSee(idx,id){
                var id = id;
                var idx = idx;
                this.$router.push({ name: 'personalDetail', query: { id: id }})
            },
            handleShare(idx,id){
                var id = id;
                var idx = idx;
                this.$router.push({ name: 'shareUser', params: { id: id }})
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
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
