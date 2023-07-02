import { useState } from "react";
import {
  Dimensions,
  Keyboard,
  Modal,
  SafeAreaView,
  StatusBar,
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
import { CONFIG } from "../config";
import CrossIcon from "../icons/crossIcon";
import QRCodeScanner from "react-native-qrcode-scanner";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Label from "../shared/label";
import ArrowIcon from "../icons/arrowIcon";

export default function DeviceLoginScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { width, height } = Dimensions.get("screen");
  const insets = useSafeAreaInsets();

  const [deviceId, setDeviceId] = useState<string>("");
  const [devicePassword, setDevicePassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wrongPassword, setWrongPassword] = useState<boolean>(false);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

  const onValueChange = (input: string, state: (value: string) => any) => {
    setWrongPassword(false);
    state(input);
  };

  const onScan = (input: string) => {
    const split = input.split("/");

    setDeviceId(split[0]);
    setDevicePassword(split[1]);

    tryLogin();
  };

  const tryLogin = async () => {
    setIsLoading(true);

    axios
      .request({
        method: "GET",
        url: `http://${CONFIG.serverIp}:${CONFIG.serverPort}/auth_device/${deviceId}`,
        headers: { devicePassword: devicePassword },
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
      .catch(() => {
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
        {showScannerModal ? (
          <Modal
            animationType="slide"
            transparent={false}
            visible={showScannerModal}
            onRequestClose={() => {
              setShowScannerModal(false);
            }}
          >
            <StatusBar
              backgroundColor={COLORS.white}
              barStyle="light-content"
            />
            <View style={styles.scannerModal}>
              <SafeAreaView>
                <View
                  style={[
                    styles.modalHeader,
                    {
                      top: insets.top,
                      width: width,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowScannerModal(false);
                    }}
                    style={{
                      flex: 1,
                    }}
                  >
                    <CrossIcon size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <QRCodeScanner
                  onRead={(e) => {
                    setShowScannerModal(false);
                    onScan(e.data);
                  }}
                  cameraStyle={{
                    height: height,
                    width: width,
                  }}
                />
              </SafeAreaView>
            </View>
          </Modal>
        ) : (
          <View style={{ flex: 1 }}>
            <ScreenHeader>Ein neues Gerät registrieren</ScreenHeader>
            <View style={styles.inputView}>
              <InputField
                defaultText="Gerätenummer"
                onValueChange={(i) => onValueChange(i, setDeviceId)}
                value={deviceId ?? ""}
                onFocus={() => setWrongPassword(false)}
              />
              <View
                style={[
                  styles.passwordInput,
                  { alignSelf: "stretch", marginTop: 12 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <InputField
                    defaultText="Gerätepasswort"
                    onValueChange={(i) => onValueChange(i, setDevicePassword)}
                    value={devicePassword ?? ""}
                    secureTextEntry
                    onFocus={() => setWrongPassword(false)}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    tryLogin();
                  }}
                  disabled={
                    deviceId === "" || devicePassword === "" || isLoading
                  }
                >
                  <ArrowIcon
                    orientation="right"
                    size={30}
                    color={
                      devicePassword === "" || isLoading || deviceId === ""
                        ? COLORS.disabled
                        : COLORS.brand
                    }
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.errorText}>
                {wrongPassword
                  ? "Falsche Gerätenummer und -passwortkombination"
                  : ""}
              </Text>
              <Label
                align="center"
                style={{
                  color: COLORS.disabled,
                  marginBottom: 12,
                  marginTop: 12,
                }}
              >
                ODER
              </Label>
              <Button
                text="QR-Code scannen"
                onPress={() => {
                  setShowScannerModal(true);
                }}
                stretch
              />
            </View>
          </View>
        )}
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
  scannerModal: {
    flex: 1,
    backgroundColor: "black",
  },
  modalHeader: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    justifyContent: "flex-end",
    zIndex: 2,
    padding: 12,
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    alignSelf: "stretch",
  },
});
