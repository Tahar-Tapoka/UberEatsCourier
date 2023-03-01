import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { DeliveryItem } from "../components/DeliveryItem.component";
import orders from "../../assets/orders.json";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Divider } from "react-native-paper";
import { Fontisto } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MapScreen } from "../components/Map.screen";
import * as Location from "expo-location";
import { ActivityIndicator } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const ORDER_STATUS = {
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
};

export const OrdersDelivery = ({ route }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMin, setTotalMin] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [deliveryStatus, setDeliveryStatus] = useState(
    ORDER_STATUS.READY_FOR_PICKUP
  );
  const { width, height } = useWindowDimensions();
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const { order } = route.params;

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
    const forgroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 200,
      },
      (updatedLocation) => {
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude,
        });
      }
    );
    return forgroundSubscription;
  }, []);
  console.log("heyo ", driverLocation);

  if (!driverLocation) {
    return <ActivityIndicator animating={true} color="green" />;
  }

  const onAcceptOrderHandler = () => {
    if (deliveryStatus === ORDER_STATUS.READY_FOR_PICKUP) {
      bottomSheetRef.current?.collapse();
      mapRef.current.animateToRegion(
        {
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
      setDeliveryStatus(ORDER_STATUS.ACCEPTED);
    }
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={{ width, height }}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        <MapViewDirections
          origin={driverLocation}
          waypoints={[
            { latitude: order.Restaurant.lat, longitude: order.Restaurant.lng },
          ]}
          destination={{ latitude: order.User.lat, longitude: order.User.lng }}
          onReady={(resutls) => {
            setTotalMin(resutls.duration);
            setTotalKm(resutls.distance);
          }}
          apikey="AIzaSyBjR9kWTaRSBCpLSrR3W1txKoViMuJQv3k"
          strokeWidth={3}
          strokeColor="#3FC060"
        />
        <Marker
          title={order.Restaurant.name}
          coordinate={{
            latitude: order.Restaurant.lat,
            longitude: order.Restaurant.lng,
          }}
        >
          <View style={styles.marker}>
            <Entypo name="shop" size={24} color="white" />
          </View>
        </Marker>
        <Marker
          title={order.User.name}
          coordinate={{
            latitude: order.User.lat,
            longitude: order.User.lng,
          }}
        >
          <View style={styles.marker}>
            <Entypo name="user" size={24} color="white" />
          </View>
        </Marker>
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: "grey", width: 100 }}
      >
        <View
          style={{
            ...styles.row,
            justifyContent: "center",
            marginTop: 10,
            marginBottom: 15,
          }}
        >
          <Text style={styles.info}>{totalMin.toFixed(0)} min</Text>
          <Fontisto
            name="shopping-basket"
            size={24}
            color="green"
            style={{ marginHorizontal: 5 }}
          />
          <Text style={styles.info}> {totalKm.toFixed(2)} Km</Text>
        </View>
        <View style={styles.contentContainer}>
          <Divider bold />
          <Divider bold />
          <Text style={styles.title}>{order.Restaurant.name}</Text>
          <View style={styles.row}>
            <Fontisto
              name="shopping-store"
              size={24}
              color="grey"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.address}>{order.Restaurant.address}</Text>
          </View>
          <View style={styles.row}>
            <Entypo
              name="location"
              size={24}
              color="grey"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.address}>{order.User.address}</Text>
          </View>
          <Divider bold />
          <Text style={styles.details}>Onion Rings x1</Text>
          <Text style={styles.details}>Big Mac x3</Text>
          <Text style={styles.details}>Big Tasty x1</Text>
          <Text style={styles.details}>Coca-Cola x4</Text>
        </View>
        <Button
          mode="contained"
          buttonColor="green"
          style={styles.button}
          labelStyle={{ fontSize: 20 }}
          onPress={onAcceptOrderHandler}
        >
          Accept Order
        </Button>
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
    margin: 15,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  info: {
    fontWeight: 600,
    fontSize: 25,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    marginVertical: 20,
  },
  address: {
    fontSize: 16,
    color: "grey",
  },
  details: {
    color: "grey",
    marginTop: 10,
  },
  button: {
    marginTop: "auto",
    padding: 10,
    fontSize: 24,
    marginBottom: 10,
  },
  marker: {
    backgroundColor: "green",
    borderRadius: 20,
    padding: 5,
  },
});
