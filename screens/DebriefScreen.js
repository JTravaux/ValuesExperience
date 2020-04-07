import * as React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { cards } from '../constants/Cards';
import ValueCard from '../components/ValueCard';
import { Input } from "react-native-elements";
import { colors, font } from '../constants/Styles';

export default function DebriefScreen({ navigation, route }) {

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior='padding'>
      <View style={styles.container}>
        
        <LinearGradient colors={['rgba(8, 131, 191, 1)', 'rgba(8, 131, 191, 0.65)']} style={styles.gradient}>
          <View style={styles.contentStart}>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.titleStyle}>Debriefing</Text>
            </View>

            <View style={{margin: 10, flexDirection: 'row', justifyContent: 'space-evenly'}}>
              {route.params?.chosenOnes.map(chosenCard => {
                const card = cards.find(c => c.id === chosenCard)
                return <ValueCard width={100} height={140} front={card.front} back={card.back} key={"card_" + card.id} shadowOpacity={0.86}/>
              })}
            </View>

            <ScrollView style={{ marginTop: 10 }}>
              <DebriefQuestion q={1} question="How much are you currently living these five core values at work/personal life?" />
              <DebriefQuestion q={2} question="What are you currently doing when these are being compromised?" />
              <DebriefQuestion q={3} question="What is the effect of this on you and other significant people within your life?  How does this make you feel?" />
              <DebriefQuestion q={4} question="What values are you currently demonstrating through your leadership?" />
              <DebriefQuestion q={5} question="Identify 1-2 important actions to address the values you are not currently living sufficiently in your life?" />
            </ScrollView>
          </View>
        </LinearGradient>

      </View>
    </KeyboardAvoidingView>
   
  );
}

const DebriefQuestion = props => 
<Input
  multiline
  ref={props.q_ref}
  blurOnSubmit={true}
  returnKeyType='next'
  selectionColor="#FFF"
  placeholderTextColor='#FFF'
  inputStyle={styles.textInput}
  placeholder="Your response..."
  labelStyle={styles.questionLabel}
  label={`${props.q}. ${props.question}`}
  inputContainerStyle={styles.questionInputContainer}
/>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  contentStart: {
    flex: 1,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  titleStyle: {
    fontFamily: font.semibold,
    fontSize: 40,
    color: colors.fontColor,
    textAlign: 'center'
  },
  gradient: {
    flex: 1,
    padding: 25
  },
  question: {
    marginBottom: 10,
    fontFamily: font.regular,
    color: colors.fontColor
  },
  scroller: {
    margin: 10
  },
  input: {
    borderColor: '#FFF',
    fontSize: 10
  },

  // Styles for question
  questionLabel: {
    fontFamily: font.regular,
    color: colors.fontColor,
    marginBottom: 10
  },
  question: {
    marginBottom: 10,
    fontFamily: font.semibold,
    color: colors.fontColor
  },
  textInput: {
    color: colors.fontColor,
    fontFamily: font.light,
    fontSize: 14,
    marginLeft: 10,
    marginRight: 10,
    padding: 5
  },
  questionInputContainer: {
    borderBottomColor: '#FFF',
    borderBottomWidth: 0,
    marginBottom: 100
  }
});
