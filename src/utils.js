import store from 'store'

if(store.hasNamespace('login')){
    store.set('login', false)
}

const playAudio = (game, src, volumn) => {
    let path = '/assert/' + game + '/audio/' + src
    let audio = new Audio(path)
    audio.volume = volumn / 100
    audio.play()
}


export {playAudio}
