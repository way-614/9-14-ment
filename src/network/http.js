import axios from "axios"

const url = "http://127.0.0.1:8888/api/private/v1/"

let infos = axios.create({
    baseURL:url,
    timeout:5000,
})


// 添加请求拦截器
infos.interceptors.request.use(function (config) {

    config.headers.Authorization = window.sessionStorage.getItem('token')
return config;
}, function (error) {
// 对请求错误做些什么
return Promise.reject(error);
});

// 添加响应拦截器
infos.interceptors.response.use(function (response) {
// 对响应数据做点什么
// Toast.clear();
return response;
}, function (error) {
// 对响应错误做点什么
return Promise.reject(error);
});



export default infos