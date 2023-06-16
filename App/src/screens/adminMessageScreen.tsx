import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../App";
import { StackNavigationProps } from "../StackScreenProps";
import { useState } from "react";
import ScreenHeader from "../shared/screenHeader";
import { COLORS } from "../colors";
import { Message } from "../types/Message";

type Props = NativeStackScreenProps<StackNavigationProps<"AdminMessageScreen">>;

type Params = {
  user: string | null;
};

export default function AdminMessageScreen({
  route,
}: Props): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const params = route.params as Params;

  const [user, setUser] = useState<string | null>(params.user);
  // TODO: api -> get messages
  const [messages, setMessages] = useState<Message[]>([
    {
      shouldTime: 1300,
      isTime: 1330,
      timestamp: Date.now(),
    },
    {
      shouldTime: 1300,
      isTime: 1400,
      timestamp: Date.now(),
    },
    {
      shouldTime: 1300,
      isTime: 1230,
      timestamp: Date.now(),
    },
    {
      shouldTime: 1300,
      isTime: 1530,
      timestamp: Date.now(),
    },
  ]);

  const formatTime = (time: number): string => {
    return time >= 10 ? time.toString() : `0${time}`;
  };

  if (user === null) {
    navigation.navigate("UserSelectionScreen", {
      setUser: (user: string) => {
        setUser(user);
      },
      allowCreateUser: false,
    });
  } else if (user === "") {
    navigation.goBack();
  }

  const timestampToDate = (timestamp: number) => {
    return new Date(timestamp);
  };

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.topView}>
        <ScreenHeader>Einnahmeüberwachung</ScreenHeader>
        <View style={styles.infoView}>
          <Text>
            Ausgewählter Patient: <Text style={styles.userId}>{user}</Text>
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("UserSelectionScreen", {
                setUser: (user: string) => {
                  setUser(user);
                },
                allowCreateUser: false,
              });
            }}
          >
            <Text style={styles.selectUserButton}>ÄNDERN</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.messageList}>
        {messages.length > 0 ? (
          messages.map((message: Message) => {
            return (
              <View style={styles.messageItem} key={messages.indexOf(message)}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageTitle}>Fehlerhafte Einnahme</Text>
                  <Text style={styles.messageDate}>
                    {timestampToDate(message.timestamp).toLocaleString(
                      "de-DE",
                      {
                        timeZone: "Europe/Berlin",
                        hour12: false,
                      }
                    )}
                  </Text>
                </View>
                <Text>
                  Soll-Einnahmezeit:{" "}
                  {`${formatTime(
                    Math.floor(message.shouldTime / 100)
                  )}:${formatTime(message.shouldTime % 100)} Uhr`}
                </Text>
                <Text>
                  Ist-Einnahmezeit:{" "}
                  {`${formatTime(
                    Math.floor(message.isTime / 100)
                  )}:${formatTime(message.isTime % 100)} Uhr`}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.noMessagesText}>
            Für diesen Patienten liegen zum aktuellen Zeitpunkt keine Meldungen
            vor
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  topView: {
    paddingHorizontal: 12,
  },
  infoView: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectUserButton: {
    color: COLORS.brand,
  },
  userId: {
    fontWeight: "bold",
  },
  messageList: {
    marginTop: 12,
    flex: 1,
    gap: 12,
    paddingHorizontal: 12,
  },
  messageItem: {
    backgroundColor: COLORS.gray100,
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  messageTitle: {
    fontWeight: "bold",
  },
  messageHeader: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  messageDate: {
    fontSize: 12,
  },
  noMessagesText: {
    color: COLORS.brand,
    marginTop: 24,
    textAlign: "center",
  },
});
