import * as React from 'react';
import { StyleSheet, Text, View  } from 'react-native';
import { Button } from 'react-native-elements';
import { colors, font } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';

export default function Phase2InstructionPage({ navigation, route }) {
  
  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(8, 131, 191, 1)', 'rgba(8, 131, 191, 0.65)']} style={styles.gradient}>
        <View style={styles.contentStart}>
        

          <View style={styles.instructionsContainer}>
              <Text style={{ ...styles.instructionsText, ...styles.titleStyle, marginBottom: 0, textAlign: 'left' }}>Phase Two</Text>
            <Text style={{ ...styles.instructionsText, ...styles.titleStyle, marginTop: 0, textAlign: 'right' }}>Instructions</Text>
            <Text style={styles.instructionsText}>From 10, choose 5 which you could do without (i.e., there is a negotiable factor here) - you could go a couple of years and still be happy and relatively satisfied in your life.  Put these four aside.</Text>
          </View>

          <View style={styles.footer}>
            <Button title="Continue to Phase Two" raised onPress={() => navigation.navigate('play', { id: 2, title: 'Phase Two', numToChoose: 5, totalCards: 10 })} containerStyle={styles.btnContainer} buttonStyle={styles.btnStyle} titleStyle={styles.btnText} />
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
