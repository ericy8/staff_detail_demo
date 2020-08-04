import React, { Component } from "react";
import { Card, Table, message } from "antd";
import { reqCompany } from "../../api/ajax";

export default class Company extends Component {
    state = {
        company_details: [],
        loading: false,
        columns: [],
    };

    // initData = () => {
    //     this.initColumns = [
    //         {
    //             title: "城市",
    //             dataIndex: "city",
    //             align: "center",
    //             fixed: "left",
    //         },
    //         {
    //             title: "公司类型",
    //             dataIndex: "companyType",
    //             align: "center",
    //         },
    //         {
    //             title: "dBName",
    //             dataIndex: "dBName",
    //             align: "center",
    //         },
    //         {
    //             title: "经理",
    //             dataIndex: "manageUser",
    //             align: "center",
    //         },
    //         {
    //             title: "modified",
    //             dataIndex: "modified",
    //             align: "center",
    //         },
    //         {
    //             title: "modifyTime",
    //             dataIndex: "modifyTime",
    //             align: "center",
    //         },
    //         {
    //             title: "名称",
    //             dataIndex: "name",
    //             align: "center",
    //         },
    //         {
    //             title: "电话",
    //             dataIndex: "phone",
    //             align: "center",
    //         },
    //         {
    //             title: "简称",
    //             dataIndex: "shortName",
    //             align: "center",
    //         },
    //         {
    //             title: "socialSecurityNumber",
    //             dataIndex: "socialSecurityNumber",
    //             align: "center",
    //             fixed: "right",
    //         },
    //     ];
    // };

    getCompany = async () => {
        this.setState({ loading: true });
        const result = await reqCompany();
        if (result.success === true) {
            const company_details = [];
            company_details.push(result.data);

            const rs = company_details.reduce((pre, item) => {
                const tmp = {
                    city: item.city,
                    companyType: item.companyType,
                    dBName: item.dBName,
                    manageUser: item.manageUser,
                    modifyTime: item.modifyTime,
                    name: item.name,
                    phone: item.phone,
                    shortName: item.shortName,
                    socialSecurityNumber: item.socialSecurityNumber,
                };
                pre.push(tmp);
                return pre;
            }, []);
            console.log("rs", rs);

            const columns = Object.keys(rs[0]).map((item) => {
                return {
                    title: item,
                    dataIndex: item,
                    align: "center",
                };
            });

            this.setState({ company_details, columns, loading: false });
        } else {
            message.error("获取公司信息失败");
        }
    };

    // UNSAFE_componentWillMount() {
    //     this.initData();
    // }

    componentDidMount() {
        this.getCompany();
    }

    render() {
        const { loading, company_details, columns } = this.state;

        return (
            <Card>
                <Table
                    rowKey={(record) => record.id}
                    loading={loading}
                    columns={columns}
                    dataSource={company_details}
                    scroll={{ x: 1500 }}
                />
            </Card>
        );
    }
}
