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

export type RootStackParamList = {
  SelectionScreen: undefined;
  DeviceLoginScreen: undefined;
  AdminScreen: undefined;
  CassetteSelectionScreen: undefined;
  ConsumerScreen: undefined;
};

type PersistStore = {
  deviceId: string | null;
  deviceHash: string | null;
  setDeviceId: Function;
  setDeviceHash: Function;
};

export const usePersistStore = create(
  persist<PersistStore>(
    (set, get) => ({
      deviceId: "",
      deviceHash: "",
      setDeviceId: (newId: string) => set({ deviceId: newId }),
      setDeviceHash: (newHash: string) => set({ deviceHash: newHash }),
    }),
    {
      name: "medikamentenausgabe",
      storage: createJSONStorage(() => localStorage),
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
              animationEnabled: true,
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
