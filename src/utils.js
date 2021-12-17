import store from 'store'
import axios from 'axios'
import moment from 'moment'
import { message } from 'antd'

const loginStage = new Event('loginStage')

const autoLogin = async () => {
    store.set('login', false)
    const { data: res } = await axios.get('/auth/auto')
    if (res && res.status === 200) {
        var user = {
            username: res.data.username,
            avatar: res.data.avatar
        }
        store.set('user', user)
        store.set('login', true)
        message.success('登录成功', 1)
        window.dispatchEvent(loginStage)
    }
}
autoLogin()


const playAudio = (game, src, volumn, auto) => {
    let path = '/assert/' + game + '/audio/' + src
    let audio = new Audio(path)
    audio.volume = volumn / 100 || 0
    if (auto) audio.play()
    return audio
}

const formatTime = (timestamp) => {
    return new Date().getTime() - timestamp < 48 * 3600 * 1000
        ? moment(timestamp).fromNow()
        : new Date(timestamp).toLocaleDateString()
}


export { playAudio, formatTime }
