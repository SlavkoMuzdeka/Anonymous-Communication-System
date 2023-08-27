import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/user.service";
import cryptoService from "../../services/crypto.service";
import { decode } from "ts-steganography";

export const getLoggedUsers = createAsyncThunk("user/logged-users", () =>
  userService.getLoggedUsers()
);

export const saveMessageParts = createAsyncThunk(
  "messagingSystem/addMessageParts",
  async (message, _) => {
    if (message.steganography) {
      const res = await decode(JSON.parse(message.data));
      return { ...message, data: res };
    } else {
      return message;
    }
  }
);

const findUser = (users, id) => {
  return users.find((u) => u.id === id);
};

const filterUsersById = (users, userId) => {
  return users.filter((u) => u.id !== userId);
};

const filterUsersByUsername = (users, username) => {
  return users.filter((u) => u.username !== username);
};

const messagingSystemSlice = createSlice({
  name: "messagingSystem",
  initialState: {
    loggedUsers: [],
    pendingConnectionRequests: [],
    connectedUsers: [],
    messageParts: [],
    userToChat: null,
  },
  reducers: {
    addLoggedUser: (state, action) => {
      const user = action.payload;
      if (
        !findUser(state.loggedUsers, user.id) &&
        !findUser(state.connectedUsers, user.id)
      ) {
        state.loggedUsers.push(user);
      }
    },
    addConnectionRequest: (state, action) => {
      if (!findUser(state.pendingConnectionRequests, action.payload)) {
        state.pendingConnectionRequests.push(
          findUser(state.loggedUsers, action.payload)
        );
      }
    },
    establishConnection: (state, action) => {
      let { userId, isEncrypted, symmetricKey } = action.payload;
      if (!findUser(state.connectedUsers, userId)) {
        const connectedUser = findUser(state.loggedUsers, userId);
        if (isEncrypted) {
          symmetricKey = JSON.parse(
            action.payload.privateKey.decrypt(JSON.parse(symmetricKey))
          );
        }
        const newUser = {
          ...connectedUser,
          symmetricKey,
          messages: [],
        };
        state.connectedUsers.push(newUser);
        state.loggedUsers = filterUsersById(state.loggedUsers, userId);
        state.pendingConnectionRequests = filterUsersById(
          state.pendingConnectionRequests,
          userId
        );
      }
    },
    filterLists: (state, action) => {
      const username = action.payload;
      if (state.userToChat && state.userToChat.username === username)
        state.userToChat = null;
      state.loggedUsers = filterUsersByUsername(state.loggedUsers, username);
      state.pendingConnectionRequests = filterUsersByUsername(
        state.pendingConnectionRequests,
        username
      );
      state.connectedUsers = filterUsersByUsername(
        state.connectedUsers,
        username
      );
    },
    resetState: (state, _) => {
      state.loggedUsers = [];
      state.pendingConnectionRequests = [];
      state.connectedUsers = [];
      state.chatMessages = [];
      state.loading = false;
      state.userToChat = null;
    },
    addMessageToChat: (state, action) => {
      const recipient = findUser(
        state.connectedUsers,
        action.payload.recipientId
      );
      recipient.messages.push(action.payload);
    },
    setUserToChat: (state, action) => {
      state.userToChat = findUser(state.connectedUsers, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveMessageParts.fulfilled, (state, action) => {
      const sender = findUser(state.connectedUsers, action.payload.senderId);
      const decryptedData = cryptoService.decryptWithSymmetricKey(
        sender.symmetricKey,
        JSON.parse(action.payload.data)
      );
      const senderPubKey = cryptoService.convertCertToDer(
        sender.certificate
      ).publicKey;
      console.log("Dekriptovani podaci su");
      console.log(decryptedData);
      if (
        cryptoService.verifyData(
          decryptedData,
          senderPubKey,
          action.payload.signature
        )
      ) {
        const { messageId, partNumber, totalParts, message } = decryptedData;
        let mess = state.messageParts.find(
          (item) => item.messageId === messageId
        );
        if (!mess) {
          mess = { messageId, parts: [], totalParts };
          mess.parts.push({ message, partNumber });
          state.messageParts.push(mess);
        } else {
          mess.parts.push({ message, partNumber });
        }

        if (mess.parts.length === mess.totalParts) {
          const sortedParts = mess.parts
            .slice()
            .sort((a, b) => a.partNumber - b.partNumber);
          const reconstructedMess = sortedParts
            .map((part) => part.message)
            .join("");
          sender.messages.push({
            message: reconstructedMess,
            recipientId: action.payload.recipientId,
            senderId: sender.id,
          });
          state.messageParts = state.messageParts.filter(
            (item) => item.messageId === messageId
          );
        }
      }
    });
    builder.addCase(getLoggedUsers.fulfilled, (state, action) => {
      state.loggedUsers = [...state.loggedUsers, ...action.payload.data];
    });
  },
});

export const {
  addLoggedUser,
  addConnectionRequest,
  establishConnection,
  filterLists,
  resetState,
  addMessageToChat,
  setUserToChat,
} = messagingSystemSlice.actions;
export default messagingSystemSlice.reducer;
