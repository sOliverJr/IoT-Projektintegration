import { StyleSheet, Text, View } from "react-native";
import ScreenHeader from "../shared/screenHeader";
import { COLORS } from "../colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import Label from "../shared/label";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, usePersistStore } from "../../App";

export default function ConsumerScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //TODO: request casette info for device
  const times = [1000, 1800];
  const frequency: number = 2;
  const comment = "Immer mit einem Glas Wasser einnehmen";

  const formatTime = (time: number): string => {
    return time >= 10 ? time.toString() : `0${time}`;
  };

  const frequencyAsText = (frequency: number): string => {
    switch (frequency) {
      case 1:
        return "täglich";
      case 2:
        return "alle zwei Tage";
      case 3:
        return "alle drei Tage";
      case 4:
        return "alle vier Tage";
      case 5:
        return "alle fünf Tage";
      case 6:
        return "alle sechs Tage";
      case 7:
        return "wöchentlich";
      default:
        throw `Frequency selection error: frequency ${frequency} not allowed`;
    }
  };

  return (
    <View style={styles.view}>
      <ScreenHeader redirectScreen={"SelectionScreen"}>Mein Gerät</ScreenHeader>
      <View style={styles.statusView}>
        <View style={{ flexDirection: "row" }}>
          <Text>Gerätestatus: </Text>
          <Text style={[styles.statusText, { color: COLORS.lightgreen }]}>
            verbunden
          </Text>
        </View>
        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={() => {
            // usePersistStore.setState({ deviceHash: "none", deviceId: "none" });
            // usePersistStore.getState().setDeviceHash("none");
            navigation.navigate("DeviceLoginScreen");
          }}
        >
          <Text style={{ color: COLORS.brand }}>Gerät trennen</Text>
        </TouchableOpacity>
      </View>
      <Label size="title">Aktuelle Einnahme</Label>
      <View style={styles.consumptionView}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Label
            size="default"
            style={{ color: COLORS.white, marginBottom: 12 }}
          >
            Titel der Einnahme
          </Label>
          <Text style={{ color: COLORS.white }}>Kassette: 12345</Text>
        </View>
        <Label size="title" style={{ color: COLORS.white }}>
          {`${frequencyAsText(frequency)}, um`}
        </Label>
        <View style={styles.timesView}>
          {times.map((time) => {
            return (
              <View style={styles.timeItem} key={time}>
                <Text
                  style={{ color: COLORS.brand, fontWeight: "bold" }}
                >{`${formatTime(Math.floor(time / 100))}:${formatTime(
                  time % 100
                )}`}</Text>
              </View>
            );
          })}
        </View>
        <Label size="default" style={{ color: COLORS.white, marginTop: 12 }}>
          Kommentar:
        </Label>
        <Text style={{ color: COLORS.white }}>{comment}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.white,
  },
  statusView: {
    marginVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusText: {
    fontWeight: "bold",
  },
  disconnectButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  consumptionView: {
    marginVertical: 12,
    backgroundColor: COLORS.brand,
    padding: 12,
    borderRadius: 20,
  },
  timesView: {
    alignSelf: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginVertical: 6,
  },
  timeItem: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 6,
  },
});
