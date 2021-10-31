// 遮罩层

import styled from "styled-components"

const Mask = styled.div.attrs(props => ({
    // 调用时可传入的参数，也可以什么都不传
    height: props.height || "100%",
    width: props.width || "100%",
    zIndex: props.zIndex || 1,
    opacity: props.opacity || 0.4,
    position: props.position || "absolute",
    visible: props.visible===false ? false : true,
    display: props.display || "block",
    // duration: props.duration || 300
}))`
    background-color: rgba(0, 0, 0, ${props => props.opacity});
    box-shadow: 0 0 50px rgba(0, 0, 0, ${props => parseFloat(props.opacity) + 0.3});
    height: ${props => props.height};
    width: ${props => props.width};
    position: ${props => props.position};
    top: ${props => props.position === 'absolute' ? '50%' : 0};
    left: ${props => props.position === 'absolute' ? '50%' : 0};
    transform: ${props => props.position === 'absolute' ? 'translate(-50%, -50%)' : 'none'};
    z-index: ${props => props.zIndex};
    visibility: ${props => props.visible ? 'visible' : 'hidden'};
    display: ${props => props.display};
    text-align: center;
    /* transition: all ease ${props => props.duration + 'ms'}; */
    >*{
        z-index: ${props => props.zIndex + 1};
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }   
`

export default Mask