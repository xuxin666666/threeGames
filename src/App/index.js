// 管理所有组件的展示

import { BrowserRouter, Route, Switch } from 'react-router-dom'

import AnimatedSwitch from "../components/AnimateSwitch";
import FlyingFish from '../components/FlyingFish'
import Login from "../Auth/Login"
import Register from "../Auth/Register"
import Home from './Home'
import Tetris from '../Tetris';
import MineSweep from '../Minesweep';
import TanksWar from '../Tankswar';
import './App.scss'

const App = () => {

    return (
        <BrowserRouter className="homePage">
            <Switch>
                <Route path="/tetris" component={Tetris}></Route>
                <Route path="/minesweep" component={MineSweep}></Route>
                <Route path="/tankswar" component={TanksWar}></Route>
                <Route path="/">
                    <AnimatedSwitch>
                        <Route path="/login" component={Login}></Route>
                        <Route path="/register" component={Register}></Route>
                        <Route path="/" exact component={Home}></Route>
                    </AnimatedSwitch>
                    <FlyingFish />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default App