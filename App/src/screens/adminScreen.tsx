import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../App";
import { COLORS } from "../colors";
import ArrowIcon from "../icons/arrowIcon";
import CrossIcon from "../icons/crossIcon";
import Button from "../shared/button";
import ScreenHeader from "../shared/screenHeader";
import InputField from "../shared/textInput";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CONFIG } from "../config";
import { StackNavigationProps } from "../StackScreenProps";

type Props = NativeStackScreenProps<StackNavigationProps<"AdminScreen">>;

type Params = {
  cassetteId: string;
};

export default function AdminScreen({ route }: Props) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const params = route.params as Params;

  const [title, setTitle] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [frequency, setFrequency] = useState<number>(1);
  const [times, setTimes] = useState<number[]>([]);
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const MAX_TIMES = 4;

  const frequencyAsText = (): string => {
    switch (frequency) {
      case 1:
        return "täglich";
      case 2:
        return "alle zwei Tage";
      case 3:
        return "alle drei Tage";
      case 4:
        return "alle vier Tage";
      case 5:
        return "alle fünf Tage";
      case 6:
        return "alle sechs Tage";
      case 7:
        return "wöchentlich";
      default:
        throw `Frequency selection error: frequency ${frequency} not allowed`;
    }
  };

  const removeTime = (time: number) => {
    const timesArray = times.slice();
    const index = times.indexOf(time);

    if (index != -1) timesArray.splice(index, 1);

    setTimes(timesArray);
  };

  const addCurrentTime = () => {
    const timesArray = times.slice();

    timesArray.push(selectedHour * 100 + selectedMinute);

    setTimes(timesArray);
  };

  const formatTime = (time: number): string => {
    return time >= 10 ? time.toString() : `0${time}`;
  };

  const updateCassette = () => {
    setIsLoading(true);

    axios
      .request({
        method: "PATCH",
        url: `http://${CONFIG.serverIp}:${CONFIG.serverPort}/cassette/${params.cassetteId}`,
        headers: {
          adminKey: CONFIG.adminKey,
        },
        data: {
          cassette: {
            einnahmeFrequenz: frequency,
            einnahmeUhrzeiten: times,
            comment: comment,
            title: title,
            username: user,
          },
        },
      })
      .then((response) => {
        setIsLoading(false);

        Alert.alert(
          "Einnahme gespeichert",
          "Die Einstellungen wurden erfolgreich der Kassette zugeschrieben",
          [
            {
              text: "Weiter",
              onPress: () => {
                navigation.navigate("CassetteSelectionScreen");
              },
            },
          ]
        );
      })
      .catch((e) => {
        setIsLoading(false);

        Alert.alert(
          "Einnahme gespeichert",
          `Fehler beim Speichern der Kassettenkonfiguration. Error: ${e}`,
          [
            {
              text: "Weiter",
              onPress: () => {},
            },
          ]
        );
      });
  };

  return (
    <SafeAreaView style={[{ flex: 1 }, styles.view]}>
      <View style={{ flex: 1, padding: 12 }}>
        <ScreenHeader
          onNavigateBack={() => {
            Alert.alert(
              "Bearbeitung abbrechen?",
              "Vorgenommene Änderungen werden verworfen",
              [
                { text: "Weiter bearbeiten", style: "cancel" },
                {
                  text: "Abbrechen",
                  onPress: () => {
                    navigation.navigate("SelectionScreen");
                  },
                },
              ]
            );
          }}
        >
          Kasette verwalten
        </ScreenHeader>
        <ScrollView>
          <Text style={styles.label}>Titel</Text>
          <InputField
            defaultText="Titel"
            onValueChange={(i) => setTitle(i)}
            value={title}
          />
          <Text style={styles.label}>Patient</Text>
          <InputField
            defaultText="Nutzername des Patienten"
            onValueChange={(i) => setUser(i)}
            value={user}
          />
          <TouchableOpacity
            style={styles.searchUserTouchable}
            onPress={() => {
              navigation.navigate("UserSelectionScreen", {
                setUser: (user: string) => {
                  setUser(user);
                },
                allowCreateUser: true,
              });
            }}
          >
            <Text style={{ color: COLORS.brand, fontWeight: "bold" }}>
              Patientendatenbank durchsuchen
            </Text>
            <ArrowIcon size={16} orientation="right" color={COLORS.brand} />
          </TouchableOpacity>
          <Text style={styles.label}>Kommentar (optional)</Text>
          <InputField
            defaultText="Kommentar"
            onValueChange={(i) => setComment(i)}
            value={comment}
            multiline={true}
          />
          <Text style={styles.label}>Einnahmefrequenz</Text>
          <View style={styles.frequencyView}>
            <TouchableOpacity
              onPress={() => setFrequency(frequency - 1)}
              style={styles.frequencyButton}
              disabled={frequency === 1}
            >
              <ArrowIcon
                size={29}
                orientation="left"
                color={frequency > 1 ? COLORS.brand : COLORS.disabled}
              />
            </TouchableOpacity>
            <Text style={styles.frequencyText}>
              {frequencyAsText().toUpperCase()}
            </Text>
            <TouchableOpacity
              onPress={() => setFrequency(frequency + 1)}
              style={styles.frequencyButton}
              disabled={frequency === 7}
            >
              <ArrowIcon
                size={29}
                orientation="right"
                color={frequency < 7 ? COLORS.brand : COLORS.disabled}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Uhrzeiten</Text>
          <View>
            <View style={styles.timeSelection}>
              <View>
                <TouchableOpacity
                  style={styles.timeSelectionButton}
                  onPress={() => {
                    selectedHour === 23
                      ? setSelectedHour(0)
                      : setSelectedHour(selectedHour + 1);
                  }}
                >
                  <Text style={styles.timeSelectionButtonText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.timeSelectionText}>
                  {formatTime(selectedHour)}
                </Text>
                <TouchableOpacity
                  style={styles.timeSelectionButton}
                  onPress={() => {
                    selectedHour === 0
                      ? setSelectedHour(23)
                      : setSelectedHour(selectedHour - 1);
                  }}
                >
                  <Text style={styles.timeSelectionButtonText}>-</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 24 }}>:</Text>
              <View>
                <TouchableOpacity
                  style={styles.timeSelectionButton}
                  onPress={() => {
                    selectedMinute === 45
                      ? setSelectedMinute(0)
                      : setSelectedMinute(selectedMinute + 15);
                  }}
                >
                  <Text style={styles.timeSelectionButtonText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.timeSelectionText}>
                  {formatTime(selectedMinute)}
                </Text>
                <TouchableOpacity
                  style={styles.timeSelectionButton}
                  onPress={() => {
                    selectedMinute === 0
                      ? setSelectedMinute(45)
                      : setSelectedMinute(selectedMinute - 15);
                  }}
                >
                  <Text style={styles.timeSelectionButtonText}>-</Text>
                </TouchableOpacity>
              </View>
              <Button
                onPress={() => addCurrentTime()}
                disabled={
                  times.length >= MAX_TIMES ||
                  times.indexOf(selectedHour * 100 + selectedMinute) !== -1
                }
                text={"Hinzufügen"}
              />
            </View>
            <View style={styles.selectedTimes}>
              {times.map((time) => {
                return (
                  <View style={styles.timeItem} key={times.indexOf(time)}>
                    <Text style={styles.timeItemText}>{`${formatTime(
                      Math.floor(time / 100)
                    )}:${formatTime(time % 100)} Uhr`}</Text>
                    <TouchableOpacity onPress={() => removeTime(time)}>
                      <CrossIcon size={14} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
        <View style={styles.divider} />
        <Button
          onPress={() => {
            updateCassette();
          }}
          text="Konfiguration abschließen"
          stretch={false}
          disabled={title === "" || times.length === 0 || user === ""}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  inputView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    alignSelf: "stretch",
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 24,
  },
  frequencyView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 12,
  },
  frequencyText: {
    flex: 2,
    textAlign: "center",
    textAlignVertical: "center",
    color: COLORS.brand,
    fontWeight: "bold",
  },
  frequencyButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  timeSelection: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  selectedTimes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 12,
  },
  timeSelectionButton: {
    color: COLORS.brand,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  timeSelectionText: {
    color: COLORS.brand,
    fontWeight: "bold",
    fontSize: 16,
    borderColor: COLORS.brand,
    textAlign: "center",
    width: 80,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  timeSelectionButtonText: {
    fontSize: 24,
  },
  timeItem: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: "48%",
    borderRadius: 20,
    backgroundColor: COLORS.brand,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeItemText: {
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  addTimeButton: {
    fontSize: 24,
    color: COLORS.white,
    textAlign: "center",
    textAlignVertical: "center",
  },
  divider: {
    backgroundColor: COLORS.disabled,
    width: "100%",
    height: 1,
    marginVertical: 6,
  },
  searchUserTouchable: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
});
