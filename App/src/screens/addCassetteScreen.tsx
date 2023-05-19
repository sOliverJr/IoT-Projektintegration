import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
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

export default function AddCassetteScreen() {
  const [cassetteId, setCassetteId] = useState<string>("");
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const addCassette = () => {
    setLoadingError(false);

    axios
      .request({
        method: "PUT",
        url: "http://localhost:5000/cassette",
        data: {
          device_id: usePersistStore.getState().deviceId,
          device_hash: usePersistStore.getState().deviceHash,
          cassette_id: cassetteId,
        },
      })
      .then(() => {
        navigation.navigate("ConsumerScreen");
      })
      .catch(() => {
        setLoadingError(true);
      });
  };

  return (
    <View style={styles.view}>
      <ScreenHeader redirectScreen="ConsumerScreen">
        Kassette koppeln
      </ScreenHeader>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <InputField
              defaultText="Kassettennummer"
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
              addCassette();
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
          style={{ color: COLORS.disabled, marginBottom: 12, marginTop: 12 }}
        >
          ODER
        </Label>
        <Button
          text="QR-Code scannen"
          onPress={() => {
            navigation.navigate("ConsumerScreen");
          }}
          stretch
          disabled
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
