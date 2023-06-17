import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { RootStackParamList } from "../../App";
import { COLORS } from "../colors";
import Button from "../shared/button";
import ScreenHeader from "../shared/screenHeader";

export default function AdminSelectionScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.view}>
      <ScreenHeader>Operation auswählen</ScreenHeader>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Button
          text="Einnahmeverlauf einsehen"
          onPress={() => {
            navigation.navigate("AdminMessageScreen", { user: null });
          }}
          stretch
          style={{ marginBottom: 12, marginTop: 24 }}
        />
        <Button
          text="Kassetten verwalten"
          onPress={() => {
            navigation.navigate("CassetteSelectionScreen");
          }}
          stretch
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
