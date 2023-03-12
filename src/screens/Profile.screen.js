import { useAuthenticator } from "@aws-amplify/ui-react-native";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import { Button, Divider } from "react-native-paper";
import { useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Ionicons } from "@expo/vector-icons";

import { Courier, TransportationModes } from "../models";
import { useAuthContext } from "../contexts/AuthContext";
import { Pressable } from "react-native";

export const Profile = ({ navigation }) => {
  const { sub, setDbCourier, dbCourier } = useAuthContext();
  const [name, setName] = useState(dbCourier?.name || "");
  const [transportationMode, setTransportationMode] = useState(
    dbCourier?.transportationMode || ""
  );
  const [lat, setLat] = useState(dbCourier?.lat?.toString() || "0");
  const [lng, setLng] = useState(dbCourier?.lng?.toString() || "0");
  const { signOut } = useAuthenticator();

  const onSave = async () => {
    if (!dbCourier) {
      await createUser();
    } else {
      await updateUser();
    }
    // navigation.goBack();
    Keyboard.dismiss();
  };

  const createUser = async () => {
    try {
      const courier = await DataStore.save(
        new Courier({
          name,
          transportationMode,
          sub,
          lat: 123.45,
          lng: 123.45,
        })
      );
      setDbCourier(courier);
      console.log(courier.sub);
    } catch (e) {
      Alert.alert("Error: ", e.message);
    }
  };
  console.log("dbc: ", dbCourier);

  const updateUser = async () => {
    try {
      const original = await DataStore.query(Courier, dbCourier.id);
      const courier = await DataStore.save(
        Courier.copyOf(original, (updated) => {
          updated.name = name;
          updated.transportationMode = transportationMode;
          updated.lat = parseFloat(lat);
          updated.lng = parseFloat(lng);
        })
      );
      setDbCourier(courier);
      console.log(courier.sub);
    } catch (e) {
      Alert.alert("Error: ", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.DRIVING)}
          style={{
            ...styles.icon,
            backgroundColor:
              transportationMode === TransportationModes.DRIVING
                ? "#3FC060"
                : "white",
          }}
        >
          <Ionicons name="car-sport" size={24} color="black" />
        </Pressable>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.BICYCLING)}
          style={{
            ...styles.icon,
            backgroundColor:
              transportationMode === TransportationModes.BICYCLING
                ? "#3FC060"
                : "white",
          }}
        >
          <Ionicons name="bicycle" size={24} color="black" />
        </Pressable>
      </View>

      <Button mode="contained" onPress={onSave}>
        {!dbCourier ? "Save" : "Update"}
      </Button>
      <Divider />
      <Button mode="contained" onPress={signOut}>
        Sign Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
  icon: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
  },
});

export default Profile;
