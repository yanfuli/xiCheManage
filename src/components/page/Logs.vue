<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 日志列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="allData" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="id" label="ID" width="150">
                </el-table-column>
                <el-table-column prop="detail" label="操作">
                </el-table-column>
                <el-table-column prop="create_date" label="时间">
                </el-table-column>
                <el-table-column prop="login_ip" label="IP地址">
                </el-table-column>
                <el-table-column prop="username" label="操作人">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import https from "../../https";
    export default {
        data() {
            return {
                allData:[],
                cur_page: 1,
                count:0,
            }
        },
        created() {
            this.getData();
        },
        computed: {

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
                    member_id: localStorage.getItem('member_id'),
                    page:that.cur_page,
                    limit:10,
                }
                https.fetchPost('log/index', params).then((e) => {
                    console.log(e)
                    if (e.code == 200) {
                        that.allData = e.data;
                        that.count = e.count
                    }
                }).catch(err => {
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
