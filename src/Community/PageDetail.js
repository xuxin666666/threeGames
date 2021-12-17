// 帖子详情
import { Card, Avatar, Space, Button, Comment, Input, Modal, BackTop, Popover, Skeleton, Divider, message, Form, Radio, Row, Col } from "antd"
import { CloseOutlined, EyeOutlined, LikeOutlined, MessageOutlined, LikeTwoTone } from "@ant-design/icons"
import { Link, useLocation } from "react-router-dom"
import React, { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import InfiniteScroll from 'react-infinite-scroll-component'

import useUser from "../hook/useUser"
import RichText from './RichText'
import { formatTime } from "../utils"
import './scss/PageDetail.scss'

const ImgAvatars = [ // 头像列表
    '/assert/user/avatar_1.png',
    '/assert/user/avatar_2.png',
    '/assert/user/avatar_3.png',
    '/assert/user/avatar_4.png',
    '/assert/user/avatar_5.png',
    '/assert/user/avatar_6.png',
    '/assert/user/avatar_7.png',
    '/assert/user/avatar_8.png',
]
const commentsLength = 10 // 每次请求的评论的长度
const PageDetail = () => {
    const pageDetail = useRef() // dom
    const loading = useRef(false) // 是否处于加载中
    const replyInput = useRef() // 回复框的dom
    const modify = useRef() // 修改键的dom
    const location = useLocation()

    const user = useUser()
    const [comment, setComment] = useState('') // 要发表的评论
    const [commentModalVis, setCommentModalVis] = useState(false) // 单一评论的的弹出框的可视性
    const [modifyModal, setModifyModalVis] = useState(false) // 修改内容的弹出框的可视性
    const [oneComment, setOneComment] = useState(null) // 单一评论的所有内容
    const [hasMore, setHasMore] = useState(true) // 是否有更多评论
    const [commentStart, setCommentStart] = useState(1) // 从第几条评论开始请求
    const [reverse, setReverse] = useState(false) // 是否倒序展示评论
    const [detail, setDetail] = useState({ views: 0, comments_num: 0, page_id: '', username: '', user_avatar: '', title: '', content: '', approve: [], create_time: 0, update_time: 0 }) // 帖子详情
    const [data, setData] = useState([]) // 评论数组

    useEffect(() => {
        // 如果帖子是自己发表的，则可以修改
        if (user.username === detail.username) {
            modify.current.classList.add('modify')
        } else {
            modify.current.classList.remove('modify')
        }
    }, [user, detail])

    useEffect(() => {
        setDetail(c => {
            return { ...c, user_avatar: user.avatar }
        })
    }, [user])

    // 请求评论
    const getComments = useCallback(async (start, reverse, merge = false) => {
        // merge；判断是否与之前的内容合并在一起
        if (loading.current) return

        loading.current = true
        var comments = [], oneReply = [], path = location.pathname
        const { data: res } = await axios.post(`${path}/comments`, { start, length: commentsLength, reverse })
        loading.current = false
        if (res.status === 200) {
            if (res.data === null) {
                setHasMore(false)
                setData([])
                return
            }
            comments = res.data
            comments.forEach((item) => {
                item.user_avatar = parseInt(item.user_avatar)
                item.approve = item.approve.split(',')
                item.approve = item.approve.filter(ceil => ceil !== '')
                item.reply = item.reply.split('```')
                item.reply = item.reply.filter(ceil => ceil !== '')
                item.reply.forEach((ceil, index) => {
                    oneReply = ceil.split('`')
                    item.reply[index] = { username: oneReply[0], user_avatar: parseInt(oneReply[1]), target_name: oneReply[2], content: oneReply[3] }
                })
            })
            if (comments.length === commentsLength) {
                setCommentStart(c => c + commentsLength)
            } else {
                setCommentStart(c => c + comments.length)
                setHasMore(false)
            }
            if (merge) setData(c => [...c, ...comments])
            else setData(comments)
        } else {
            message.error('获取评论失败')
            setData([])
            setHasMore(false)
        }
    }, [location])

    useEffect(() => {
        var path = location.pathname
        // 请求帖子详情
        async function getPageDetail() {
            var detail
            const { data: res } = await axios.get(path)
            if (res.status === 200) {
                detail = res.data
                detail.user_avatar = parseInt(detail.user_avatar)
                detail.approve = detail.approve.split(',')
                detail.approve = detail.approve.filter(item => item !== '')
                setDetail(detail)
            } else {
                message.error('获取帖子详情失败')
            }
        }

        setHasMore(true)
        setCommentStart(1)
        getPageDetail()
        getComments(1, false, false)
    }, [location, getComments])

    // 按最新/最早的顺序排列评论
    const getCommentsByOrder = useCallback((reverse) => {
        setReverse(reverse)
        setHasMore(true)
        setCommentStart(1)
        getComments(1, reverse)
    }, [getComments])

    // 加载更多数据
    const loadMoreData = () => {
        getComments(commentStart, reverse, true)
    }

    // 给评论（取消）点赞
    const commentApprove = useCallback(async (item) => {
        var path = location.pathname, isApprove = false, msg, comments = [...data]

        if (item.approve.indexOf(user.username) === -1) // 看是否已经点赞
            isApprove = true
        const { data: res } = await axios.post(`${path}/comments/approve`, { add: isApprove, id: item.id })
        if (res.status === 200) { // 请求成功
            if (isApprove) item.approve.push(user.username)
            else {
                item.approve = item.approve.filter(ceil =>
                    ceil !== user.username
                )
            }
            comments[item.id - 1] = item
            setData(comments)
        } else {
            msg = isApprove ? '点赞失败' : '取消点赞失败'
            message.error(msg)
        }
    }, [location, data, user])

    // 给帖子（取消）点赞
    const pageApprove = useCallback(async () => {
        var path = location.pathname, pageDetail = { ...detail }, isApprove = false, msg

        if (detail.approve.indexOf(user.username) === -1) {
            isApprove = true
        }
        const { data: res } = await axios.post(`${path}/approve`, { add: isApprove })
        if (res.status === 200) { // 内容已存到服务器，后续操作本地完成即可
            if (isApprove) pageDetail.approve.push(user.username)
            else {
                pageDetail.approve = pageDetail.approve.filter(item =>
                    item !== user.username
                )
            }
            setDetail(pageDetail)
        } else {
            msg = isApprove ? '点赞失败' : '取消点赞失败'
            message.error(msg)
        }
    }, [location, detail, user])

    // 发表评论
    const publishComment = async () => {
        var path = location.pathname
        const { data: res } = await axios.post(`${path}/comments/insert`, { content: comment })
        if (res.status === 200) {
            message.success('评论成功')
            setComment('')
        } else {
            message.error('评论失败')
        }
    }

    // 发表回复
    const publishReply = async (commentID, targetName, value) => {
        var path = location.pathname, comments, response, oneReply
        const { data: res } = await axios.post(`${path}/comments/reply`, { comment_id: commentID.toString(), target_name: targetName, content: value.content })
        if (res.status === 200) {
            message.success('回复成功', 1)
            comments = [...data]
            response = res.data.reply
            response = response.split('```')
            response = response.filter(ceil => ceil !== '')
            response.forEach((ceil, index) => {
                oneReply = ceil.split('`')
                response[index] = { username: oneReply[0], user_avatar: parseInt(oneReply[1]), target_name: oneReply[2], content: oneReply[3] }
            })
            comments.forEach(item => {
                if (item.id === commentID) {
                    item.reply = response
                }
            })
            setData(comments)
        } else {
            message.error('回复失败')
        }
    }

    // 查看该条评论下的所有回复
    const showAllReply = (parent) => {
        setCommentModalVis(true)
        setOneComment(parent)
    }

    // 回复框聚焦
    const replyDivVis = () => {
        setTimeout(() => {
            replyInput.current.focus()
        }, 150)
    }

    // 显示修改内容的对话框
    const modifyPage = () => {
        setModifyModalVis(true)
    }

    // 校对成功，提交修改
    const onFinish = async (value) => {
        var path = location.pathname
        const { data: res } = await axios.post(path, { content: value.content })
        if (res.status === 200) {
            setDetail(c => {
                return {
                    ...c,
                    content: value.content,
                    update_time: res.data.update_time
                }
            })
            setModifyModalVis(false)
        } else {
            message.error('修改帖子内容失败')
        }
    }

    // 校验失败
    const onFinishFailed = () => {
        message.info('请完成所有内容')
    }

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    // 回复框
    const AddReply = ({ commentID, targetName }) => (
        <Form
            onFinish={value => publishReply(commentID, targetName, value)}
        >
            <Form.Item
                name='content'
                rules={[{ required: true, message: null }]}
                style={{ marginBottom: 10 }}
            >
                <Input.TextArea rows={3} placeholder='请开始你的表演. . .' ref={replyInput} />
            </Form.Item>
            <Form.Item
                style={{ marginBottom: 0 }}
            >
                <Button type="primary" htmlType='submit' style={{ position: 'relative', left: '100%', transform: 'translateX(-100%)' }}>
                    评论
                </Button>
            </Form.Item>
        </Form>
    )

    // 回复
    const InsideComment = ({ comments, short, parent }) => {
        return comments.length > 0 && (
            <Card
                className={short ? 'insideCommentCard' : 'allInsideCommentCard'}
                bordered={false}
            >
                {
                    comments.map((item, index) => {
                        if (short && index > 2) return null
                        if (short && index === 2) return <span className='viewMore' onClick={() => showAllReply(parent)} key={index}>{`查看全部 ${comments.length} 条评论 >`}</span>
                        return (
                            <Comment
                                key={index}
                                avatar={<Avatar src={ImgAvatars[item.user_avatar]} alt="avatar" />}
                                actions={[
                                    <Popover placement='bottomLeft' content={<AddReply commentID={parent.id} targetName={item.username} />} trigger='click' onVisibleChange={replyDivVis}>
                                        <span key="comment-nested-reply-to">回复</span>
                                    </Popover>
                                ]}
                                author={<div className='replyAuthor'>
                                    <span className='username'>{item.username}</span>
                                    {
                                        item.target_name !== '' && <>
                                            <span>回复</span>
                                            <span className='username'>{item.target_name}</span>
                                        </>
                                    }
                                </div>}
                                content={<div className='content'>{item.content}</div>}
                            />
                        )
                    })
                }
            </Card>
        )
    }

    // 评论
    const OutComment = ({ item, short }) => (
        <Comment
            className='outComment'
            actions={[
                <Popover placement='bottomLeft' content={<AddReply commentID={item.id} targetName='' />} trigger='click' onVisibleChange={replyDivVis}>
                    <span key="comment-nested-reply-to">回复</span>
                </Popover>,
                <span>|</span>,
                item.approve.indexOf(user.username) === -1
                    ? <LikeOutlined onClick={() => commentApprove(item)} />
                    : <LikeTwoTone onClick={() => commentApprove(item)} />
                ,
                <span>{item.approve.length}</span>
            ]}
            author={<div>
                <div className='username'>{item.username}</div>
                <div>{item.id + 1}楼</div>
            </div>}
            avatar={<Avatar src={ImgAvatars[item.user_avatar]} alt="avatar" />}
            content={
                <p className='content'>
                    {item.content}
                </p>
            }
            datetime={formatTime(item.create_time)}
        >
            <InsideComment comments={item.reply} short={short} parent={item} />
        </Comment>
    )

    return (
        <div className='communityPageDetail' id='pageDetailScrollable' ref={pageDetail}>
            <Card
                className='content'
                title={<div className='detailUser'>
                    <Avatar src={ImgAvatars[detail.user_avatar]} alt='avatar' />
                    <div className='username'>{detail.username}</div>
                </div>}
                bordered={false}
                extra={<Link to='/community'><CloseOutlined style={{ fontSize: '20px' }} /></Link>}
            >
                <Row className='contentTitle'>
                    <Col span={22}>{detail.title}</Col>
                    <Col span={2}>
                        <span className='static' ref={modify} onClick={modifyPage}>修改</span>
                    </Col>
                </Row>
                <div className='contentBar'>
                    <Space className='time'>
                        <div>
                            创建时间：{formatTime(detail.create_time)}
                        </div>
                        {detail.update_time !== 0 && 
                            <div>
                                更新时间：{formatTime(detail.update_time)}
                            </div>
                        }
                    </Space>
                    <div className='extra'>
                        <IconText icon={EyeOutlined} text={detail.views} key="list-vertical-eye-o" />
                        <IconText icon={MessageOutlined} text={detail.comments_num} key="list-vertical-message" />
                        <Space className='like' onClick={pageApprove} >
                            {
                                detail.approve.indexOf(user.username) === -1
                                    ? <IconText icon={LikeOutlined} text={detail.approve.length} key="list-vertical-like-o" />
                                    : <IconText icon={LikeTwoTone} text={detail.approve.length} key="list-vertical-like" />
                            }
                        </Space>
                    </div>

                </div>
                <div className='contentDetail' dangerouslySetInnerHTML={{ __html: detail.content }}></div>
            </Card>
            <Card className='addComment'>
                <Comment
                    avatar={<Avatar src={ImgAvatars[user.avatar]} alt='avatar' />}
                    content={
                        <>
                            <Input.TextArea rows={3} onChange={e => setComment(e.target.value)} value={comment} placeholder='请开始你的表演. . .' />
                            <Button type="primary" className='sunmitBtn' onClick={publishComment}>评论</Button>
                        </>
                    }
                />
            </Card>
            <Card
                className='comments'
                bordered={false}
                title='全部评论'
                extra={<Radio.Group defaultValue='a'>
                    <Radio.Button value='a' className='linkBtn' onClick={() => getCommentsByOrder(false)}>最早</Radio.Button>
                    <Radio.Button value='b' className='linkBtn' onClick={() => getCommentsByOrder(true)}>最新</Radio.Button>
                </Radio.Group>}
            >
                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={<Divider plain>已显示所有评论</Divider>}
                    scrollableTarget="pageDetailScrollable"
                >
                    {
                        data.map((item) => <OutComment item={item} key={item.id} short />)
                    }
                </InfiniteScroll>

            </Card>

            <Modal
                className='commentModal'
                title='查看评论'
                visible={commentModalVis}
                onCancel={() => setCommentModalVis(false)}
                footer={null}
            >
                <OutComment item={oneComment} />
            </Modal>
            <Modal
                className='modifyModal'
                title='修改内容'
                visible={modifyModal}
                onCancel={() => setModifyModalVis(false)}
                footer={null}
            >
                <Form
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    validateTrigger='onBlur'
                    autoComplete='off'
                >
                    <Form.Item
                        name='content'
                        label='内容'
                        rules={[
                            {
                                required: true,
                                message: ''
                            }
                        ]}
                    >
                        <RichText content={detail.content} />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' className='submit'>更新</Button>
                    </Form.Item>
                </Form>

            </Modal>
            <BackTop visibilityHeight={300} target={() => pageDetail.current} className='backTop' >
                <img src='/assert/community/image/backTop.png' alt='img' />
            </BackTop>
        </div>
    )
}

export default PageDetail