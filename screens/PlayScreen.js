import * as React from 'react';
import { cards } from '../constants/Cards';
import { Button } from 'react-native-elements';
import ValueCard from '../components/ValueCard';
import { colors, font } from '../constants/Styles';
import GoalOverlay from '../components/GoalOverlay';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import CardStack from 'react-native-card-stack-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

const bigCardHeight = 400;
const bigCardWidth = 280;
const smallCardHeight = 140;
const smallCardWidth = 100;
const title = "Values Experience"
const defaultCustomFront = "Custom Value"
const defaultCustomBack = "Don't see any values that resonate with you? Feel free to use this card to add a custom value."

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
    
    const swiper = React.useRef(); // Used to swipe cards programatically
    const keepScroller = React.useRef(); // used to scroll the scrollviewer programatically

    const [x, setX] = React.useState(0); // For scrolling the keep pile automagically
    const [myValues, setValues] = React.useState([]); // The user's value pile
    const [removeTemp, setRemoveTemp] = React.useState([]); // The cards to be removed from the main deck
    const [deck, setDeck] = React.useState([]); // The main pile of cards 
    const [addTemp, setAddTemp] = React.useState([]); // The cards to be added to the main deck
    const [customValues, setCustomValues] = React.useState([]); // The custom values a user has added

    const [loading, setLoading] = React.useState(false); // Indicator for when a removeal is happening
    const [modalOpen, setModalOpen] = React.useState(false) // phase instruction model
    const [goal, setGoal] = React.useState(phases[0]) // object containing information about the current goal ("Phase")
    const [goals, setGoals] = React.useState(phases) // object containing information about the different phases

    React.useEffect(() => { 
        if (goal.id === 0)
            setDeck([newCustomValue(), ...cards])
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

    const newCustomValue = () => {
        let newValue = { id: customValues.length + 1000, custom: true, front: defaultCustomFront, back: defaultCustomBack }
        setCustomValues([...customValues, newValue])
        return newValue
    }

    const removeFromValues = idx => {
        let myDeck = [...myValues]
       
        // Remove the card from "My Values"
        const removed = myDeck.splice(idx, 1)[0]
        setValues(myDeck)

        // Check if the card is already in the deck
        if (removeTemp.findIndex(c => c.id === removed.id) !== -1){
            let temp = [...removeTemp]
            temp.splice(temp.findIndex(c => c.id === removed.id), 1)
            setRemoveTemp(temp)
        } else 
            setAddTemp([...addTemp, removed])
    }

    const scrollCards = variant => {
        let newX; 

        if(variant === 'right')
            newX = x + smallCardWidth
        else
            newX = x - smallCardWidth

        if ((newX > myValues.length * smallCardWidth) || newX < 0)
            newX = 0

        keepScroller.current.scrollTo({ x: newX, y: 0, animated: true })
        setX(newX)
    }

    const resetRound = () => {
        setValues([])
        setRemoveTemp([])
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
            navigation.navigate('endGame', { chosenOnes: myValues })
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
            arr.splice(arr.findIndex(card => card.id === removeTemp[i].id), 1)

        setDeck(arr)
        setRemoveTemp([])
    }

    const addToMyValues = idx => {
        if (myValues.length !== goal.numToKeep) {
            setValues([...myValues, deck[idx]])

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
                setRemoveTemp([...removeTemp, deck[idx]])
        }
    }

    const scrollToEnd = () => {
        keepScroller.current.scrollToEnd({ animated: true })

        if (myValues.length === 1)
            setX(1)
        else if (x === 0)
            setX(1)
    }

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <LinearGradient colors={['rgba(8, 131, 191, 0.90)', 'rgba(8, 131, 191, 0.80)']} style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                    
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Icon onPress={goBack} name="arrow-left" size={25} color="#FFFFFF" />
                    </View>

                    <View style={{ flex: 6, alignItems: 'center', alignSelf: 'center'}}>
                        <Text style={styles.titleText}>{title}</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Button 
                            onPress={() => myValues.length === goal.numToKeep ? completePhase() : setModalOpen(true)} 
                            buttonStyle={{ backgroundColor: 'transparent' }} 
                            icon={myValues.length === goal.numToKeep ? <Icon name="arrow-right" size={30} color="#00FF00" /> : <Icon name="question" size={30} color="#FFFFFF" />} 
                        />
                    </View>

                </LinearGradient>
            </View>

            <View style={styles.mainPile}>
                {!loading && deck && (
                    <Animatable.View animation="bounceInDown" duration={1000} style={styles.content} key="mainPileDeck">
                        <CardStack
                            ref={swiper}
                            duration={130}
                            key={deck.length}
                            secondCardZoom={0.95}
                            style={styles.content}
                            verticalThreshold={150}
                            onSwipedAll={onSwipeAll}
                            horizontalThreshold={75}
                            loop={removeTemp.length === 0 && addTemp.length === 0}
                            onSwipedBottom={addToMyValues}
                            renderNoMoreCards={() => <View />}
                            disableBottomSwipe={myValues.length === goal.numToKeep}
                        >
                            {deck.map((card, idx) =>
                                <ValueCard
                                    key={"card_" + idx}
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
                    <Text style={{ textAlign: 'left', color: '#0883BF', fontFamily: font.regular }}>{myValues.length}/{goal.numToKeep}</Text>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: colors.fontColor, fontFamily: font.semibold, fontSize: 17}}>{goal.id === goals.length - 1 ? "Primary Values" : "My Values"}</Text>
                    <Animatable.Text key={`${myValues.length}/${goal.numToKeep}`} style={{ textAlign: 'right', color: colors.fontColor, fontFamily: font.regular }} animation="tada">{myValues.length}/{goal.numToKeep}</Animatable.Text>
                </View>

                {/* Left Scroll Button */}
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={styles.scrollBtnContainer}>
                        {myValues.length > 3 && 
                            <Animatable.View animation="tada" duration={1250}>
                                <Button 
                                    disabled={myValues.length < 3 || x <= 0} 
                                    onPress={() => scrollCards('left')} 
                                    buttonStyle={{ backgroundColor: '#FFFFFF' }} 
                                    icon={<Icon name="caret-left" size={15} color="#0883BF" />} 
                                />
                            </Animatable.View>
                        }
                    </View>
                   
                    {/* "My Values" Card Pile */}
                    <View style={{ flex: 8, alignItems: goal.id === goals.length - 1 ? 'center' : 'flex-start' }}>
                        <ScrollView snapToAlignment="center" scrollEnabled={false} horizontal={true} style={{ margin: 2 }} ref={keepScroller} onContentSizeChange={scrollToEnd}>
                            {myValues.map((card, myValuesIndex) => 
                                <CardStack
                                    key={"my_stack_" + card.id}
                                    style={{ alignItems: 'center' }}
                                    disableBottomSwipe={true}
                                    horizontalSwipe={false}
                                    verticalThreshold={50}
                                    renderNoMoreCards={() => <View style={{ width: 110 }} />}
                                    onSwipedTop={() => removeFromValues(myValuesIndex)}>
                                    <Animatable.View duration={300} animation='fadeInDown' easing="linear" >
                                        <ValueCard
                                            width={smallCardWidth}
                                            height={smallCardHeight}
                                            card={card}
                                            shadowOpacity={0}
                                        />
                                    </Animatable.View>
                                </CardStack>
                            )}
                        </ScrollView>
                    </View>

                    {/* Right Scroll Button */}
                    <View style={styles.scrollBtnContainer}>
                        {myValues.length > 3 && 
                            <Animatable.View animation="tada" duration={1250}>
                                <Button 
                                    disabled={(x >= myValues.length * 60)  || myValues.length < 3} 
                                    onPress={() => scrollCards('right')} 
                                    buttonStyle={{ backgroundColor: '#FFFFFF' }} 
                                    icon={<Icon name="caret-right" size={15} color="#0883BF" />} 
                                />
                            </Animatable.View>
                        }
                    </View>

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
        backgroundColor: 'transparent'
    },
    mainPile: {
        flex: 5,
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