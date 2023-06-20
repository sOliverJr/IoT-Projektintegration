import { Rect, Svg } from "react-native-svg";

type Props = {
  size: number;
  color: string;
};

export default function CrossIcon(props: Props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 20 20">
      <Rect
        width="24.9567"
        height="3.32755"
        rx="1.66378"
        transform="matrix(0.707105 -0.707108 0.707105 0.707108 0 17.6471)"
        fill={props.color}
      />
      <Rect
        width="24.9567"
        height="3.32755"
        rx="1.66378"
        transform="matrix(-0.707105 -0.707108 0.707105 -0.707108 17.6469 20)"
        fill={props.color}
      />
    </Svg>
  );
}
