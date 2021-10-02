// 头部菜单

import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import './Auth.scss'

const Header = ({ logined }) => {
    return (
        <div>
            {
                logined ? (
                    <div>
                        <Avatar icon={<UserOutlined />} />
                    </div>
                ) : (
                    <div className="unLogin">
                        <Link to="/login"><span>登录</span></Link>
                        &nbsp;|&nbsp;
                        <Link to="/register"><span>注册</span></Link>
                    </div>
                )
            }
        </div>

    )
}

export default Header