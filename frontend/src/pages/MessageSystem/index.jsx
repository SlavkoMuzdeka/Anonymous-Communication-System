import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import UsersList from "./components/UsersList";
import Chat from "./components/Chat";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useDispatch } from "react-redux";
import {
  addConnectionRequest,
  establishConnection,
  filterLists,
  addLoggedUser,
  setUserToChat,
  addMessageToChat,
  saveMessageParts,
} from "../../redux/slices/messagingSystemSlice";
import { message } from "antd";
import messageService from "../../services/message.service";
import cryptoService from "../../services/crypto.service";
import image from "../../assets/steg.jpg";
import { encode } from "ts-steganography";

const Home = styled.div`
  background-color: #a7bcff;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainContainer = styled.div`
  border: 1px solid white;
  border-radius: 10px;
  width: 80%;
  height: 80%;
  display: flex;
  overflow: hidden;
`;

const MessagingSystem = () => {
  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();

  const { user } = useSelector((state) => state.user);
  const { loggedUsers, pendingConnectionRequests, connectedUsers, userToChat } =
    useSelector((state) => state.messagingSystem);

  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [users, setUsers] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [requestSymmetricKey, setRequestSymmetricKey] = useState(null);

  const subscribeToTopic = (stompClient) => {
    stompClient.subscribe("/topic/logged-users", (message) => {
      const resp = JSON.parse(message.body);
      if (resp.isLogout) dispatch(filterLists(resp.user));
      else dispatch(addLoggedUser(resp.user));
    });
  };

  const subscribeToQueue = (stompClient) => {
    stompClient.subscribe("/queue/requests" + user.id, (res) => {
      const request = JSON.parse(JSON.parse(res.body));
      if ("REQUEST_FOR_CONNECTION" === request.message) {
        dispatch(addConnectionRequest(request.senderId));
      } else if ("ACCEPT_CONNECTION" === request.message) {
        setRequestSymmetricKey(request);
      } else if ("GENERATED_SYMMETRIC_KEY" === request.message) {
        symmetricKeyIsGenerated(request);
      } else if ("SEND_MESSAGE" === request.message) {
        dispatch(saveMessageParts(request));
      }
    });
  };

  useEffect(() => {
    const stompClient = Stomp.over(
      () => new SockJS("https://localhost:8443/messaging-system")
    );
    stompClient.debug = () => {}; // By default, the debug messages are logged in the browser window's console, so we disable logging because logs can be overwhelming
    stompClient.connect({}, () => {
      subscribeToTopic(stompClient);
      subscribeToQueue(stompClient);
    });
    setStompClient(stompClient);
    return () => {
      if (stompClient) stompClient.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (requestSymmetricKey) {
      const symmetricKey = cryptoService.genSymmetricKey(32); // 32 bytes = 256 bits
      const recipientPublicKey = getRecipientPublicKey();
      const request = {
        senderId: requestSymmetricKey.recipientId,
        recipientId: requestSymmetricKey.senderId,
        symmetricKey: JSON.stringify(
          recipientPublicKey.encrypt(JSON.stringify(symmetricKey))
        ),
        message: "GENERATED_SYMMETRIC_KEY",
      };
      stompClient.send("/app/request", {}, JSON.stringify(request));
      dispatch(
        establishConnection({
          userId: requestSymmetricKey.senderId,
          symmetricKey,
          isEncrypted: false,
        })
      );
    }
    setRequestSymmetricKey(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestSymmetricKey]);

  useEffect(() => {
    if (selectedMenuItem === "1") setUsers(loggedUsers);
    else if (selectedMenuItem === "2") setUsers(pendingConnectionRequests);
    else if (selectedMenuItem === "3") setUsers(connectedUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUsers, pendingConnectionRequests, connectedUsers]);

  const symmetricKeyIsGenerated = (request) => {
    dispatch(
      establishConnection({
        userId: request.senderId,
        symmetricKey: request.symmetricKey,
        isEncrypted: true,
        privateKey: user.privateKey,
      })
    );
  };

  const sendMessage = async (messageToSend) => {
    const messageParts = messageService.splitTheMessage(messageToSend);

    console.log("Dijelovi poruke su");
    console.log(messageParts);

    const { signatures, encryptedParts } = messageService.encryptParts(
      messageParts,
      user.privateKey,
      userToChat.symmetricKey
    );

    const partForSteganography = Math.floor(
      Math.random() * messageParts.length
    );
    for (let i = 0; i < signatures.length; i++) {
      let data = encryptedParts[i];
      let steganography = false;
      if (i === partForSteganography) {
        const res = await encode(encryptedParts[i], image);
        data = JSON.stringify(res);
        steganography = true;
      }
      const request = {
        senderId: user.id,
        recipientId: userToChat.id,
        signature: signatures[i],
        data,
        steganography,
        message: "SEND_MESSAGE",
      };
      stompClient.send("/app/request", {}, JSON.stringify(request));
    }
    dispatch(
      addMessageToChat({
        message: messageToSend,
        recipientId: userToChat.id,
        senderId: user.id,
      })
    );
  };

  const getRecipientPublicKey = () => {
    const encCert = loggedUsers.find(
      (u) => u.id === requestSymmetricKey.senderId
    ).certificate;
    return cryptoService.convertCertToDer(encCert).publicKey;
  };

  const handleMenuItemClick = (item) => {
    if (item === "1") setUsers(loggedUsers);
    else if (item === "2") setUsers(pendingConnectionRequests);
    else if (item === "3") setUsers(connectedUsers);
    setSelectedMenuItem(item);
  };

  const getFilteredUsers = (usersToFilter, searchQuery) => {
    return usersToFilter.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleSearch = (query) => {
    let searchQuery = query.target.value;
    let filteredUsers = [];
    if (selectedMenuItem === "1") {
      filteredUsers = getFilteredUsers(loggedUsers, searchQuery);
    } else if (selectedMenuItem === "2") {
      filteredUsers = getFilteredUsers(pendingConnectionRequests, searchQuery);
    } else if (selectedMenuItem === "3") {
      filteredUsers = getFilteredUsers(connectedUsers, searchQuery);
    }
    setUsers(filteredUsers);
  };

  const sendRequestForConnection = (senderId, recipientId) => {
    if (!isCertificateValid(user.certificate)) {
      showInvalidCertificate();
    } else {
      const request = {
        senderId,
        recipientId,
        message: "REQUEST_FOR_CONNECTION",
      };
      stompClient.send("/app/request", {}, JSON.stringify(request));
    }
  };

  const sendRequestForAcceptance = (senderId, recipientId) => {
    if (!isCertificateValid(user.certificate)) {
      showInvalidCertificate();
    } else {
      const request = {
        senderId,
        recipientId,
        message: "ACCEPT_CONNECTION",
      };
      stompClient.send("/app/request", {}, JSON.stringify(request));
    }
  };

  const isCertificateValid = (certificate) => {
    // Verify the certificate's validity period
    const currentTime = Date.now();
    const validNotBefore = certificate.validity.notBefore.getTime();
    const validNotAfter = certificate.validity.notAfter.getTime();
    if (currentTime < validNotBefore || currentTime > validNotAfter)
      return false;

    // Verify the certificate's signature
    const isSignatureValid = certificate.verify(certificate);
    if (!isSignatureValid) return false;

    // Compare issuer and subject (in my situation certificates are self-signed, for purpose of project)
    const issuer = certificate.issuer.attributes;
    const subject = certificate.subject.attributes;
    if (JSON.stringify(issuer) !== JSON.stringify(subject)) return false;

    return true;
  };

  const showInvalidCertificate = () => {
    console.log("showInvalidCertificate");
    messageApi.open({
      type: "error",
      content:
        "Your certificate is invalid. You cannot send/accept request for connection!",
    });
  };

  const chatWithUser = (senderId, recipientId) => {
    console.log("Komunikacija izmedju");
    console.log(senderId, recipientId);
    dispatch(setUserToChat(recipientId));
  };

  const getHandleClickMethod = (senderId, recipientId) => {
    if (selectedMenuItem === "1") {
      return sendRequestForConnection(senderId, recipientId);
    } else if (selectedMenuItem === "2") {
      return sendRequestForAcceptance(senderId, recipientId);
    } else if (selectedMenuItem === "3") {
      return chatWithUser(senderId, recipientId);
    }
  };

  return (
    <Home>
      {contextHolder}
      <MainContainer>
        <Sidebar user={user} onItemClick={handleMenuItemClick} />
        <UsersList
          users={users}
          handleSearch={handleSearch}
          handleClick={getHandleClickMethod}
          selectedMenuItem={selectedMenuItem}
        ></UsersList>
        <Chat sendMessage={sendMessage} userToChat={userToChat} />
      </MainContainer>
    </Home>
  );
};

export default MessagingSystem;
