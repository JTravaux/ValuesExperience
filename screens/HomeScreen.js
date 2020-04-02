import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';

export default function HomeScreen({navigation: { navigate } }) {
  return (
    <View style={styles.container}>

      <View style={styles.purposeContainer}>
        <Text style={styles.purpose}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper lectus mi, id ullamcorper sem porttitor ac. In sit amet massa nulla.
          Curabitur molestie eu tellus at tristique. Sed felis nisi, viverra ut magna aliquam, varius sodales est. Morbi in lorem turpis. Donec porttitor risus felis, eu sodales sem ullamcorper sed.
          Ut hendrerit tellus arcu, sed porttitor magna feugiat et. Phasellus molestie velit erat, eget viverra est suscipit et. Maecenas id scelerisque purus.
          Praesent vitae orci at quam efficitur consequat a vitae augue. Phasellus lacinia arcu ipsum, ut commodo mi scelerisque vel.
        </Text>
        <Text style={styles.purpose}>
            Nulla pellentesque congue est, id molestie purus porttitor a. Etiam suscipit id leo a interdum. Nunc eget iaculis risus, non scelerisque nisi.
            Ut consequat a felis id bibendum. Suspendisse viverra neque et egestas fringilla. Vivamus lacus sapien, consectetur euismod purus quis, consectetur lacinia justo.
            Donec a risus ac neque iaculis rutrum vitae eu nunc. Etiam mattis auctor porttitor. Mauris faucibus porta posuere. Vestibulum vel eleifend magna, eget ullamcorper neque.
            Integer id sagittis felis, eu luctus lorem. Sed quis cursus nibh. Phasellus at tempor turpis, sed ornare dolor. Suspendisse mollis ligula in dui mollis tincidunt.
        </Text>
      </View>
    
      <View style={styles.bottomBtns}>
        <Button title="Begin Experience" raised containerStyle={styles.containerStyle} />
        <TouchableOpacity onPress={() => navigate('links')} >
          <Text style={styles.instructionsLink}>View Instructions</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  purpose: {
    margin: '5%'
  },
  containerStyle: {
    width: '60%',
    alignSelf: 'center'
  },
  purposeContainer: {
    flex: 5
  },
  bottomBtns: {
    flex: 1
  },
  instructionsLink: {
    color: '#239BF9',
    textAlign: 'center',
    marginTop: 10
  }
});
