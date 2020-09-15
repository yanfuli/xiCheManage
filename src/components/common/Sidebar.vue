<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: 'admin',
                        title: '权限管理',
                        subs: [
                            {
                                index: 'adminRights',
                                title: '管理员列表'
                            },
                            {
                                index: 'adminClass',
                                title: '管理组列表'
                            },
                            {
                                index: 'userGroup',
                                title: '规则管理'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: 'user',
                        title: '用户管理',
                        subs: [
                            {
                                index: 'personal',
                                title: '个人用户'
                            },
                            {
                                index: 'company',
                                title: '企业用户'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: 'recharge',
                        title: '充值管理',
                        subs: [
                            {
                                index: 'setRecharge',
                                title: '充值设置'
                            },
                            {
                                index: 'userRecharge',
                                title: '用户充值明细'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: 'service',
                        title: '服务项目管理',
                        subs: [
                            {
                                index: 'serviceClassify',
                                title: '服务项目分类'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: 'order',
                        title: '订单管理',
                        subs: [
                            {
                                index: 'userOrder',
                                title: '个人用户订单'
                            },
                            {
                                index: 'companyOrder',
                                title: '企业用户订单'
                            },
                        ]
                    },
                    // {
                    //     icon: 'el-icon-message',
                    //     index: 'table',
                    //     title: 'tab选项卡'
                    // },
                    {
                        icon: 'el-icon-star-on',
                        index: 'coupon',
                        title: '优惠券管理'
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: 'peopleNum',
                        title: '企业人数管理'
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: 'region',
                        title: '地区管理'
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: 'time',
                        title: '时间段管理'
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: 'carType',
                        title: '车辆类型'
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: 'energyType',
                        title: '能源类型'
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: 'join',
                        title: '加盟合作',
                        subs: [
                            {
                                index: 'joiner',
                                title: '加盟商信息'
                            },
                            {
                                index: 'joinInfo',
                                title: '加盟商申请信息'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: 'message',
                        title: '反馈管理',
                        subs: [
                            {
                                index: 'mesType',
                                title: '反馈类型列表'
                            },
                            {
                                index: 'message',
                                title: '反馈意见列表'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: 'logs',
                        title: '日志列表'
                    }
                    // {
                    //     icon: 'el-icon-warning',
                    //     index: 'permission',
                    //     title: '权限测试'
                    // },
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
