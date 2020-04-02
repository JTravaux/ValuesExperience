import * as React from 'react';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import LinksScreen from './screens/LinksScreen';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();
        await Font.loadAsync({...Ionicons.font,'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf')});
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen)
    return null;
  else 
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Purpose" headerMode="screen">
          <Stack.Screen name="purpose" component={HomeScreen} options={{ headerTitle: 'Purpose & Background' }} />
          <Stack.Screen name="links" component={LinksScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}