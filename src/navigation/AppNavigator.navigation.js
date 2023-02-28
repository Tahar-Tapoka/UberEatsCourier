import { createStackNavigator } from "@react-navigation/stack";
import { OrdersDelivery } from "../screens/OrderDelivery.screen";
import { OrdersScreen } from "../screens/Orders.screen";

const AppStack = createStackNavigator();

export default function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Home" component={OrdersScreen} />
      <AppStack.Screen name="Orders" component={OrdersDelivery} />
    </AppStack.Navigator>
  );
}
