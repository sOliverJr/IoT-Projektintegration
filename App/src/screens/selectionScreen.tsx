import { StyleSheet, Text, View } from "react-native";
import Button from "../shared/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../colors";
import Label from "../shared/label";

export default function SelectionScreen() {
  return (
    <SafeAreaView style={styles.view}>
      <Label size="title">App-Verison auswählen</Label>
      <Button
        text="Patient"
        onPress={() => {}}
        stretch
        style={{ marginBottom: 12, marginTop: 24 }}
      />
      <Button text="Kassettenaverwaltung" onPress={() => {}} stretch />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
});
