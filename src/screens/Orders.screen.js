import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { DeliveryItem } from "../components/DeliveryItem.component";
import orders from "../../assets/orders.json";
import { useCallback, useRef } from "react";

export const OrdersScreen = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = ["12%", "70%"];
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);
  return (
    // <FlatList
    //   data={orders}
    //   renderItem={({ item }) => <DeliveryItem order={item} />}
    // />
    <View style={styles.container}>
      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={["12%", "70%"]}>
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
