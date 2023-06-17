import { Alert, StyleSheet, Text, View } from "react-native";
import ScreenHeader from "../shared/screenHeader";
import { COLORS } from "../colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import Label from "../shared/label";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, usePersistStore } from "../../App";
import axios from "axios";
import { useCallback, useState } from "react";
import { Cassette } from "../shared/types";
import Button from "../shared/button";
import { CONFIG } from "../config";

export default function ConsumerScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [data, setData] = useState<Cassette | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>(
    usePersistStore((state) => state.deviceId) ?? ""
  );
  const [deviceHash, setDeviceHash] = useState<string>(
    usePersistStore((satte) => satte.deviceHash) ?? ""
  );

  useFocusEffect(
    useCallback(() => {
      setDeviceHash(usePersistStore.getState().deviceHash ?? "");
      setDeviceId(usePersistStore.getState().deviceId ?? "");

      if (data === null && !loading) {
        setLoadingError(false);
        setLoading(true);

        axios
          .request({
            method: "GET",
            url: `http://${CONFIG.serverIp}:${CONFIG.serverPort}/cassette/${deviceId}`,
            headers: {
              device_hash: deviceHash,
            },
          })
          .then((response) => {
            setLoading(false);
            setData(response.data);
          })
          .catch(() => {
            setLoading(false);
            setLoadingError(true);
            setData(null);
          });
      }
    }, [])
  );

  const formatTime = (time: number): string => {
    return time >= 10 ? time.toString() : `0${time}`;
  };

  const frequencyAsText = (frequency: number): string => {
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

  return (
    <View style={styles.view}>
      <ScreenHeader
        onNavigateBack={() => {
          navigation.navigate("SelectionScreen");
        }}
      >
        Mein Gerät
      </ScreenHeader>

      <View style={styles.deviceInfo}>
        <Text>Gerätenummer: </Text>
        <Text>{usePersistStore.getState().deviceId}</Text>
      </View>

      <View style={styles.statusView}>
        <View style={{ flexDirection: "row" }}>
          <Text>Gerätestatus: </Text>
          <Text style={[styles.statusText, { color: COLORS.lightgreen }]}>
            verbunden
          </Text>
        </View>
        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={() => {
            Alert.alert(
              "Gerät trennen?",
              "Bei erneutem Zugriff ist eine neue Anmeldung notwendig",
              [
                { text: "Abbrechen", style: "cancel" },
                {
                  text: "Trennen",
                  onPress: () => {
                    usePersistStore.getState().setDeviceHash("");
                    usePersistStore.getState().setDeviceId("");

                    navigation.navigate("SelectionScreen");
                  },
                },
              ]
            );
          }}
        >
          <Text style={{ color: COLORS.brand }}>Gerät trennen</Text>
        </TouchableOpacity>
      </View>
      <Label size="title">Aktuelle Einnahme</Label>
      {data && !loadingError ? (
        <View style={styles.consumptionView}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Label
              size="default"
              style={{ color: COLORS.white, marginBottom: 12 }}
            >
              {data.title ?? "Einnahme"}
            </Label>
            <Text style={{ color: COLORS.white }}>
              Kassette: {data.cassette_id}
            </Text>
          </View>
          <Label size="title" style={{ color: COLORS.white }}>
            {`${frequencyAsText(data.einnahme_frequenz)}, um`}
          </Label>
          <View style={styles.timesView}>
            {data.einnahme_uhrzeiten.map((time) => {
              return (
                <View style={styles.timeItem} key={time}>
                  <Text
                    style={{ color: COLORS.brand, fontWeight: "bold" }}
                  >{`${formatTime(Math.floor(time / 100))}:${formatTime(
                    time % 100
                  )}`}</Text>
                </View>
              );
            })}
          </View>
          <Label size="default" style={{ color: COLORS.white, marginTop: 12 }}>
            Kommentar:
          </Label>
          <Text style={{ color: COLORS.white }}>
            {data.comment ?? "kein Kommentar"}
          </Text>
        </View>
      ) : (
        <View>
          <Text style={styles.errorText}>
            Zum aktuellen Zeitpunkt ist keine Kassette mit deinem Gerät
            verbunden...
          </Text>
          <Button
            text="Jetzt koppeln"
            onPress={() => {
              navigation.navigate("AddCassetteScreen");
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.white,
  },
  deviceInfo: {
    marginTop: 18,
    flexDirection: "row",
  },
  statusView: {
    marginTop: 6,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusText: {
    fontWeight: "bold",
  },
  disconnectButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  consumptionView: {
    marginVertical: 12,
    backgroundColor: COLORS.brand,
    padding: 12,
    borderRadius: 20,
  },
  timesView: {
    alignSelf: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginVertical: 6,
  },
  timeItem: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 6,
  },
  errorText: {
    marginVertical: 24,
  },
});
