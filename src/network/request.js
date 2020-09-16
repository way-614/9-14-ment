import request from "./http"
import {app} from "./app"
import qs from "qs"



const admin = {
    loginadds(data){
        return request({
            url:app.login,
            method: 'post',
            data:qs.stringify(data)
        })
    },
    menusbas(){
        return request({
            url:app.menus,
            method:'get',
        })
    },
    usersbas(params){
        return request({
            url:app.users,
            method:'get',
            params
        })
    },
    statbasput(params){
        return request({
            url:`users/${params.id}/state/${params.mg_state}`,
            method:"put"
        })
    },
    addusers(data){
        return request({
            url:app.addusers,
            method:'post',
            data:qs.stringify(data)
        })
    },
    seachuser(data){
        return request({
            url:`users/${data}`,
            method:'get',
        })
    },
    updatausersbas(data){
        return request({
            url:`users/${data.id}`,
            method:'put',
            data
        })
    },
    deleteuserbas(id){
        return request({
            url:`users/${id}`,
            method:'delete',
        })
    }
}


export default admin