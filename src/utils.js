import store from 'store'

if(store.hasNamespace('login')){
    store.set('login', false)
}

const playAudio = (game, src, volumn, auto) => {
    let path = '/assert/' + game + '/audio/' + src
    let audio = new Audio(path)
    audio.volume = volumn / 100 || 0
    if(auto) audio.play()
    return audio
}


export {playAudio}
