import { useEffect, useRef } from "react"

import './scss/WordRain.scss'

const WordRain = ({ visible }) => {
    const container = useRef()
    const rafId = useRef()

    useEffect(() => {
        MainJS()
        return () => {
            window.cancelAnimationFrame(rafId.current)
        }
    }, [])

    useEffect(() => {
        var vis = visible === false ? false : true
        console.log(visible, vis, vis ? 'visible' : 'hidden')
        container.current.style.visibility = vis ? 'visible' : 'hidden'
    }, [visible])

    const MainJS = () => {
        var RENDERER = {
            FontSize: 16,
            FontColor: 'rgb(0, 255, 0)',
            BGColor: 'rgba(0, 0, 0, 0.5)',
            thirtyFPS: true,

            init: function () {
                this.setParams()
                this.bindThis()
                this.setup()
                this.bindEvent()
                this.render()
            },
            setParams: function () {
                this.$window = window
                this.$canvas = container.current
                this.ctx = this.$canvas.getContext('2d')
                
            },
            setup: function(){
                this.width = this.$window.innerWidth
                this.height = this.$window.innerHeight
                this.$canvas.width = this.width
                this.$canvas.height = this.height
                this.w = Math.floor(this.width / this.FontSize)
                this.h = Math.floor(this.height / this.FontSize)
                this.count = 0

                this.fontArr = []
                for (let i = 0; i < 200; i++) {
                    this.fontArr[i] = []
                    this.fontArr[i].running = true
                    if (Math.random() < 0.6) this.fontArr[i].push(new FONT(this, i * this.FontSize, 0, this.FontSize, this.FontColor))
                }
            },
            bindThis: function () {
                this.watchWindowSize = this.watchWindowSize.bind(this)
                this.render = this.render.bind(this)
                this.bindEvent = this.bindEvent.bind(this)
            },
            watchWindowSize: function () {
                this.width = this.$window.innerWidth
                this.height = this.$window.innerHeight
                this.$canvas.width = this.width
                this.$canvas.height = this.height
                this.w = Math.floor(this.width / this.FontSize)
                this.h = Math.floor(this.height / this.FontSize)
            },
            bindEvent: function () {
                this.$window.addEventListener('resize', this.watchWindowSize)
            },
            
            render: function () {
                rafId.current = requestAnimationFrame(this.render)
                if(this.thirtyFPS && this.count < 1){
                    this.count++
                    return
                }
                this.count = 0

                this.ctx.beginPath()
                this.ctx.clearRect(0, 0, this.width, this.height)
                this.ctx.beginPath()
                this.ctx.fillStyle = this.BGColor
                this.ctx.fillRect(0, 0, this.width, this.height)
                this.ctx.font = this.FontSize + 'px Consolas'
                for (let i = 0; i < this.w; i++) {
                    let j = 0, flag = false
                    if(this.fontArr[i].length > 0)
                        this.fontArr[i].forEach((item, index) => {
                            if (item.running) {
                                item.render()
                                item.change()
                                flag = true
                                j++
                            } else {
                                this.fontArr[i].shift()
                            }
                        })
                    if (j > 0 && flag && j < (this.h + 4) && this.fontArr[i].running)
                        this.fontArr[i].push(new FONT(this, i * this.FontSize, j * this.FontSize, this.FontSize, this.FontColor))

                    if (Math.random() < 0.02) {
                        this.fontArr[i].running = false
                    }
                    if (this.fontArr[i].length === 0 && !this.fontArr[i].running && Math.random() < 0.2) {
                        this.fontArr[i].running = true
                        this.fontArr[i].push(new FONT(this, i * this.FontSize, 0, this.FontSize, this.FontColor))
                    }
                }
            }
        }
        function FONT(renderer, x, y, fontSize, fontColor) {
            fontColor = fontColor || 'rgb(0, 255, 0)'
            var res = fontColor.match(/^(rgba?\()?(\d*\.?\d+), *(\d*\.?\d+), *(\d*\.?\d+)(, *(\d*\.?\d+))?\)?$/i)
            this.text = String.fromCharCode(parseInt(Math.random() * (90 - 65) + 65))
            this.color = [res[2], res[3], res[4]]
            this.fontSize = fontSize || 14
            this.position = { x: x || 0, y: y || 0 }
            this.opacity = 1
            this.running = true
            this.renderer = renderer
            this.init()
        }
        FONT.prototype = {
            init: function () {
                this.h = Math.floor(this.renderer.height / this.fontSize)
            },
            change: function () {
                this.opacity -= 1 / this.h / 1.5
                this.fontColor = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity}`
                if (this.opacity <= 0) this.running = false
            },
            render: function () {
                this.renderer.ctx.beginPath()
                this.renderer.ctx.fillStyle = this.fontColor
                this.renderer.ctx.fillText(this.text, this.position.x, this.position.y)
            }
        }
        
        RENDERER.init()
    }

    return (
        <canvas ref={container} className='wordRain'></canvas>
    )
}

export default WordRain