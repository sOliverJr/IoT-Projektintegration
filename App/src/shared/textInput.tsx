import { TextInput, View } from "react-native";
import { COLORS } from "../colors";

type Props = {
  defaultText?: string;
  onValueChange: (value: string) => any;
  value: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  onFocus?: () => void;
};

export default function InputField(props: Props) {
  return (
    <TextInput
      placeholder={props.defaultText}
      value={props.value}
      onChangeText={props.onValueChange}
      secureTextEntry={props.secureTextEntry}
      multiline={props.multiline}
      autoCorrect={false}
      autoComplete={"off"}
      autoCapitalize="none"
      onFocus={props.onFocus}
      style={{
        alignSelf: "stretch",
        borderColor: COLORS.brand,
        borderWidth: 1,
        borderRadius: 20,
        paddingTop: 12,
        padding: 12,
        alignItems: "center",
        minHeight: 45,
      }}
    />
  );
}
