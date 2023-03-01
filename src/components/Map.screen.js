import MapView from "react-native-maps";
import { useWindowDimensions } from "react-native";

export const MapScreen = ({ children, location, ref }) => {
  const { width, height } = useWindowDimensions();
  return (
    <MapView
      ref={ref}
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
