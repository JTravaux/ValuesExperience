import * as React from 'react';
import Modal, { ModalTitle, ModalContent, ModalFooter, ModalButton, ScaleAnimation } from 'react-native-modals';
import { StyleSheet, Text, Dimensions } from 'react-native'
import { colors, font } from '../constants/Styles';

export default function GoalOverlay (props) {

    const [instructions, setInstructions] = React.useState([])

    React.useEffect(() => {
        setInstructions(props.instructions)
    }, [props.instructions])

    return (
        <Modal
            width={Dimensions.get('screen').width * 0.8}
            visible={props.visible}
            onTouchOutside={props.close}
            modalTitle={<ModalTitle title="Goal" textStyle={{ fontFamily: font.semibold }} />}
            modalAnimation={new ScaleAnimation()}
            footer={<ModalFooter><ModalButton text="Dismiss" onPress={() => props.close()} /></ModalFooter>}
        >
            <ModalContent>
                {instructions.map((ins, idx) => <Text key={"goal_ins_" + idx} style={styles.phaseInstruction}>{ins}</Text>)}
            </ModalContent>
        </Modal>
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
        color: '#000',
        margin: 10,
        textAlign: 'justify'
    }
});
