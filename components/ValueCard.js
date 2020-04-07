import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import CardFlip from 'react-native-card-flip';
import Svg, { Image } from 'react-native-svg'

export default function ValueCard(props) {
    const cardRef = React.useRef();
    
    return (
        <CardFlip style={{ ...styles.cardContainer, height: props.height, width: props.width, shadowOpacity: props.shadowOpacity}} ref={cardRef} flipDirection="x" duration={400} {...props}>
            <TouchableOpacity activeOpacity={1} onPress={() => cardRef.current.flip()}>
                <Svg width={props.width} height={props.height} onLongPress={props.onLongPress} viewBox={`0 0 ${props.width} ${props.height}`} style={{ ...props.style, borderRadius: props.borderRadius ?? 15, overflow: 'hidden' }}>
                    <Image href={props.front} width={props.width} height={props.height} />
                </Svg>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={() => cardRef.current.flip()}>
                <Svg width={props.width} height={props.height} onLongPress={props.onLongPress} viewBox={`0 0 ${props.width} ${props.height}`} style={{ ...props.style, borderRadius: props.borderRadius ?? 15, overflow: 'hidden' }}>
                    <Image href={props.back} width={props.width} height={props.height} />
                </Svg>
            </TouchableOpacity>
        </CardFlip>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'transparent',
        borderRadius: 15,
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: {
            width: 3,
            height: 3,
        }
    }
});