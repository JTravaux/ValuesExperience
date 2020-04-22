import * as React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { colors, font } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeArea } from 'react-native-safe-area-context';
import { game_instructions } from '../Instructions';
import * as Amplitude from 'expo-analytics-amplitude';


export default function InstructionScreen({ navigation: { navigate } }) {
    const insets = useSafeArea();

    React.useEffect(() => {
        Amplitude.logEvent("Visited Instructions Screen")
    }, [])

    return (
        <View style={styles.container}>
            <LinearGradient colors={['rgba(8, 131, 191, 1)', 'rgba(8, 131, 191, 0.65)']} style={{ ...styles.gradient, paddingTop: insets.top + 5, paddingRight: 15, paddingLeft: 15, paddingBottom: insets.top + 5 }}>
                <View style={styles.contentStart}>

                    <View style={styles.purposeContainer}>
                        <Text style={{ ...styles.instruction, ...styles.titleStyle, textAlign: 'center' }}>Instructions</Text>

                        <Text style={styles.instruction}>The Values Experience is a guided tour to help you identify the values you hold most dear.</Text>
                        <FlatList
                            scrollEnabled={false}
                            style={{ marginTop: 20 }}
                            data={game_instructions}
                            renderItem={({ item }) => <Text style={styles.instructionPoint}>{item}</Text>}
                            keyExtractor={(item, idx) => "instruction_" + idx}
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
        fontSize: 16,
        fontFamily: font.regular,
        color: colors.fontColor,
        textAlign: 'center'
    },
    instructionPoint: {
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