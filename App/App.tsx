import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AdminScreen from "./src/screens/adminScreen";
import CassetteSelectionScreen from "./src/screens/cassetteSelectionScreen";
import ConsumerScreen from "./src/screens/consumerScreen";
import DeviceLoginScreen from "./src/screens/loginScreen";
import SelectionScreen from "./src/screens/selectionScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddCassetteScreen from "./src/screens/addCassetteScreen";

export type RootStackParamList = {
  SelectionScreen: undefined;
  DeviceLoginScreen: undefined;
  AdminScreen: {cassetteId: string};
  CassetteSelectionScreen: undefined;
  ConsumerScreen: undefined;
  AddCassetteScreen: undefined;
};

type PersistStore = {
  deviceId: string;
  deviceHash: string;
  setDeviceId: (deviceId: string) => void;
  setDeviceHash: (deviceHash: string) => void;
};

export const usePersistStore = create(
  persist<PersistStore>(
    (set, get) => ({
      deviceId: "",
      deviceHash: "",
      setDeviceId: (newId: string) => {
        set((state) => ({ deviceId: newId }));
      },
      setDeviceHash: (newHash: string) => {
        set((state) => ({ deviceHash: newHash }));
      },
    }),
    {
      name: "medikamentenausgabe",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default function App() {
  const Stack = createStackNavigator();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShadowVisible: false,
              animationEnabled: false,
              headerShown: false,
              gestureEnabled: false,
            }}
            initialRouteName="SelectionScreen"
          >
            <Stack.Screen name="SelectionScreen" component={SelectionScreen} />
            <Stack.Screen
              name="DeviceLoginScreen"
              component={DeviceLoginScreen}
            />
            <Stack.Screen name="AdminScreen" component={AdminScreen} />
            <Stack.Screen name="ConsumerScreen" component={ConsumerScreen} />
            <Stack.Screen
              name="CassetteSelectionScreen"
              component={CassetteSelectionScreen}
            />
            <Stack.Screen
              name="AddCassetteScreen"
              component={AddCassetteScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
