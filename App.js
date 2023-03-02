import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StatusBar as RNStatusBar } from "react-native";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Amplify } from "aws-amplify";

import AppNavigator from "./src/navigation/AppNavigator.navigation";
import awsconfig from "./src/aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure({ ...awsconfig, Analitics: { disabled: true } });

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <View style={styles.container}>
          <AppNavigator />
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
