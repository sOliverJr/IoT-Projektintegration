import { Text } from "react-native";

type Props = {
  size?: "title" | "default";
  align?: "left" | "center" | "right";
  style?: {};
  children: string;
};

export default function Label(props: Props) {
  return (
    <Text
      style={[
        {
          textAlign: props.align,
          fontWeight: "bold",
          flex: 0,
          fontSize: props.size === "title" ? 24 : 14,
        },
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
}
