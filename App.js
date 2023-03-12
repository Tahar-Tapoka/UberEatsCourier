import "@azure/core-asynciterator-polyfill";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StatusBar as RNStatusBar } from "react-native";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react-native";
import awsconfig from "./src/aws-exports";

import AppNavigator from "./src/navigation/AppNavigator.navigation";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import Profile from "./src/screens/Profile.screen";

Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <View style={styles.container}>
          <AuthContextProvider>
            <AppNavigator />
          </AuthContextProvider>
          <StatusBar style="auto" />
        </View>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: RNStatusBar.currentHeight,
  },
});

export default withAuthenticator(App);
