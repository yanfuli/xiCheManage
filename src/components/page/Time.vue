<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>时间管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
<!--            <div class="handle-box">-->
<!--                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>        -->
<!--                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
<!--                <el-button type="primary" icon="search" @click="search">搜索</el-button>-->
<!--                <el-button type="primary" icon="search" @click="search">添加时间</el-button>-->
<!--            </div>-->
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
<!--                <el-table-column type="selection" width="55"></el-table-column>-->
                <el-table-column prop="id" label="id" width="180">
                </el-table-column>
                <el-table-column prop="time" label="时间段">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="props">
                        <el-switch v-model="props.row.status" active-color="#13ce66"
                                   inactive-color="#ff4949" @change="statusModify(props.row)">
                        </el-switch>
                    </template>
                </el-table-column>
<!--                <el-table-column label="操作" width="240">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
<!--                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
<!--                    </template>-->
<!--                </el-table-column>-->
            </el-table>
<!--            <div class="pagination">-->
<!--                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">-->
<!--                </el-pagination>-->
<!--            </div>-->
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="时间段">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
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
                    title: that.select_word
                }
                https.fetchPost('time/timeList', params).then((e) => {
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
                console.log(row);
                const that = this;
                let status = '';
                row.status == true ? status = 1 : row.status == false ? status = 2 : '';
                let params = {
                    member_id : that.member_id,
                    id: row.id,
                    status: status,
                }
                https.fetchPost('time/status',params ).then((e) => {
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
