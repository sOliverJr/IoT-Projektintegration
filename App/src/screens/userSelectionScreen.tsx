import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../App";
import { COLORS } from "../colors";
import ScreenHeader from "../shared/screenHeader";
import InputField from "../shared/textInput";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackNavigationProps } from "../StackScreenProps";
import Button from "../shared/button";
import axios from "axios";
import { CONFIG } from "../config";

type Props = NativeStackScreenProps<
  StackNavigationProps<"UserSelectionScreen">
>;

type Params = {
  setUser: (user: string) => void;
  allowCreateUser: boolean;
};

export default function UserSelectionScreen({
  route,
}: Props): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const params = route.params as Params;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<string[] | null>(null);

  if (users === null) {
    axios
      .request({
        method: "GET",
        url: `http://${CONFIG.serverIp}:${CONFIG.serverPort}/user`,
        headers: {
          adminKey: CONFIG.adminKey,
        },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((e) => {
        Alert.alert("Fehler", `Fehler beim Laden der Nutzerliste. Error ${e}`, [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      });
  }

  const searchResults =
    users?.filter((user) =>
      user.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];

  return (
    <SafeAreaView style={[{ flex: 1 }, styles.view]}>
      <View style={{ flex: 1, paddingVertical: 12 }}>
        <View style={{ paddingHorizontal: 12 }}>
          <ScreenHeader
            onNavigateBack={() => {
              params.setUser("");
              navigation.goBack();
            }}
          >
            Patienten auswählen
          </ScreenHeader>
          <View style={styles.searchBar}>
            <InputField
              defaultText="Benutzernamen"
              onValueChange={(i) => setSearchTerm(i)}
              value={searchTerm}
            />
          </View>
        </View>
        <ScrollView style={styles.results}>
          {searchResults.length > 0 ? (
            searchResults.map((user) => {
              return (
                <TouchableOpacity
                  key={user}
                  style={styles.resultItem}
                  onPress={() => {
                    params.setUser(user);
                    navigation.goBack();
                  }}
                >
                  <Text>{user}</Text>
                </TouchableOpacity>
              );
            })
          ) : params.allowCreateUser ? (
            <Button
              text="Neuen Patientenaccount anlegen"
              style={styles.button}
              onPress={() => {
                params.setUser(searchTerm);
                navigation.goBack();
              }}
            />
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  searchBar: {
    marginTop: 12,
  },
  results: {
    marginTop: 12,
    marginBottom: 12,
    flex: 1,
    flexDirection: "column",
    gap: 12,
    paddingHorizontal: 12,
  },
  resultItem: {
    backgroundColor: COLORS.gray100,
    padding: 12,
    borderRadius: 20,
    marginBottom: 9,
  },
  button: {
    marginTop: 12,
  },
});
