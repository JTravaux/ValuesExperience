import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Keyboard, View } from 'react-native';
import CardFlip from 'react-native-card-flip';
import Svg, { Image } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font } from '../constants/Styles';
import { Input } from 'react-native-elements';

export default function ValueCard(props) {
    const cardRef = React.useRef();

    const [customFront, setCustomFront] = React.useState(props.card.custom ? props.card.front : '')
    const [customBack, setCustomBack] = React.useState(props.card.custom ? props.card.back : '')

    if (props.card.custom) 
        return (
            <CardFlip style={{ ...styles.customContainer, height: props.height, width: props.width, shadowOpacity: props.shadowOpacity }} flipDirection="x" duration={400} ref={cardRef} {...props} >
                <TouchableOpacity activeOpacity={1} onPress={() => cardRef.current.flip()} style={styles.customCard}>
                    <LinearGradient colors={['#c50ae4','#9198e5']} style={{...styles.customCard, padding: 10, justifyContent: 'space-between'}}>
                        {props.height > 300 && (<>
                            <Input
                                inputStyle={styles.frontText}
                                inputContainerStyle={styles.textFieldContainer}
                                value={customFront}
                                onChangeText={txt => setCustomFront(txt)}
                                onSubmitEditing={() => props.edit(props.card.id, 'front', customFront)}
                                returnKeyType="done"
                            />
                            <Text style={styles.how}>click the value to make changes.</Text>
                        </>)}

                        {props.height <= 300 && <Text style={styles.frontTextSmall}>{props.card.front}</Text>}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => cardRef.current.flip()} style={styles.customCard}>
                    <LinearGradient colors={['#9198e5', '#c50ae4']} style={{ ...styles.customCard, padding: 10, justifyContent: 'center' }}>
                        {props.height > 300 && (<>
                            <View style={{ flex: 10, justifyContent: 'center' }}>
                                <Input
                                    blurOnSubmit={true}
                                    multiline
                                    inputStyle={styles.backText}
                                    inputContainerStyle={{ borderBottomWidth: 0 }}
                                    value={customBack}
                                    onChangeText={txt => setCustomBack(txt)}
                                    onSubmitEditing={() => props.edit(props.card.id, 'back', customBack)}
                                    returnKeyType="done"
                                />
                            </View>

                            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <Text style={styles.how}>click the description to make changes.</Text>
                            </View>
                        </>)}

                        {props.height <= 300 && <Text style={styles.backTextSmall}>{props.card.back}</Text>}
                    </LinearGradient>
                </TouchableOpacity>
            </CardFlip>
        );
    else
        return (
            <CardFlip style={{ ...styles.cardContainer, height: props.height, width: props.width, shadowOpacity: props.shadowOpacity}} ref={cardRef} flipDirection="x" duration={400} {...props}>
                <TouchableOpacity activeOpacity={1} onPress={() => cardRef.current.flip()}>
                    <Svg width={props.width} height={props.height} onLongPress={props.onLongPress} viewBox={`0 0 ${props.width} ${props.height}`} style={{ ...props.style, borderRadius: props.borderRadius ?? 15, overflow: 'hidden' }}>
                        <Image href={props.card.front} width={props.width} height={props.height} />
                    </Svg>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => cardRef.current.flip()}>
                    <Svg width={props.width} height={props.height} onLongPress={props.onLongPress} viewBox={`0 0 ${props.width} ${props.height}`} style={{ ...props.style, borderRadius: props.borderRadius ?? 15, overflow: 'hidden' }}>
                        <Image href={props.card.back} width={props.width} height={props.height} />
                    </Svg>
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
        fontSize: 35,
        textAlign: 'center',
        color: colors.fontColor,
        fontFamily: font.semibold
    },
    backText: {
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: colors.fontColor,
        fontFamily: font.regular
    },
    how: {
        fontFamily: font.light,
        color: colors.fontColor,
        fontSize: 12,
        textAlign: 'center'
    },
    textFieldContainer: {
        borderBottomWidth: 0,
        backgroundColor: '#b300d1'
    },
    frontTextSmall: {
        fontSize: 15,
        textAlign: 'center',
        color: colors.fontColor,
        fontFamily: font.semibold  
    },
    backTextSmall: {
        fontSize: 10,
        textAlign: 'center',
        color: colors.fontColor,
        fontFamily: font.semibold
    }
});