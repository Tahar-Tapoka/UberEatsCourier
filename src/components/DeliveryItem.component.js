import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

export const DeliveryItem = ({ order }) => {
  return (
    <View style={styles.item}>
      <Image
        source={{
          uri: order.Restaurant.image,
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{order.Restaurant.name}</Text>
        <Text style={styles.description}>{order.Restaurant.address}</Text>
        <Text style={styles.subtitle}>Delevery Details:</Text>
        <Text style={styles.description}>{order.User.name}</Text>
        <Text style={styles.description}>{order.User.address}</Text>
      </View>
      <Pressable
        style={styles.button}
        onPress={() => console.log("Delevery Accepted")}
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
    borderRadius: 5,
    flexDirection: "row",
    marginVertical: 5,
  },
  image: {
    width: "20%",
    margin: 3,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
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
