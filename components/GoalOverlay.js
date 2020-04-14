import * as React from 'react';
import Modal, { ModalTitle, ModalContent, ModalFooter, View, SlideAnimation } from 'react-native-modals';
import { StyleSheet, Text, Dimensions } from 'react-native'
import { colors, font } from '../constants/Styles';

export default function GoalOverlay (props) {

    const [instructions, setInstructions] = React.useState([])

    React.useEffect(() => {
        setInstructions(props.instructions)
    }, [props.instructions])

    return (
        <Modal.BottomModal
            height={props.goal ? 0.45 : 0.65}
            visible={props.visible}
            overlayOpacity={0.85}
            swipeThreshold={100}
            onTouchOutside={props.close}
            modalAnimation={new SlideAnimation({slideFrom: 'bottom'})}
            onSwipeOut={props.close}
        >
            <Text style={{ fontFamily: font.bold, color: colors.fontColor, fontSize: 25, textAlign: 'center', backgroundColor: '#0883BF', paddingTop: 5}}>{props.title}</Text>
            <ModalContent style={{ backgroundColor: '#0883BF', height: '95%', justifyContent: 'space-between'}}>
                {instructions.map((ins, idx) => <Text key={"goal_ins_" + idx} style={styles.phaseInstruction}>{ins}</Text>)}
                <Text style={{textAlign: 'center', fontFamily: font.light, color: colors.fontColor}}>(swipe down to dismiss this notice)</Text>
            </ModalContent>
        </Modal.BottomModal>
    )
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    bottomBtns: {
        flex: 1,
        backgroundColor: "#FF0000",
        justifyContent: 'flex-end',
        marginBottom: 20
    },
    phaseInstruction: {
        fontFamily: font.regular,
        color: colors.fontColor,
        fontSize: 17,
        textAlign: 'justify',
        marginTop: 10,
    }
});
