import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../colors";
import Button from "../shared/button";
import ScreenHeader from "../shared/screenHeader";
import InputField from "../shared/textInput";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, usePersistStore } from "../../App";
import axios from "axios";

export default function DeviceLoginScreen() {
  const [deviceId, setDeviceId] = useState<string>("");
  const [devicePassword, setDevicePassword] = useState<string>("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const onValueChange = (input: string, state: (value: string) => any) => {
    state(input);
  };
  const tryLogin = async () => {
    axios
      .request({
        method: "POST",
        url: "http://localhost:5000/auth_device",
        data: { device_id: deviceId, device_pwd: devicePassword },
      })
      .then((response) => {
        usePersistStore.setState({
          deviceId: deviceId,
          deviceHash: response.data,
        });
        navigation.navigate("ConsumerScreen");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (usePersistStore.getState().deviceHash !== "none") {
    console.log(1);
    navigation.navigate("ConsumerScreen");
    return <View style={styles.view} />;
  } else console.log(0);

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
                  tryLogin();
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
