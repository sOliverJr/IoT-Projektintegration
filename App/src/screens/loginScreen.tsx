import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../colors";
import Button from "../shared/button";
import ScreenHeader from "../shared/screenHeader";
import InputField from "../shared/textInput";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

export default function DeviceLoginScreen() {
  const [deviceId, setDeviceId] = useState<string>("");
  const [devicePassword, setDevicePassword] = useState<string>("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const onValueChange = (input: string, state: (value: string) => any) => {
    state(input);
  };

  return (
    <View style={styles.view}>
      <View style={{ flex: 1 }}>
        {false /* TODO: Check if device is registered */ ? (
          <View>
            <ScreenHeader>Aktuelle Einnahme</ScreenHeader>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <ScreenHeader>Ein neues Gerät registrieren</ScreenHeader>
            <View style={styles.inputView}>
              <InputField
                defaultText="Gerätenummer"
                onValueChange={(i) => onValueChange(i, setDeviceId)}
                value={deviceId ?? ""}
              />
              <View style={{ height: 12 }} />
              <InputField
                defaultText="Gerätepasswort"
                onValueChange={(i) => onValueChange(i, setDevicePassword)}
                value={devicePassword ?? ""}
              />
              <Button
                onPress={() => {
                  // TODO: check device login
                  navigation.navigate("ConsumerScreen");
                }}
                text="Gerät registrieren"
                style={{ marginTop: 12 }}
                disabled={deviceId === "" || devicePassword === ""}
              />
            </View>
          </View>
        )}
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
  inputView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
