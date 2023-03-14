import { Auth, DataStore } from "aws-amplify";
import { createContext, useContext, useEffect, useState } from "react";
import { Courier } from "../models";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbCourier, setDbCourier] = useState(null);
  const sub = authUser?.attributes?.sub;
  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true })
      .then(setAuthUser)
      .catch(console.log);
  }, []);

  useEffect(() => {
    DataStore.query(Courier, (user) => user.sub.eq(sub)).then((users) => {
      setDbCourier(users[0]);
    });
  }, [sub]);

  return (
    <AuthContext.Provider value={{ authUser, dbCourier, sub, setDbCourier }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
