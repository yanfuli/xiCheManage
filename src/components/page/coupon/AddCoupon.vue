<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> {{pageTitle}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="140px" :rules="rule">
                    <el-form-item label="优惠券标题" prop="title">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠券描述" prop="content">
                        <el-input type="textarea" rows="5" v-model="form.content"></el-input>
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
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    import https from '../../../https.js'

    export default {
        name: 'baseform',
        data: function () {
            return {
                options: [
                    {
                        value: 'guangdong',
                        label: '广东省',
                        children: [
                            {
                                value: 'guangzhou',
                                label: '广州市',
                                children: [
                                    {
                                        value: 'tianhe',
                                        label: '天河区'
                                    },
                                    {
                                        value: 'haizhu',
                                        label: '海珠区'
                                    }
                                ]
                            },
                            {
                                value: 'dongguan',
                                label: '东莞市',
                                children: [
                                    {
                                        value: 'changan',
                                        label: '长安镇'
                                    },
                                    {
                                        value: 'humen',
                                        label: '虎门镇'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        value: 'hunan',
                        label: '湖南省',
                        children: [
                            {
                                value: 'changsha',
                                label: '长沙市',
                                children: [
                                    {
                                        value: 'yuelu',
                                        label: '岳麓区'
                                    }
                                ]
                            }
                        ]
                    }
                ],
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
                    value1: '',
                    id:'',
                },
                rule: {
                    title: [{required: true, message: '请输入优惠券标题', trigger: 'blur'},],
                    actual_price: [{required: true, message: '请输入可使用价格', trigger: 'blur'}],
                    virtual_price: [{required: true, message: '请输入满减价格', trigger: 'blur'}],
                    content: [{required: true, message: '请输入优惠券描述', trigger: 'blur'}],
                    number: [{required: true, message: '请输入派发数量', trigger: 'blur'}],
                    // start_time:[{ required: true, message: '请输入使用区间时间', trigger: 'blur'}],
                    // end_time:[{ required: true, message: '请输入使用区间时间', trigger: 'blur'}],
                    value1: [{required: true, message: '请输入使用区间时间', trigger: 'blur'}],
                    status: [{required: true, message: '请输入上架状态', trigger: 'blur'},
                        {required: true, message: '请输入上架状态', trigger: 'change'}],
                    type: [{required: true, message: '请输入优惠券分类', trigger: 'blur'},
                        {required: true, message: '请输入优惠券分类', trigger: 'change'}],
                },
                pageTitle: '添加优惠券',
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                },
                value1: '',
                value2: ''
            }
        },
        created() {
            if (this.$route.query.row) {
                this.pageTitle = '编辑优惠券';
                this.form.title = this.$route.query.row.title;
                this.form.actual_price = this.$route.query.row.actual_price;
                this.form.virtual_price = this.$route.query.row.virtual_price;
                this.form.content = this.$route.query.row.content;
                this.form.number = this.$route.query.row.number;
                this.form.type = this.$route.query.row.type;
                this.form.start_time = this.$route.query.row.start_time;
                this.form.end_time = this.$route.query.row.end_time;
                if(this.$route.query.row.status === true){
                    this.form.status = '1';
                }else{
                    this.form.status = '2';
                }
                this.form.value1 = [this.$route.query.row.start_time, this.$route.query.row.end_time];
                this.form.id = this.$route.query.row.id;
            }else{
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
            }

            // this.dataPost();
        },
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
            onSubmit(form) {
                const that = this;
                this.$refs[form].validate(valid => {
                    if (valid) {
                        if(this.$route.query.row){
                            https.fetchPost('coupon/updateCoupon', that.form).then((e) => {
                                console.log(e)
                                if (e.code == 200) {
                                    console.log('成功')
                                    this.$message.success('编辑成功');
                                    this.$router.push('/coupon');
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
                            https.fetchPost('coupon/createCoupon', that.form).then((e) => {
                                console.log(e)
                                if (e.code == 200) {
                                    console.log('成功')
                                    this.$message.success('添加成功');
                                    this.$router.push('/coupon');
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
