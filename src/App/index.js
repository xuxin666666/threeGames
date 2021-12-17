// 管理所有组件的展示

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import React, { Suspense, useEffect } from 'react'
import { Spin } from 'antd'

import AnimatedSwitch from "../components/AnimateSwitch";
import FlyingFish from '../components/FlyingFish'
import Login from "../Auth/Login"
import Register from "../Auth/Register"
import Home from './Home'
// import Tetris from '../Tetris';
// import MineSweep from '../Minesweep';
// import TanksWar from '../Tankswar';
import './App.scss'

// const AnimatedSwitch = React.lazy(() => import('../components/AnimateSwitch'))
// const FlyingFish = React.lazy(() => import('../components/FlyingFish'))
// const Login = React.lazy(() => import('../Auth/Login'))
// const Register = React.lazy(() => import('../Auth/Register'))
// const Home = React.lazy(() => import('./Home'))
const Tetris = React.lazy(() => import('../Tetris'))
const MineSweep = React.lazy(() => import('../Minesweep'))
const TanksWar = React.lazy(() => import('../Tankswar'))
const Community = React.lazy(() => import('../Community'))
const Note = React.lazy(() => import('../Note'))

const App = () => {

    useEffect(() => {
        // window.addEventListener('pushState', function(e){
        //     console.log(e, 1)
        // })
        // history.push('/123')
        // console.log(window.history)
    })

    return (
        <BrowserRouter className="homePage">
            <Suspense fallback={
                <div className='spin'>
                    <Spin size='large' />
                </div>
            }>
                <Switch>
                    <Route path="/tetris" component={Tetris} />
                    <Route path="/minesweep" component={MineSweep} />
                    <Route path="/tankswar" component={TanksWar} />
                    <Route path="/community" component={Community} />
                    <Route path='/note' component={Note} />
                    <Route path="/">
                        <AnimatedSwitch>
                            <Route path="/login" component={Login}></Route>
                            <Route path="/register" component={Register} ></Route>
                            <Route path="/" exact component={Home}></Route>
                        </AnimatedSwitch>
                        <FlyingFish />
                    </Route>
                </Switch>
            </Suspense>
        </BrowserRouter>
    )
}

export default App