// 富文本编辑器（可套入Form表单中）
import React, { useCallback, useEffect, useRef } from 'react'
import E from 'wangeditor'
import hljs from 'highlight.js'

import 'highlight.js/styles/vs2015.css'
import './scss/RichText.scss'

const RichText = ({onChange, content}) => {
    const edit = useRef()

    const contentChange = useCallback((newHtml) => {
        // console.log(newHtml)
        onChange?.(
            newHtml
        );
    }, [onChange])

    useEffect(() => {
        const emotions = require('./emotions.json')

        const editor = new E('#communityRichText')
        editor.highlight = hljs // 高亮
        // 配置属性
        editor.config = {
            ...editor.config,
            height: 270,
            placeholder: '请尽情发挥吧...',
            menus: ['undo', 'redo', 'bold', 'head', 'italic', 'fontName', 'emoticon', 'underline', 'splitLine', 'table', 'code', 'foreColor', 'backColor'],
            fontNames: [
                '黑体',
                '仿宋',
                '楷体',
                '华文仿宋',
                '华文楷体',
                '宋体',
                '微软雅黑',
                'Times New Roman',
            ],
            emotions: emotions,
            languageType: [
                'Bash', 'C', 'C++', 'Java', 'JavaScipt', 'JSON', 'Python', 'Matlab', 'Html', 'CSS', 'TypeScript', 'Plain text', 'SQL', 'Go', 'Shell Session'
            ],
            onchangeTimeout: 500,
            pasteFilterStyle: false,
            pasteIgnoreImg: true,
            focus: false,
            languageTab: '    '
        }
        editor.create()
        edit.current = editor
        return () => {
            editor.destroy()
        }
    }, [])

    useEffect(() => {
        // 初始化内容
        if(content === null || content === undefined) return
        edit.current.txt.html(content)
    }, [content])

    useEffect(() => {
        // 内容发生变化时
        edit.current.config.onchange = contentChange
    }, [contentChange])

    return (
        <div className='communityRichText' id='communityRichText' spellCheck={false}>

        </div>
    )
}

export default RichText