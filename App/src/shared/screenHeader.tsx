import { Text, TouchableOpacity, View } from "react-native";
import Label from "./label";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "../icons/arrowIcon";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type Props = {
  children: string;
  disableBackButton?: boolean;
  onNavigateBack?: () => void;
};

export default function ScreenHeader(props: Props) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View
      style={{
        flexDirection: "row",
        flex: 0,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {props.disableBackButton ? (
        <View />
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (props.onNavigateBack) props.onNavigateBack();
            else navigation.goBack();
          }}
          style={{ marginRight: 12 }}
        >
          <ArrowIcon color={"black"} size={22} orientation="left" />
        </TouchableOpacity>
      )}
      <Label size="title" align="left">
        {props.children}
      </Label>
    </View>
  );
}
