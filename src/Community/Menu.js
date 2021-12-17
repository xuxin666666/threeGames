// 菜单栏
import { EditOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"

import Header from "../components/Header"
import './scss/Menu.scss'


const Menu = () => {

    return (
        <Header>
            <div className='communityMenu'>
                <Link to='/community/createPage'>
                    <button className='publish'>
                        <EditOutlined />
                        <span>发布帖子</span>
                    </button>
                </Link>
            </div>
        </Header>
    )
}

export default Menu