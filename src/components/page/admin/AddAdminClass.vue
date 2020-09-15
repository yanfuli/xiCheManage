<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> {{pageTitle}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="120px" :rules="rule">
                    <el-form-item label="用户组名称" prop="title">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="用户组描述" prop="description">
                        <el-input v-model="form.description"></el-input>
                    </el-form-item>
                    <el-form-item label="用户组所属模块" prop="module">
                        <el-input v-model="form.module"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio label="1">启用</el-radio>
                            <el-radio label="2">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    import https from "../../../https";

    export default {
        name: 'baseform',
        data: function(){
            return {
                form: {
                    id: '',
                    title: '',
                    description: '',
                    module: '',
                    status: '',
                    member_id: localStorage.getItem('member_id'),
                },
                pageTitle: '添加管理组',
                rule: {
                    title: [{required: true, message: '请输入用户组名称', trigger: 'blur'},],
                    description: [{required: true, message: '请输入用户组描述', trigger: 'blur'}],
                    module: [{required: true, message: '请输入用户组所属模块', trigger: 'blur'}],
                    status: [{required: true, message: '请输入状态', trigger: 'blur'},
                        {required: true, message: '请输入状态', trigger: 'change'}],
                },
            }
        },
        created() {
            if (this.$route.query.row) {
                this.pageTitle = '编辑管理组';
                this.form.title = this.$route.query.row.title;
                this.form.description = this.$route.query.row.description;
                this.form.module = this.$route.query.row.module;
                if(this.$route.query.row.status === true){
                    this.form.status = '1';
                }else{
                    this.form.status = '2';
                }
                this.form.id = this.$route.query.row.id;
            }
        },
        methods: {
            onSubmit(form) {
                const that = this;
                this.$refs[form].validate(valid => {
                    if (valid) {
                        if(this.$route.query.row){
                            https.fetchPost('auth_group/update', that.form).then((e) => {
                                console.log(e)
                                if (e.code == 200) {
                                    console.log('成功')
                                    this.$message.success('编辑成功');
                                    this.$router.push('/adminClass');
                                } else {
                                    this.$message({
                                        message: e.msg,
                                        type: "warning"
                                    });
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        }else{
                            https.fetchPost('auth_group/create', that.form).then((e) => {
                                console.log(e)
                                if (e.code == 200) {
                                    console.log('成功')
                                    this.$message.success('添加成功');
                                    this.$router.push('/adminClass');
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
            }
        }
    }
</script>
