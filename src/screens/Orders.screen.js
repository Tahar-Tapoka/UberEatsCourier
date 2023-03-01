import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { DeliveryItem } from "../components/DeliveryItem.component";
import orders from "../../assets/orders.json";
import { useRef, useMemo, useEffect, useState } from "react";
import { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import { MapScreen } from "../components/Map.screen";
import * as Location from "expo-location";
import { ActivityIndicator } from "react-native-paper";

export const OrdersScreen = ({ navigation }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Please gtant using location!!");
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  if (!driverLocation) {
    return <ActivityIndicator animating={true} color="green" />;
  }
  return (
    <View style={styles.container}>
      <MapScreen
        location={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
        }}
      >
        {orders.map((order) => (
          <Marker
            key={order.id}
            title={order.Restaurant.name}
            coordinate={{
              latitude: order.Restaurant.lat,
              longitude: order.Restaurant.lng,
            }}
          >
            <View style={styles.marker}>
              <Entypo name="shop" size={30} color="white" />
            </View>
          </Marker>
        ))}
      </MapScreen>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: "gray", width: 100 }}
      >
        <View style={styles.contentContainer}>
          <Text style={{ fontWeight: 600 }}>You're Now Online 🎉</Text>
          <Text style={{ color: "grey", marginTop: 5 }}>
            {orders.length ? orders.length : "No"} Available Nearby Orders
          </Text>
        </View>
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <DeliveryItem order={item} navigation={navigation} />
          )}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
  },
  contentContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  marker: {
    backgroundColor: "green",
    borderRadius: 20,
    padding: 5,
  },
});
