import { Text, TouchableOpacity } from "react-native";
import { COLORS } from "../colors";

type Props = {
  text: string;
  style?: {};
  stretch?: boolean;
  onPress: () => any;
};

export default function Button(props: Props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        props.style,
        {
          backgroundColor: COLORS.brand,
          padding: 12,
          borderRadius: 20,
          width: props.stretch ? "100%" : "auto",
        },
      ]}
    >
      <Text
        style={{ color: COLORS.white, fontWeight: "bold", textAlign: "center" }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}
