import * as React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ValueCard from '../components/ValueCard';
import { colors, font } from '../constants/Styles';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Multisetp from '../components/MultiStep'
import { useSafeArea } from 'react-native-safe-area-context';

const allSteps = [
  { name: "Question 1", component: props => <ReflectionQuestion question="Do these reflect me at at my best?" {...props} /> },
  { name: "Question 2", component: props => <ReflectionQuestion question="When faced with difficult decision do these values guide my decision making?" {...props} /> },
  { name: "Question 3", component: props => <ReflectionQuestion question="Am I currently living these values?" {...props}/> },
  { name: "Question 4", component: props => <ReflectionQuestion question="What happens when these values are not being honoured?" {...props}/> },
  { name: "Question 5", component: props => <ReflectionQuestion question="What behaviours of mine support these values?" {...props}/> },
  { name: "Question 6", component: props => <ReflectionQuestion question="What behaviours of mine run counter to these values?" {...props}/> },
  
];
export default function DebriefScreen({ navigation, route }) {
  const insets = useSafeArea();

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior='padding'>
      <View style={styles.container}>
        
        <LinearGradient colors={['rgba(8, 131, 191, 1)', 'rgba(8, 131, 191, 0.65)']} style={{ ...styles.gradient, paddingTop: insets.top + 5, paddingRight: 15, paddingLeft: 15, paddingBottom: insets.top + 5}}>
          <View style={styles.contentStart}>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.titleStyle}>Reflection</Text>
            </View>

            <View style={{margin: 10, flexDirection: 'row', justifyContent: 'space-evenly'}}>
              {route.params?.chosenOnes.map(chosenCard => <ValueCard width={145} height={205} card={chosenCard} key={"card_" + chosenCard.id} shadowOpacity={0.86} borderRadius={20}/>)}
            </View>

            <Multisetp 
              style={{ marginTop: 10 }} 
              steps={allSteps}
              comeInOnNext="fadeInRight"
              OutOnNext="fadeOutLeft"
              comeInOnBack="fadeInLeft"
              OutOnBack="fadeOutRight"
            />
          </View>
          <Button onPress={() => navigation.goBack()} title="Back to Values" containerStyle={styles.btnContainer} buttonStyle={styles.buttonStyle} titleStyle={styles.btnText} />

        </LinearGradient>

      </View>
    </KeyboardAvoidingView>
   
  );
}

const ReflectionQuestion = props => 
<View style={styles.reflectionCard}>
  <Text style={styles.reflectionQ}>{props.question}</Text>
  <View style={styles.bottomButtons}>
      <Button buttonStyle={styles.buttons} onPress={() => props.back()} icon={props.currentStep !== 0 ? <Icon name="arrow-circle-left" size={50} color="#FFFFFF" /> : null} />
      <Text style={styles.stepText}>{props.currentStep + 1}/{props.totalSteps + 1}</Text>
      <Button buttonStyle={styles.buttons} onPress={() => props.next()} icon={props.currentStep !== props.totalSteps ? <Icon name="arrow-circle-right" size={50} color="#FFFFFF" /> : null} />
     
  </View>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
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
    padding: 20
  },
  question: {
    marginBottom: 10,
    fontFamily: font.regular,
    color: colors.fontColor
  },
  buttonStyle: {
    borderRadius: 25,
    backgroundColor: colors.mainBtnColor
  },
  btnContainer: {
    width: '80%',
    marginTop: 20,
    alignSelf: 'center'
  },
  btnText: {
    fontFamily: font.semibold,
    fontSize: 20
  },

  // Styles for reflection question
  reflectionCard: {
    margin: 20,
    flex: 1,
  },
  reflectionQ: {
    fontFamily: font.regular,
    fontSize: 30,
    textAlign: 'center',
    color: colors.fontColor,
    marginTop: 30
  },
  bottomButtons: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: 10
  },
  buttons: {
    alignItems: 'center',
    justifyContent: 'center',

    width: 65,
    height: 65,
    backgroundColor: 'transparent',
    borderRadius: 50,
  },
  stepText: {
    fontFamily: font.regular,
    color: colors.fontColor,
    marginBottom: 20
  }
  
});
