import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wrongPassword, setWrongPassword] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const onValueChange = (input: string, state: (value: string) => any) => {
    setWrongPassword(false);
    state(input);
  };

  const tryLogin = async () => {
    setIsLoading(true);

    axios
      .request({
        method: "GET",
        url: `http://localhost:5000/auth_device/${deviceId}`,
        headers: { device_pwd: devicePassword },
      })
      .then((response) => {
        if (response.status === 200) {
          usePersistStore.setState({
            deviceId: deviceId,
            deviceHash: response.data,
          });

          navigation.navigate("ConsumerScreen");
        } else setWrongPassword(true);
      })
      .catch((err) => {
        setWrongPassword(true);
      });

    setIsLoading(false);
  };

  return (
    <TouchableOpacity
      style={styles.view}
      onPress={() => Keyboard.dismiss()}
      activeOpacity={1}
    >
      <View style={{ flex: 1 }}>
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
            <Text style={styles.errorText}>
              {wrongPassword
                ? "Falsche Gerätenummer und -passwortkombination"
                : ""}
            </Text>
            <Button
              onPress={() => {
                tryLogin();
              }}
              text="Gerät registrieren"
              style={{ marginTop: 12 }}
              disabled={deviceId === "" || devicePassword === "" || isLoading}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
  errorText: {
    padding: 12,
    textAlignVertical: "center",
    color: COLORS.brand,
    height: 50,
  },
});
