import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_Web_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1 }) // 一天之后cookie失效
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getDateStr(dayCount) {
  if(null == dayCount){
    dayCount = 0;
  }
  var dd = new Date();
  dd.setDate(dd.getDate()+dayCount);//设置日期
  var y = dd.getFullYear();
  var m = dd.getMonth()+1;//获取当前月份的日期
  var d = dd.getDate();
  return y+"-"+m+"-"+d;
}
