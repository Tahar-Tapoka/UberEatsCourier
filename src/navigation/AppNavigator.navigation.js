import { createStackNavigator } from "@react-navigation/stack";
import { useAuthContext } from "../contexts/AuthContext";
import { OrdersDelivery } from "../screens/OrderDelivery.screen";
import { OrdersScreen } from "../screens/Orders.screen";
import Profile from "../screens/Profile.screen";

const AppStack = createStackNavigator();

export default function AppNavigator() {
  const { dbCourier } = useAuthContext();
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      {dbCourier ? (
        <>
          <AppStack.Screen name="Home" component={OrdersScreen} />
          <AppStack.Screen name="Orders" component={OrdersDelivery} />
        </>
      ) : (
        <AppStack.Screen name="Profile" component={Profile} />
      )}
    </AppStack.Navigator>
  );
}
