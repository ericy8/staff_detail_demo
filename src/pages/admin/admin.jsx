import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";

import Staff from "../staff/staff";
import WareHouse from "../warehouse/warehouse";
import Company from "../company/company";
import NotFound from "../not-found/not-found";
import LeftNav from "../../components/left-nav";
import TopNav from "../../components/top-nav";
import memoryUtils from "../../utils/memoryUtils";
import menuList from "../../utils/menuConfig";
import Store from "../area/store";

const { Sider, Header, Footer, Content } = Layout;

export default class Admin extends Component {
    constructor(props) {
        super(props);
        // console.log("this props", this.props);

        this.props.history.listen((location) => {
            const pathname = location.pathname;

            const match = menuList.find((item) => item.key === pathname);
            if (match) {
                window.document.title = match.title;
            } else {
                window.document.title = "用户登录";
            }
        });
    }

    render() {
        const token = memoryUtils.token;

        if (!token || token === "") {
            return <Redirect to="/login" />;
        } // 拦截未登录过输入路由可跳转到其他界面

        return (
            <Layout style={{ minHeight: "100%" }}>
                <Sider width={230}>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header style={{ backgroundColor: "#fff" }}>
                        <TopNav />
                    </Header>

                    <Content
                        style={{
                            margin: "25px 10px 0",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Switch>
                            <Redirect from="/" to="/login" exact />
                            <Route path="/warehouse" component={WareHouse} />
                            <Route path="/company" component={Company} />
                            <Route path="/staff" component={Staff} />
                            <Route path="/store" component={Store} />
                            <Route component={NotFound} />
                        </Switch>
                    </Content>

                    <Footer style={{ textAlign: "center", color: "#cccccc" }}>
                        MIS ©2018 Created by Yang yang
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}
