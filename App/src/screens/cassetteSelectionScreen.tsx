import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { useState } from "react";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import QRCodeScanner from "react-native-qrcode-scanner";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../../App";
import { COLORS } from "../colors";
import { CONFIG } from "../config";
import ArrowIcon from "../icons/arrowIcon";
import CrossIcon from "../icons/crossIcon";
import Button from "../shared/button";
import Label from "../shared/label";
import ScreenHeader from "../shared/screenHeader";
import InputField from "../shared/textInput";

export default function CassetteSelectionScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [cassetteId, setCassetteId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

  const { width, height } = Dimensions.get("screen");
  const insets = useSafeAreaInsets();

  const checkCassette = (data: string) => {
    setIsLoading(true);

    axios
      .request({
        method: "GET",
        url: `http://${CONFIG.api_ip}:5000/cassette_exists/${data}`,
        headers: {
          adminKey: "admin",
        },
      })
      .then((response) => {
        setIsLoading(false);

        if (response.status === 200)
          navigation.navigate("AdminScreen", { cassetteId: data });
      })
      .catch(() => {
        setIsLoading(false);
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
                  checkCassette(e.data);
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
          <ScreenHeader>Kassette verwalten</ScreenHeader>
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
                    setLoadingError(false);
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
                  checkCassette(cassetteId);
                }}
                disabled={cassetteId === "" || isLoading}
              >
                <ArrowIcon
                  orientation="right"
                  size={30}
                  color={
                    cassetteId === "" || isLoading
                      ? COLORS.disabled
                      : COLORS.brand
                  }
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
                ? "Es konnte keine Kassette mit der angegebenen Nummer gefunden werden"
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
