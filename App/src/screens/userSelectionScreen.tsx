import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import {
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

  // TODO: api -> get users
  const testData = [
    "Test 1",
    "Test 2",
    "Test 3",
    "Test 4",
    "Test 5",
    "Test 6",
    "Test 7",
    "Test 8",
    "Test 9",
    "Test 10",
    "Test 11",
    "Test 12",
    "Test 13",
    "Test 14",
    "Test 15",
    "Test 16",
    "Test 17",
    "Test 18",
    "Test 19",
    "Test 20",
  ];

  const searchResults = testData.filter((user) =>
    user.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                // TODO: api -> create user
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
