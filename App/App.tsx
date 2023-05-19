import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DeviceLoginScreen from "./src/screens/loginScreen";
import SelectionScreen from "./src/screens/selectionScreen";
import AdminScreen from "./src/screens/adminScreen";
import ConsumerScreen from "./src/screens/consumerScreen";
import CassetteSelectionScreen from "./src/screens/cassetteSelectionScreen";

export type RootStackParamList = {
  SelectionScreen: undefined;
  DeviceLoginScreen: undefined;
  AdminScreen: undefined;
  CassetteSelectionScreen: undefined;
  ConsumerScreen: undefined;
};

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
