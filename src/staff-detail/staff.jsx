import React, { Component } from "react";
import "./staff.less";
import LinkButton from "../utils/link-button";
import {
    Table,
    Tag,
    Space,
    message,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    DatePicker,
    Cascader,
    Popconfirm,
    Card,
} from "antd";
import moment from "moment";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";

const { Item } = Form;
const { Option } = Select;

export default class Staff extends Component {
    state = {
        visible: false,
        staff_details: [],
        formValue: {},
    };

    okModal = () => {
        this.formRef_currnt.validateFields().then((values) => {
            this.setState({
                visible: false,
                staff_details: [...this.state.staff_details, values],
            });
            this.formRef_currnt.resetFields();
            message.success("添加成功");
        });
    };

    // 删除表格数据
    handleDelete = (index) => {
        const dataSource = [...this.state.staff_details];
        // this.setState({
        //     dataSource: dataSource.filter(item => item.name !== name)
        // });
        dataSource.splice(index, 1);
        this.setState({
            staff_details: dataSource,
        });
        message.success("删除成功");
    };

    handleUpdate = (record) => {
        const { formValue } = this.state;
        this.setState({ visible: true });
        // this.record = record;
        this.setState({
            formValue: record,
        });
        console.log("1", formValue, record);
    };

    initColumns = () => {
        this.columns = [
            {
                title: "姓名",
                dataIndex: "name",
                key: "name",
                align: "center",
                // width: 150,
                fixed: "left",
                render: (_, record) => <LinkButton>{record.name}</LinkButton>,
            },
            {
                title: "年龄",
                dataIndex: "age",
                align: "center",
                // width: 100,
                key: "age",
            },
            {
                title: "性别",
                dataIndex: "sex",
                align: "center",
                // width: 100,
                key: "sex",
            },
            {
                title: "职务",
                dataIndex: "duty",
                // width: 150,
                align: "center",
                key: "duty",
            },
            {
                title: "入职时间",
                // width: 200,
                key: "entry_time",
                dataIndex: "entry_time",
                align: "center",
                render: (_, record) => (
                    <span>
                        {moment(record.entry_time).format("YYYY年MM月DD日")}
                    </span>
                ),
            },
            {
                title: "联系电话",
                // width: 200,
                key: "phone",
                dataIndex: "phone",
                align: "center",
            },
            {
                title: "家庭住址",
                dataIndex: "address",
                align: "center",
                // width: 200,
                key: "address",
                render: (_, record) => (
                    <Space size="small">{record.address}</Space>
                ),
            },
            {
                title: "爱好",
                dataIndex: "hobby",
                align: "center",
                key: "hobby",
                // width: 180,
                render: (_, record) => (
                    <Tag color="volcano">{record.hobby}</Tag>
                ),
            },
            {
                title: "操作",
                dataIndex: "handle",
                align: "center",
                fixed: "right",
                key: "handle",
                // width: 150,
                render: (_, record, index) => (
                    <Space size="middle">
                        <LinkButton onClick={() => this.handleUpdate(record)}>
                            编辑
                        </LinkButton>
                        <Popconfirm
                            title="确认删除该员工信息吗？"
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => this.handleDelete(index)}
                        >
                            <LinkButton>删除</LinkButton>
                        </Popconfirm>
                    </Space>
                ),
            },
        ];
    };

    componentWillMount() {
        this.initColumns();
    }
    render() {
        const { visible, staff_details, formValue } = this.state;
        // const record = this.record || {};
        const title = (
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => this.setState({ visible: true })}
            >
                添加
            </Button>
        );

        return (
            <div>
                <div className="header">
                    <div className="header-left">员工信息</div>
                </div>
                <div className="submit">
                    <StaffQuery />
                </div>
                <div className="content">
                    <Card title={title}>
                        {visible && (
                            <Modal
                                // title={this.record ? "更新信息" : "添加信息"}
                                title="员工添加"
                                visible={visible}
                                okText="确定"
                                cancelText="取消"
                                onOk={this.okModal}
                                onCancel={() => {
                                    this.setState({ visible: false });
                                    this.formRef_currnt.resetFields();
                                }}
                            >
                                <StaffModal
                                    // record={record}
                                    formValue={formValue}
                                    getForm={(formEntity) => {
                                        this.formRef_currnt = formEntity;
                                    }}
                                />
                            </Modal>
                        )}

                        <Table
                            columns={this.columns}
                            dataSource={staff_details}
                            scroll={{ x: 800 }}
                            // bordered
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

// 查询栏
class StaffQuery extends Component {
    handleQuery = (values) => {
        console.log(values);
    };

    render() {
        return (
            <Form layout="inline" onFinish={this.handleQuery}>
                <Item label="员工姓名" name="name">
                    <Input placeholder="员工姓名" />
                </Item>
                <Item>
                    <Button type="primary" htmlType="submit">
                        搜索
                    </Button>
                </Item>
            </Form>
        );
    }
}

class StaffModal extends Component {
    formRef = React.createRef();
    // constructor(props) {
    //     super(props);
    //     let detailList = {};

    //     this.state = {
    //         detailList,
    //     };

    //     const { record } = this.props;
    //     if (record) {
    //         this.setState({ detailList: record });
    //     }
    // }

    initialValues = () => {
        this.layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        this.errors = {
            required: "'${name}'是必填项！！",
            types: {
                number: "'${label}'为非数字！！",
            },
            number: {
                range: "'${label}'必须在$'{min}'到$'{max}'！！",
            },
            string: {
                range: "'${label}'个数必须介于$'{min}'和$'{max}'之间",
            },
        };

        this.works = [
            "前端开发",
            "软件测试",
            "后端开发",
            "产品运营",
            "售后服务",
        ];
        this.addresses = [
            {
                value: "广东",
                label: "广东",
                children: [
                    {
                        value: "东莞",
                        label: "东莞",
                        children: [
                            {
                                value: "常平",
                                label: "常平",
                            },
                        ],
                    },
                ],
            },
            {
                value: "江西",
                label: "江西",
                children: [
                    {
                        value: "南昌",
                        label: "南昌",
                        children: [
                            {
                                value: "赣州",
                                label: "赣州",
                            },
                        ],
                    },
                ],
            },
        ];
    };

    componentWillMount() {
        this.initialValues();
    }
    // componentDidUpdate() {
    //     // const record = this.props;
    //     // this.isUpate = !!record;
    //     // this.detail = record || {};
    //     this.formRef.current.setFieldsValue({
    //         record: this.props.record,
    //     });
    // }

    componentDidMount() {
        this.props.getForm(this.formRef.current);
    }
    render() {
        const { formValue } = this.props;
        return (
            <Form
                ref={this.formRef}
                {...this.layout}
                validateMessages={this.errors}
                initialValues={formValue}
            >
                <Form.Item
                    label="姓名"
                    name="name"
                    // initialValue={recordName}
                    rules={[
                        {
                            required: true,
                            type: "string",
                            min: 2,
                            max: 4,
                        },
                    ]}
                >
                    <Input
                        placeholder="请输入姓名"
                        style={{ width: 250 }}
                        prefix={<UserOutlined />}
                        allowClear
                    />
                </Form.Item>

                <Form.Item
                    label="年龄"
                    name="age"
                    // initialValue={isUpate ? detail.age : ""}
                    rules={[
                        {
                            required: true,
                            type: "number",
                            min: 0,
                            max: 99,
                        },
                    ]}
                >
                    <InputNumber style={{ width: 100 }} />
                </Form.Item>

                <Form.Item
                    label="性别"
                    name="sex"
                    // initialValue={isUpate ? detail.sex : ""}
                    rules={[
                        {
                            required: true,
                            message: "请选择性别！",
                        },
                    ]}
                >
                    <Radio.Group buttonStyle="solid">
                        <Radio.Button value="男">男</Radio.Button>
                        <Radio.Button value="女">女</Radio.Button>
                        <Radio.Button value="noneSex" disabled>
                            人妖
                        </Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="职务"
                    name="duty"
                    rules={[
                        {
                            required: true,
                            // type: 'object',
                            message: "职务 尚未选择！！",
                        },
                    ]}
                >
                    <Select style={{ width: 150 }} allowClear>
                        {this.works.map((item, idx) => (
                            <Option key={idx} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="入职时间"
                    name="entry_time"
                    rules={[
                        {
                            required: true,
                            // type: 'object',
                            message: "入职时间 尚未选择！！",
                        },
                    ]}
                >
                    <DatePicker
                        placeholder="请选择日期"
                        style={{ width: 280 }}
                        showToday={false}
                    />
                </Form.Item>

                <Form.Item
                    label="联系电话"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: "请输入你的 电话!！",
                        },
                    ]}
                >
                    <Input
                        style={{ width: 280 }}
                        placeholder="请输入电话"
                        allowClear
                    />
                </Form.Item>

                <Form.Item
                    label="家庭住址"
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: "家庭地址 尚未选择！！",
                        },
                    ]}
                >
                    <Cascader
                        options={this.addresses}
                        placeholder="请选择地址"
                        style={{ width: 330 }}
                    />
                </Form.Item>

                <Form.Item label="爱好" name="hobby">
                    <Input
                        style={{ width: 330 }}
                        placeholder="请输入爱好"
                        allowClear
                    />
                </Form.Item>
            </Form>
        );
    }
}
