import { message } from 'antd'
import {useEffect} from 'react'
import store from 'store'


import './App.scss'

const App = () => {
    // var expirePlugin = require('store/plugins/expire')
    

    useEffect(() => {
        // store.addPlugin(expirePlugin)
        console.log(new Date().getTime())
        store.set('foo', 'bar', new Date().getTime() + 3000)
        store.set('haha', 'haha')
        console.log(store.get('foo'))
        setTimeout(() => {
            console.log(store.get('foo'))
        }, 3000);
        
    }, [])
    
    const haha1 = () => {
        message.success("hello", 5)
    }
    const haha2 = () => {
        message.warning("hello", 5)
    }
    const haha3 = () => {
        message.info("hello", 5)
    }
    const haha4 = () => {
        message.error("hello", 5)
    }

    return (
        <div>
            <div className="he">Hello</div>
            <button onClick={haha1}>success</button>
            <button onClick={haha2}>warning</button>
            <button onClick={haha3}>info</button>
            <button onClick={haha4}>error</button>
        </div>
    )
}

export default App