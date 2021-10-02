// 路由间切换时添加过渡动画，具体内容由 AnimateSwitch.scss 决定
// 很多动画都需要给路由对应组件最外层元素设置 position: absolute; 

import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Route, Switch } from 'react-router-dom'
import './scss/AnimateSwitch.scss'

const AnimatedSwitch = props => {
    const { children } = props
    return (
        <Route
            render={({ location }) => (
                <TransitionGroup>
                    <CSSTransition
                        key={location.key}
                        classNames={props.type || 'fade'} // 播放动画时添加的className的头
                        timeout={props.duration || 300} // 设置动画的播放时长
                    >
                        <Switch location={location}>{children}</Switch>
                    </CSSTransition>
                </TransitionGroup>
            )}
        />
    )
}

export default AnimatedSwitch