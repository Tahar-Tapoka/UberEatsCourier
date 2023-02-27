import { StatusBar } from "expo-status-bar";
import { StatusBar as RNStatusBar } from "react-native";
import { StyleSheet, View } from "react-native";

import { OrdersScreen } from "./src/screens/Orders.screen";

export default function App() {
  return (
    <View style={styles.container}>
      <OrdersScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
    marginTop: RNStatusBar.currentHeight,
  },
});
