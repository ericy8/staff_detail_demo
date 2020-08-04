import React, { Component, PureComponent } from "react";
import {
    Card,
    Table,
    message,
    Button,
    Modal,
    Form,
    Input,
    Radio,
    Select,
    notification,
} from "antd";
import { ExclamationCircleOutlined, CheckOutlined } from "@ant-design/icons";
import { reqWareHouse, reqStore } from "../../api/ajax";

const { Item } = Form;
const { Option } = Select;

class WareHouse extends Component {
    state = {
        ware_details: [],
        loading: false,
        visible: false,
        confirmLoading: false,
    };

    initDate = () => {
        this.initColumns = [
            {
                title: "code",
                dataIndex: "code",
                align: "center",
            },
            {
                title: "默认",
                dataIndex: "is_default",
                align: "center",
            },
            {
                title: "名称",
                dataIndex: "name",
                align: "center",
            },
            {
                title: "简称",
                dataIndex: "pin_yin",
                align: "center",
            },
            {
                title: "商店",
                dataIndex: "shop",
                align: "center",
            },
            {
                title: "操作",
                dataIndex: "action",
                align: "center",
                render: (_, ware) => (
                    <div>
                        <Button
                            type="link"
                            onClick={() => this.updateHander(ware)}
                        >
                            编辑
                        </Button>
                        <Button
                            type="link"
                            danger
                            onClick={() => this.deleteHander(ware)}
                        >
                            删除
                        </Button>
                    </div>
                ),
            },
        ];
    };

    // 获取仓库信息
    getWareHouse = async () => {
        this.setState({ loading: true });
        const result = await reqWareHouse();
        if (result.success === true) {
            const ware_details = result.data;
            this.setState({ ware_details, loading: false });
        } else {
            message.error("获取仓库信息失败");
        }
    };

    // 取消
    cancelHander = () => {
        this.setState({ visible: false });

        this.formRef_current.resetFields();
    };

    // 打开新增Modal
    addHander = () => {
        this.ware = null;

        this.setState({ visible: true });
    };

    // 删除数据
    deleteHander = (ware) => {
        Modal.confirm({
            content: `确定要删除仓库 ${ware.name} 吗？`,
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                console.log("发送删除请求...");
                this.setState({ loading: true });
                setTimeout(() => {
                    this.setState({ loading: false });
                    notification.open({
                        message: "删除成功！",
                        description: `你已成功删除 ${ware.name} 仓库信息`,
                        icon: <CheckOutlined style={{ color: "#68AB2C" }} />,
                        duration: 2,
                    });
                }, 500);
            },
        });
    };

    // 打开编辑Modal
    updateHander = (ware) => {
        this.ware = ware;

        this.setState({ visible: true });
    };

    // 新增/更新数据
    addOrUpdateHander = () => {
        this.formRef_current.validateFields().then((values) => {
            this.setState({ confirmLoading: true });
            console.log("发送更改请求...", values);
            setTimeout(() => {
                this.setState({ visible: false, confirmLoading: false });
                this.formRef_current.resetFields();
            }, 1000);
        });
    };

    UNSAFE_componentWillMount() {
        this.initDate();
    }

    componentDidMount() {
        this.getWareHouse();
    }

    render() {
        const { ware_details, loading, visible, confirmLoading } = this.state;
        const ware = this.ware || {};

        return (
            <Card
                title={
                    <Button type="primary" onClick={this.addHander}>
                        新增
                    </Button>
                }
            >
                <Table
                    rowKey={(record) => record.id}
                    columns={this.initColumns}
                    dataSource={ware_details}
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                />
                <Modal
                    title={ware.id ? "更新仓库信息" : "添加仓库信息"}
                    visible={visible}
                    confirmLoading={confirmLoading}
                    onCancel={this.cancelHander}
                    onOk={this.addOrUpdateHander}
                >
                    <AddForm
                        ware={ware}
                        getForm={(abc) => {
                            this.formRef_current = abc;
                        }}
                    />
                </Modal>
            </Card>
        );
    }
}

class AddForm extends PureComponent {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            shop: [],
        };
    }

    getShop = async () => {
        const result = await reqStore();
        if (result.success === true) {
            const shop = result.data;
            this.setState({ shop });
        } else {
            message.error("获取店铺信息失败");
        }
    };

    componentDidMount() {
        this.getShop();
        this.props.getForm(this.formRef.current);
    }

    componentDidUpdate() {
        const { code, name, is_default, pin_yin, shop } = this.props.ware;
        this.formRef.current.setFieldsValue({
            code,
            name,
            is_default,
            pin_yin,
            shop,
        });
    }

    render() {
        const { shop } = this.state;
        const { ware } = this.props;

        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        return (
            <Form {...layout} ref={this.formRef} initialValues={ware}>
                <Item
                    name="is_default"
                    label="默认"
                    rules={[{ required: true, message: "请选择默认值" }]}
                >
                    <Radio.Group buttonStyle="solid">
                        <Radio value={0}>0 </Radio>
                        <Radio value={1}>1 </Radio>
                    </Radio.Group>
                </Item>

                <Item
                    name="code"
                    label="code"
                    rules={[{ required: true, message: "code为必填项" }]}
                >
                    {ware.id ? (
                        <Input disabled />
                    ) : (
                        <Input placeholder="请输入code值" />
                    )}
                </Item>

                <Item
                    name="name"
                    label="名称"
                    rules={[{ required: true, message: "名称为必填项" }]}
                >
                    <Input placeholder="请输入名称" />
                </Item>

                <Item
                    name="pin_yin"
                    label="简称"
                    rules={[{ required: true, message: "简称为必填项" }]}
                >
                    <Input placeholder="请输入简称" />
                </Item>

                <Item
                    name="shop"
                    label="商店"
                    rules={[{ required: true, message: "请选择店铺" }]}
                >
                    <Select placeholder="请选择店铺">
                        {shop.map((item) => (
                            <Option value={item.name} key={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Item>
            </Form>
        );
    }
}

export default WareHouse;
