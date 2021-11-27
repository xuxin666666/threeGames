import { Link } from "react-router-dom"
import { ExportOutlined } from "@ant-design/icons"
import store from "store"

import AuthHeader   from "../Auth/AuthHeader"
import './scss/Header.scss'

const Header = ({background, children}) => {
    background = background || 'skyblue'

    return (
        <div className='Header' style={{background}}>
            <Link to={'/'} className="link" title='返回主页'>
                <ExportOutlined rotate={180} />
            </Link>
            {children}
            <AuthHeader logined={store.get('login')} />
        </div>
    )
}

export default Header