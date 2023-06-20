import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackParamList, usePersistStore } from "../../App";
import { COLORS } from "../colors";
import Button from "../shared/button";
import ScreenHeader from "../shared/screenHeader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function SelectionScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [deviceHash, setDeviceHash] = useState<string>(
    usePersistStore((state) => state.deviceHash)
  );

  useFocusEffect(
    useCallback(() => {
      setDeviceHash(usePersistStore.getState().deviceHash ?? "");
    }, [])
  );

  return (
    <View style={styles.view}>
      <ScreenHeader disableBackButton>App-Version auswählen</ScreenHeader>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Button
          text="Patient"
          onPress={() => {
            if (deviceHash !== "") {
              navigation.navigate("ConsumerScreen");
            } else navigation.navigate("DeviceLoginScreen");
          }}
          stretch
          style={{ marginBottom: 12, marginTop: 24 }}
        />
        <Button
          text="Verwaltung"
          onPress={() => {
            navigation.navigate("AdminSelectionScreen");
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
