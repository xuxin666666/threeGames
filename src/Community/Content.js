// 主要内容区
import { useEffect, useRef } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'

import CreatePage from './CreatePage'
import PageList from "./PageList"
import PageDetail from './PageDetail'
import './scss/Content.scss'


const Content = () => {
    let location = useLocation()

    const content = useRef()

    useEffect(() => {
        // 动态调整内容的宽度，使得改变时更自然（css: transition）
        if(location.pathname !== '/community') {
            content.current.style.width = '1150px'
        } else {
            content.current.style.width = '400px'
        }
    }, [location])

    return (
        <div className='communityMainContent' ref={content}>
            <div className='pagelist'>
                <PageList />
            </div>
            <Switch>
                <Route path='/community/createPage'>
                    <div className='pageDetail'>
                        <CreatePage />
                    </div>
                </Route>
                <Route path='/community/:page_id'>
                    <div className='pageDetail'>
                        <PageDetail />
                    </div>
                </Route>
                <Route path='/community'>
                    <div></div>
                </Route>
            </Switch>
        </div>
    )
}

export default Content