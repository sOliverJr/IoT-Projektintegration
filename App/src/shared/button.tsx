import { Text, TouchableOpacity } from "react-native";
import { COLORS } from "../colors";

type Props = {
  text: string;
  style?: {};
  stretch?: boolean;
  disabled?: boolean;
  onPress: () => any;
};

export default function Button(props: Props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        props.style,
        {
          backgroundColor: props.disabled ? COLORS.white : COLORS.brand,
          padding: 12,
          borderRadius: 20,
          borderWidth: props.disabled ? 1 : 0,
          borderColor: COLORS.disabled,
          alignSelf: props.stretch ? "stretch" : "auto",
        },
      ]}
      disabled={props.disabled}
    >
      <Text
        style={{
          color: props.disabled ? COLORS.disabled : COLORS.white,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}
