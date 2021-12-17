// some笔记
import { marked } from "marked"
import { useCallback, useEffect, useRef, useState } from 'react'
import { Anchor, Col, Row } from "antd"
import hljs from "highlight.js"

import Header from '../components/Header'
import md from './summary.md'
import 'highlight.js/styles/github-dark.css'
import './scss/index.scss'


const { Link } = Anchor;
const Note = () => {
    // const md = require('./summary.md')
    const [note, setNote] = useState('') // 笔记内容(markdown)
    const [link1, setLink1] = useState() // 一级锚点
    const [link2, setLink2] = useState() // 二级锚点

    const haveHighlight = useRef(false)

    useEffect(() => {
        fetch(md)
            .then(res => res.text())
            .then(text => setNote(text))
        hljs.highlightAll()
    }, [])

    // 设置锚点
    const getAnchor = useCallback(() => {
        let i, index
        var H1Arr = document.getElementsByTagName('h1')
        var H2Arr = document.getElementsByTagName('h2')
        var h1s = [], h2s = []
        for (i = 0; i < H1Arr.length; i++) {
            h1s[i] = {}
            h2s[i] = []
            h1s[i].id = H1Arr[i].id
            h1s[i].text = H1Arr[i].innerText
        }
        for (i = 0; i < H2Arr.length; i++) {
            if (H2Arr[i].innerText.split('.')[0] !== 'O') { // 分组，分到哪个一级锚点下
                index = parseInt(H2Arr[i].innerText.split('.')[0])
                h2s[index - 1].push({ id: H2Arr[i].id, text: H2Arr[i].innerText })
            } else {
                h2s[index].push({ id: H2Arr[i].id, text: H2Arr[i].innerText })
            }
        }
        setLink1(h1s)
        setLink2(h2s)
    }, [])

    useEffect(() => {
        if (note) {
            if(!haveHighlight.current) {
                hljs.highlightAll()
                haveHighlight.current = true
            }
            getAnchor()
        }
    }, [note, getAnchor])



    return (
        <div>
            <Header />
            <Row className='Note'>
                <Col span={6} id='anchor'>
                    <Anchor className='anchor'>
                        {
                            link1 && link1.map((item, index) => {
                                return (
                                    <Link href={`#${item.id}`} title={item.text} key={item.id}>
                                        {
                                            link2 && link2[index].map(ceil => (
                                                <Link href={`#${ceil.id}`} title={ceil.text} key={ceil.id} />
                                            ))
                                        }
                                    </Link>
                                )
                            })
                        }
                    </Anchor>
                </Col>
                <Col offset={1} span={17} dangerouslySetInnerHTML={{ __html: marked.parse(note) }}></Col>
            </Row>
        </div>

    )
}

export default Note