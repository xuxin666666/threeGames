import { useEffect, useRef } from 'react'

// 普通定时器
const useInterval = (callback, delay) => {
    const saveCallBack = useRef()

    useEffect(() => {
        saveCallBack.current = callback
    }, [callback])

    useEffect(() => {
        function tick() {
            saveCallBack.current()
        }
        if (delay !== null) {
            let id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}

// 优雅定时器（setInterval的当前这步完成后，才会清除并开启新的定时器）
const useEleInterval = (callback, delay) => {
    const saveCallBack = useRef()
    const defer = useRef(delay)
    const preDefer = useRef(delay)

    useEffect(() => {
        saveCallBack.current = callback
    }, [callback])

    useEffect(() => {
        defer.current = delay
    }, [delay])

    useEffect(() => {
        let id
        function tick() {
            saveCallBack.current()
            if (preDefer.current !== defer.current) {
                preDefer.current = defer.current
                clearInterval(id)
                if (defer.current !== null) {
                    id = setInterval(tick, defer.current)
                }
            }
        }
        id = setInterval(tick, defer.current)
        return () => clearInterval(id)
    }, [])
}

export { useInterval, useEleInterval }