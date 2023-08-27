import { Button, Input, Space } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import moment from "moment";

const MainContainer = styled.div`
  margin: 2px;
  width: 100%;
  background-color: #ddddf7;
  border-radius: 6px;
`;

const StyledChat = styled.div`
  height: 90%;
`;

const InputButtonComponent = styled(Space.Compact)`
  height: 9%;
  overflow: hidden;
  width: 99%;
  margin: 5px;

  .styledButton {
    height: 100%;
    background-color: #8da4f1;
    width: 10%;
    color: white;
  }
`;

const StyledInput = styled(Input)`
  background-color: white;
  font-size: 17px;
  width: 90%;
`;

const WelcomeMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: darkgray;
  height: 100%;
`;

const ChatContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  max-height: 100%;
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 20px;
  max-width: 80%;
  gap: 10px;
`;

const MessageImage = styled.img`
  min-width: 40px;
  min-height: 40px;
  border-radius: 50%;
  background-color: #b92d2d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const MessageInfo = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 0 10px 10px 10px;
`;

const MessageText = styled.div`
  font-size: 15px;
`;

const MessageDateTime = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: row-reverse;
`;

const Chat = ({ sendMessage, userToChat }) => {
  const [mess, setMess] = useState("");

  const selector = createSelector(
    (state) => state.messagingSystem,
    (messagingSystem) =>
      messagingSystem.connectedUsers.find(
        (u) => u.username === userToChat?.username
      )?.messages
  );
  const messages = useSelector(selector);

  const { user } = useSelector((state) => state.user);

  // const chatMessages = [
  //   {
  //     message: "Ovo je prva poruka",
  //     senderId: 2,
  //   },
  //   {
  //     message:
  //       "Ovo je druga porukaOvo je druga porukaOvo je druga porukaOvo je druga porukaOvo je druga porukaOvo je druga porukaOvo je druga porukaOvo je druga porukaOvo je druga porukaOvo je druga porukaOvo je druga poruka",
  //     senderId: 1,
  //   },
  //   {
  //     message: "Ovo je treca poruka",
  //     senderId: 1,
  //   },
  //   {
  //     message: "Ovo je certvrta poruka",
  //     senderId: 2,
  //   },
  //   {
  //     message: "Ovo je peta poruka",
  //     senderId: 2,
  //   },
  // ];

  return (
    <MainContainer>
      <StyledChat>
        {userToChat === null ? (
          <WelcomeMessage>Welcome to the messaging system!</WelcomeMessage>
        ) : (
          <ChatContainer>
            {messages.map((message, index) => (
              <MessageWrapper
                key={index}
                style={
                  message.senderId === user.id
                    ? { flexDirection: "row-reverse", marginLeft: "20%" }
                    : {}
                }
              >
                <MessageImage
                  style={
                    message.senderId === user.id
                      ? { backgroundColor: "#2DB9B9" }
                      : {}
                  }
                  src={message.senderAvatar}
                  alt={
                    message.senderId === user.id
                      ? user.username[0].toUpperCase()
                      : userToChat.username[0].toUpperCase()
                  }
                />
                <MessageInfo
                  style={
                    message.senderId === user.id
                      ? {
                          borderRadius: "10px 0 10px 10px",
                          backgroundColor: "#8da4f1",
                          color: "white",
                        }
                      : {}
                  }
                >
                  <MessageText>{message.message}</MessageText>
                  <MessageDateTime>
                    {moment(moment()).format("HH:mm")}
                  </MessageDateTime>
                </MessageInfo>
              </MessageWrapper>
            ))}
          </ChatContainer>
        )}
      </StyledChat>
      {userToChat && (
        <InputButtonComponent>
          <StyledInput
            placeholder="Type something..."
            value={mess}
            onChange={(event) => setMess(event.target.value)}
          />
          <Button
            className="styledButton"
            disabled={!mess.trim().length}
            onClick={() => {
              setMess("");
              sendMessage(mess);
            }}
          >
            Send
          </Button>
        </InputButtonComponent>
      )}
    </MainContainer>
  );
};

Chat.propTypes = {
  sendMessage: PropTypes.func,
  userToChat: PropTypes.object,
};

export default Chat;
