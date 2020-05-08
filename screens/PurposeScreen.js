import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { colors, font } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeArea } from 'react-native-safe-area-context';
import * as Amplitude from 'expo-analytics-amplitude';

// For development only, will be moved eventually
const VERSION = "Beta: 0.1.0";

const backgroundText = [
  "Values motivate and guide us to behave at our best.",
  "We invite you to explore your values and reflect on what is really important to you.",
  "The Value Experience will assist you in identifying your top 2 primary values.  It will provide you with some self reflection and action items so you can live your most fulfilled life."
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
            <Text style={{ textAlign: 'center', color: '#CACACA' }}>{VERSION}</Text>
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
