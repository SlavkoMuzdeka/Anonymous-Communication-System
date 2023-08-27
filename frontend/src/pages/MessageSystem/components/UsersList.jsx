import React, { useState } from "react";
import styled from "styled-components";
import { Button, List, Skeleton, Avatar } from "antd";
import Searchbar from "./Searchbar";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import icon from "../../../assets/icons8-user-100.png";

const MainContainer = styled.div`
  border-radius: 6px;
  margin: 2px;
  background-color: #3e3c61;
`;

const UsersMenu = styled.div`
  overflow-y: auto;
  padding: 0px 10px;
  max-height: calc(100% - 38px);

  ul > li {
    border-bottom: 1px solid whitesmoke !important;
  }

  ul > li > ul > li {
    border-bottom: none !important;
  }
`;

const SyledButton = styled(Button)`
  font-size: 10px;
  height: 20px;
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledListItemMeta = styled(List.Item.Meta)`
  && {
    div,
    h4 {
      color: white !important;
    }
  }
`;

const UsersList = ({ users, handleSearch, handleClick, selectedMenuItem }) => {
  const { user } = useSelector((state) => state.user);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const getButtonText = () => {
    switch (selectedMenuItem) {
      case "1":
        return "Send Request";
      case "2":
        return "Accept Request";
      case "3":
        return "Chat";
      default:
        return "Send Request";
    }
  };

  return (
    <MainContainer>
      <Searchbar onSearch={handleSearch} />
      <UsersMenu>
        <List
          dataSource={users.filter((item) => item.username !== user.username)}
          renderItem={(item, index) => {
            let isSelected = item.id === selectedItemId;
            return (
              <List.Item
                style={{
                  backgroundColor:
                    isSelected && getButtonText() === "Chat"
                      ? "darkcyan"
                      : "transparent",
                  transition: "background-color 0.3s ease",
                }}
                actions={[
                  <SyledButton
                    onClick={() => {
                      handleClick(user.id, item.id);
                      if (getButtonText() === "Chat")
                        setSelectedItemId(item.id);
                    }}
                  >
                    {getButtonText()}
                  </SyledButton>,
                ]}
              >
                <Skeleton avatar title={true} loading={item.loading} active>
                  <StyledListItemMeta
                    avatar={
                      <Avatar
                        src={icon}
                        style={{
                          backgroundColor: "white",
                          borderRadius: "50%",
                          height: "40px",
                          width: "40px",
                        }}
                      />
                    }
                    title={item.username}
                    description={item.firstName + " " + item.lastName}
                  />
                </Skeleton>
              </List.Item>
            );
          }}
        />
      </UsersMenu>
    </MainContainer>
  );
};

Searchbar.propTypes = {
  users: PropTypes.array,
  handleSearch: PropTypes.func,
  sendRequestForConnection: PropTypes.func,
  selectedMenuItem: PropTypes.string,
};

export default UsersList;
