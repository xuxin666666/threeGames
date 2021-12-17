// 登陆界面
import store from 'store'
import axios from 'axios';
import { Form, Input, Button, Checkbox, message } from 'antd';
import {Link, useHistory} from 'react-router-dom'

import {User, Lock} from '../components/Icons'
import './Auth.scss'

const Login = () => {
    let history = useHistory()

    const onFinish = async (values) => { // 表单验证成功了
        const {data: res} = await axios.post("/auth", values)
        if(res.status === 200) {
            var user = {
                "username": values.username,
                "avatar": res.data.avatar
            }
            store.set("user", user)
            store.set("auto_login", values.auto_login, new Date().getTime() + 1000 * 60 * 60 * 24 * 30)
            store.set("login", true)
            store.set("token", "Bearer " + res.data.token)
            message.success("登录成功")
            history.goBack()
        } else {
            message.error(`登录失败：${res.msg}`)
        }
    };

    const onFinishFailed = (errorInfo) => { // 验证失败
        console.log('Failed:', errorInfo);
    };

    const loca = {
        pathname: './register',
        state: {from: '/login'}
    }

    return (
        <div className="AnimateRoute">
            <Form
                className="loginForm"
                initialValues={{
                    auto_login: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                validateTrigger="onBlur"
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名',
                        }, {
                            max: 12,
                            message: "用户名不得多于12个字"
                        }, {
                            min: 3,
                            message: "用户名不得少于3个字"
                        }
                    ]}
                >
                    <Input prefix={<User />} placeholder="username" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码',
                        }, {
                            max: 18,
                            message: "密码不得多于18位"
                        }, {
                            min: 6,
                            message: "密码不得少于6位"
                        }
                    ]}
                >
                    <Input.Password prefix={<Lock />} placeholder="password" />
                </Form.Item>

                <Form.Item>   
                    <Form.Item
                        name="auto_login"
                        valuePropName="checked"
                        noStyle
                    >
                        <Checkbox>30天内自动登录</Checkbox>
                    </Form.Item>
                    
                    <Link to={loca} style={{float: "right"}} >注册用户</Link>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        登录
                    </Button>
                </Form.Item>
            </Form>
            <Link to="/">返回主页</Link>
        </div>
    )
}

export default Login