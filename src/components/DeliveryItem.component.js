import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { DataStore } from "aws-amplify";
import { OrderDish, User } from "../models";

export const DeliveryItem = ({ order, navigation }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    if (order) DataStore.query(User, order.userID).then(setUser);
  }, [order]);
  return (
    <View style={styles.item}>
      <Image
        source={{
          uri: order.Restaurant._j?.image,
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{order.Restaurant._j?.name}</Text>
        <Text style={styles.description}>{order.Restaurant._j?.address}</Text>
        <Text style={styles.subtitle}>Delevery Details:</Text>
        <Text style={styles.description}>{user?.name}</Text>
        <Text style={styles.description}>{user?.address}</Text>
      </View>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Orders", { order, user })}
      >
        <Entypo name="check" size={24} color="black" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    marginVertical: 5,
  },
  image: {
    width: "20%",
    margin: 3,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  info: {
    marginLeft: 5,
    flex: 1,
    marginVertical: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  description: {
    color: "grey",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 7,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "10%",
    marginLeft: "auto",
    backgroundColor: "green",
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
});
