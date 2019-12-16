import axios from 'axios'
import qs from 'qs'

const host = ''
const accessToken = localStorage.getItem('accessToken');
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

export const PostLogin = (url, params) => {
  return axios({
    method: 'post',
    url: `${host}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getRequest = (url, params) => {
  const accessToken = localStorage.getItem('accessToken');
  return axios({
    method: 'get',
    url: `${host}${url}`,
    params: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken
    }
  })
}

export const postRequest = (url, params) => {
  const accessToken = localStorage.getItem('accessToken');
  return axios({
    method: 'post',
    url: `${host}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken
    }
  })
}

export const fileRequest = (url, params) => {
  const accessToken = localStorage.getItem('accessToken')
  const baseURLs = `${host}${url}`
  return axios.create({
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken
    }
  }).post(baseURLs, params)
}

export const putRequest = (url, params) => {
  const accessToken = localStorage.getItem('accessToken');
  return axios({
    method: 'put',
    url: `${host}${url}`,
    data: params,
    transformRequest: [function(data) {
      let ret = '';
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken
    }
  })
}

export const deleteRequest = (url, params) => {
  const accessToken = localStorage.getItem('accessToken');
  return axios({
    method: 'delete',
    url: `${host}${url}`,
    params: params,
    headers: {
      'Authorization': accessToken
    }
  })
}

export const uploadFileRequest = (url, params) => {
  const accessToken = localStorage.getItem('accessToken')
  return axios({
    method: 'post',
    url: `${host}${url}`,
    params: params,
    headers: {
      'Authorization': accessToken
    }
  })
}

// 下载文件
export const downloadFileRequest = (url, params) => {
  const accessToken = localStorage.getItem('accessToken')
  return axios({
    method: 'post',
    url: url,
    responseType: 'blob',
    data: params,
    headers: {
      'Authorization': accessToken
    }
  })
}


//转化为几天前几分钟前
export const getDateDiff = (dateTimeStamp) => {
    let result;
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let halfamonth = day * 15;
    let month = day * 30;
    let now = new Date().getTime();
    let diffValue = now - dateTimeStamp;
    if(diffValue < 0) {
      result = '刚刚'
    }
    let monthC = diffValue/month;
    let weekC = diffValue/(7*day);
    let dayC =diffValue/day;
    let hourC =diffValue/hour;
    let minC =diffValue/minute;

    if(monthC>=1){
      if(monthC<=12)
        result="" + parseInt(monthC) + "月前";
      else{
        result="" + parseInt(monthC/12) + "年前";
      }
    }else if(weekC>=1){
      result="" + parseInt(weekC) + "周前";
    }else if(dayC>=1){
      result=""+ parseInt(dayC) +"天前";
    }else if(hourC>=1){
      result=""+ parseInt(hourC) +"小时前";
    }else if(minC>=1){
      result=""+ parseInt(minC) +"分钟前";
    }else{
      result="刚刚";
    }
    return result;
};

//待审批倒计时
export const donateTimeDiff = (dateTimeStamp) => {
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let month = day * 30;
  let now = new Date().getTime();
  console.log(now,111)
  let diffValue = dateTimeStamp-now;
  console.log(diffValue,222)
  let result;
  if (diffValue < 0) {
    return "0天";
  }
  let dayC = diffValue / day;
  let hourC = diffValue / hour;
  let minC = diffValue / minute;
  result=parseInt(dayC)+"天";
  return result;
}

export const getform = (times) =>{
  const days = times / (1000 * 60 * 60 * 24);
  const hours = (times % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
  const minutes = (times % (1000 * 60 * 60)) / (1000 * 60);
  const seconds = (times % (1000 * 60)) / 1000;
  return `${Math.floor(days)}天${Math.floor(hours)}时${Math.floor(minutes)}分${Math.floor(seconds)}秒`
}
