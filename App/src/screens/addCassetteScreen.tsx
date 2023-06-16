import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenHeader from "../shared/screenHeader";
import Button from "../shared/button";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, usePersistStore } from "../../App";
import { COLORS } from "../colors";
import Label from "../shared/label";
import InputField from "../shared/textInput";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import ArrowIcon from "../icons/arrowIcon";
import axios from "axios";
import { CONFIG } from "../config";
import CrossIcon from "../icons/crossIcon";
import QRCodeScanner from "react-native-qrcode-scanner";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddCassetteScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [deviceId, setDeviceId] = useState<string>(
    usePersistStore((state) => state.deviceId) ?? ""
  );
  const [deviceHash, setDeviceHash] = useState<string>(
    usePersistStore((satte) => satte.deviceHash) ?? ""
  );
  const [cassetteId, setCassetteId] = useState<string>("");
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

  const { width, height } = Dimensions.get("screen");
  const insets = useSafeAreaInsets();

  const addCassette = (data: string) => {
    setLoadingError(false);

    axios
      .request({
        method: "PUT",
        url: `http://${CONFIG.serverIp}:${CONFIG.serverPort}/cassette/${deviceId}`,
        headers: { device_hash: deviceHash, cassette_id: data },
      })
      .then((result) => {
        console.log(result.statusText);
        navigation.navigate("ConsumerScreen");
      })
      .catch(() => {
        setLoadingError(true);
      });
  };

  return (
    <View style={styles.flexOne}>
      {showScannerModal ? (
        <Modal
          animationType="slide"
          transparent={false}
          visible={showScannerModal}
          onRequestClose={() => {
            setShowScannerModal(false);
          }}
        >
          <StatusBar backgroundColor={COLORS.white} barStyle="light-content" />
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
                  setCassetteId(e.data);
                  addCassette(e.data);
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
        <SafeAreaView style={styles.view}>
          <ScreenHeader>Kassette koppeln</ScreenHeader>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <InputField
                  defaultText="Kassettennummer eingeben"
                  onValueChange={(i) => {
                    if (loadingError) setLoadingError(false);
                    setCassetteId(i);
                  }}
                  value={cassetteId}
                />
              </View>
              <TouchableOpacity
                style={{
                  padding: 6,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  addCassette(cassetteId);
                }}
                disabled={cassetteId === ""}
              >
                <ArrowIcon
                  orientation="right"
                  size={30}
                  color={cassetteId === "" ? COLORS.disabled : COLORS.brand}
                />
              </TouchableOpacity>
            </View>
            <Label
              style={{
                color: COLORS.brand,
                marginVertical: 12,
                textAlign: "center",
              }}
            >
              {loadingError
                ? "Die angegebene Kassette existiert nicht oder ist bereits mit einem anderen Gerät gekoppelt"
                : "\n"}
            </Label>
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
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  view: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
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
});
