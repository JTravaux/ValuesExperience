//Emoji's from: https://unicode.org/emoji/charts/full-emoji-list.html

import * as React from 'react';
import { StyleSheet, Text, View, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font } from '../constants/Styles';
import { useSafeArea } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Amplitude from 'expo-analytics-amplitude';
import * as Animatable from 'react-native-animatable';
import { Input, CheckBox  } from 'react-native-elements';
import Modal, {ModalContent, SlideAnimation } from 'react-native-modals';

export default function EndScreen({ route: { params } }) {
    const insets = useSafeArea();

    const [rating, setRating] = React.useState(-1)
    const [showEmail, setShowEmail] = React.useState(false)
    const [feedbackTitle, setFeedbackTitle] = React.useState("How was your values experience?")
    const [moreToSayTitle, setMoreToSayTitle] = React.useState("Have more to say?")
    const [moreToSay, setMoreToSay] = React.useState(false)
    const [animate, setAnimate] = React.useState(true)

    React.useEffect(() => {
        Amplitude.logEvent("Visited Final Values In Action")   
    }, [])

    const onClose = () => {
        Keyboard.dismiss()
        setMoreToSay(false)
    }
    const changeFeedback = idx => {
        setAnimate(false) // We don't want the animation EVERY render. Just on enter.

        if (rating === idx) {
            setRating(-1)
            setFeedbackTitle("How was your values experience?")
            Amplitude.logEvent("Cleared Feedback")
        }
        else {
            setRating(idx)
            setFeedbackTitle("Thank you for your feedback!")
            Amplitude.logEventWithProperties("Left Feedback", { rating })
        }
    }

    const Emoji = props => {
        return (
            <Animatable.View useNativeDriver animation={props.animation} duration={animate ? 700 : 1}>
                <TouchableOpacity onPress={() => changeFeedback(props.value)}>
                    <Text style={props.value === rating ? styles.emoji_on : (rating === -1 ? styles.emoji_on : styles.emoji_off)}>{props.emoji}</Text>
                </TouchableOpacity>
            </Animatable.View>
          
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
                {/* {rating !== -1 && (
                    <Animatable.View useNativeDriver animation="zoomIn" easing="ease-in-sine" duration={200}>
                        <TouchableOpacity onPress={() => setMoreToSay(true)}>
                            <Text style={styles.moreToSay}>{moreToSayTitle}</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                )} */}

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', margin: 5 }}>
                    <Emoji emoji="😡" value={1} animation="fadeInLeft" />
                    <Emoji emoji="😟" value={2} animation="fadeInDown" />
                    <Emoji emoji="😐" value={3} animation="fadeIn" />
                    <Emoji emoji="😃" value={4} animation="fadeInDown" />
                    <Emoji emoji="🥰" value={5} animation="fadeInRight" />
                </View>

            </LinearGradient>

            <Modal.BottomModal
                height={0.8}
                visible={moreToSay}
                overlayOpacity={0.85}
                swipeThreshold={100}
                onTouchOutside={onClose}
                modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
                onSwipeOut={onClose}
            >
                <Text style={{ fontFamily: font.bold, color: colors.fontColor, fontSize: 25, textAlign: 'center', backgroundColor: '#0883BF', paddingTop: 5 }}>Send us your Feedback</Text>
                <ModalContent style={{ backgroundColor: '#0883BF', height: '95%', justifyContent: 'space-between' }}>
                    <Input 
                        blurOnSubmit={true}
                        returnKeyType="go"
                        label="Feedback" 
                        containerStyle={styles.feedbackContainer}
                        labelStyle={styles.feedbackInputLabel} 
                        inputContainerStyle={styles.feedbackInputContainer}
                        // inputStyle={{color: colors.fontColor}}
                        multiline 
                        placeholder='Enter your feedback...' 
                        maxLength={256}
                        numberOfLines={3}
                    />
                    <CheckBox
                        title='I would like to discuss this feedback.'
                        checked={showEmail}
                        onPress={() => setShowEmail(!showEmail)}
                    />
                    <Text style={{ textAlign: 'center', fontFamily: font.light, color: colors.fontColor, paddingBottom: insets.bottom + 10 }}>(swipe down to dismiss)</Text>
                </ModalContent>
            </Modal.BottomModal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    feedbackInputLabel: {
        color: colors.fontColor, 
        fontFamily: font.regular
    },
    feedbackContainer: {
        borderColor: colors.fontColor,
        borderWidth: 1, 
        padding: 5
    },
    feedbackInputContainer: {
        borderBottomWidth: 0,
        color: colors.fontColor
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
        marginBottom: 0,
        fontFamily: font.semibold,
        color: colors.fontColor,
        textAlign: 'center'
    },
    moreToSay: {
        fontSize: 15,
        margin: 5,
        fontFamily: font.regular,
        color: colors.fontColor,
        textAlign: 'center',
        textDecorationLine: 'underline'
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
