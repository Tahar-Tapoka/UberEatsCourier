import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Divider } from "react-native-paper";
import { Fontisto } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as Location from "expo-location";
import { ActivityIndicator } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useOrderContext } from "../contexts/OrderContext";
import { API_KEY } from "../../.googleApiKey";

export const OrdersDelivery = ({ route, navigation }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMin, setTotalMin] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [isDriverClose, setDriverIsClose] = useState(false);
  const { width, height } = useWindowDimensions();
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const { orderId } = route.params;
  const {
    onAcceptOrder,
    completeOrder,
    pickUpOrder,
    fetchOrder,
    order,
    user,
    dishes,
  } = useOrderContext();

  const restaurantLocation = {
    latitude: order?.Restaurant?._j?.lat,
    longitude: order?.Restaurant?._j?.lng,
  };
  const deliveryLocation = {
    latitude: user?.lat,
    longitude: user?.lng,
  };

  console.log("drLoc", driverLocation, " rstLoc :", restaurantLocation);

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId]);
  console.log("Restaurant :", order?.Restaurant);
  console.log("user :", user);
  console.log("dishes :", dishes);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Please grant using location!!");
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

  if (dishes) console.log("User order  dish ", dishes[0]?.Dish?._j?.name);

  if (!driverLocation || !order || !user || !dishes) {
    return (
      <ActivityIndicator
        animating={true}
        color="green"
        size={"large"}
        style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
      />
    );
  }

  const onAcceptOrderHandler = async () => {
    bottomSheetRef.current?.collapse();
    if (order?.status === "READY_FOR_PICKUP") {
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      onAcceptOrder();
    }
    if (order?.status === "ACCEPTED") {
      pickUpOrder();
    }
    if (order?.status === "PICKED_UP") {
      await completeOrder();
      navigation.navigate("Home");
    }
  };

  const renderbuttonTitle = () => {
    if (order?.status === "READY_FOR_PICKUP") return "Accept Order";
    if (order?.status === "ACCEPTED") return "Pickup Order";
    if (order?.status === "PICKED_UP") return "Complete Delivery";
  };
  const buttonDisabled = () => {
    if (order?.status === "READY_FOR_PICKUP") return false;
    if (order?.status === "ACCEPTED" && isDriverClose) return false;
    if (order?.status === "PICKED_UP" && isDriverClose) return false;
    return true;
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
          waypoints={
            order?.status === "READY_FOR_PICKUP" ? [restaurantLocation] : []
          }
          destination={
            order?.status === "ACCEPTED" ? restaurantLocation : deliveryLocation
          }
          onReady={(resutls) => {
            setTotalMin(resutls.duration);
            setTotalKm(resutls.distance);
            setDriverIsClose(resutls.distance <= 0.1);
          }}
          apikey={API_KEY}
          strokeWidth={3}
          strokeColor="#3FC060"
        />
        <Marker
          title={order?.Restaurant._j?.name}
          coordinate={restaurantLocation}
        >
          <View style={styles.marker}>
            <Entypo name="shop" size={24} color="white" />
          </View>
        </Marker>
        <Marker title={user?.name} coordinate={deliveryLocation}>
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
          <Text style={styles.title}>{order?.Restaurant._j?.name}</Text>
          <View style={styles.row}>
            <Fontisto
              name="shopping-store"
              size={24}
              color="grey"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.address}>{order?.Restaurant._j?.address}</Text>
          </View>
          <View style={styles.row}>
            <Entypo
              name="location"
              size={24}
              color="grey"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.address}>{user?.address}</Text>
          </View>
          <Divider bold />
          {dishes?.map((item) => (
            <Text style={styles.details} key={item.id}>
              {item.Dish?._j?.name} x {item.quantity}
            </Text>
          ))}
        </View>
        <Button
          mode="contained"
          buttonColor="green"
          style={styles.button}
          labelStyle={{ fontSize: 20 }}
          onPress={onAcceptOrderHandler}
          disabled={buttonDisabled()}
        >
          {renderbuttonTitle()}
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
