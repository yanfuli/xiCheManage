<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 个人用户订单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="select_status" placeholder="订单状态" class="handle-select mr10" @change="selectStutas">
                    <el-option key="1" label="已支付" value="1"></el-option>
                    <el-option key="2" label="已完成" value="2"></el-option>
                    <el-option key="3" label="申请退款" value="3"></el-option>
                    <el-option key="4" label="退款通过" value="4"></el-option>
                    <el-option key="5" label="退款成功" value="5"></el-option>
                    <el-option key="6" label="退款失败" value="6"></el-option>
                </el-select>
                <el-date-picker
                    v-model="select_date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    @change="selectDate"
                    >
                </el-date-picker>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <el-table-column label="序号" width="80">
                    <template slot-scope="scope">
                        <p>{{scope.$index}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="order_number" label="订单号">
                </el-table-column>
                <el-table-column prop="title" label="服务内容">
                </el-table-column>
                <el-table-column prop="nickname" label="用户名">
                </el-table-column>
                <el-table-column prop="username" label="手机号">
                </el-table-column>
                <el-table-column prop="price" label="支付金额" width="80">
                </el-table-column>
                <el-table-column prop="way" label="支付方式" width="80">
                </el-table-column>
                <el-table-column prop="status" label="订单状态"  width="80">
                    <template slot-scope="scope">
                        <p v-if="scope.row.status=='1'">已支付</p>
                        <p v-if="scope.row.status=='2'">已完成</p>
                        <p v-if="scope.row.status=='3'">申请退款</p>
                        <p v-if="scope.row.status=='4'">退款通过</p>
                        <p v-if="scope.row.status=='5'">退款成功</p>
                        <p v-if="scope.row.status=='6'">退款失败</p>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间" width="140">
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handleSee(scope.row)">查看</el-button>
                    </template>
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
    import https from '../../../https.js' 
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                select_status: '',
                select_word: '',
                is_search: false,
                idx: -1,
                select_date:'',
                count:0,
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
            getData() {
                var that = this;
                let params = {
                    member_id:that.member_id,
                    page:that.cur_page,
                    limit:10,
                    title:that.select_word,
                    status:that.select_status,
                    interval_timer:that.select_date[0]+'/'+that.select_date[1],
                }
                console.log(params)
                https.fetchPost('member_order/index',params ).then((e) => {
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
            // 选择状态
            selectStutas(e){
                this.select_status = e;
                this.getData()
            },
            // 选择日期
            selectDate(e){
                this.select_date = e;
                this.getData()
            },
            handleSee(row){
                var id = row.id
                this.$router.push({ path: '/orderDetail', query: { id: id }})
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
