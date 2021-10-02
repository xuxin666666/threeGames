// 自定义 Icons

import {UserOutlined, LockOutlined} from '@ant-design/icons'

const User = () => {
    return (
        <UserOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />
    )
}
const Lock = () => {
    return (
        <LockOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />
    )
}

export {User, Lock}