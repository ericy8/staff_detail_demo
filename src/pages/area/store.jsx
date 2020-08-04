import React, { Component, PureComponent } from "react";
import { Card, Table, Button, message, Modal, Form, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { reqStore } from "../../api/ajax";

const { Item } = Form;

class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            dataSource: [],
            loading: false,
            visible: false,
        };
    }

    mapFiledToChinese = {
        id: "序号",
        name: "名称",
        code: "标识",
    };

    getStore = async () => {
        this.setState({ loading: true });
        const result = await reqStore();
        if (result.success === true) {
            const firstData = result.data[0];

            const columns = Object.keys(firstData).map((item) => {
                return {
                    title: this.mapFiledToChinese[item],
                    dataIndex: item,
                    align: "center",
                };
            });

            columns.push({
                title: "操作",
                dataIndex: "action",
                align: "center",

                render: (_, store) => (
                    <div>
                        <Button
                            type="link"
                            onClick={() => this.updateHander(store)}
                        >
                            编辑
                        </Button>
                        <Button
                            type="link"
                            danger
                            onClick={() => this.deleteHander(store)}
                        >
                            删除
                        </Button>
                    </div>
                ),
            });

            const dataSource = result.data;
            this.setState({ dataSource, columns, loading: false });
        } else {
            message.error("获取店铺信息失败");
        }
    };

    deleteHander = (store) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: `确定要删除 ${store.name} 吗？`,
            onOk: () => {
                console.log("发送请求...");
                this.setState({ loading: true });
                setTimeout(() => {
                    message.success(`删除店铺 ${store.name} 成功！`);
                    this.setState({ loading: false });
                }, 1000);
            },
        });
    };

    updateHander = (store) => {
        this.store = store;
        this.setState({ visible: true });
    };

    addHander = () => {
        this.store = null;
        this.setState({ visible: true });
    };

    addOrUpdateStore = () => {
        this.formRef_current.validateFields().then((values) => {
            console.log("请求接口...", values);
            this.setState({ visible: false });
            this.formRef_current.resetFields();
        });
    };

    cancelHander = () => {
        this.setState({ visible: false });
        this.formRef_current.resetFields();
    };

    componentDidMount() {
        this.getStore();
    }

    render() {
        const { columns, dataSource, loading, visible } = this.state;
        const store = this.store || {};

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
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{ pageSize: 5 }}
                />
                <Modal
                    title={store.id ? "更改店铺" : "新增店铺"}
                    visible={visible}
                    onCancel={this.cancelHander}
                    onOk={this.addOrUpdateStore}
                >
                    <AddUpdate
                        store={store}
                        getForm={(formEntity) => {
                            this.formRef_current = formEntity;
                        }}
                    />
                </Modal>
            </Card>
        );
    }
}

class AddUpdate extends PureComponent {
    formRef = React.createRef();

    componentDidMount() {
        this.props.getForm(this.formRef.current);
    }

    componentDidUpdate() {
        const { name, id, code } = this.props.store;
        this.formRef.current.setFieldsValue({ name, id, code });
    }

    render() {
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        const { store } = this.props;

        return (
            <Form
                {...layout}
                initialValues={store}
                ref={this.formRef}
                hideRequiredMark
            >
                <Item
                    name="id"
                    label="序号"
                    rules={[{ required: true, message: "请输入序号！" }]}
                >
                    {store.id ? (
                        <Input disabled />
                    ) : (
                        <Input placeholder="请输入序号" allowClear />
                    )}
                </Item>

                <Item
                    name="name"
                    label="名称"
                    rules={[{ required: true, message: "请输入名称！" }]}
                >
                    <Input placeholder="请输入名称" allowClear />
                </Item>

                <Item
                    name="code"
                    label="标识"
                    rules={[{ required: true, message: "请输入标识！" }]}
                >
                    <Input placeholder="请输入标识" allowClear />
                </Item>
            </Form>
        );
    }
}

export default Store;
