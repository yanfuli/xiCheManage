import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    name:'dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/tabs',
                    name:'tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    // 管理员列表
                    path: '/adminRights',
                    name:'adminRights',
                    component: resolve => require(['../components/page/admin/AdminRights.vue'], resolve),
                    meta: { title: '管理员权限' }
                },
                {
                    // 添加管理员
                    path: '/addAdmin',
                    name:'addAdmin',
                    component: resolve => require(['../components/page/admin/AddAdmin.vue'], resolve),
                    meta: { title: '添加管理员' }
                },
                {
                    // 管理员分类
                    path: '/adminClass',
                    name:'adminClass',
                    component: resolve => require(['../components/page/admin/AdminClass.vue'], resolve),
                    meta: { title: '管理组列表' }
                },
                {
                    // 添加管理员分类
                    path: '/addAdminClass',
                    name:'addAdminClass',
                    component: resolve => require(['../components/page/admin/AddAdminClass.vue'], resolve),
                    meta: { title: '添加管理组' }
                },
                {
                    // 添加管理员分类
                    path: '/quanxianList',
                    name:'quanxianList',
                    component: resolve => require(['../components/page/admin/QuanxianList.vue'], resolve),
                    meta: { title: '权限列表' }
                },
                {
                    // 规则列表
                    path: '/userGroup',
                    name:'userGroup',
                    component: resolve => require(['../components/page/admin/userGroup.vue'], resolve),
                    meta: { title: '规则列表' }
                },
                {
                    // 个人用户
                    path: '/personal',
                    name:'personal',
                    component: resolve => require(['../components/page/user/Personal.vue'], resolve),
                    meta: { title: '个人用户' }
                },
                {
                    // 用户分享
                    path: '/shareUser',
                    name:'shareUser',
                    component: resolve => require(['../components/page/user/ShareUser.vue'], resolve),
                    meta: { title: '分享用户' }
                },
                {
                    // 公司用户
                    path: '/company',
                    name:'company',
                    component: resolve => require(['../components/page/user/Company.vue'], resolve),
                    meta: { title: '企业用户' }
                },
                {
                    // 公司用户详情
                    path: '/companyDetail',
                    name:'companyDetail',
                    component: resolve => require(['../components/page/user/CompanyDetail.vue'], resolve),
                    meta: { title: '企业用户详情' }
                },
                {
                    // 公司用户详情
                    path: '/companyCar',
                    name:'companyCar',
                    component: resolve => require(['../components/page/user/CompanyCar.vue'], resolve),
                    meta: { title: '企业用户详情' }
                },
                {
                    // 公司用户
                    path: '/personalDetail',
                    name:'personalDetail',
                    component: resolve => require(['../components/page/user/PersonalDetail.vue'], resolve),
                    meta: { title: '个人用户详情' }
                },
                {
                    // 充值设置
                    path: '/setRecharge',
                    name:'setRecharge',
                    component: resolve => require(['../components/page/recharge/SetRecharge.vue'], resolve),
                    meta: { title: '充值设置' }
                },
                {
                    // 用户充值
                    path: '/userRecharge',
                    name:'userRecharge',
                    component: resolve => require(['../components/page/recharge/UserRecharge.vue'], resolve),
                    meta: { title: '用户充值' }
                },
                {
                    // 充值设置
                    path: '/serviceItems',
                    name:'serviceItems',
                    component: resolve => require(['../components/page/service/ServiceItems.vue'], resolve),
                    meta: { title: '服务项目' }
                },
                {
                    // 充值设置
                    path: '/serviceClassify',
                    name:'serviceClassify',
                    component: resolve => require(['../components/page/service/ServiceClassify.vue'], resolve),
                    meta: { title: '服务项目分类' }
                },
                {
                    // 用户充值
                    path: '/servicePrice',
                    name:'servicePrice',
                    component: resolve => require(['../components/page/service/ServicePrice.vue'], resolve),
                    meta: { title: '服务价格' }
                },
                {
                    // 个人用户订单
                    path: '/userOrder',
                    name:'userOrder',
                    component: resolve => require(['../components/page/order/UserOrder.vue'], resolve),
                    meta: { title: '用户订单' }
                },
                {
                    // 企业订单
                    path: '/companyOrder',
                    name:'companyOrder',
                    component: resolve => require(['../components/page/order/CompanyOrder.vue'], resolve),
                    meta: { title: '企业订单' }
                },
                {
                    // 个人订单详情
                    path: '/orderDetail',
                    name:'orderDetail',
                    component: resolve => require(['../components/page/order/OrderDetail.vue'], resolve),
                    meta: { title: '企业订单' }
                },
                {
                    // 企业订单详情
                    path: '/companyOrderDetail',
                    name:'companyOrderDetail',
                    component: resolve => require(['../components/page/order/CompanyOrderDetail.vue'], resolve),
                    meta: { title: '企业订单' }
                },
                {
                    //人数管理
                    path: '/peopleNum',
                    name:'peopleNum',
                    component: resolve => require(['../components/page/PeopleNum.vue'], resolve),
                    meta: { title: '人数管理' }
                },
                {
                    // 地区管理
                    path: '/region',
                    name:'region',
                    component: resolve => require(['../components/page/Region.vue'], resolve),
                    meta: { title: '地区管理' }
                },
                {
                    // 优惠券管理
                    path: '/coupon',
                    name:'coupon',
                    component: resolve => require(['../components/page/coupon/Coupon.vue'], resolve),
                    meta: { title: '优惠券管理' }
                },
                {
                    // 添加优惠券
                    path: '/addCoupon',
                    name:'addCoupon',
                    component: resolve => require(['../components/page/coupon/AddCoupon.vue'], resolve),
                    meta: { title: '优惠券管理' }
                },
                {
                    // 加盟商管理
                    path: '/joiner',
                    name:'joiner',
                    component: resolve => require(['../components/page/join/Joiner.vue'], resolve),
                    meta: { title: '加盟商信息' }
                },
                {
                    // 加盟申请信息
                    path: '/joinInfo',
                    name:'joinInfo',
                    component: resolve => require(['../components/page/join/JoinInfo.vue'], resolve),
                    meta: { title: '加盟商信息' }
                },
                {
                    // 加盟申请信息
                    path: '/ceshi',
                    name:'ceshi',
                    component: resolve => require(['../components/page/join/ceshi.vue'], resolve),
                    meta: { title: '加盟商信息' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    name:'permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    // 时间页面
                    path: '/time',
                    name:'time',
                    component: resolve => require(['../components/page/Time.vue'], resolve),
                    meta: { title: '意见反馈' }
                },
                {
                    // 留言页面
                    path: '/message',
                    name:'message',
                    component: resolve => require(['../components/page/message/Message.vue'], resolve),
                    meta: { title: '意见反馈' }
                },
                {
                    // 留言详情
                    path: '/mesDetail',
                    name:'mesDetail',
                    component: resolve => require(['../components/page/message/MesDetail.vue'], resolve),
                    meta: { title: '留言详情' }
                },
                {
                    // 留言详情
                    path: '/mesType',
                    name:'mesType',
                    component: resolve => require(['../components/page/message/MesType.vue'], resolve),
                    meta: { title: '意见类型' }
                },
                {
                    // 车辆类型
                    path: '/carType',
                    name:'carType',
                    component: resolve => require(['../components/page/CarType.vue'], resolve),
                    meta: { title: '车辆类型' }
                },
                {
                    // 能源类型
                    path: '/energyType',
                    name:'energyType',
                    component: resolve => require(['../components/page/EnergyType.vue'], resolve),
                    meta: { title: '能源类型' }
                },
                {
                    // 日志
                    path: '/logs',
                    name:'logs',
                    component: resolve => require(['../components/page/Logs.vue'], resolve),
                    meta: { title: '日志列表' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
