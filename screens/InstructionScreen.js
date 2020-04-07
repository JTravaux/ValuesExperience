import * as React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { colors, font } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';

const instructions = [
  { id: 0, instruction: 'Each value is represented by a digital card'},
  { id: 1, instruction: 'Swipe left or right through the cards ' },
  { id: 2, instruction: 'For values which resonate most with you slide them down into the area labeled "My Values"' },
  { id: 3, instruction: 'You can return cards for consideration by sliding them out of the "My Values" area' },
  { id: 4, instruction: 'Tap a card to toggle more detailed descriptions' },
  { id: 5, instruction: 'Once you’ve filled the My Values area a "Continue" button will appear to progress to the next activity' },
  { id: 6, instruction: 'Blank card...' },
]

export default function InstructionScreen({ navigation: { navigate } }) {

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(8, 131, 191, 1)', 'rgba(8, 131, 191, 0.65)']} style={styles.gradient}>
        <View style={styles.contentStart}>

          <View style={styles.purposeContainer}>
            <Text style={{ ...styles.instruction, ...styles.titleStyle, textAlign: 'center' }}>Instructions</Text>

            <Text style={styles.instruction}>The Values Experience is a guided tour to help you identify the values you hold most dear.</Text>
            <FlatList 
              scrollEnabled={false}
              style={{marginTop: 20}}
              data={instructions} 
              renderItem={({ item }) => <Text style={styles.instructionPoint}>{`\u2022 ${item.instruction}`}</Text>}
              keyExtractor={item => "instruction_" + item.id}
            />
          </View>

          <View style={styles.bottomBtns}>
            <Button onPress={() => navigate('play', { id: 1, title: 'Phase One', numToChoose: 10, totalCards: 22 })} title="Begin" raised activeOpacity={0.7} containerStyle={styles.btnContainer} buttonStyle={styles.buttonStyle} titleStyle={styles.btnText} />
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
  gradient: {
    flex: 1,
    padding: 20,
    alignItems: 'center'
  },
  instruction: {
    margin: 10,
    fontFamily: font.regular,
    color: colors.fontColor,
    textAlign: 'center'
  },
  instructionPoint: {
    margin: 10,
    fontFamily: font.regular,
    color: colors.fontColor,
    textAlign: 'left'
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
