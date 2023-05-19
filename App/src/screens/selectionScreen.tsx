import { useNavigation } from "@react-navigation/core";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../colors";
import Button from "../shared/button";
import Label from "../shared/label";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, usePersistStore } from "../../App";
import ScreenHeader from "../shared/screenHeader";

export default function SelectionScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.view}>
      <ScreenHeader disableBackButton>App-Verison auswählen</ScreenHeader>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Button
          text="Patient"
          onPress={() => {
            if (usePersistStore.getState().deviceHash !== "") {
              navigation.navigate("ConsumerScreen");
            } else navigation.navigate("DeviceLoginScreen");
          }}
          stretch
          style={{ marginBottom: 12, marginTop: 24 }}
        />
        <Button
          text="Kassettenaverwaltung"
          onPress={() => {
            navigation.navigate("CassetteSelectionScreen");
          }}
          stretch
        />
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
});
