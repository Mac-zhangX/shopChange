import {
  PostLogin,
  postRequest,
  downloadFileRequest
} from './config'
import $ from 'jquery'

// const ip = 'http://192.168.0.112:8081';
export const imgIp = 'http://192.168.0.131:8020/';
const ip = 'http://192.168.0.119:8081';   //王云港ip地址
// const ip = 'https://sw.zjhongrikeji.com';   //线上地址
export const login = (params) => { // 登    1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           录接口
  return PostLogin(`${ip}/bishu/sys/login`, params)
}

export const newPass = (params) => { // 修改密码
  return postRequest(`${ip}/bishu/sys/sysuser/password`, params)
}

export const menuList = (params) => { // 菜单接口
  return postRequest(`${ip}/bishu/sys/sysmenu/nav`, params)
}

export const userList = (params) => { // 用户列表接口
  return postRequest(`${ip}/bishu/sys/sysmenu/button`, params)
}

export const menueList = (params) => { // 菜单列表
  return postRequest(`${ip}/bishu/sys/sysmenu/list`, params)
}

export const addMenueOp = (params) => { // 新增菜单
  return postRequest(`${ip}/bishu/sys/sysmenu/save`, params)
}
export const delMenue = (params) => { // 删除菜单
  return postRequest(`${ip}/bishu/sys/sysmenu/delete`, params)
}

export const updateMenue = (params) => { // 更新菜单
  return postRequest(`${ip}/bishu/sys/sysmenu/update`, params)
}

export const getMenue = (params) => { // 二级目录
  return postRequest(`${ip}/bishu/sys/sysmenu/menus`, params)
}
export const userBtnList = (params) => { // 用户按钮接口
  return postRequest(`${ip}/bishu/sys/sysmenu/button`, params)
}

export const userOrderList = (params) => { // 用户列表接口
  return postRequest(`${ip}/bishu/sys/sysuser/list`, params)
}

export const addUser = (params) => { // 添加用户
  return postRequest(`${ip}/bishu/sys/sysuser/save`, params)
}
export const updateUser = (params) => { // 添加用户
  return postRequest(`${ip}/bishu/sys/sysuser//update`, params)
}

export const getUser = (params) => { // 获取当前角色类型
  return postRequest(`${ip}/bishu/sys/sysuser/info/role`, params)
}
export const roleAll = (params) => { // 获取当前用户拥有角色类型
  return postRequest(`${ip}/bishu/sys/sysrole/roleAll`, params)
}

export const delUser = (params) => { // 删除用户接口
  return postRequest(`${ip}/bishu/sys/sysuser/delete`, params)
}
export const resetPsd = (params) => { // 删除用户接口
  return postRequest(`${ip}/bishu/sys/sysuser/resetPsd`, params)
}
export const menuAll = (params) => { // 获取树形菜单接口
  return postRequest(`${ip}/bishu/sys/sysmenu/menuAll`, params)
}

export const roleList = (params) => { // 角色列表接口
  return postRequest(`${ip}/bishu/sys/sysrole/list`, params)
}
export const saveRole = (params) => { // 新增角色接口
  return postRequest(`${ip}/bishu/sys/sysrole/save`, params)
}
export const updateRole = (params) => { // 新增角色接口
  return postRequest(`${ip}/bishu/sys/sysrole/update`, params)
}
export const deleteRole = (params) => { // 删除角色接口
  return postRequest(`${ip}/bishu/sys/sysrole/delete`, params)
}

export const declPage = (params) => { // 申报列表
  return postRequest(`${ip}/bishu/sys/sysDeclare/listByPage`, params)
}

export const declList = (params) => { // 申报列表 有条件筛选
  return postRequest(`${ip}/bishu/sys/sysDeclare/conditionQuery`, params)
}

export const decl = (params) => { // 提交申报
  return postRequest(`${ip}/bishu/sys/sysDeclare/save`, params)
}
export const updateDecl = (params) => { // 编辑申报
  return postRequest(`${ip}/bishu/sys/sysDeclare/update`, params)// /bishu/sys/sysDeclare/delete
}

export const delDecl = (params) => { // 批量删除  单挑删除
  return postRequest(`${ip}/bishu/sys/sysDeclare/delete`, params)//
}

export const downloadMB = (params) => { // 下载模板
  return downloadFileRequest(`${ip}/bishu/sys/sysDeclare/get_model_excel`, params)//
}

export const uploadEx = (params) => { // 上传文件
  return postRequest(`${ip}/bishu/sys/sysDeclare/readExcel`, params)
}

export const declAll = (params) => { // 批量申报
  return postRequest(`${ip}/bishu/sys/sysDeclare/receiveData`, params)
}
export const sbExcel = (params) => { // 导出申报记录
  return downloadFileRequest(`${ip}/bishu/sys/sysDeclare/exportExcel`, params)
}

export const tbExcel = (params) => { // 申报记录同步
  return postRequest(`${ip}/bishu/sys/sysDeclare/synchronizationDeclare`, params)
}
export const getAllError = (params) => { // 申报号码异常记录接口
  return postRequest(`${ip}/bishu/sys/sysDeclare/getAllError`, params)
}
export const abnormalExc = (params) => { // 导出异常申报手机号记录
  return downloadFileRequest(`${ip}/bishu/sys/sysDeclare/errorMobile`, params)
}
export const declareExamine = (params) => { // 申请审核接口
  return postRequest(`${ip}/bishu/sys/sysDeclare/declareExamine`, params)
}
export const synchronizationDeclare = (params) => { // 申报异常同步
  return postRequest(`${ip}/bishu/sys/sysDeclare/synchronizationDeclare`, params)
}
export const updateDeclare = (params) => { // 申报异常更新接口
  return postRequest(`${ip}/bishu/sys/sysDeclare/updateDeclare`, params)
}
export const completeList = (params) => { // 申报异常审核接口
  return postRequest(`${ip}/bishu/sys/sysDeclare/completeList`, params)
}
export const completeExamine = (params) => { // 申报异常审核原因接口
  return postRequest(`${ip}/bishu/sys/sysDeclare/completeExamine`, params)
}

export const orderList = (params) => { // 核销订单列表
  return postRequest(`${ip}/bishu/sys/sysuserorder/list`, params)
}
export const LogisticsUpPage = (params) => { // 物流修改记录列表接口
  return postRequest(`${ip}/bishu/sys/sysuserorder/LogisticsUpPage`, params)
}
export const returnGoods = (params) => { // 核销订单取消订单接口
  return postRequest(`${ip}/bishu/sys/sysuserorder/returnGoods`, params)
}
export const unclearOrderList = (params) => { // 核销订单模糊查询列表
  return postRequest(`${ip}/bishu/sys/sysuser/LikeName`, params)
}
export const updateErrorList = (params) => { // 核销订单异常数据记录
  return postRequest(`${ip}/bishu/sys/sysuserorder/update`, params)
}
export const unOrderList = (params) => { // 未核销订单列表接口
  return postRequest(`${ip}/bishu/sys/sysorder/queryOrder`, params)
}
export const sameCheck = (params) => { // 未核销订单列表同步接口
  return postRequest(`${ip}/bishu/sys/sysorder/synchronization`, params)
}
export const unOrderOut = (params) => { // 未核销订单列表导出接口
  return downloadFileRequest(`${ip}/bishu/sys/sysorder/unwrittenoff_improt`, params)
}
export const orderInExcel = (params) => { // 未核销订单导入申报信息
  return postRequest(`${ip}/bishu/sys/sysorder/declareOrder_improt`, params)
}
export const integralStatistics = (params) => { // 核销统计列表接口
  return postRequest(`${ip}/bishu/sys/sysuserorder/integralStatisticsNew`, params)
}
export const dataAll = (params) => { // 省份数据统计
  return postRequest(`${ip}/bishu/sys/sysmobileprovince/list`, params)
}
export const unmatchedModel = (params) => { // 未核销信息表接口
  return downloadFileRequest(`${ip}/bishu/sys/sysorder/unmatchedModel`, params)
}
export const unmatchedOrder = (params) => { // 订单导入失败接口
  return downloadFileRequest(`${ip}/bishu/sys/sysorder/unmatchedOrder`, params)
}

export const errorExcelDow = (params) => { // 异常申报excele下载
  return downloadFileRequest(`${ip}/bishu/sys/sysDeclare/ErrorEXcel`, params)
}
export const GoodsAddress = (params) => { // 发货接口
  return postRequest(`${ip}/bishu/sys/sysuserorder/deliveryGoods`, params)
}
export const orderDelete = (params) => { // 订单记录删除接口
  return postRequest(`${ip}/bishu/sys/sysuserorder/delete`, params)
}
export const downloadExcel = (params) => { // 发货模板下载接口
  return downloadFileRequest(`${ip}/bishu/sys/sysorder/getLogisticsExcel`, params)
}
export const allGoods = (params) => { // 批量发货接口
  return postRequest(`${ip}/bishu/sys/sysorder/logisticsInfo`, params)
}
export const orderExcelOut = (params) => { // 导出订单接口
  return downloadFileRequest(`${ip}/bishu/sys/sysuserorder/exportExcel`, params)
}
export const exportLogisticsUp = (params) => { // 物流修改记录导出接口
  return downloadFileRequest(`${ip}/bishu/sys/sysuserorder/exportLogisticsUp`, params)
}
export const orderExcelIn = (params) => { // 导入订单接口
  return postRequest(`${ip}/bishu/sys/sysorder/readExcel`, params)
}

export const backGoods = (params) => { // 申请退货接口
  return postRequest(`${ip}/bishu/sys/sysuserorder/returnGoods`, params)
}
export const goodsInfo = (params) => { // 查看物流信息接口
  return postRequest(`${ip}/bishu/sys/sysuserorder/expressInformation`, params)
}
export const backGoodList = (params) => { // 退货记录接口
  return postRequest(`${ip}/bishu/sys/sysuserorder/returnRecord`, params)
}

//
//
// 积分专区

export const findPage = (params) => { // 积分专区接口
  return postRequest(`${ip}/bishu/integralPrecinct/findPage`, params)
};
export const findAll = (params) => { // 积分类型
    return postRequest(`${ip}/bishu/integralPrecinct/findAll`, params)
};

export const addOne = (params) => { // 新增积分专区
  return postRequest(`${ip}/bishu/integralPrecinct/addOne`, params)
};
export const deleteList = (params) => { // 删除积分专区
  return postRequest(`${ip}/bishu/integralPrecinct/deleteList`, params)
};
export const updateOne = (params) => { // 修改积分专区
  return postRequest(`${ip}/bishu/integralPrecinct/updateOne`, params)
};

//商品信息
export const goodsPage = (params) => { // 商品列表
    return postRequest(`${ip}/bishu/goods/findPage`, params)
};
export const goodsAdd = (params) => { // 新增商品
    return postRequest(`${ip}/bishu/goods/addOne`, params)
};
export const goodsType = (params) => { // 商品类型
    return postRequest(`${ip}/bishu/goodsCategory/findAll`, params)
};
export const goodsDelete = (params) => { // 删除商品
    return postRequest(`${ip}/bishu/goods/deleteList`, params)
};
export const goodsUpdate = (params) => { // 修改商品
    return postRequest(`${ip}/bishu/goods/updateOne`, params)
};

//积分范围表 POST
export const scopePage = (params) => { // 全部范围
    return postRequest(`${ip}/bishu/integralScope/findPage`, params)
};
export const scopeAdd = (params) => { // 新增范围
    return postRequest(`${ip}/bishu/integralScope/addOne`, params)
};
export const scopeDelete = (params) => { // 删除范围
    return postRequest(`${ip}/bishu/integralScope/deleteList`, params)
};
export const scopeUpdate = (params) => { // 修改范围
    return postRequest(`${ip}/bishu/integralScope/updateOne`, params)
};
export const scopeArea = (params) => { // 积分区间
    return postRequest(`${ip}/bishu/integralScope/findAll`, params)
};

//商品类别
export const goodsTypeAll = (params) => { // 全部商品
    return postRequest(`${ip}/bishu/goodsCategory/findPage`, params)
};
export const goodsTypeAdd = (params) => { // 新增类别
    return postRequest(`${ip}/bishu/goodsCategory/addOne`, params)
};
export const goodsTypeDelete = (params) => { // 删除类别
    return postRequest(`${ip}/bishu/goodsCategory/deleteList`, params)
};
export const goodsTypeUpdate= (params) => { // 修改类别
    return postRequest(`${ip}/bishu/goodsCategory/updateOne`, params)
};
