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
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="pass">
                        <el-input v-model="form.pass"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="form.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="telephone">
                        <el-input v-model="form.telephone"></el-input>
                    </el-form-item>
                    <el-form-item label="用户组" prop="group_id">
                        <el-select v-model="form.group_id" placeholder="请选择">
                            <el-option :label="item.title" :value="item.id" v-for="(item,index) in statusList" :key="index"/>
                        </el-select>
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
                    member_id: localStorage.getItem('member_id'),
                    id: '',
                    username: '',
                    password: '',
                    nickname: '',
                    telephone: '',
                    status: '',
                    group_id: '',
                    pass: '',
                },
                statusList: [],
                pageTitle: '添加管理员',
                rule: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'},],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    nickname: [{required: true, message: '请输入昵称', trigger: 'blur'}],
                    telephone: [{required: true, message: '请输入手机号', trigger: 'blur'},
                        {
                            required: true,
                            pattern: /^1[3456789]\d{9}$/,
                            message: '请输入正确的电话号码',
                            trigger: 'blur'
                        }
                    ],
                    group_id: [{required: true, message: '请输入用户组', trigger: 'blur'},
                        {required: true, message: '请输入上架状态', trigger: 'change'}
                    ],
                    pass: [{required: true, message: '请输入确认密码', trigger: 'blur'}],
                    status: [{required: true, message: '请输入状态', trigger: 'blur'},
                        {required: true, message: '请输入状态', trigger: 'change'}],
                },
            }
        },
        created() {
            if (this.$route.query.row) {
                this.pageTitle = '编辑管理员';
                this.form.username = this.$route.query.row.username;
                this.form.nickname = this.$route.query.row.nickname;
                this.form.telephone = this.$route.query.row.telephone;
                this.form.type = this.$route.query.row.type;
                this.form.start_time = this.$route.query.row.start_time;
                this.form.end_time = this.$route.query.row.end_time;
                if(this.$route.query.row.status === true){
                    this.form.status = '1';
                }else{
                    this.form.status = '2';
                }
                this.form.id = this.$route.query.row.id;
                console.log(this.$route.query.row)
            }
            this.getStatus();
        },
        methods: {
            getStatus(){
                let params = {
                    member_id: this.form.member_id,
                }
                https.fetchPost('admin/add',params ).then((e) => {
                    console.log(e)
                    if(e.code==200){
                        this.statusList = e.data;
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            onSubmit(form) {
                // this.$message.success('提交成功！');
                const that = this;
                this.$refs[form].validate(valid => {
                    if (valid) {
                        if(this.$route.query.row){
                            https.fetchPost('admin/update', that.form).then((e) => {
                                console.log(e)
                                if (e.code == 200) {
                                    console.log('成功')
                                    this.$message.success('编辑成功');
                                    this.$router.push('/adminRights');
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
                            https.fetchPost('admin/create', that.form).then((e) => {
                                console.log(e)
                                if (e.code == 200) {
                                    console.log('成功')
                                    this.$message.success('添加成功');
                                    this.$router.push('/adminRights');
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
