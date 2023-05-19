import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../colors";
import Button from "../shared/button";
import ScreenHeader from "../shared/screenHeader";
import InputField from "../shared/textInput";
import ArrowIcon from "../icons/arrowIcon";
import DropDownPicker from "react-native-dropdown-picker";
import CrossIcon from "../icons/crossIcon";

export default function AdminScreen() {
  const [title, setTitle] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [frequency, setFrequency] = useState<number>(1);
  const [times, setTimes] = useState<number[]>([1015, 2030]);
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
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

  const onValueChange = (input: string, state: (value: string) => any) => {
    state(input);
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.view}>
        <View style={{ flex: 1, padding: 12 }}>
          <ScreenHeader>Kasette verwalten</ScreenHeader>
          <Text style={styles.label}>Titel</Text>
          <InputField
            defaultText="Titel"
            onValueChange={(i) => onValueChange(i, setTitle)}
            value={title}
          />
          <Text style={styles.label}>Kommentar</Text>
          <InputField
            defaultText="Kommentar (optional)"
            onValueChange={(i) => onValueChange(i, setComment)}
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
          <View style={styles.divider} />
          <Button
            onPress={() => {
              // TODO: send request to api
            }}
            text="Konfiguration abschließen"
            stretch={false}
            disabled={title === "" || times.length === 0}
          />
        </View>
      </ScrollView>
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
    marginVertical: 24,
  },
});
