// index.js
import Content from './Content'
import Menu from './Menu'
import './scss/index.scss'

const Community = () => {

    return (
        <div className='communityContent'>
            <div className='community'>
                <img src='/assert/community/image/bgImg.png' alt='img' className='bgImage' />
                <Menu /> 
                <Content />
            </div>
        </div>
    )
}

export default Community