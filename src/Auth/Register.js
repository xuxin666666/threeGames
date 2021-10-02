// 注册界面

import { Form, Input, Button } from 'antd';

import {User, Lock} from '../components/Icons'
import UserAvatar from '../components/UserAvatar'
import './Auth.scss'


const Register = () => {

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="AnimateRoute">
            <Form
                className="loginForm"
                initialValues={{
                    remember: true,
                    avatar: 0
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    name="avatar"
                    style={{ textAlign: 'center' }}
                >
                    <UserAvatar shape="square" size={128} />
                </Form.Item>
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
                    <Button type="primary" htmlType="submit">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Register