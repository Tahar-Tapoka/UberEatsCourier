import MapView from "react-native-maps";
import { useWindowDimensions } from "react-native";

export const MapScreen = ({ children, location }) => {
  const { width, height } = useWindowDimensions();
  return (
    <MapView
      style={{ width, height }}
      showsUserLocation
      followsUserLocation
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.07,
        longitudeDelta: 0.07,
      }}
    >
      {children}
    </MapView>
  );
};
