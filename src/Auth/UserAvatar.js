// 自定义的表单控件，实现用户自由选择更换头像的效果

import { useEffect, useRef, useState, useCallback } from "react"
import { Avatar, Tooltip } from 'antd'

import './UserAvatar.scss'

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

const UserAvatar = ({ size, index, shape, value, onChange }) => {
    const [user, setUser] = useState(index || 0) // 表单中展示的头像
    const [visible, setVisible] = useState(false) // 弹出框的显示与否
    const tool = useRef()

    const triggerChange = (changedValue) => { // 更改传回表单的数据
        onChange?.(
          changedValue
        );
      };

    const listenClick = useCallback( // 全局点击事件触发的函数
        (e) => {
            // 如果弹出框显示了，且是在弹出框外点击
            if (visible && tool.current && !tool.current.contains(e.target)) {
                setVisible(false)
            }
        },
        [visible],
    )

    useEffect(() => { // 监听全局点击事件
        window.addEventListener('click', listenClick)
        return () => {
            window.removeEventListener('click', listenClick)
        }
    }, [listenClick])

    const userListClick = (i, e) => { // 点击弹出框的头像列表中的头像时
        setUser(i)
        setVisible(false)
        triggerChange(i)
        e.stopPropagation(); // 阻止点击事件冒泡
    }

    const avatarClick = (e) => { // 点击头像时
        setVisible(!visible)
        e.stopPropagation()
    }

    return (
        <div className='userAvatar'>
            <Tooltip
                trigger="click"
                color="white"
                visible={visible} // 手动控制弹出框的显示与否
                title={
                    <div className="userTool" ref={tool}>
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
                }

            >
                <Avatar
                    className="avatar"
                    shape={shape || 'circle'}
                    size={size || 32}
                    src={ImgAvatars[user]}
                    onClick={avatarClick}
                />
            </Tooltip>

        </div>
    )
}

export default UserAvatar