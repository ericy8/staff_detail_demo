import React, { Component } from "react";
import "./index.less";
import { Menu, Button } from "antd";
import { LoginOutlined, SettingOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import menuList from "../../utils/menuConfig";
import storageUtils from "../../utils/storageUtils";

class TopLeft extends Component {
    getTitle = () => {
        const path = this.props.location.pathname;
        let title;
        menuList.forEach((item) => {
            if (item.key === path) {
                title = item.title;
            }
        });
        return title;
    };

    logout = () => {
        this.props.history.replace("/login");
        storageUtils.removeUser();
    };

    render() {
        const title = this.getTitle();

        return (
            <div className="header">
                <div className="header-left">{title}</div>

                <Menu mode="horizontal" className="header-right">
                    <Menu.SubMenu title="系统设置" icon={<SettingOutlined />}>
                        <Menu.Item key="logout">
                            <Button
                                type="text"
                                onClick={this.logout}
                                icon={<LoginOutlined />}
                            >
                                退出登录
                            </Button>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </div>
        );
    }
}

export default withRouter(TopLeft);
