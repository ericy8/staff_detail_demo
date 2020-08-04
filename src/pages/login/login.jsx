import React, { Component } from "react";
import "./login.less";
import { Form, Input, Button, Select, message } from "antd";
import { reqCompanies, reqLogin } from "../../api/ajax";
import ReactCanvasNest from "react-canvas-nest";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
// import sha256 from "crypto-js/sha256";
// import Base64 from "crypto-js/enc-base64";

const { Item } = Form;
const { Option } = Select;

export default class Login extends Component {
    state = {
        companies: [],
    };

    // 点击登录
    handClick = async (values) => {
        const user = { ...values, deviceId: "00-FF-DD-DE-EE" };
        // user.password = sha256(user.password).toString();
        console.log("login信息", user);

        const result = await reqLogin(user);
        if (result.success === true) {
            message.success("登录成功");

            const token = result.data;
            memoryUtils.token = token;
            storageUtils.saveUser(token);

            this.props.history.replace("/warehouse");
        } else {
            message.error(result.msg);
        }
    };

    initData = () => {
        this.loginMethod = ["web", "mobile", "computer"];
    };

    // 获取公司列表
    getCompanies = async (deviceId, loginType) => {
        const result = await reqCompanies(deviceId, loginType);
        if (result.success === true) {
            const companies = result.data;
            this.setState({ companies });
        } else {
            message.error(result.msg);
        }
    };

    UNSAFE_componentWillMount() {
        this.initData();
    }

    componentDidMount() {
        this.getCompanies("1000", "web");
    }

    render() {
        const { companies } = this.state;

        return (
            <div className="login">
                <ReactCanvasNest style={{ zIndex: 1 }} />
                {/* ReactCanvasNest组件大小取决于父节点大小。*/}
                <div className="login-content">
                    <h1>用户登录</h1>
                    <Form onFinish={this.handClick}>
                        <Item
                            name="company_id"
                            rules={[
                                { required: true, message: "请选择公司！" },
                            ]}
                        >
                            <Select placeholder="公司">
                                {companies.map((item) => (
                                    <Option value={item.id} key={item.code}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Item>

                        <Item
                            name="name"
                            rules={[
                                { required: true, message: "请输入用户名！" },
                            ]}
                        >
                            <Input placeholder="用户名" allowClear />
                        </Item>

                        <Item
                            name="password"
                            rules={[
                                { required: true, message: "请输入密码！" },
                            ]}
                        >
                            <Input.Password placeholder="密码" allowClear />
                        </Item>

                        <Item
                            name="loginType"
                            rules={[
                                { required: true, message: "请选择登录方式！" },
                            ]}
                        >
                            <Select placeholder="登录方式">
                                {this.loginMethod.map((item) => (
                                    <Option value={item} key={item}>
                                        {item}
                                    </Option>
                                ))}
                            </Select>
                        </Item>

                        <Button type="primary" block htmlType="submit">
                            登录
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}
