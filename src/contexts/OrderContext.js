import { DataStore } from "aws-amplify";
import { createContext, useContext, useState } from "react";
import { Order, OrderDish, User } from "../models";
import { useAuthContext } from "./AuthContext";

const OrderContext = createContext({});

export const OrderContextProvider = ({ children }) => {
  const { dbCourier } = useAuthContext();
  const [order, setOrder] = useState();
  const [user, setUser] = useState();
  const [dishes, setDishes] = useState();

  const fetchOrder = async (id) => {
    if (!id) {
      setOrder(null);
      return;
    }
    const fetechedOrder = await DataStore.query(Order, id);
    DataStore.query(User, fetechedOrder?.userID).then(setUser);
    DataStore.query(OrderDish, (od) => od.orderID.eq(fetechedOrder?.id)).then(
      setDishes
    );
    setOrder(fetechedOrder);
  };
  const onAcceptOrder = () => {
    DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "ACCEPTED";
        updated.Courier = dbCourier;
      })
    ).then(setOrder);
  };
  const pickUpOrder = () => {
    DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "PICKED_UP";
      })
    ).then(setOrder);
  };
  const completeOrder = async () => {
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "COMPLETED";
      })
    );
    setOrder(updatedOrder);
  };

  return (
    <OrderContext.Provider
      value={{
        order,
        user,
        dishes,
        onAcceptOrder,
        fetchOrder,
        pickUpOrder,
        completeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
