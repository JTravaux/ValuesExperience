import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font } from '../constants/Styles';
import * as WebBrowser from 'expo-web-browser';
import { useSafeArea } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function EndScreen({ route: { params } }) {
    const insets = useSafeArea();

    return (
        <View style={styles.container}>
            <LinearGradient colors={['rgba(8, 131, 191, 1)', 'rgba(8, 131, 191, 0.65)']} style={{ ...styles.gradient, paddingTop: insets.top + 5, paddingRight: 15, paddingLeft: 15, paddingBottom: insets.top + 5 }}>
                <View style={styles.contentStart}>
                    <Text style={styles.textStyle}>
                        Consider the actions I need to take in my life to live the values of 
                        <Text style={{ fontFamily: font.bold }}>{` ${params.chosenOnes[0]} `}</Text>
                        and <Text style={{ fontFamily: font.bold }}>{` ${params.chosenOnes[1]}`}</Text>.
                    </Text>
                </View>
                
                <TouchableOpacity onPress={async () => await WebBrowser.openBrowserAsync('https://google.com')} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 5}}>
                    <Text style={{ fontFamily: font.regular, color: colors.fontColor, fontSize: 15, textAlign: 'right', marginTop: 10 }}>Submit Feedback&nbsp;</Text>
                    <Icon name="bullhorn" size={15} color="#FFFFFF" /> 
                </TouchableOpacity>
               
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    contentStart: {
        flex: 1,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        justifyContent: 'center'
    },
    textStyle: {
        fontFamily: font.light,
        fontSize: 30,
        color: colors.fontColor,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    gradient: {
        flex: 1
    }
});
