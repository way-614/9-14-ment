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
    },
    rightslist(){
        return request({
            url:"rights/list",
            method:"get",
        })
    },
    rightsroles(){
        return request({
            url:app.roles,
            method:"get"
        })
    },
    delroles(rels,rightid){
        return request({
            url:`roles/${rels.id}/rights/${rightid}`,
            method:"delete",
        })
    },
    fenpeifors(){
        return request({
            url:"rights/tree",
            method:"get",
        })
    },
    shouqcolse(rids,id){
        return request({
            url:`roles/${id}/rights`,
            method:"post",
            data:rids
        })
    },
    fenpeiuser(id,rid){
        return request({
            url:`users/${id}/role`,
            method:"put",
            data:rid
        })
    },
    categories(params){
        return request({
            url:app.categories,
            method:"get",
            params
        })
    },
    categoriesdbs(data){
        return request({
            url:app.categories,
            method:"post",
            data
        })
    },
    attrbutsbas(params,id){
        return request({
            url:`categories/${id}/attributes`,
            method:"get",
            params
        })
    },
    addbutes(data,id){
        return request({
            url:`categories/${id}/attributes`,
            method:"post",
            data
        })
    },
    addattrbutids(params,id,attrid){
        return request({
            url:`categories/${id}/attributes/${attrid}`,
            method:"get",
            params
        })
    },
    attrbutes(data,cateid,attrid){
        return request({
            url:`categories/${cateid}/attributes/${attrid}`,
            method:"put",
            data
        })
    },
    deletebtues(id,attrid){
        return request({
            url:`categories/${id}/attributes/${attrid}`,
            method:"delete"
        })
    },
    getgoods(params){
        return request({
            url:"goods",
            method:"get",
            params
        })
    },
    removebyid(id){
        return request({
            url:`goods/${id}`,
            method:"delete",
        })
    },
    getgories(params,id){
        return request({
            url:`categories/${id}/attributes`,
            method:"get",
            params
        })
    },
    addgoodsbas(data){
        return request({
            url:"goods",
            method:"post",
            data
        })
    },
    getordersbas(params){
        return request({
            url:"orders",
            method:"get",
            params
        })
    },
    ceshikuaidi(){
        return request({
            url:"/kuaidi/1106975712662",
            method:"get"
        })
    },
    getreports(){
        return request({
            url:"reports/type/1",
            method:"get",
        })
    }
}


export default admin