// 头部菜单
import store from 'store'
import axios from 'axios'
import { LogoutOutlined } from '@ant-design/icons'
import { Avatar, Menu, Dropdown, Popover, message } from 'antd'
import { Link } from 'react-router-dom'
import { useCallback, useState, useEffect } from 'react'

import './Auth.scss'


const ImgAvatars = [ // 头像列表
    '/assert/user/avatar_1.png',
    '/assert/user/avatar_2.png',
    '/assert/user/avatar_3.png',
    '/assert/user/avatar_4.png',
    '/assert/user/avatar_5.png',
    '/assert/user/avatar_6.png',
    '/assert/user/avatar_7.png',
    '/assert/user/avatar_8.png',
]

const getUser = new Event('getUser')
const AuthHeader = () => {
    const [logined, setLogined] = useState(false)
    const [avatarIndex, setAvatarIndex] = useState(store.get('user', { avatar: 0 }).avatar)
    const [popoverVis, setPopoverVis] = useState(false)

    useEffect(() => {
        function loginStage(e){
            setLogined(store.get('login', false))
        }
        loginStage()
        window.addEventListener('loginStage', loginStage)
        return () => {
            window.removeEventListener('loginStage', loginStage)
        }
    }, [])

    const logout = useCallback(() => {
        store.set('login', false)
        store.set('register', false)
        store.set('token', '')
        setLogined(false)
    }, [])

    const userListClick = async (i, e) => {
        e.stopPropagation();
        const { data: res } = await axios.post('/auth/changeAvatar', { avatar: i.toString() })
        if (res.status === 200) {
            var user = store.get('user', { username: '???' })
            user.avatar = i.toString()
            store.set('user', user)
            setAvatarIndex(i)
            window.dispatchEvent(getUser)
        } else {
            message.error('更改头像失败')
        }
        setPopoverVis(false)
    }

    const handleVisibleChange = visible => {
        setPopoverVis(visible)
    };

    const content = (
        <div className='AuthHeaderAvatarList'>
            {
                ImgAvatars.map((item, i) => (
                    <Avatar
                        size={64}
                        src={item}
                        onClick={e => {
                            userListClick(i, e)
                        }}
                        key={i}
                    />
                ))
            }
        </div>
    )

    const menu = (
        <Menu className='authHeaderMenu'>
            <Menu.Item key={1} disabled>
                <div className='username'>
                    <span>我的昵称：</span>
                    <span style={{ fontWeight: 800, color: 'lightgreen' }}>{store.get('user', { username: '???' }).username}</span>
                </div>
            </Menu.Item>
            <Menu.Item key={2}>
                <div className='changeAvatar'>
                    <Popover 
                        title='头像' 
                        content={content} 
                        trigger='click' 
                        visible={popoverVis}
                        onVisibleChange={handleVisibleChange}
                    >
                        更换头像
                    </Popover>
                </div>
            </Menu.Item>
            <Menu.Item key={3}>
                <div onClick={logout} className='logout'>
                    <span className='text'>登出</span>
                    <LogoutOutlined />
                </div>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className='authHeader'>
            {
                logined ? (
                    <div className="logined">
                        <Dropdown overlay={menu} placement="bottomRight">
                            <Avatar
                                src={ImgAvatars[avatarIndex]}
                                size={36}
                            />
                        </Dropdown>

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

export default AuthHeader