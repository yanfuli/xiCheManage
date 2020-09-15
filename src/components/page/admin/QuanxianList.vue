<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 选择权限</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form ref="form" :model="form" :rules="rule">
                <el-form-item>
                    <template>
                    <el-table :data="allData" border style="width: 100%">
                        <el-table-column width="240">
                            <template slot-scope="scope">
                                <el-checkbox :indeterminate="isIndeterminate" v-model="scope.row.checkAll" @change="handleCheckAllChange($event,scope.$index)">{{scope.row.title}}</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <el-checkbox-group v-model="checkedLists" @change="handleCheckedListChange($event,scope.$index)">
                                    <el-checkbox v-for="item in scope.row.list" :checked="item.checkAll" :label="item.title" :key="item.id">{{item.title}}</el-checkbox>
                                </el-checkbox-group>
                            </template>
                        </el-table-column>
                    </el-table>
                    </template>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
            </div>
        </div>
</template>

<script>
    import https from "../../../https";
    export default {
        data: function(){
            return {
                allData:[],
                checkedLists: [],
                isIndeterminate: true,
                form: {
                },
                rule: {

                },
            }
        },
        created() {
            this.getData();
        },
        // 
        methods: {
            handleCheckAllChange(val,index) {
                let idx = index;
                this.allData[idx].checkAll = val
                if(val){
                    this.checkedLists.push(this.allData[idx].list.map(item=>(item.title)))
                    this.allData[idx].list.checkAll = true;
                }else{
                    this.checkedLists.pop()
                }
                console.log(this.allData)
                // this.checkedLists = val ? this.allData[idx].list.map(item=>(item.title)) : [];
                this.isIndeterminate = false;
            },
            handleCheckedListChange(value,index) {
                console.log(value)
                let idx = index;
                let listLen = this.allData[idx].list.length
                let checkedCount = value.length;
                if(checkedCount==listLen){
                    this.allData[idx].checkAll = true;
                }
                this.allData[idx].checkAll = checkedCount === listLen;
                this.isIndeterminate = checkedCount > 0 && checkedCount < listLen;
            },
            getData() {
                const that = this;
                let params = {
                    member_id: localStorage.getItem('member_id'),
                }
                https.fetchPost('auth_group/ruleList', params).then((e) => {
                    console.log(e)
                    e.data.forEach(item => {item.checkAll = false;})
                    e.data.map(item=>(item.list.forEach(itm => {itm.checkAll = false;})))
                    if (e.code == 200) {
                        that.allData = e.data
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            onSubmit(form) {
                const that = this;
                this.$refs[form].validate(valid => {
                    if (valid) {

                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            }
        }
    }
</script>
<style scoped>
    /* .el-form-item__content{
        display: flex !important;
    } */
</style>
