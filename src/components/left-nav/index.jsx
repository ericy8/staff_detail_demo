import React, { Component } from "react";
import { Menu } from "antd";
import "./index.less";
import menuList from "../../utils/menuConfig";
import { Link, withRouter } from "react-router-dom";
import LogoImg from "../../images/logo.png";

class LeftNav extends Component {
    getMenu = (menuList) => {
        return menuList.map((item) => (
            <Menu.Item key={item.key} icon={<item.icon />}>
                <Link to={item.key}>{item.title}</Link>
            </Menu.Item>
        ));
    };

    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenu(menuList);
    }

    render() {
        const path = this.props.location.pathname;

        return (
            <div className="left-nav">
                <div className="nav-header">
                    <Link to="/warehouse">
                        <img src={LogoImg} alt="logo-img" />
                        <span>信息管理</span>
                    </Link>
                </div>
                <Menu theme="light" mode="inline" selectedKeys={[path]}>
                    {this.menuNodes}
                </Menu>
            </div>
        );
    }
}

export default withRouter(LeftNav);
