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

export default function CassetteSelectionScreen() {
  const [cassetteId, setCassetteId] = useState<string>("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
              onValueChange={(i) => setCassetteId(i)}
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
              navigation.navigate("AdminScreen");
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
          align="center"
          style={{ color: COLORS.disabled, marginBottom: 12, marginTop: 42 }}
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
