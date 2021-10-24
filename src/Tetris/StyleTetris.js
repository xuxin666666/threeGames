import styled from "styled-components";

const StyleCeil = styled.div.attrs(props => ({
    height: props.height || 25,
    width: props.width || 25,
    color: props.color || 'white'
}))`
    /* width: ${props => props.width + 'px'};
    height: ${props => props.height + 'px'}; */
    margin: 1px;
    box-sizing: border-box;
    border-radius: 3px;
    background-color: ${props => props.color};
`

const StyleTetrisStage = styled.div`
    width: ${props => props.columns * 25}px;
    height: ${props => props.rows * 25}px;
    display              : grid;
    grid-template-rows   : repeat(${props => props.rows}, 1fr);
    grid-template-columns: repeat(${props => props.columns}, 1fr);
    grid-gap             : 0 0;
    
    padding: 1px;
`

export {StyleCeil, StyleTetrisStage}