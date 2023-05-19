import { Text, TouchableOpacity, View } from "react-native";
import Label from "./label";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "../icons/arrowIcon";

type Props = {
  children: string;
  disableBackButton?: boolean;
};

export default function ScreenHeader(props: Props) {
  const navigation = useNavigation();

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
          onPress={() => navigation.goBack()}
          style={{ marginRight: 12 }}
        >
          <ArrowIcon color={"black"} size={22} />
        </TouchableOpacity>
      )}
      <Label size="title" align="left">
        {props.children}
      </Label>
    </View>
  );
}
