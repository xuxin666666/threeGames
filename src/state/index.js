import React, { useReducer } from "react" //导入react,
 
const State = React.createContext() //创建Context对象,来向组件树传递数据
//定义reducer的改变规则
const ADD = "ADD"
const DECREASE = "DECREASE"
function reducer(state, action) {
    switch (action) {
        case ADD:
            return state + 1
        case DECREASE:
            return state - 1
        default:
            return state
    }
}
//定义一个组件来包裹需要获取到共享数据的组件
const StateProvider = props => {
    //获取值和设置值的方法,0是默认值
    const [state, dispatch] = useReducer(reducer, 0)
    /* value 就是组件树能够拿到的数据,传了一个state值,和一个dispatch方法
       dispatch就是为了改变state用的 */
    return <State.Provider value={{ state, dispatch }}>
        {props.children}
    </State.Provider>
}
 
export {
    State, StateProvider
}