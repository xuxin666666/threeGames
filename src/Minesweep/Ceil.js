// mineSweep的每一个小块
import './scss/Ceil.scss'

// 雷数对应的数字颜色
const colors = ['black', '#3d53c2', '#166902', '#a7050f', '#030288', '#1ddafb', '#a4ba11', '#f426e8', '#7b15c8']

// 翻转后的无雷块
const CeilCommon = ({number}) => {
    return (
        <div className='mineSweepCeil mineSweepCeilCommon'>
            {
                number === 0
                    ? null
                    : <span style={{color: colors[number]}}>{number}</span>
            }
        </div>
    )
}

// 翻转后的雷
const CeilMine = () => {
    return (
        <div className='mineSweepCeil'>
            <img src='/assert/mineSweep/image/common.png' alt='img' />
            <img src='/assert/mineSweep/image/mine2.png' alt='img' style={{width: '21px'}} />
        </div>
    )
}

// 立旗的块
const CeilFlag = () => {
    return (
        <div className='mineSweepCeil'>
            <img src='/assert/mineSweep/image/common.png' alt='img' />
            <img src='/assert/mineSweep/image/flag.png' alt='img' style={{width: '21px'}} />
        </div>
    )
}

// 未翻转的深色块
const CeilDark = () => {
    return (
        <div className='mineSweepCeil'>
            <img src='/assert/mineSweep/image/dark.png' alt='img' />
        </div>
    )
}

// 未翻转的普通块
const CeilNotReverse = () => {
    return (
        <div className='mineSweepCeil'>
            <img src='/assert/mineSweep/image/common.png' alt='img' />
        </div>
    )
}

export {CeilCommon, CeilDark, CeilNotReverse, CeilFlag, CeilMine}