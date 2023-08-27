import React, { useState } from "react";
import { Button, Menu } from "antd";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/userSlice";
import { resetState } from "../../../redux/slices/messagingSystemSlice";
import PropTypes from "prop-types";
import {
  UserSwitchOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const StyledSidebar = styled.div`
  margin: 2px;
`;

const StyledMenu = styled(Menu)`
  background-color: #3e3c61;
  color: white;
  border-radius: 6px;
  transition: none !important;
`;

const StyledButton = styled(Button)`
  margin-bottom: 2px;
  background-color: #2f2d52;
  width: 100%;
`;

const StyledLogoutButton = styled(Button)`
  background-color: #2f2d52;
  border-radius: 6px;
  width: 100%;
  margin-top: 2px;
`;

const StyledLoggedUser = styled.div`
  background-color: #2f2d52;
  margin-top: 2px;
  border-radius: 6px;
  color: white;
  text-align: center;
  padding-top: 2px;
  padding-bottom: 5px;
  font-size: 15px;
`;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}

const items = [
  getItem("Logged users", "1", <UserAddOutlined />),
  getItem("Connection requests", "2", <UserSwitchOutlined />),
  getItem("Established connections", "3", <UsergroupAddOutlined />),
];

const Sidebar = ({ user, onItemClick }) => {
  const [collapsed, setCollapsed] = useState(false);

  const dispatch = useDispatch();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    dispatch(logout({ username: user.username }));
    dispatch(resetState());
  };

  return (
    <StyledSidebar>
      <StyledButton type="primary" onClick={toggleCollapsed}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </StyledButton>
      <StyledMenu
        style={{ height: collapsed ? "89.5%" : "85%" }}
        mode="inline"
        theme="dark"
        items={items}
        inlineCollapsed={collapsed}
        onClick={({ key }) => onItemClick(key)}
      />
      {!collapsed && (
        <StyledLoggedUser>
          {user.firstName + " " + user.lastName}
        </StyledLoggedUser>
      )}
      <StyledLogoutButton type="primary" onClick={handleLogout}>
        <LogoutOutlined />
        {!collapsed && "Logout"}
      </StyledLogoutButton>
    </StyledSidebar>
  );
};

Sidebar.propTypes = {
  user: PropTypes.object,
  onItemClick: PropTypes.func,
};

export default Sidebar;
