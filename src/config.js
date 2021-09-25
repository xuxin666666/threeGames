import store from 'store'
import axios from 'axios'
import {message} from 'antd'
import {InfoCircleFilled} from '@ant-design/icons'
import 'antd/dist/antd.css'

import expirePlugin from 'store/plugins/expire'


(function handleStore(){
    store.addPlugin(expirePlugin)
})();

(function handleMessage(){
    const newMessage = {...message}
    message.config({
        maxCount: 5,
        rtl: false
    })
    message.success = (content, duration, key) => {
        if(typeof duration === "string" && (key === undefined || key === null)){
            key = duration
            duration = null
        }
        newMessage.success({
            className: 'msgSuccess',
            content: content,
            duration: duration || 2,
            key: key || null
        })
    }
    message.warning = (content, duration, key) => {
        if(typeof duration === "string" && (key === undefined || key === null)){
            key = duration
            duration = null
        }
        newMessage.warning({
            className: 'msgWarning',
            content: content,
            duration: duration || 2,
            key: key || null
        })
    }
    message.info = (content, duration, key) => {
        if(typeof duration === "string" && (key === undefined || key === null)){
            key = duration
            duration = null
        }
        newMessage.info({
            className: 'msgInfo',
            content: content,
            icon: <InfoCircleFilled style={{color: "rgb(144,147,153)"}} />,
            duration: duration || 2,
            key: key || null
        })
    }
    message.error = (content, duration, key) => {
        if(typeof duration === "string" && (key === undefined || key === null)){
            key = duration
            duration = null
        }
        newMessage.error({
            className: 'msgError',
            content: content,
            duration: duration || 2,
            key: key || null
        })
    }
})();

(function handleAxios(){
    axios.defaults.baseURL = 'http://127.0.0.1:8000'
})();

