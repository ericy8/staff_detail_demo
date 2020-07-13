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
// import { reqStaff } from "../api/ajax";
import axios from "axios";
import "../mock";

const { Item } = Form;
const { Option } = Select;

export default class Staff extends Component {
    state = {
        visible: 0,
        loading: false,
        staff_details: [],
    };

    // 添加信息确认操作
    handleAdd = () => {
        this.formRef_current.validateFields().then((values) => {
            this.setState({
                visible: 0,
                staff_details: [...this.state.staff_details, values],
            });
            this.formRef_current.resetFields();
            message.success("添加成功");
        });
    };

    // 删除(一条)表格数据
    handleDelete = (index) => {
        const dataSource = [...this.state.staff_details];
        // this.setState({
        //     dataSource: dataSource.filter(item => item.name !== name)
        // });
        dataSource.splice(index, 1);
        // console.log(dataSource.splice(index, 1));
        this.setState({
            staff_details: dataSource,
        });
        message.success("删除成功");
    };

    // 打开修改信息Modal
    handleUpdate = (record, index) => {
        this.record = record;
        this.index = index;
        this.setState({ visible: 2 });

        record.entry_time = moment(record.entry_time) || null;
        // 拿到数据之后，对数据进行格式处理，转换成 moment 格式
        console.log("record.entry_time", record.entry_time);

        /* 默认值会在页面渲染的时候就渲染在 Form.Item 中，但是一般数据请求拿到返回值存在异步，
		会晚于渲染，因此日期格式转换的操作不能放在 DatePicker中。正确的日期处理，应该放在获取数据之后 */
    };

    // 修改信息确认操作
    okUpate = () => {
        this.formRef_current_2.validateFields().then((values) => {
            const { index } = this;
            const new_staff = [...this.state.staff_details];
            /* 因为我们下面要更新state状态,react中建议我们尽量产生一个新的数组再去更新
			所以用到扩展(浅拷贝 => 形成新的数组)*/

            new_staff.splice(index, 1, values);
            this.setState({
                visible: 0,
                staff_details: new_staff,
                /* staff_details: new_staff.splice(index, 1, values),
				不能够直接这样写,splice()会返回一个新的数组！！我们只是做原有的修改 */
            });
            this.formRef_current_2.resetFields();
            message.success("更新成功");
        });
    };

    // 搜索确认操作：不完全字段匹配，filter()：1.遍历数组 2.检索符合内容
    submitEnter = (search) => {
        const { staff_details } = this.state;
        console.log("search", search);

        if (search.name) {
            this.setState({
                staff_details: staff_details.filter(
                    (item) => item.name.indexOf(search.name) !== -1
                ),
            }); // filter不会形成新的数组，所以可以这样写
        } else {
            this.getStallList();
        }
    };

    initColumns = () => {
        this.columns = [
            {
                title: "姓名",
                dataIndex: "name",
                key: "name",
                align: "center",
                width: 150,
                fixed: "left",
                render: (_, record) => <LinkButton>{record.name}</LinkButton>,
            },
            {
                title: "年龄",
                dataIndex: "age",
                align: "center",
                width: 100,
                key: "age",
            },
            {
                title: "性别",
                dataIndex: "sex",
                align: "center",
                width: 100,
                key: "sex",
            },
            {
                title: "职务",
                dataIndex: "duty",
                width: 150,
                align: "center",
                key: "duty",
            },
            {
                title: "入职时间",
                width: 200,
                key: "entry_time",
                dataIndex: "entry_time",
                align: "center",
                render: (_, record) => (
                    <span>
                        {moment(record.entry_time).format("YYYY-MM-DD")}
                    </span>
                ),
            },
            {
                title: "联系电话",
                width: 200,
                key: "phone",
                dataIndex: "phone",
                align: "center",
            },
            {
                title: "家庭住址",
                dataIndex: "address",
                align: "center",
                width: 200,
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
                width: 180,
                render: (text, record) => (
                    <Tag color={text.length > 2 ? "green" : "blue"}>
                        {record.hobby}
                    </Tag>
                ),
            },
            {
                title: "操作",
                dataIndex: "handle",
                align: "center",
                fixed: "right",
                key: "handle",
                width: 150,
                render: (_, record, index) => (
                    <Space size="middle">
                        <LinkButton
                            onClick={() => this.handleUpdate(record, index)}
                        >
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

    // 请求表格数据
    getStallList = () => {
        this.setState({ loading: true });
        axios.get("/staff", { dataType: "json" }).then((res) => {
            console.log("getStallList", res);

            if (res.status === 200) {
                const staff_details = res.data.result;
                this.setState({ staff_details, loading: false });
            } else {
                message.error("获取员工信息失败!");
            }
        });
    };

    // 仅仅是新别名而已
    UNSAFE_componentWillMount() {
        this.initColumns();
    }

    componentDidMount() {
        this.getStallList();
    }

    render() {
        const { visible, staff_details, loading } = this.state;
        const record = this.record || {};
        const title = (
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => this.setState({ visible: 1 })}
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
                    <StaffQuery handleSubmt={this.submitEnter} />
                </div>
                <div className="content">
                    <Card title={title}>
                        <Modal
                            // title={this.record ? "更新信息" : "添加信息"}
                            title="添加信息"
                            visible={visible === 1}
                            okText="确定"
                            cancelText="取消"
                            onOk={this.handleAdd}
                            onCancel={() => {
                                this.setState({ visible: 0 });
                                this.formRef_current.resetFields();
                            }}
                        >
                            <StaffModal
                                // record={record}
                                getForm={(formEntity) => {
                                    this.formRef_current = formEntity;
                                }}
                            />
                        </Modal>

                        <Modal
                            // title={this.record ? "更新信息" : "添加信息"}
                            title="修改信息"
                            visible={visible === 2}
                            okText="确定"
                            cancelText="取消"
                            onOk={this.okUpate}
                            onCancel={() => {
                                this.setState({ visible: 0 });
                                this.formRef_current_2.resetFields();
                            }}
                        >
                            <StaffModal
                                record={record}
                                getForm={(formEntity) => {
                                    this.formRef_current_2 = formEntity;
                                }}
                            />
                        </Modal>

                        <Table
                            rowKey="id"
                            loading={loading}
                            columns={this.columns}
                            dataSource={staff_details}
                            scroll={{ x: 1500 }}
                            pagination={{ defaultPageSize: 7 }}
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
        this.props.handleSubmt(values);
    };

    render() {
        return (
            <Form layout="inline" onFinish={this.handleQuery}>
                <Item label="员工姓名" name="name">
                    <Input placeholder="员工姓名" allowClear />
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

    initialValues = () => {
        this.layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        this.validateMessages = {
            required: "${label}是必填项",
            types: {
                number: "${label}为非数字",
            },
            number: {
                range: "${label}必须在${min}到${max}之间",
            },
            string: {
                range: "${label}必须是${min}到${max}个字符",
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

    UNSAFE_componentWillMount() {
        this.initialValues();

        // const { record } = this.props;
        // this.isUpdate = !!record;
        // this.product = record;
    }

    componentDidMount() {
        this.props.getForm(this.formRef.current);
    }

    /* 打开表单的初始值问题，不同表单的初始值不会同步更新，所以需要我们异步请求传过来的record值
    并赋于到相应的表单上，所以要在接受到新的props立即执行即这个生命周期方法(异步,保证每次更新只调用一次) */
    componentDidUpdate() {
        const { name, age, sex, duty, entry_time, phone, address, hobby } =
            this.props.record || {};
        this.formRef.current.setFieldsValue({
            name,
            age,
            sex,
            duty,
            entry_time,
            phone,
            address,
            hobby,
        }); // ...必须要一个个item属性名称对应,在这个生命周期使用这个方法才能完成(第二个)初始值的更新
    }

    render() {
        const { record } = this.props;

        return (
            <Form
                ref={this.formRef}
                {...this.layout}
                validateMessages={this.validateMessages}
                initialValues={record}
            >
                <Form.Item
                    label="姓名"
                    name="name"
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
                    rules={[
                        {
                            required: true,
                            type: "number",
                            min: 0,
                            max: 99,
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: 115 }}
                        placeholder="请选择年龄"
                    />
                </Form.Item>

                <Form.Item
                    label="性别"
                    name="sex"
                    rules={[
                        {
                            required: true,
                            message: "请选择性别",
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
                            message: "职务尚未选择",
                        },
                    ]}
                >
                    <Select
                        style={{ width: 150 }}
                        allowClear
                        placeholder="请选择职务"
                    >
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
                            // type: "object",
                            message: "入职时间尚未选择",
                        },
                    ]}
                >
                    <DatePicker
                        // defaultValue={moment(record.entry_time || {}, "YYYY-MM-DD")}
                        format="YYYY/MM/DD"
                        placeholder="请选择日期"
                        style={{ width: 280 }}
                        showToday={true}
                    />
                </Form.Item>

                <Form.Item
                    label="联系电话"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: "请输入你的电话",
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
                            message: "家庭地址尚未选择",
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
