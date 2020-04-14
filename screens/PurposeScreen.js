import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { colors, font } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeArea } from 'react-native-safe-area-context';
import * as Amplitude from 'expo-analytics-amplitude';

const backgroundText = [
    "Values are your personal standards of behavior and what you hold dear. These are applied equally across all facets of your life and heavily impact your experiences.",
    "Exploring one's values requires much introspection and personal contemplation in order to identify the primary values that motive, direct and fulfill us. Before we can begin to adjust our actions to align with our values we first need to clearly identify what those values are.",
    "This app is designed to assist you in identifying your own personal values and giving you some prompts to reflect on them."
]

export default function PurposeScreen({navigation: { navigate } }) {
  const insets = useSafeArea();

  React.useEffect(() => {
    Amplitude.logEvent("Visited Background Screen")
  }, [])

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(8, 131, 191, 1)', 'rgba(8, 131, 191, 0.65)']} style={{...styles.gradient, paddingTop: insets.top + 5, paddingRight: 15, paddingLeft: 15, paddingBottom: insets.top + 5}}>
        <View style={styles.contentStart}>

          <View style={styles.purposeContainer}>
            <Text style={{ ...styles.purpose, ...styles.titleStyle,  textAlign: 'center' }}>Background</Text>
            {backgroundText.map((txt, idx) => <Text style={styles.purpose} key={idx}>{txt}</Text>)}
          </View>

          <View style={styles.bottomBtns}>
            <Button onPress={() => navigate('instructions')} title="Next" raised activeOpacity={0.7} containerStyle={styles.btnContainer} buttonStyle={styles.buttonStyle} titleStyle={styles.btnText} />
            <Text style={{ textAlign: 'center', color: '#CACACA'}}>Alpha: 0.0.2</Text>
          </View>

        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentStart: {
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  gradient: {
    flex: 1, 
    alignItems: 'center'
  },
  purpose: {
    fontSize: 16,
    margin: 10,
    fontFamily: font.regular,
    color: colors.fontColor,
    textAlign: 'justify'
  },
  titleStyle: {
    fontFamily: font.semibold,
    fontSize: 40,
  },
  buttonStyle: {
    borderRadius: 25,
    backgroundColor: colors.mainBtnColor
  },
  btnContainer: {
    width: '80%',
    margin: 10,
    alignSelf: 'center'
  },
  purposeContainer: {
    flex: 5,
  },
  bottomBtns: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  },
  instructionsLink: {
    color: '#239BF9',
    textAlign: 'center',
    marginTop: 15
  }, 
  btnText: {
    fontFamily: font.semibold, 
    fontSize: 20
  },
  smallBtnContainer: {
    width: '40%',
    alignSelf: 'center'
  }, 
  smallBtnText: {
    fontFamily: font.semibold,
    fontSize: 16
  }
});
