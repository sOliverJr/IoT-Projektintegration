import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar, StyleSheet } from "react-native";
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
import { COLORS } from "./src/colors";
import UserSelectionScreen from "./src/screens/userSelectionScreen";
import AdminSelectionScreen from "./src/screens/adminSelectionScreen";
import AdminMessageScreen from "./src/screens/adminMessageScreen";

export type RootStackParamList = {
  SelectionScreen: undefined;
  DeviceLoginScreen: undefined;
  AdminSelectionScreen: undefined;
  AdminScreen: { cassetteId: string };
  AdminMessageScreen: { user: string | null };
  CassetteSelectionScreen: undefined;
  ConsumerScreen: undefined;
  AddCassetteScreen: undefined;
  UserSelectionScreen: { setUser: (user: string) => void, allowCreateUser: boolean };
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
        <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
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
            <Stack.Screen
              name="AdminSelectionScreen"
              component={AdminSelectionScreen}
            />
            <Stack.Screen
              name="AdminMessageScreen"
              component={AdminMessageScreen}
            />
            <Stack.Screen
              name="UserSelectionScreen"
              component={UserSelectionScreen}
            />
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
