import * as React from 'react';
import { StyleSheet, Text, View  } from 'react-native';
import { Button } from 'react-native-elements';
import { colors, font } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';

export default function Phase1InstructionPage({ navigation: { navigate } }) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(8, 131, 191, 1)', 'rgba(8, 131, 191, 0.65)']} style={styles.gradient}>
        <View style={styles.contentStart}>
        

          <View style={styles.instructionsContainer}>
              <Text style={{ ...styles.instructionsText, ...styles.titleStyle, marginBottom: 0, textAlign: 'left' }}>Phase One</Text>
            <Text style={{ ...styles.instructionsText, ...styles.titleStyle, marginTop: 0, textAlign: 'right' }}>Instructions</Text>
            <Text style={styles.instructionsText}>You are about to see 22 cards which have common values for life. From the 22, your task is to choose 12 which resonate and leap out at you.</Text>
          </View>

          <View style={styles.footer}>
            <Button title="Continue to Phase One" raised onPress={() => navigate('play', { id: 1, title: 'Phase One', numToChoose: 10, totalCards: 22 })} containerStyle={styles.btnContainer} buttonStyle={styles.btnStyle} titleStyle={styles.btnText} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }, 
  contentStart: {
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  titleStyle: {
    fontFamily: font.semibold,
    fontSize: 40,
  },
  gradient: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,

    alignItems: 'center'
  },
  instructionsContainer: {
    flex: 5,
  },
  instructionsText: {
    margin: 10,
    fontFamily: font.regular,
    color: colors.fontColor,
    textAlign: 'center'
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '5%'
  }, 
  btnContainer: {
    width: '60%',
    alignSelf: 'center',
  },
  btnStyle: {
    borderRadius: 25,
    backgroundColor: colors.mainBtnColor
  },
  btnText: {
    fontFamily: font.semibold
  }
});
