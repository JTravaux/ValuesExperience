import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { colors, font } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';

export default function PurposeScreen({navigation: { navigate } }) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(8, 131, 191, 1)', 'rgba(8, 131, 191, 0.65)']} style={styles.gradient}>
        <View style={styles.contentStart}>

          <View style={styles.purposeContainer}>
            <Text style={{ ...styles.purpose, ...styles.titleStyle,  textAlign: 'center' }}>Background</Text>

            <Text style={styles.purpose}>
              Values are principles or standards of behaviour.
            </Text>

            <Text style={styles.purpose}>
              In order to live our values it requires some up front work.  It requires us to go inward and be contemplative which is not always easy.  
              It’s easy to dismiss them as not important.  In reality in order to live a whole life we need to explore and identify the primary values that drive us.
            </Text>

            <Text style={styles.purpose}>
              We only have one set of values for ourselves.  Not work values  and family values and ...
            </Text>

            <Text style={styles.purpose}>
              Our values need to be so clear in our mind that they don’t feel like a choice that are simply a definition of who we are in our lives.
            </Text>

            <Text style={styles.purpose}>
              Tieing behaviours and actions to values.  When we act against our values it feels wrong/uncomfortable.  When we act in accordance with our values it feels right/good.
            </Text>

            <Text style={styles.purpose}>
              Research shows that when we identify our primary values we really can manage 2-3 in our consciousness and not 10-15 at once.  
              Something - we may identify with 10 values but really only a small number are primary.   
            </Text>
          
          </View>

          <View style={styles.bottomBtns}>
            <Button onPress={() => navigate('instructions')} title="Next" raised activeOpacity={0.7} containerStyle={styles.btnContainer} buttonStyle={styles.buttonStyle} titleStyle={styles.btnText} />
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
    padding: 20, 
    alignItems: 'center'
  },
  purpose: {
    margin: 10,
    fontFamily: font.regular,
    color: colors.fontColor,
    textAlign: 'center'
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
