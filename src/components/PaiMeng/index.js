import { useEffect, useRef } from "react"

import SpriteFigure from './SpriteFigure.png'
import './index.scss'

const PaiMeng = () => {
    const canvas = useRef()
    const rafId = useRef()

    useEffect(() => {
        var RENDERER = {
            Width: 50,
            Height: 50,
            Position: {x: 0, y: 0},
            ThirtyFPS: true,
            Canvas: canvas.current,

            init: function () {
                this.setParams()
                this.bindThis()
                this.computedParams()
                this.bindEvent()
                this.render()
            },
            setParams: function () {
                this.$window = window
                this.canvas = this.Canvas
                this.ctx = this.canvas.getContext('2d')
                

            },
            bindThis: function () {
                this.render = this.render.bind(this)
                // this.isThirtyFPS = this.isThirtyFPS.bind(this)
                // this.ctx.drawImage = this.ctx.drawImage.bind(this)
            },
            computedParams: function () {
                this.count = 0
                this.paimeng = new PaiMeng(this.Position.x, this.Position.y, this)
                if(this.Width < this.Position.x + this.paimeng.width)
                    this.Width = this.Position.x + this.paimeng.width
                if(this.Height < this.Position.y + this.paimeng.height)
                    this.Height = this.Position.y + this.paimeng.height

                this.canvas.width = this.Width
                this.canvas.height = this.Height
            },
            bindEvent: function () {

            },
            isThirtyFPS: function () {
                if (this.ThirtyFPS && this.count < 1) {
                    this.count++
                    return true
                }
                this.count = 0
                return false
            },
            render: function () {
                rafId.current = this.$window.requestAnimationFrame(this.render)
                if (this.isThirtyFPS()) return

                this.ctx.clearRect(0, 0, this.Width, this.Height)
                this.paimeng.render()
            }
        }
        function PaiMeng(x, y, renderer) {
            this.x = x
            this.y = y
            this.renderer = renderer
            this.ctx = this.renderer.ctx
            this.img = new Image()
            this.img.src = SpriteFigure
            this.interval = 25
            this.init()

            this.width = 330
            this.height = 485
        }
        PaiMeng.prototype = {
            init: function () {
                this.hands.init(this)
                this.legs.init(this)
                this.body.init(this)
                this.head.init(this)
                this.face.init(this)
                this.hair.init(this)
                this.crown.init(this)
            },
            hands: {
                init: function (renderer) {
                    this.renderer = renderer
                    this.ctx = this.renderer.ctx
                    this.img = this.renderer.img
                    this.interval = this.renderer.interval
                    this.activing = false
                    this.leftHandX = 0
                    this.leftHandY = 0
                    this.leftHandR = 0
                    this.rightHandX = 0
                    this.rightHandY = 0
                    this.rightHandR = 0
                    this.maxR = Math.PI / 24
                    this.flag = true
                    this.activingPre = true
                    this.activingEnd = false
                    this.count = 0
                },
                leftHand: function () {
                    this.ctx.save()
                    this.ctx.translate(this.leftHandX + 20, this.leftHandY + 60)
                    this.ctx.rotate(this.leftHandR)
                    this.ctx.translate(-20, -60)

                    this.ctx.save()
                    this.ctx.translate(36, 25)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 1766, 2, 55, 50, 0, 0, 55, 50) // 手臂
                    this.ctx.restore()

                    this.ctx.save()
                    this.ctx.translate(-4, 9)
                    this.ctx.rotate(-Math.PI / 16)
                    this.ctx.drawImage(this.img, 1935, 82, 34, 37, 0, 0, 34, 37) // 手掌
                    this.ctx.restore()

                    this.ctx.translate(42, 25)
                    this.ctx.rotate(Math.PI / 30 * 16)
                    this.ctx.drawImage(this.img, 1897, 72, 38, 57, 0, 0, 38, 57) // 手环

                    this.ctx.restore()
                },
                rightHand: function () {
                    this.ctx.save()
                    this.ctx.translate(this.rightHandX + 100, this.rightHandY + 20)
                    this.ctx.rotate(this.rightHandR)
                    this.ctx.translate(-100, -20)

                    this.ctx.translate(74, 3)
                    this.ctx.drawImage(this.img, 1205, 4, 60, 63, -17, 8, 60, 63) // 手臂
                    this.ctx.translate(12, -1)
                    this.ctx.save()
                    this.ctx.rotate(Math.PI / 12 * 7)
                    this.ctx.drawImage(this.img, 1984, 169, 39, 37, 0, 0, 39, 37) // 手掌
                    this.ctx.restore()
                    this.ctx.translate(-30, 6)
                    this.ctx.rotate(Math.PI / 12)
                    this.ctx.drawImage(this.img, 1939, 207, 40, 41, 0, 0, 40, 41) // 手环

                    this.ctx.restore()
                },
                render: function () {
                    this.ctx.save()
                    this.ctx.translate(0, 37)
                    this.leftHand()
                    this.rightHand()
                    this.ctx.restore()
                    this.move()
                },
                move: function () {
                    if (this.activing && !this.renderer.face.mouthActiving) {
                        if (this.activingPre) {
                            if (this.leftHandX < 10) {
                                this.leftHandX += 1
                                this.leftHandY -= 0.6
                                this.rightHandX -= 1
                                this.rightHandY += 0.7
                                this.leftHandR -= Math.PI / 180
                                this.rightHandR += Math.PI / 180
                            } else this.activingPre = false
                            return
                        }
                        if (this.activingEnd) {
                            if (this.flag) {
                                if (this.leftHandX < 10) {
                                    this.leftHandX += 0.5
                                    this.leftHandY -= 1
                                    this.rightHandX += 0.5
                                    this.rightHandY += 1
                                } else this.flag = false
                                return
                            }
                            if (this.leftHandX > 0) {
                                this.leftHandX -= 1
                                this.leftHandY += 0.6
                                this.rightHandX += 1
                                this.rightHandY -= 0.7
                                this.leftHandR += Math.PI / 180
                                this.rightHandR -= Math.PI / 180
                            } else {
                                this.activingPre = true
                                this.activing = false
                                this.activingEnd = false
                            }
                            return
                        }
                        if (this.flag) {
                            if (this.leftHandX < 11) {
                                this.leftHandX += 0.5
                                this.leftHandY -= 1
                                this.rightHandX += 0.5
                                this.rightHandY += 1
                            } else this.flag = false
                        } else {
                            if (this.leftHandX > 9) {
                                this.leftHandX -= 0.5
                                this.leftHandY += 1
                                this.rightHandX -= 0.5
                                this.rightHandY -= 1
                            } else {
                                this.flag = true
                                this.count++
                            }
                        }
                        if (this.count === 3) {
                            this.count = 0
                            this.activingEnd = true
                        }
                    } else {
                        if (this.flag) {
                            if (this.leftHandR < this.maxR) {
                                this.leftHandR += this.maxR / this.interval
                                this.rightHandR -= this.maxR / this.interval
                            } else this.flag = false
                        } else {
                            if (this.leftHandR > 0) {
                                this.leftHandR -= this.maxR / this.interval
                                this.rightHandR += this.maxR / this.interval
                            } else {
                                this.flag = true
                                this.count++
                            }
                            if (this.count === 2) {
                                this.count = 0
                                if (Math.random() < 0.6) this.activing = true
                            }
                        }
                    }
                }
            },
            legs: {
                init: function (renderer) {
                    this.renderer = renderer
                    this.ctx = this.renderer.ctx
                    this.img = this.renderer.img
                    this.interval = this.renderer.interval
                    this.leftLegR = 0
                    this.rightLegR = 0
                    this.maxR = Math.PI / 18
                    this.flag = true
                },
                leftLeg: function () {
                    this.ctx.save()
                    this.ctx.translate(80, 120)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 1694, 3, 73, 49, 0, 0, 73, 49) // 大腿
                    this.ctx.restore()
                    this.ctx.save()
                    this.ctx.translate(51, 168)
                    this.ctx.rotate(this.leftLegR)
                    this.ctx.drawImage(this.img, 1695, 51, 56, 73, 0, 0, 56, 73) // 小腿+脚
                    this.ctx.restore()
                    this.ctx.save()
                    this.ctx.translate(89, 166)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 1864, 66, 35, 62, 0, 0, 35, 62) // 脚环
                    this.ctx.restore()
                },
                rightLeg: function () {
                    this.ctx.save()
                    this.ctx.translate(112, 136)
                    this.ctx.translate(-10, 0)
                    this.ctx.rotate(this.rightLegR)
                    this.ctx.translate(10, -0)
                    this.ctx.drawImage(this.img, 1932, 147, 39, 49, 0, 0, 39, 49) // 脚
                    this.ctx.save()
                    this.ctx.translate(30, 0)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 1982, 211, 42, 40, 0, 0, 42, 40) // 脚环
                    this.ctx.restore()
                    this.ctx.translate(-30, -25)
                    this.ctx.drawImage(this.img, 1810, 63, 53, 62, 0, 0, 53, 62) // 大腿
                    this.ctx.restore()
                },
                move: function () {
                    if (this.flag) {
                        if (this.leftLegR < this.maxR) {
                            this.leftLegR += this.maxR / this.interval
                            this.rightLegR += this.maxR / this.interval
                        } else this.flag = false
                    } else {
                        if (this.leftLegR > 0) {
                            this.leftLegR -= this.maxR / this.interval
                            this.rightLegR -= this.maxR / this.interval
                        } else this.flag = true
                    }
                },
                render: function () {
                    this.leftLeg()
                    this.rightLeg()
                    this.move()
                }
            },
            body: {
                init: function (renderer) {
                    this.renderer = renderer
                    this.ctx = this.renderer.ctx
                    this.img = this.renderer.img
                    this.interval = this.renderer.interval
                    this.maxR = Math.PI / 12
                    this.R = 0
                    this.flag = true
                },
                body: function(){
                    this.ctx.save()
                    this.ctx.translate(133, 36)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 1535, 129, 124, 123, 0, 0, 124, 123)
                    this.ctx.restore()
                },
                scarf: function(){
                    this.ctx.drawImage(this.img, 885, 0, 89, 62, 10, 32, 89, 62)

                    this.ctx.save()
                    this.ctx.translate(10, 2)
                    this.ctx.rotate(Math.PI / 6)
                    this.ctx.drawImage(this.img, 1101, 1, 101, 68, 0, 0, 101, 68)
                    this.ctx.restore()
                },
                cape: function(){
                    this.ctx.save()
                    this.ctx.translate(166, 20)
                    this.ctx.translate(-100, 0)
                    this.ctx.rotate(-0.2 * this.R)
                    this.ctx.translate(100, 0)
                    
                    this.ctx.save()
                    this.ctx.translate(13, 71)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.translate(0, 60)
                    this.ctx.rotate(-0.2 * this.R)
                    this.ctx.translate(0, -60)
                    this.ctx.drawImage(this.img, 1407, 145, 45, 70, 0, 0, 45, 70) // 左截中部
                    this.ctx.clearRect(-1, 31, 6, -32)
                    this.ctx.clearRect(4, 28, 10, -29)
                    this.ctx.clearRect(14, 21, 18, -22)
                    this.ctx.clearRect(32, 18, 14, -10)

                    this.ctx.translate(33, 0.5)
                    this.ctx.translate(0, 37)
                    this.ctx.rotate(-0.5 * this.R)
                    this.ctx.translate(0, -37)
                    this.ctx.drawImage(this.img, 1440, 145, 27, 50, 0, 0, 27, 50) // 左截下部
                    this.ctx.restore()

                    this.ctx.save()
                    this.ctx.translate(5, 55)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.translate(0, 20)
                    this.ctx.rotate(-0.2 * this.R)
                    this.ctx.translate(0, -20)
                    this.ctx.drawImage(this.img, 1391, 152, 27, 25, 0, 0, 27, 25)// 中截上部

                    this.ctx.translate(4, -10)
                    this.ctx.drawImage(this.img, 1395, 142, 28, 30, 0, 0, 28, 30) // 中截中上部

                    this.ctx.translate(5, -23)
                    this.ctx.translate(5, 35)
                    this.ctx.rotate(-0.3 * this.R)
                    this.ctx.translate(-5, -35)
                    this.ctx.drawImage(this.img, 1401, 117.5, 43, 46, 0, 0, 43, 46) // 中截中部

                    this.ctx.translate(6.5, -27)
                    this.ctx.translate(10, 20)
                    this.ctx.rotate(-0.6 * this.R)
                    this.ctx.translate(-10, -20)
                    this.ctx.drawImage(this.img, 1408, 89, 30, 33, 0, 0, 30, 33) // 中截下部
                    this.ctx.restore()

                    this.ctx.save()
                    this.ctx.translate(10, 29)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.translate(14, 10)
                    this.ctx.rotate(-0.2 * this.R)
                    this.ctx.translate(-14, -10)
                    this.ctx.drawImage(this.img, 1364, 146, 29, 11, 0, 0, 29, 11) // 右截上部

                    this.ctx.translate(-3, -50)
                    this.ctx.translate(18, 50)
                    this.ctx.rotate(-0.3 * this.R)
                    this.ctx.translate(-18, -50)
                    this.ctx.drawImage(this.img, 1361, 96, 37, 52, 0, 0, 37, 52)

                    this.ctx.translate(-22, -0.5)
                    this.ctx.translate(24, 16)
                    this.ctx.rotate(-0.3 * this.R)
                    this.ctx.translate(-24, -16)
                    this.ctx.drawImage(this.img, 1338, 95, 26, 33, 0, 0, 26, 33)
                    this.ctx.restore()

                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 1335, 85 + 73, 72, 95, 0, 0, 72, 95)

                    this.ctx.restore()
                }, 
                move: function(){
                    if(this.flag) {
                        if(this.R < this.maxR) {
                            this.R += this.maxR / this.interval
                        } else this.flag = false
                    } else {
                        if(this.R > 0) {
                            this.R -= this.maxR / this.interval
                        } else this.flag = true
                    }
                },
                render: function () {
                    this.cape()
                    this.body()
                    this.scarf()
                    this.move()
                }
            },
            head: {
                init: function (renderer) {
                    this.renderer = renderer
                    this.ctx = this.renderer.ctx
                    this.img = this.renderer.img
                },
                head: function(){
                    this.ctx.save()
                    this.ctx.translate(195, -145)

                    this.ctx.save()
                    this.ctx.translate(2, 0)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 4, 5, 103, 245, 0, 0, 103, 245) // 头后的头发上部
                    this.ctx.restore()

                    this.ctx.save()
                    this.ctx.translate(3, 98)
                    this.ctx.rotate(Math.PI / 2 + Math.PI / 24)
                    this.ctx.rotate(-0.8 * this.renderer.hair.R)
                    this.ctx.drawImage(this.img, 95, 4, 127, 78, 0, 0, 127, 78) // 头后的头发右下部
                    this.ctx.restore()

                    this.ctx.save()
                    this.ctx.translate(-180, 110)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.translate(0, 60)
                    this.ctx.rotate(0.8 * this.renderer.hair.R)
                    this.ctx.translate(0, -60)
                    this.ctx.drawImage(this.img, 127, 184, 106, 65, 0, 0, 106, 65) // 头后的头发左下部
                    this.ctx.restore()

                    this.ctx.restore()
                },
                render: function () {
                    this.head()
                    this.renderer.face.render()
                }
            },
            face: {
                init: function (renderer) {
                    this.renderer = renderer
                    this.ctx = this.renderer.ctx
                    this.img = this.renderer.img
                    this.eyeFlag = true
                    this.eyeF = 0 // 眨眼时的帧数，闭眼睁眼共8帧动画，0完全睁开，4完全闭上
                    this.eyeInterval = 0 // 控制眨眼之间的间隔
                    this.mouthActiving = false 
                    this.mouthInterval = 0 // 控制张嘴之间的间隔
                },
                face: function () {
                    this.ctx.save()

                    this.ctx.translate(-30, -120)
                    this.ctx.drawImage(this.img, 730, 65, 182, 183, 0, 0, 182, 183)
                    this.ctx.drawImage(this.img, 1016, 70, 188, 183, -3, -1, 188, 183)

                    this.ctx.restore()
                },
                leftEye: function () {
                    this.ctx.save()
                    this.ctx.translate(-28, -17)

                    this.ctx.save()
                    this.ctx.translate(45, 5 + 44 * this.eyeF / 8)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 1475 + 44 * this.eyeF / 8, 79, 44 - 44 * this.eyeF / 4, 38, 0, 0, 44 - 44 * this.eyeF / 4, 38) // 眼底
                    this.ctx.restore()

                    this.ctx.save()
                    this.ctx.translate(37, 5 + 40 * this.eyeF / 8)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 1933 + 40 * this.eyeF / 8, 121, 40 - 40 * this.eyeF / 4, 27, 0, 0, 40 - 40 * this.eyeF / 4, 27) // 眼睛
                    this.ctx.drawImage(this.img, 378 + 38 * this.eyeF / 8, 2, 38 - 38 * this.eyeF / 4, 29, 5, 1, 34 - 34 * this.eyeF / 4, 26) // 星星

                    this.ctx.restore()

                    this.ctx.translate(4, 30 * this.eyeF / 8)
                    this.ctx.drawImage(this.img, 1973, 101, 41, 34, 0, 0, 41, 15 + (34 - 15) * (4 - this.eyeF) / 4) // 睫毛
                    this.ctx.drawImage(this.img, 1197, 68, 21, 15, 15, -5, 21, 15) // 眉毛
                    this.ctx.drawImage(this.img, 761, 58, 11, 7, 12, 40 - 40 * this.eyeF / 4, 11, 7) // 左下角黑线

                    this.ctx.restore()
                },
                rightEye: function () {
                    this.ctx.save()
                    this.ctx.translate(44, -14)

                    this.ctx.save()
                    this.ctx.translate(50, -5 + 43 * this.eyeF / 8)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 1470 + 43 * this.eyeF / 8, 1, 43 - 43 * this.eyeF / 4, 51, 0, 0, 43 - 43 * this.eyeF / 4, 51) // 眼底
                    this.ctx.restore()

                    this.ctx.drawImage(this.img, 1955, 31 + 40 * this.eyeF / 8, 34, 40 - 40 * this.eyeF / 4, 2, -3 + 40 * this.eyeF / 8, 34, 40 - 40 * this.eyeF / 4) // 眼睛
                    this.ctx.drawImage(this.img, 1988, 34 + 36 * this.eyeF / 8, 25, 36 - 36 * this.eyeF / 4, 6, -1 + 36 * this.eyeF / 8, 25, 36 - 36 * this.eyeF / 4) // 星星
                    this.ctx.drawImage(this.img, 473, 1, 62, 36, -2, -11 + 36 * this.eyeF / 8, 62, 15 + (36 - 15) * (4 - this.eyeF) / 4) // 睫毛
                    this.ctx.drawImage(this.img, 740, 53, 22, 13, 0, -11 + 36 * this.eyeF / 8, 22, 13) // 眉毛
                    this.ctx.translate(44, 27 - 36 * this.eyeF / 8)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 732, 51, 8, 13, 0, 0, 8, 13) // 右下角黑线

                    this.ctx.restore()
                },
                mouth: function () {
                    this.ctx.save()

                    this.ctx.translate(20, 34)
                    if (!this.mouthActiving) {
                        this.ctx.drawImage(this.img, 1217, 73, 29, 9, 0, 0, 29, 9)
                    } else {
                        this.ctx.drawImage(this.img, 1902, 1, 29, 18, 0, 0, 29, 18)
                    }

                    this.ctx.restore()
                },
                eyebrow: function () {
                    this.ctx.save()

                    this.ctx.translate(10, -34)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 1680, 221, 18, 32, 0, 0, 18, 32)
                    this.ctx.drawImage(this.img, 1674, 152, 16, 41, -5, -78, 16, 41)

                    this.ctx.restore()
                },
                eyeMove: function () {
                    if (this.eyeInterval < 80) {
                        this.eyeInterval++
                        return
                    }
                    if (this.eyeFlag) {
                        if (this.eyeF < 4) {
                            this.eyeF++
                        } else this.eyeFlag = false
                    } else {
                        if (this.eyeF > 0) {
                            this.eyeF--
                        } else {
                            this.eyeFlag = true
                            this.eyeInterval = 0
                        }
                    }
                },
                mouthMove: function () {
                    if (this.mouthActiving) {
                        if(this.mouthInterval < 60)
                            this.mouthInterval++
                        else if(Math.random() < 0.08) {
                            this.mouthActiving = false
                            this.mouthInterval = 0
                        }
                    } else {
                        if(this.mouthInterval < 180) 
                            this.mouthInterval++
                        else if(!this.renderer.hands.activing && Math.random() < 0.03) {
                            this.mouthActiving = true
                            this.mouthInterval = 0
                        }
                    }
                },
                preHair1: function(){
                    this.ctx.save()
                    this.ctx.translate(-3, -87)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 563, 223, 123, 29, 0, 0, 123, 29) // 左底
                    this.ctx.restore()
                },
                preHair2: function() {
                    this.ctx.save()
                    this.ctx.drawImage(this.img, 686, 105, 33, 23, 112, -30, 33, 23) // 右底
                    this.ctx.translate(123, -58)
                    this.ctx.rotate(Math.PI / 18)
                    this.ctx.drawImage(this.img, 1648, 75, 29, 55, 0, 0, 29, 55) // 右顶
                    this.ctx.restore()

                    this.ctx.save()
                    this.ctx.translate(40, -36)
                    this.ctx.rotate(Math.PI / 2 + Math.PI / 18)
                    this.ctx.translate(0, 40)
                    this.ctx.rotate( -1.6 * this.renderer.hair.R)
                    this.ctx.translate(0, -40)
                    this.ctx.drawImage(this.img, 625, 158, 50, 47, 0, 0, 50, 47) // 中左底
                    this.ctx.restore()

                    this.ctx.save()
                    this.ctx.translate(103, -54)
                    this.ctx.rotate(Math.PI / 2 + Math.PI / 30)
                    this.ctx.translate(10, 45)
                    this.ctx.rotate( -this.renderer.hair.R)
                    this.ctx.translate(-10, -45)
                    this.ctx.drawImage(this.img, 600, 102, 76, 46, 0, 0, 76, 46) // 中右底
                    this.ctx.restore()
                },
                render: function () {
                    this.preHair1()
                    this.face()
                    this.preHair2()
                    this.leftEye()
                    this.rightEye()
                    this.mouth()
                    this.eyebrow()
                    this.eyeMove()
                    this.mouthMove()
                }
            },
            hair: {
                init: function (renderer) {
                    this.renderer = renderer
                    this.ctx = this.renderer.ctx
                    this.img = this.renderer.img
                    this.interval = this.renderer.interval * 1.2
                    this.R = 0
                    this.maxR = Math.PI / 24
                    this.flag = true
                },
                inLeft: function(){
                    this.ctx.save()
                    this.ctx.translate(27, -107)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.rotate(0.35 * this.R - Math.PI / 90)
                    this.ctx.drawImage(this.img, 777, 5, 107, 58, 0, 0, 107, 58) // 左底
                    this.ctx.restore()
                },
                inRight: function(){
                    this.ctx.save()
                    this.ctx.translate(26, -128)
                    this.ctx.rotate(Math.PI / 36)
                    // this.ctx.translate(15, 40)
                    this.ctx.rotate( -0.4 * this.renderer.hair.R)
                    // this.ctx.translate(-15, -40)
                    this.ctx.drawImage(this.img, 1541, 6, 102, 118, 0, 0, 102, 118)
                    this.ctx.restore()
                },
                outLeft: function(){
                    this.ctx.save()
                    this.ctx.translate(-88, -118)
                    this.ctx.drawImage(this.img, 450, 36, 81, 116, 30, 0, 81, 116)

                    this.ctx.save()
                    this.ctx.translate(2, 76)
                    this.ctx.translate(30, 20)
                    this.ctx.rotate(this.R)
                    this.ctx.translate(-30, -20)
                    this.ctx.drawImage(this.img, 422, 112, 31, 44, 0, 0, 31, 44) // 左边一小撮
                    this.ctx.restore()

                    this.ctx.translate(32.5, 114)
                    this.ctx.translate(15, 0)
                    this.ctx.rotate(this.R)
                    this.ctx.translate(-15, 0)
                    this.ctx.drawImage(this.img, 452, 152, 78, 61, 0, 0, 78, 61)

                    this.ctx.translate(-2, 58)
                    this.ctx.translate(20, 0)
                    this.ctx.rotate(1.2 * this.R - this.maxR)
                    this.ctx.translate(-20, 0)
                    this.ctx.drawImage(this.img, 450, 209, 83, 40, 0, 0, 83, 40)

                    this.ctx.restore()
                },
                outMiddle: function(){
                    this.ctx.save()
                    this.ctx.translate(-11, -118)
                    this.ctx.drawImage(this.img, 1465, 115, 71, 72, 0, 0, 71, 72)

                    this.ctx.translate(0, 70)
                    this.ctx.translate(25, 0)
                    this.ctx.rotate(-1.2 * this.R)
                    this.ctx.translate(-25, 0)
                    this.ctx.drawImage(this.img, 1465, 185, 71, 47, 0, 0, 71, 47)

                    this.ctx.translate(22, 42)
                    this.ctx.translate(10, 0)
                    this.ctx.rotate(-1.2 * this.R)
                    this.ctx.translate(-10, 0)
                    this.ctx.drawImage(this.img, 1488, 228, 40, 18, 0, 0, 40, 18)

                    this.ctx.restore()
                },
                outRight: function(){
                    this.ctx.save()
                    this.ctx.translate(25, -133)
                    this.ctx.drawImage(this.img, 237, 31, 184, 53, 0, 0, 184, 53) // 上部

                    this.ctx.translate(1, 50)
                    this.ctx.translate(80, 0)
                    this.ctx.rotate(-0.5 * this.R)
                    this.ctx.translate(-80, 0)
                    this.ctx.drawImage(this.img, 237, 81, 164, 40, 0, 0, 164, 40) // 中上部

                    this.ctx.translate(22, 39)
                    this.ctx.drawImage(this.img, 260, 125, 124, 39, 0, 0, 124, 39) // 中部

                    this.ctx.save()
                    this.ctx.translate(118, -1)
                    this.ctx.translate(0, 15)
                    this.ctx.rotate(-this.R)
                    this.ctx.translate(0, -15)
                    this.ctx.drawImage(this.img, 382, 123, 38, 41, 0, 0, 38, 41) // 右部
                    this.ctx.restore()

                    this.ctx.save()
                    this.ctx.translate(8.5, 35)
                    this.ctx.translate(50, 0)
                    this.ctx.rotate(-this.R + this.maxR)
                    this.ctx.translate(-50, 0)
                    this.ctx.drawImage(this.img, 268, 160, 86, 90, 0, 0, 86, 90) // 下部
                    this.ctx.restore()

                    this.ctx.drawImage(this.img, 1786, 179, 52, 74, 28, -45, 52, 74) // 头饰
                    this.ctx.restore()
                },
                hairMove: function(){
                    if(this.flag) {
                        if(this.R < this.maxR)
                            this.R += this.maxR / this.interval
                        else this.flag = false
                    } else {
                        if(this.R > 0)
                            this.R -= this.maxR / this.interval
                        else this.flag = true
                    }
                },
                render: function() {
                    this.inLeft()
                    this.inRight()
                    this.outLeft()
                    this.outRight()
                    this.outMiddle()

                    this.hairMove()
                }
            },
            crown: {
                init: function (renderer) {
                    this.renderer = renderer
                    this.ctx = this.renderer.ctx
                    this.img = this.renderer.img
                    this.maxY = 8
                    this.interval = this.renderer.interval * 1.5
                    this.Y = 0
                    this.flag = true
                },
                move: function(){
                    if(this.flag) {
                        if(this.Y < this.maxY)
                            this.Y += this.maxY / this.interval
                        else this.flag = false
                    } else {
                        if(this.Y > 0)
                            this.Y -= this.maxY / this.interval
                        else this.flag = true
                    }
                },
                crown: function(){
                    this.ctx.save()
                    this.ctx.translate(130, -222 - this.Y)
                    this.ctx.rotate(Math.PI / 2)
                    this.ctx.drawImage(this.img, 914, 68, 105, 185, 0, 0, 105, 185)
                    this.ctx.restore()
                },
                render: function(){
                    this.crown()
                    this.move()
                }
            },
            render: function () {
                this.ctx.save()
                this.ctx.translate(90, 230)
                this.ctx.translate(this.x, this.y)

                this.legs.render()
                this.body.render()
                this.head.render()
                this.hands.render()
                this.hair.render()
                this.crown.render()

                this.ctx.restore()
            },
            handsMove: function(){
                if(!this.hands.activing) this.hands.activing = true
            },
            mouthOpen: function(){
                if(!this.face.mouthActiving && !this.hands.activing) 
                    this.face.mouthActiving = true
            },
            eyesBlink: function(){
                this.face.eyeInterval = 80
            }
        }
        RENDERER.init()

        return () => {
            window.cancelAnimationFrame(rafId.current)
        }
    }, [])

    return (
        <canvas className='paimeng' ref={canvas}></canvas>
    )
}

export default PaiMeng