import { configureStore } from "@reduxjs/toolkit";
import messagingSystemSlice from "./slices/messagingSystemSlice";
import userSlice from "./slices/userSlice";

export default configureStore({
  reducer: {
    user: userSlice,
    messagingSystem: messagingSystemSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Use the named middleware to disable the serializable check
      serializableCheck: false,
    }),
});
