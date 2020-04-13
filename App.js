import * as React from 'react';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PurposeScreen from "./screens/PurposeScreen";
import InstructionScreen from "./screens/InstructionScreen"
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PlayScreen from './screens/PlayScreen';
import DebriefScreen from './screens/DebriefScreen';
import EndScreen from './screens/EndScreen';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAsync() {
      try {
        SplashScreen.preventAutoHide();
        await Font.loadAsync({ ...Ionicons.font, 'lato': require('./assets/fonts/Lato-Regular.ttf') });
        await Font.loadAsync({ ...Ionicons.font, 'lato-bold': require('./assets/fonts/Lato-Bold.ttf') });
        await Font.loadAsync({ ...Ionicons.font, 'lato-semibold': require('./assets/fonts/Lato-Semibold.ttf') });
        await Font.loadAsync({ ...Ionicons.font, 'lato-light': require('./assets/fonts/Lato-Light.ttf') });
        await Font.loadAsync({ ...Ionicons.font, 'harring': require('./assets/fonts/harring.ttf') });

      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen)
    return null;
  else 
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Purpose" headerMode="screen">
            <Stack.Screen name='purpose' component={PurposeScreen} options={{ headerShown: false }} />
            <Stack.Screen name='instructions' component={InstructionScreen} options={{ headerShown: false }} />
            <Stack.Screen name='play' component={PlayScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name='debrief' component={DebriefScreen} options={{ headerShown: false }} />
            <Stack.Screen name='end' component={EndScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
}