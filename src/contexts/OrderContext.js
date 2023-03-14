import { DataStore } from "aws-amplify";
import { createContext, useContext, useState } from "react";
import { Order } from "../models";
import { useAuthContext } from "./AuthContext";

const OrderContext = createContext({});

export const OrderContextProvider = ({ children }) => {
  const { dbCourier } = useAuthContext();
  const [order, setOrder] = useState();

  const fotchOrder = async (id) => {
    if (!id) {
      setOrder(null);
      return;
    }
    const fetchedOrder = await DataStore.query(Order, id);
  };
  const onAcceptOrder = (order) => {
    DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "ACCEPTED";
        updated.Courier = dbCourier;
      })
    ).then(setOrder);
  };
  console.log(order);
  return (
    <OrderContext.Provider value={{ onAcceptOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
