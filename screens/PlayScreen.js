import * as React from 'react';
import { cards } from '../constants/Cards';
import { Button } from 'react-native-elements';
import ValueCard from '../components/ValueCard';
import { colors, font } from '../constants/Styles';
import GoalOverlay from '../components/GoalOverlay';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import CardStack from '../components/CardStack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

const bigCardHeight = 400;
const bigCardWidth = 280;
const smallCardHeight = 170;
const smallCardWidth = 120;
const title = "Values Experience"

const phases = [
    {   id: 0, 
        numToKeep: 10, 
        totalCards: 22, 
        chosenValues: [],
        instructions: [
            `There are hundreds of values. On the next screen are 22 common ones. We invite you now to review these plus any you want to add and identify 10 that resonate most with you by sliding them down into the "My Values" area.`,
            `Once you have filled the "My Values" area you can continue to the next phase.`
        ] 
    },
    {   id: 1, 
        numToKeep: 5, 
        totalCards: 10, 
        chosenValues: [],
        instructions: [
            `We are now going to drill deeper into your values. While all 10 of these values are important to you, what 5 values do you hold dear when living your life most fulfilled?`,
            `Once you have filled the "My Values" area you can continue to the next phase.`
        ] 
    },
    {   id: 2, 
        numToKeep: 2, 
        totalCards: 5,
        chosenValues: [], 
        instructions: [
            `Of these 5 important values what 2 values do you feel you absolutely could not live without? When you are living at your best these would be the values that affect your decision making and actions the most. These are your Primary Values.`
        ] 
    }
]

export default function PlayScreen({ navigation, route }) {
    
    const insets = useSafeArea();
    const keepScroller = React.useRef(); // used to scroll the scrollviewer programatically

    const [myValues, setValues] = React.useState([]); // The user's value pile
    const [removeTemp, setRemoveTemp] = React.useState([]); // The cards to be removed from the main deck
    const [deck, setDeck] = React.useState([]); // The main pile of cards 
    const [addTemp, setAddTemp] = React.useState([]); // The cards to be added to the main deck
    const [loading, setLoading] = React.useState(false); // Indicator for when a removeal is happening
    const [modalOpen, setModalOpen] = React.useState(false) // phase instruction model
    const [goal, setGoal] = React.useState(phases[0]) // object containing information about the current goal ("Phase")
    const [goals, setGoals] = React.useState(phases) // object containing information about the different phases
    const [scrollEnabled, setScrollEnabled] = React.useState(true); // For scrolling the keep pile automagically
    const newCustomValue = () => { return { id: Date.now(), custom: true, front: '', back: '', name: "Custom Value" } }

    React.useEffect(() => { 
        if (goal.id === 0)
            setDeck([...cards, newCustomValue()])

        setModalOpen(true)
    }, [goal])

    const editCustom = (id, side, text) => {
        let newDeck = [...deck]
        let card = newDeck.find(c => c.id === id)
        
        if(side === 'front')
            card.front = text
        else if (side === 'back')
            card.back = text

        setDeck(newDeck)
    }

    const resetRound = () => {
        setValues([])
        setRemoveTemp([])
        setAddTemp([])
    }

    const goBack = () => {
        if(goal.id === 0)
            navigation.goBack()
        else if (goal.id === 1) {
            setGoal(goals[0])
            setDeck(cards)
            resetRound()
        } else {
            setGoal(goals[goal.id - 1])
            setDeck(goals[goal.id - 2].chosenValues)
            resetRound()
        }
    }

    const completePhase = () => {
        if(goal.id === goals.length - 1)
            navigation.navigate('debrief', { chosenOnes: myValues })
        else {
            const keep = [...myValues]
            const oldGoals = [...goals]
            oldGoals.find(g => g.id === goal.id).chosenValues = keep

            setGoal(goals[goal.id + 1])
            setGoals(oldGoals)
            setDeck(keep)
            resetRound()
        }
    }

    const onSwipeAll = () => {
        // Check if there's any cards to remove
        // Lets do it now instead of when the action occurs
        // to make the whole process smoother, less jittery
        if (removeTemp.length > 0) {
            setLoading(true)
            let udpdatedDeck = [...deck]
            processRemoveTemp(udpdatedDeck)
            setTimeout(() => setLoading(false), 100)
        } 
        if (addTemp.length > 0) {
            setLoading(true)
            let udpdatedDeck = [...deck]
            processAddTemp(udpdatedDeck)
            setTimeout(() => setLoading(false), 100)
        } 
    }

    const processAddTemp = arr => {
        for (let i = 0; i < addTemp.length; ++i)
            arr.unshift(addTemp[i])
        setDeck(arr)
        setAddTemp([])
    }

    const processRemoveTemp = arr => {
        for(let i = 0; i < removeTemp.length; ++i)
            if (removeTemp[i].custom)
                arr.splice(arr.findIndex(card => card.id === removeTemp[i].id), 1, newCustomValue())
            else
                arr.splice(arr.findIndex(card => card.id === removeTemp[i].id), 1)

        setDeck(arr)
        setRemoveTemp([])
    }

    const addToMyValues = idx => {
        const card = deck[idx];

        if (myValues.length !== goal.numToKeep) {
            if (card?.custom) {
                if (card.front.length > 0) {
                    setValues([...myValues, card])
                    let arr = [...deck]
                    arr.splice(arr.findIndex(c => c.id === card.id), 1, newCustomValue())
                    processRemoveTemp(arr)
                    //setDeck(arr)
                }
            } else {
                // Add the non custom card to "My Values"
                setValues([...myValues, card])

                // If its the last card in the deck, do the refresh
                if (idx === deck.length - 1) {
                    let arr = [...deck]
                    arr.splice(idx, 1)

                    // Check if there's anymore to remove
                    if (removeTemp.length > 0)
                        processRemoveTemp(arr)
                    else
                        setDeck(arr)
                } else
                    setRemoveTemp([...removeTemp, card])
            }
        }
    }

    const removeFromValues = id => {
        let myDeck = [...myValues]

        // Remove the card from "My Values"
        const removed = myDeck.splice(myDeck.findIndex(card => card.id === id), 1)[0]
        setValues(myDeck)

        // Check if the card is already in the deck
        if (removeTemp.findIndex(c => c.id === removed.id) !== -1) {
            let temp = [...removeTemp]
            temp.splice(temp.findIndex(c => c.id === removed.id), 1)
            setRemoveTemp(temp)
        } else
            setAddTemp([...addTemp, removed])
    }

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <LinearGradient colors={['rgba(8, 131, 191, 0.90)', 'rgba(8, 131, 191, 0.80)']} style={{ flex: 1, alignItems: 'center', flexDirection: 'row', paddingTop: insets.top + 5, paddingRight: 15, paddingLeft: 15, paddingBottom: insets.top + 5}}>
                    
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Icon onPress={goBack} name="arrow-left" size={25} color="#FFFFFF" />
                    </View>

                    <View style={{ flex: 10, alignItems: 'center', alignSelf: 'center'}}>
                        <Text style={styles.titleText}>{title}</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Button onPress={() => setModalOpen(true)} buttonStyle={{ backgroundColor: 'transparent' }} icon={<Icon name="question" size={30} color="#FFFFFF" />} />
                    </View>

                </LinearGradient>
            </View>

            <View style={styles.mainPile}>
                {!loading && deck && (
                    <Animatable.View collapsable={true} animation="bounceInDown" duration={1000} style={styles.content} key="mainPileDeck">
                        <CardStack
                            duration={130}
                            key={deck.length}
                            secondCardZoom={0.95}
                            style={styles.content}
                            verticalThreshold={Dimensions.get('screen').width / 4}
                            onSwipedAll={onSwipeAll}
                            horizontalThreshold={Dimensions.get('screen').width / 2}
                            loop={removeTemp.length === 0 && addTemp.length === 0}
                            onSwipedBottom={addToMyValues}
                            renderNoMoreCards={() => <View />}
                            disableBottomSwipe={myValues.length === goal.numToKeep}
                        >
                            {deck.map(card =>
                                <ValueCard
                                    key={"card_" + card.id}
                                    card={card}
                                    width={bigCardWidth}
                                    height={bigCardHeight}
                                    borderRadius={25}
                                    shadowOpacity={0.85}
                                    edit={editCustom}
                                />
                            )}
                        </CardStack>
                    </Animatable.View>
                )}

                {loading && (<ActivityIndicator size="large" color="#0883BF" style={{flex: 1}} />)}
            </View>

            <View style={styles.myValues}>
                <View style={styles.pileTitle}>
                    <View>
                        {myValues.length !== goal.numToKeep ? 
                            <Text style={{ textAlign: 'left', color: '#0883BF', fontFamily: font.regular, fontSize: 20 }}>
                                {myValues.length}/{goal.numToKeep}
                            </Text>
                        :
                            <Button
                                title={goal.id === 2 ? "Finish" : "Continue"}
                                buttonStyle={{ margin: 0, padding: 2, paddingLeft: 10, paddingRight: 10, backgroundColor: "#0883BF" }}
                                titleStyle={{ fontSize: 14, fontFamily: 'lato', color: "#0883BF" }}
                            />
                        }
                    </View>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: colors.fontColor, fontFamily: font.semibold, fontSize: 20}}>{goal.id === goals.length - 1 ? "Primary Values" : "My Values"}</Text>
                    
                    <Animatable.View key={`${myValues.length}/${goal.numToKeep}`} animation="tada">
                        {myValues.length !== goal.numToKeep ? 
                            <Text style={{ textAlign: 'right', color: colors.fontColor, fontFamily: font.regular, fontSize: 20 }}>
                                {myValues.length}/{goal.numToKeep}
                            </Text>
                        : 
                            <Button 
                                title={goal.id === 2 ? "Finish" : "Continue"}
                                onPress={completePhase} 
                                buttonStyle={{ margin: 0, padding: 2, paddingLeft: 10, paddingRight: 10, backgroundColor: "#0883BF", borderRadius: 10, borderWidth: 0.5, borderColor: '#FFFFFF'}} 
                                titleStyle={{fontSize: 14, fontFamily: 'lato'}}
                            />
                        }
                    </Animatable.View>
                </View>

                {/* "My Values" Card Pile */}
                <View style={{ alignItems: goal.id === goals.length - 1 ? 'center' : 'flex-start' }}>
                    <FlatList
                        style={{ height: smallCardHeight + 15}}
                        data={myValues}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={myValues.length > 3 && scrollEnabled}
                        onContentSizeChange={() => keepScroller.current.scrollToEnd({animated: true})}
                        ref={keepScroller}
                        keyExtractor={item => "my_stack_" + item.id}
                        renderItem={({item}) => (
                            <CardStack
                                style={{ alignItems: 'center', width: smallCardWidth + 5, marginTop: 5}}
                                disableBottomSwipe={true}
                                disableLeftSwipe={true}
                                disableRightSwipe={true}
                                horizontalSwipe={false}
                                verticalThreshold={50}
                                onSwipe={() =>  setScrollEnabled(false)}
                                onSwipeEnd={() => setScrollEnabled(true)}
                                renderNoMoreCards={() => <View style={{ width: 110 }} />}
                                onSwipedTop={() => removeFromValues(item.id)}
                            >
                                <Animatable.View duration={300} animation='fadeInDown' easing="linear">
                                    <ValueCard
                                        width={smallCardWidth}
                                        height={smallCardHeight}
                                        card={item}
                                        shadowOpacity={0}
                                        borderRadius={20}
                                    />
                                </Animatable.View>
                            </CardStack>
                        )}
                    >
                    </FlatList>
                </View>
            </View>

            <GoalOverlay visible={modalOpen} instructions={goal.instructions} close={() => setModalOpen(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBgColor
    },
    content: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        flex: 1,
        flexDirection: 'row'
    },
    titleText: {
        color: colors.fontColor,
        textAlign: 'center',
        fontFamily: font.semibold,
        fontSize: 35,
    },
    pileTitle: {
        flexDirection: 'row', 
        justifyContent: "space-between",
        margin: 5,
        marginBottom: 0,
        backgroundColor: 'transparent'
    },
    mainPile: {
        flex: 4,
        backgroundColor: '#8CC9E6'
    },
    myValues: {
        flex: 2,
        backgroundColor: '#0883BF',
        zIndex: -1
    },
    scrollBtnContainer: {
        flex: 1, 
        alignItems: 'center', 
        alignSelf: 'center' 
    }
});