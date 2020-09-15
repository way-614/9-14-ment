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
    }
}


export default admin