import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
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

export default function CassetteSelectionScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [cassetteId, setCassetteId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<boolean>(false);

  const checkCassette = () => {
    setIsLoading(true);

    axios
      .request({
        method: "GET",
        url: `http://localhost:5000/cassette_exists/${cassetteId}`,
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
    <View style={styles.view}>
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
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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
                cassetteId === "" || isLoading ? COLORS.disabled : COLORS.brand
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
          style={{ color: COLORS.disabled, marginBottom: 12, marginTop: 12 }}
        >
          ODER
        </Label>
        <Button
          text="QR-Code scannen"
          onPress={() => {
            navigation.navigate("CassetteSelectionScreen");
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
