//Emoji's from: https://unicode.org/emoji/charts/full-emoji-list.html

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font } from '../constants/Styles';
import * as WebBrowser from 'expo-web-browser';
import { useSafeArea } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Amplitude from 'expo-analytics-amplitude';



export default function EndScreen({ route: { params } }) {
    const insets = useSafeArea();

    const [feedback, setFeedback] = React.useState(-1)
    const [feedbackTitle, setFeedbackTitle] = React.useState("How was your values experience?")

    React.useEffect(() => {
        Amplitude.logEvent("Visited Final Values In Action")
    }, [])

    const changeFeedback = idx => {
        if(feedback === idx) {
            setFeedback(-1)
            setFeedbackTitle("How was your values experience?")
            Amplitude.logEvent("Cleared Feedback")
        }
        else {
            setFeedback(idx)
            setFeedbackTitle("Thank you for your feedback!")
            Amplitude.logEventWithProperties("Left Feedback", { rating: feedback })
        }
    }

    const Emoji = props => {
        return (
            <TouchableOpacity onPress={() => changeFeedback(props.value)}>
                <Text style={props.value === feedback ? styles.emoji_on : (feedback === -1 ? styles.emoji_on : styles.emoji_off)}>{props.emoji}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['rgba(8, 131, 191, 1)', 'rgba(8, 131, 191, 0.65)']} style={{ ...styles.gradient, paddingTop: insets.top + 5, paddingBottom: insets.top + 5 }}>
                
                {/* Main Content */}
                <View style={styles.contentStart}>
                    <Text style={styles.textStyle}>
                        Consider the actions I need to take in my life to live the values of
                        <Text style={{ fontFamily: font.bold }}>{` ${params.chosenOnes[0]} `}</Text>and
                        <Text style={{ fontFamily: font.bold }}>{` ${params.chosenOnes[1]}`}</Text>.
                    </Text>
                </View>

                {/* Feedback */}
                <Text style={styles.feedbackTitle}>{feedbackTitle}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', margin: 5 }}>
                    <Emoji emoji="😡" value={1} />
                    <Emoji emoji="😟" value={2} />
                    <Emoji emoji="😐" value={3} />
                    <Emoji emoji="😃" value={4} />
                    <Emoji emoji="🥰" value={5} />
                </View>

            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    emoji_on: {
        fontSize: 30,
        opacity: 1
    },
    emoji_off: {
        fontSize: 30,
        opacity: 0.3
    },
    feedbackTitle: {
        fontSize: 18,
        margin: 10,
        fontFamily: font.regular,
        color: colors.fontColor,
        textAlign: 'center'
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
        flex: 1,
        paddingRight: 15, 
        paddingLeft: 15,
    }
});
