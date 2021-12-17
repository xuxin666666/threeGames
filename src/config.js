import store from 'store'
import expirePlugin from 'store/plugins/expire'
import axios from 'axios'
import { message } from 'antd'
import { InfoCircleFilled } from '@ant-design/icons'
import moment from 'moment'
import 'antd/dist/antd.css'
import 'moment/locale/zh-cn'

var CONFIG = {
    _ServerURL: 'http://127.0.0.1:8000',

    init: function () {
        this.handleStore()
        this.handleMessage()
        this.handleAxios()
        this.handleMoment()
        // this.handleHistory() // useLocation(react-router-dom)
    },
    handleStore: function () {
        store.addPlugin(expirePlugin)
        // store.set('foo', 'bar', new Date().getTime() + 3000)
    },
    handleMessage: function () {
        const newMessage = { ...message }
        message.config({
            maxCount: 5,
            rtl: false
        })
        message.success = (content, duration, key) => {
            if (typeof duration === "string" && (key === undefined || key === null)) {
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
            if (typeof duration === "string" && (key === undefined || key === null)) {
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
            if (typeof duration === "string" && (key === undefined || key === null)) {
                key = duration
                duration = null
            }
            newMessage.info({
                className: 'msgInfo',
                content: content,
                icon: <InfoCircleFilled style={{ color: "rgb(144,147,153)" }} />,
                duration: duration || 2,
                key: key || null
            })
        }
        message.error = (content, duration, key) => {
            if (typeof duration === "string" && (key === undefined || key === null)) {
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
    },
    handleAxios: function () {
        axios.defaults.baseURL = this._ServerURL
        axios.interceptors.request.use(
            config => {
                config.headers.Authorization = store.get('token')
                // config.headers['Content-Type'] = 'application/json'
                return config
            },
        )
        axios.interceptors.response.use(
            response => {
                if(response.data.status === 430) {
                    store.set('login', false)
                    message.error('登录状态失效，请重新登录')
                }
                return response
            },
            error => {
                // const code = error.response && error.response.status;
                // console.log(1)
                // if (code === 401) { // 请求要求用户的身份认证
                //     message.error("未登录")
                // } else if (code === 403) { // 服务器拒绝执行此请求
                //     message.error('权限不够')
                // } else if (code === 404) { // 服务器无法根据客户端的请求找到资源（网页）
                //     message.error('这里空空如也')
                // } else if (code === 430) { // active token失效，此处应当带着refresh token重新请求一次

                // } else if (code === 431) { // refresh token失效
                //     message.error('请重新登录')
                // } else if (code === 500) { // 服务器内部错误，无法完成请求
                //     message.error('服务繁忙')
                // } else { // 未知错误
                //     message.error('未知错误')
                // }
                // return Promise.reject(error)
                // console.log(error)
                return error
            }
        )
    },
    handleMoment: function() {
        moment.locale('zh-cn')
    },
    handleHistory: function () {
        const _historyWrap = function (type) {
            const orig = window.history[type];
            const e = new Event(type);
            return function () {
                const rv = orig.apply(this, arguments);
                e.arguments = arguments;
                window.dispatchEvent(e);
                return rv;
            };
        };
        window.history.pushState = _historyWrap('pushState');
        window.history.replaceState = _historyWrap('replaceState');
    }
}

CONFIG.init()

