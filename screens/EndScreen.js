//Emoji's from: https://unicode.org/emoji/charts/full-emoji-list.html

import * as React from 'react';
import { StyleSheet, Text, View, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font } from '../constants/Styles';
import { useSafeArea } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Amplitude from 'expo-analytics-amplitude';
import * as Animatable from 'react-native-animatable';
import { Input, CheckBox, Button  } from 'react-native-elements';
import Modal, {ModalContent, SlideAnimation } from 'react-native-modals';

export default function EndScreen({ route, navigation }) {
    const insets = useSafeArea();

    const [rating, setRating] = React.useState(-1)
    const [showEmail, setShowEmail] = React.useState(false)
    const [feedbackTitle, setFeedbackTitle] = React.useState("How was your values experience?")
    const [moreToSayTitle, setMoreToSayTitle] = React.useState("Have more to say?")
    const [feedback, setFeedback] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [errMsg, setErrMsg] = React.useState("")
    const [moreToSay, setMoreToSay] = React.useState(false)
    const [moreToSayDone, setMoreToSayDone] = React.useState(false)
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
        }
        else {
            setRating(idx)
            setFeedbackTitle("Thank you for your feedback!")
            Amplitude.logEventWithProperties("Left Feedback", { rating: idx })
        }
    }

    const Emoji = props => {
        return (
            <Animatable.View useNativeDriver animation={props.animation} duration={animate ? 700 : 1}>
                <TouchableOpacity onPress={() => props.readonly ? null : changeFeedback(props.value)}>
                    <Text style={props.value === rating ? styles.emoji_on : (rating === -1 ? styles.emoji_on : styles.emoji_off)}>{props.emoji}</Text>
                </TouchableOpacity>
            </Animatable.View>
        )
    }

    const renderSelection = () => {
        switch(rating){
            case 1:
                return "😡";
            case 2:
                return "😟";
            case 3:
                return "😐";
            case 4:
                return "😃";
            case 5:
                return "🥰";
        }
    }

    const submitFeedbackResponse = () => {
        setErrMsg("")
        if (feedback.length === 0) {
            setErrMsg("Your feedback is empty.")
            return;
        }
        if(showEmail && email.length === 0) {
            setErrMsg("Please enter your email address.")
            return;
        }

        Amplitude.logEventWithProperties("Left Feedback Expanded", { feedback, email }).then(val => {
            Keyboard.dismiss();
            setMoreToSayTitle("Your feedback has been sent.")
            setMoreToSayDone(true)
            setMoreToSay(false)
        })
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['rgba(8, 131, 191, 1)', 'rgba(8, 131, 191, 0.65)']} style={{ ...styles.gradient, paddingTop: insets.top + 5, paddingBottom: insets.top + 5 }}>
                
                {/* Main Content */}
                <View style={styles.contentStart}>
                    <View style={{ flex: 1, marginTop: 10 }}>
                        <Text style={styles.titleStyle}>Action</Text>
                    </View>

                    <View style={{flex: 1.7, justifyContent: 'space-between'}}>
                        <Text style={styles.textStyle}>
                            What do I need to do today to ensure alignment of my values of
                            <Text style={{ fontFamily: font.bold }}>{` ${route.params.chosenOnes[0]} `}</Text>and
                            <Text style={{ fontFamily: font.bold }}>{` ${route.params.chosenOnes[1]}`}</Text>?
                        </Text>
                   
                        <TouchableOpacity activeOpacity={0.3} onPress={() => navigation.navigate('purpose')}>
                            <Text style={styles.textStyleSM}>Restart Experience</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Feedback */}
                <Text style={styles.feedbackTitle}>{feedbackTitle}</Text>
                {rating !== -1 && (
                    <Animatable.View useNativeDriver animation="zoomIn" easing="ease-in-sine" duration={200}>
                        <TouchableOpacity onPress={() => moreToSayDone ? null : setMoreToSay(true)}>
                            <Text style={styles.moreToSay}>{moreToSayTitle}</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                )}

                {rating === -1 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', margin: 5 }}>
                        <Emoji emoji="😡" value={1} animation="fadeInLeft" />
                        <Emoji emoji="😟" value={2} animation="fadeInDown" />
                        <Emoji emoji="😐" value={3} animation="fadeIn" />
                        <Emoji emoji="😃" value={4} animation="fadeInDown" />
                        <Emoji emoji="🥰" value={5} animation="fadeInRight" />
                    </View>
                )}

                {rating !== -1 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', margin: 5 }}>
                        <Emoji emoji={renderSelection()} readonly/>
                    </View>
                )}

            </LinearGradient>

            <Modal.BottomModal
                height={Platform.OS === 'ios' ? 0.9 : 0.6}
                visible={moreToSay}
                overlayOpacity={0.85}
                swipeThreshold={100}
                onTouchOutside={onClose}
                modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
                onSwipeOut={onClose}
            >
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : ""}>
                    <Text style={{ fontFamily: font.bold, color: colors.fontColor, fontSize: 25, textAlign: 'center', backgroundColor: '#0883BF', paddingTop: 5 }}>Send us your Feedback</Text>
                    <ModalContent style={{ backgroundColor: '#0883BF', height: '95%', justifyContent: 'space-between' }}>
                        <View>
                            <Input
                                blurOnSubmit={true}
                                returnKeyType="go"
                                label="Feedback"
                                containerStyle={styles.feedbackContainer}
                                labelStyle={styles.feedbackInputLabel}
                                inputContainerStyle={styles.feedbackInputContainer}
                                inputStyle={{ color: '#FFFFFF' }}
                                multiline
                                placeholder='Enter your feedback'
                                maxLength={256}
                                numberOfLines={3}
                                value={feedback}
                                onChangeText={text => {
                                    setErrMsg("")
                                    setFeedback(text)
                                }}
                            />

                            {showEmail && (
                                <Input
                                    blurOnSubmit={true}
                                    returnKeyType="go"
                                    keyboardType="email-address"
                                    label="Email Address"
                                    containerStyle={styles.feedbackContainer}
                                    labelStyle={styles.feedbackInputLabel}
                                    inputContainerStyle={styles.feedbackInputContainer}
                                    inputStyle={{ color: '#FFFFFF' }}
                                    placeholder='Enter your email address'
                                    value={email}
                                    onChangeText={text => {
                                        setErrMsg("")
                                        setEmail(text)
                                    }}
                                />
                            )}
                        </View>

                        <View>
                            <CheckBox
                                center
                                title='I would like to discuss this feedback.'
                                checked={showEmail}
                                checkedColor="white"
                                uncheckedColor="white"
                                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                                textStyle={{ color: '#FFFFFF' }}
                                onPress={() => {
                                    setErrMsg("")
                                    setShowEmail(!showEmail)
                                }}
                            />
                            <Button title="Submit" containerStyle={styles.btnContainer} buttonStyle={styles.buttonStyle} titleStyle={styles.btnText} onPress={submitFeedbackResponse} />
                            <Text style={{ textAlign: 'center', fontFamily: font.regular, color: '#DC0000', paddingBottom: Platform.OS === 'ios' ? 25 : 0 }}>{errMsg}</Text>
                            <Text style={{ textAlign: 'center', fontFamily: font.light, color: colors.fontColor, paddingBottom: insets.bottom + 10 }}>(swipe down to dismiss)</Text>
                        </View>

                    </ModalContent>
                </KeyboardAvoidingView>
            </Modal.BottomModal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    titleStyle: {
        fontFamily: font.semibold,
        fontSize: 40,
        color: colors.fontColor,
        textAlign: 'center'
    },
    feedbackInputLabel: {
        color: colors.fontColor, 
        fontFamily: font.bold,
    },
    feedbackContainer: {
        borderColor: colors.fontColor,
        borderWidth: 0, 
        padding: 5
    },
    feedbackInputContainer: {
        borderBottomWidth: 0
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
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    textStyle: {
        fontFamily: font.light,
        fontSize: 30,
        color: colors.fontColor,
        textAlign: 'center'
    },
    textStyleSM: {
        fontFamily: font.light,
        fontSize: 15,
        color: colors.fontColor,
        textAlign: 'center',
        margin: 20,
        textDecorationLine: 'underline'
    },
    gradient: {
        flex: 1,
        paddingRight: 15, 
        paddingLeft: 15,
    },
    buttonStyle: {
        borderRadius: 25,
        backgroundColor: colors.mainBtnColor
    },
    btnContainer: {
        width: '85%',
        marginBottom: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#FFF'
    },
    btnText: {
        fontFamily: font.semibold,
        fontSize: 20
    }
});
