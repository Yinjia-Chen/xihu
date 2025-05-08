// 对外暴露常量路由

export const constantRoutesPC = [
  // 展示数据 一级
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'home',
        meta: {
          title: '首页',
          hidden: false, // 是否隐藏 true为隐藏，默认false
        },
      },
      {
        path: '/meeting',
        component: () => import('@/views/meeting/index.vue'),
        name: 'meeting',
        meta: {
          title: '大会议程',
          hidden: false,
        },
      },
      {
        path: '/activity',
        name: 'activity',
        meta: {
          title: '精彩活动',
          hidden: false,
        },
        children: [
          {
            path: '/activity/activities',
            component: () => import('@/views/activity/activities/index.vue'),
            meta: {
              title: '精彩活动',
              hidden: false,
            },
          },
          {
            path: '/activity/discuss',
            component: () => import('@/views/activity/discuss/index.vue'),
            meta: {
              title: '热门议题',
              hidden: false,
            },
          },
        ],
      },
      {
        path: '/achievement',
        component: () => import('@/views/achievement/index.vue'),
        name: 'achievement',
        meta: {
          title: '成果展示',
          hidden: false,
        },
      },
      {
        path: '/master',
        component: () => import('@/views/master/index.vue'),
        name: 'master',
        meta: {
          title: '大咖云集',
          hidden: false,
        },
      },
      {
        path: '/mate',
        name: 'mate',
        meta: {
          title: '合作伙伴',
          hidden: false,
        },
        children: [
          {
            path: '/mate/businessman',
            component: () => import('@/views/mate/businessman/index.vue'),
            meta: {
              title: '展商合作',
              hidden: false,
            },
          },
          {
            path: '/mate/media',
            component: () => import('@/views/mate/media/index.vue'),
            meta: {
              title: '媒体合作',
              hidden: false,
            },
          },
        ],
      },
      {
        path: '/about',
        name: 'about',
        meta: {
          title: '关于大会',
          hidden: false,
        },
        children: [
          {
            path: '/about/introduction',
            component: () => import('@/views/about/introduction/index.vue'),
            meta: {
              title: '大会介绍',
              hidden: false,
            },
          },
          {
            path: '/about/guide',
            component: () => import('@/views/about/guide/index.vue'),
            meta: {
              title: '参赛指南',
              hidden: false,
            },
          },
        ],
      },
    ],
  },

  // 404 一级
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
  },

  // 任意路由 一级
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
  },

  // 个人主页 一级
  {
    path: '/person',
    component: () => import('@/views/person/index.vue'),
    name: 'person',
  },
]
