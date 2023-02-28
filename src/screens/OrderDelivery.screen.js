import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { DeliveryItem } from "../components/DeliveryItem.component";
import orders from "../../assets/orders.json";
import { useCallback, useMemo, useRef } from "react";
import { Button, Divider } from "react-native-paper";
import { Fontisto } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MapScreen } from "../components/Map.screen";

export const OrdersDelivery = ({ route }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const { order } = route.params;
  const time = (
    (order.Restaurant.minDeliveryTime + order.Restaurant.maxDeliveryTime) /
    2
  ).toFixed(0);
  return (
    <View style={styles.container}>
      <MapScreen></MapScreen>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
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
          <Text style={styles.info}>{time} min</Text>
          <Fontisto
            name="shopping-basket"
            size={24}
            color="green"
            style={{ marginHorizontal: 5 }}
          />
          <Text style={styles.info}> 3.107Km</Text>
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
          onPress={() => console.log("order Accepted")}
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
});
