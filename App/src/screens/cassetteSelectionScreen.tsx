import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  Touchable,
  View,
} from "react-native";
import ScreenHeader from "../shared/screenHeader";
import Button from "../shared/button";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { COLORS } from "../colors";
import Label from "../shared/label";
import InputField from "../shared/textInput";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import ArrowIcon from "../icons/arrowIcon";
import axios from "axios";
import CrossIcon from "../icons/crossIcon";
import QRCodeScanner from "react-native-qrcode-scanner";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CassetteSelectionScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [cassetteId, setCassetteId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

  const { width, height } = Dimensions.get("screen");
  const insets = useSafeAreaInsets();

  const checkCassette = () => {
    setIsLoading(true);

    axios
      .request({
        method: "GET",
        // rl: `http://169.254.121.31:5000/cassette_exists/${cassetteId}`,
        url: `http://169.254.121.31:5000/cassette_exists/${cassetteId}`,
        headers: {
          adminKey: "admin",
        },
      })
      .then((response) => {
        setIsLoading(false);

        if (response.status === 200)
          navigation.navigate("AdminScreen", { cassetteId: cassetteId });
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
          <View style={styles.scannerModal}>
            <SafeAreaView>
              <View style={[styles.modalHeader, { top: insets.top }]}>
                <TouchableOpacity
                  onPress={() => {
                    setShowScannerModal(false);
                  }}
                  style={{ flex: 0 }}
                >
                  <CrossIcon size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <QRCodeScanner
                onRead={(e) => {
                  setCassetteId(e.data);
                  setShowScannerModal(false);
                  checkCassette();
                }}
                reactivate
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
                  defaultText="Kassettennummer"
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
                  checkCassette();
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
    flexDirection: "row",
    position: "absolute",
    zIndex: 2,
    padding: 12,
  },
});
