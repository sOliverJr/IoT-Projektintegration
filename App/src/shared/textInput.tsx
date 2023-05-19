import { TextInput, View } from "react-native";
import { COLORS } from "../colors";

type Props = {
  defaultText?: string;
  onValueChange: (value: string) => any;
  value: string;
  multiline?: boolean;
};

export default function InputField(props: Props) {
  const onValueChange = (input: any) => {
    props.onValueChange(input);
  };

  return (
    <View
      style={{
        borderColor: COLORS.brand,
        borderWidth: 1,
        borderRadius: 20,
        padding: 12,
        alignSelf: "stretch",
      }}
    >
      <TextInput
        placeholder={props.defaultText}
        value={props.value}
        onChangeText={props.onValueChange}
        multiline={props.multiline}
        autoCorrect={false}
        autoComplete={"off"}
        autoCapitalize="none"
      />
    </View>
  );
}
