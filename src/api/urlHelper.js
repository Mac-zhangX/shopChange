// 全局配置 路径
// const ip = 'http://192.168.0.113/dan/public/index.php'// 后端地址
// const ip = 'http://192.168.0.113/dan/index'// 后端地址
const ip2 = 'http://ld.zjhongrikeji.com'
const ip = 'http://ld.zjhongrikeji.com/index' // 徐文新 本地环境（最新）
// const ip = 'http://qs.zjhongrikeji.com:8091' // 测试环境
export const UrlHelper = {
  clearCookieTime: 60 * 60 * 1000, // 60分钟页面没有刷新 就跳出
  picUrl: ip2 + '/', // 全局图片访问路径
  // 登录页面
  login: {
    adminLogin: ip + '/login-sw'
  },
  // 积分通道
  integralChannel: {
    getList: ip + '/scoreList', // 查询列表
    add: ip + '/scoreInsert' // 新增积分通道
  },
  // 商品列表
  integralList: {
    getList: ip + '/shopList', // 商品列表
    add: ip + '/shopInsert' // 商品新增
  },
  // 商品兑换通道
  exchangeWay: {
    getList: ip + '/exchangeList', // 列表查询
    add: ip + '/exchangeInsert', // 新增
    update: ip + '/exchangeUpdate' // 修改
  },
  // 权限管理
  operatorManage: {
    getList: ip + '/userList-sw', // 一级用户全查询
    add: ip + '/userInsert-sw', // 添加用户
    userDiscount: ip + '/userDiscount', // 设置折扣
    setDiscount: ip + '/setDiscount', // 查询加设置用户的这口值
    userAudit: ip + '/userAudit-sw', // 审核
    userStatus: ip + '/userStatus-sw' // 启用或者停用
  },
  // 二级运营商列表
  agentManage: {
    getList: ip + '/agentList'
  },
  // 查询所有用户
  getAllUser: {
    getList: ip + '/userOur'
  },
  // 申报列表
  declInfo: {
    getList: ip + '/sblist', // 全查询
    export: ip + '/exportsExcel', // 申报记录导出
    import: ip + '/importsExcel' // 文件导入
  },
  decl: {
    confirm: ip + '/shenBao'
  },
  // 订单列表
  orderList: {
    getList: ip + '/list-sw',
    write: ip + '/write', // 审核
    audit: ip + '/audit', // 核销
    listScore: ip + '/listScore', // 所有的商品
    exportList: ip + '/exportExcel', // 导出订单列表
    importList: ip + '/importExcel' // 导入订单列表
  },
  // 提现管理
  drawMoney: {
    getList: ip + '/cashList',
    cashAudit: ip + '/cashAudit',
    cashError: ip + '/cashError'
  },
  // 实名认证
  realName: {
    query: ip + '/realList',
    realAudit: ip + '/realAudit'
  },
  // 首页提示语句
  noticeList: {
    query: ip + '/noticeList',
    insert: ip + '/noticeInsert',
    update: ip + '/noticeStatus' // 启用或者禁用
  },
  // 实物商品管理
  realGoods: {
    query: ip + '/shopList-sw', // 列表全查询
    insert: ip + '/shopInsert-sw', // 新增
    update: ip + '/swUpdate', // 更新
    open: ip + '/swStatus' // 启用禁用
  }
}
