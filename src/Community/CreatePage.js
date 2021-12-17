// 创建帖子
import axios from "axios"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, message } from "antd"
import { useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom"

import RichText from "./RichText"
import './scss/CreatePage.scss'

const CreatePage = () => {
    let history = useHistory()

    const inputRef = useRef()

    useEffect(() => {
        inputRef.current.focus()
    }, [])

    // 校验成功
    const onFinish = async (value) => {
        const {data: res} = await axios.post('/community/createPage', value)
        if(res.status === 200) {
            history.replace('/community')
        } else {
            message.error('水贴失败😉')
        }
    }

    // 校验失败
    const onFinishFailed = () => {
        message.info('请完成所有内容')
    }

    return (
        <Card
            title='发布帖子'
            bordered={false}
            className='communityCreatePage'
            extra={<Link to='/community'><CloseOutlined style={{ fontSize: '20px' }} /></Link>}
        >
            <Form
                className='createPageForm'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                validateTrigger='onBlur'
                autoComplete='off'
            >
                <Form.Item
                    name='title'
                    label='标题'
                    rules={[
                        {
                            required: true,
                            message: '',
                        }
                    ]}
                >
                    <Input  placeholder='标题（必填）' ref={inputRef} />
                </Form.Item>
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
                    <RichText />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' className='submit'>发布</Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default CreatePage