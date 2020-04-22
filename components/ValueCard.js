import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Keyboard, View, Dimensions, Image, Platform} from 'react-native';
import CardFlip from 'react-native-card-flip';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font } from '../constants/Styles';
import { Input } from 'react-native-elements';
import * as Amplitude from 'expo-analytics-amplitude';

const bigHeightThresh = Dimensions.get('screen').height / 2;

export default function ValueCard(props) {
    const cardRef = React.useRef();

    const [customFront, setCustomFront] = React.useState(props.card.custom ? props.card.front : '')
    const [customBack, setCustomBack] = React.useState(props.card.custom ? props.card.back : '')
    const [color, setColor] = React.useState(colors.fontColor)

    const resetColor = () => {
        logFlip()
        if (color !== colors.fontColor)
            setTimeout(() => { setColor(colors.fontColor) }, 100)
    }

    const flipToBack = () => {
        if(customFront.length > 0 && props.height === bigHeightThresh)
            props.edit(props.card.id, 'front', customFront)

        cardRef.current.flip()
        Keyboard.dismiss()
    }

    const flipToFront = () => {
        if (customBack.length > 0 && props.height === bigHeightThresh)
            props.edit(props.card.id, 'back', customBack)

        cardRef.current.flip()
        Keyboard.dismiss()
    }

    const logFlip = () => {
        Amplitude.logEventWithProperties("Card Flipped", {   
            card: props.card.custom ? props.card.front : props.card.name, 
            location: props.height === bigHeightThresh ? "Main Deck" : (props.height === 225 ? "No Deck - Reflection" : "My Values Deck") 
        })
    }

    if (props.card.custom) 
        return (
            <CardFlip onFlip={resetColor} style={{ ...styles.customContainer, height: props.height, width: props.width, shadowOpacity: props.shadowOpacity }} flipDirection="x" duration={400} ref={cardRef} {...props} >
                <TouchableOpacity activeOpacity={1} onPress={() => flipToBack()} style={styles.customCard}>
                    <LinearGradient colors={['#c50ae4','#9198e5']} style={{...styles.customCard, padding: 10, justifyContent: 'space-between'}}>
                        {props.height === bigHeightThresh && (<>
                            <Input
                                multiline
                                blurOnSubmit={true}
                                inputStyle={styles.frontText}
                                inputContainerStyle={styles.textFieldContainer}
                                placeholderTextColor={color}
                                value={customFront}
                                placeholder="Custom Value"
                                onFocus={() => setColor("rgba(255,255,255,0.1)")}
                                onBlur={() => setColor(colors.fontColor)}
                                onChangeText={text => setCustomFront(text)}
                                onSubmitEditing={() => props.edit(props.card.id, 'front', customFront)}
                                returnKeyType="done"
                            />
                            <Text style={styles.how}>Tap the title to customize</Text>
                        </>)}

                        {props.height < bigHeightThresh && <Text adjustsFontSizeToFit style={styles.frontTextSmall}>{props.card.front}</Text>}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => flipToFront()} style={styles.customCard}>
                    <LinearGradient colors={['#9198e5', '#c50ae4']} style={{ ...styles.customCard, padding: 10, justifyContent: 'center' }}>
                        {props.height === bigHeightThresh && (<>
                            <View style={{ flex: 10, justifyContent: 'center' }}>
                                <Input
                                    blurOnSubmit={true}
                                    multiline
                                    inputStyle={styles.backText}
                                    inputContainerStyle={styles.textFieldContainer} 
                                    placeholderTextColor={color}
                                    placeholder={Platform.OS === 'ios' ? "Don't see any values that resonate with you? Feel free to use this card to add a custom value." : "Your description..."}
                                    value={customBack}
                                    onFocus={() => setColor("rgba(255,255,255,0.1)")}
                                    onBlur={() => setColor(colors.fontColor)}
                                    onChangeText={txt => setCustomBack(txt)}
                                    onSubmitEditing={() => props.edit(props.card.id, 'back', customBack)}
                                    returnKeyType="done"
                                />
                            </View>

                            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <Text style={styles.how}>Tap the description to customize</Text>
                            </View>
                        </>)}

                        {props.height < bigHeightThresh && <Text style={styles.backTextSmall}>{props.card.back}</Text>}
                    </LinearGradient>
                </TouchableOpacity>
            </CardFlip>
        );
    else
        return (
            <CardFlip onFlip={logFlip} style={{ ...styles.cardContainer, height: props.height, width: props.width, shadowOpacity: props.shadowOpacity}} ref={cardRef} flipDirection="x" duration={400} {...props}>
                <TouchableOpacity activeOpacity={1} onPress={() => cardRef.current.flip()}>
                    <Image source={{ uri: props.card.front }} style={{height: props.height, borderRadius: props.borderRadius ?? 25}}  resizeMode={Platform.isPad ? "contain" : "stretch"}/>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => cardRef.current.flip()}>
                    <Image source={{ uri: props.card.back }} style={{height: props.height, borderRadius: props.borderRadius ?? 25}}  resizeMode={Platform.isPad ? "contain" : "stretch"}/>
                </TouchableOpacity>
            </CardFlip>
        );
};

const styles = StyleSheet.create({
    cardContainer: {
        shadowOffset: { width: 3, height: 3 },
        backgroundColor: 'transparent',
        shadowColor: 'rgba(0,0,0,0.5)',
        borderRadius: 15,
    },
    customContainer: {
        shadowOffset: { width: 3, height: 3 },
        backgroundColor: 'transparent',
        shadowColor: 'rgba(0,0,0,0.5)',
        borderRadius: 15
    },
    customCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        shadowOffset: { width: 3, height: 3 },
        shadowColor: 'rgba(0,0,0,0.5)',
        borderRadius: 15
    },
    frontText: {
        padding: 5,
        fontSize: Platform.OS === 'ios' ? 35 : 30,
        lineHeight: 35,
        textAlign: 'center',
        color: colors.fontColor,
        fontFamily: font.card
    },
    backText: {
        padding: 5,
        fontSize: 23,
        lineHeight: 23,
        textAlign: 'center',
        color: colors.fontColor,
        fontFamily: font.card,
    },
    how: {
        fontFamily: font.light,
        color: colors.fontColor,
        fontSize: 12,
        textAlign: 'center'
    },
    textFieldContainer: {
        borderBottomWidth: 0,
    },
    frontTextSmall: {
        padding: 3,
        fontSize: 20,
        lineHeight: 20,
        textAlign: 'center',
        color: colors.fontColor,
        fontFamily: font.card,
    },
    backTextSmall: {
        padding: 3,
        fontSize: 14,
        lineHeight: 14,
        textAlign: 'center',
        color: colors.fontColor,
        fontFamily: font.card
    }
});