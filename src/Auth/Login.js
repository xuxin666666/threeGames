// 登陆界面

import { Form, Input, Button, Checkbox } from 'antd';
import {Link} from 'react-router-dom'

import {User, Lock} from '../components/Icons'
import './Auth.scss'

const Login = () => {
    const onFinish = (values) => { // 表单验证成功了
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => { // 验证失败
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="AnimateRoute">
            <Form
                className="loginForm"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
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

                <Form.Item
                    
                >   
                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                    >
                        <Checkbox>30天内自动登录</Checkbox>
                    </Form.Item>
                    
                    <Link to="/register" style={{float: "right"}}>注册用户</Link>
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