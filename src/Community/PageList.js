// 帖子列表
import axios from 'axios';
import store from 'store';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { List, Avatar, Skeleton, Divider, Space, message } from 'antd';
import { EyeOutlined, MessageOutlined, LikeOutlined, LikeTwoTone } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'

import { formatTime } from '../utils';
import './scss/PageList.scss'


const pageLength = 10
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

const PageList = () => {

    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(true) // 是否还有更多帖子
    const [pageStart, setPageStart] = useState(1) // 从第几条数据开始请求

    const loading = useRef(false) // 是否加载中
    const user = useRef(store.get('user', { username: '???', avatar: 0 }))

    // 加载更多帖子
    const loadMoreData = useCallback((pageStart, prevData) => {
        if(!store.get('login', false)) {
            setHasMore(false)
            return
        }
        if (loading.current) return

        loading.current = true
        async function getPageList() {
            const { data: res } = await axios.post('/community', {
                start: pageStart,
                length: pageLength
            })
            loading.current = false
            if (res.status === 200) {
                if (res.data === null) {
                    setHasMore(false)
                    return
                }
                res.data.forEach(item => {
                    item.approve = item.approve.split(',')
                    item.approve = item.approve.filter(ceil => ceil !== '')
                })
                setData([...prevData, ...res.data])
                if (res.data.length < pageLength) {
                    setHasMore(false)
                    setPageStart(pageStart + res.data.length)
                    // console.log(1)
                } else {
                    setPageStart(pageStart + pageLength)
                }
            } else {
                message.error('获取帖子列表失败')
            }
        }
        getPageList()
    }, [])

    // 刷新，获得最新帖子
    const refresh = () => {
        setHasMore(true)
        loadMoreData(1, [])
    }

    useEffect(() => {
        loadMoreData(1, []);
    }, [loadMoreData]);

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    return (
        <div className='communityPageList'>
            <div className='refresh'>
                <span onClick={refresh}>
                    最新发帖
                </span>
            </div>
            <div id="scrollableDiv">
                <InfiniteScroll
                    dataLength={data.length}
                    next={() => loadMoreData(pageStart, data)}
                    hasMore={hasMore}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        itemLayout='vertical'
                        dataSource={data}
                        renderItem={item => (
                            <List.Item
                                key={item.id}
                                actions={[
                                    <IconText icon={EyeOutlined} text={item.views} key="list-vertical-eye-o" />,
                                    <IconText icon={MessageOutlined} text={item.comments_num} key="list-vertical-message" />,
                                    <IconText 
                                        icon={
                                            item.approve.indexOf(user.current.username) === -1
                                                ? LikeOutlined
                                                : LikeTwoTone    
                                        } 
                                        text={item.approve.length} 
                                        key="list-vertical-like-o" 
                                    />,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={ImgAvatars[parseInt(item.user_avatar)]} />}
                                    title={item.username}
                                    description={formatTime(item.create_time)}
                                />
                                <Link to={`/community/${item.page_id}`}>
                                    <div className='preview'>
                                        <div className='title'>{item.title}</div>
                                        <div className='preContent' dangerouslySetInnerHTML={{ __html: item.pre_content }}></div>
                                    </div>
                                </Link>
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
        </div>

    )
}

export default PageList