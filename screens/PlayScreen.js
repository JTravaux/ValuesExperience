import * as React from 'react';
import { cards } from '../constants/Cards';
import { Button } from 'react-native-elements';
import ValueCard from '../components/ValueCard';
import { colors, font } from '../constants/Styles';
import SlideOverlay from '../components/SlideOverlay';
import * as Animatable from 'react-native-animatable';
import CardStack from '../components/CardStack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import {  Menu, Divider, Provider } from 'react-native-paper';
import { game_instructions, phases } from '../Instructions';
import * as Amplitude from 'expo-analytics-amplitude';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('screen');
const bigCardHeight = Platform.OS === "ios" ? height / 2 : height / 2.35;
const bigCardWidth = Platform.isPad ? (width / 2.2) : (width / 1.5);

const smallCardHeight = Platform.OS === 'ios' ? (height / 4.4) : (height / 5);
const smallCardWidth = Platform.isPad ? (width / 5) : (width / 3.6);
const title = "Values Experience"

export default function PlayScreen({ navigation }) {
    const insets = useSafeArea();
    const keepScroller = React.useRef(); // used to scroll the scrollviewer programatically

    const [myValues, setValues] = React.useState([]); // The user's value pile
    const [removeTemp, setRemoveTemp] = React.useState([]); // The cards to be removed from the main deck
    const [deck, setDeck] = React.useState([]); // The main pile of cards 
    const [addTemp, setAddTemp] = React.useState([]); // The cards to be added to the main deck
    const [loading, setLoading] = React.useState(false); // Indicator for when a removeal is happening
    const [goalModalOpen, setGoalModalOpen] = React.useState(false) // phase instruction model
    const [insModalOpen, setInsModalOpen] = React.useState(false) // game instruction model
    const [goal, setGoal] = React.useState(phases[0]) // object containing information about the current goal ("Phase")
    const [goals, setGoals] = React.useState(phases) // object containing information about the different phases
    const [scrollEnabled, setScrollEnabled] = React.useState(true); // For scrolling the keep pile automagically
    const [menuOpen, setMenuOpen] = React.useState(false); // For opening and closing the menu
    const [myValuesTitleWidth, setMyValuesTitleWidth] = React.useState(0);

    const newCustomValue = () => { return { id: `${Constants.installationId}_${Date.now()}`, custom: true, front: '', back: '', name: "Custom Value" } }

    React.useEffect(() => { 
        if (goal.id === 0) {
            Amplitude.logEvent("Visited Phase 1")
            setDeck([...cards, newCustomValue()])
        } 
        else if (goal.id === 1) 
            Amplitude.logEvent("Visited Phase 2")
        else if (goal.id === 2) 
            Amplitude.logEvent("Visited Phase 3")

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

    const goBack = () => {
        if(goal.id === 0)
            navigation.goBack()
        else if (goal.id === 1) {
            setLoading(true)
            setGoal(goals[0])
            setTimeout(() => {
                setDeck(goals[0].remainingDeck)
                setValues(goals[0].myValues)
                setLoading(false)
            }, 500)
           
        } else {
            setLoading(true)
            setGoal(goals[goal.id - 1])
            setTimeout(() => {
                setDeck(goals[goal.id - 1].remainingDeck)
                setValues(goals[goal.id - 1].myValues)
                setLoading(false)
            }, 500)
        }
    }

    const completePhase = () => {
        if(goal.id === goals.length - 1) {
            Amplitude.logEventWithProperties(`Phase ${goal.id + 1} Completion`, { cards: myValues.map(c => c.name).join(', ') })
            navigation.navigate('debrief', { chosenOnes: myValues })
        }
        else {

            setLoading(true)
            const keep = [...myValues]
            const restOfDeck = [...deck]
            const updateGoals = [...goals]

            if (removeTemp.length > 0)
                processRemoveTemp(restOfDeck)

            if (addTemp.length > 0)
                processAddTemp(restOfDeck)

            let currentGoal = updateGoals.find(g => g.id === goal.id)
            currentGoal.myValues = [...keep]
            currentGoal.remainingDeck = [...restOfDeck]

            setGoal(goals[goal.id + 1])
            setGoals(updateGoals)
            setValues([])

            Amplitude.logEventWithProperties(`Phase ${goal.id + 1} Completion`, {cards: keep.map(c => c.name).join(', ')})
            
            setTimeout(() => { 
                setDeck(keep)
                setLoading(false)
            }, 500)
        }
    }

    // Check if there's any cards to remove
    // Lets do it now instead of when the action occurs
    // to make the whole process smoother, less jittery
    const onSwipeAll = () => {
        if (removeTemp.length > 0 && addTemp.length > 0) {
            setLoading(true);
            let preUpdatedDeck = [...deck]
            let updatedDeck = processRemoveTemp(preUpdatedDeck, false);
            processAddTemp(updatedDeck)
            setTimeout(() => setLoading(false), 100)
        } else if (removeTemp.length > 0) {
            setLoading(true)
            let udpdatedDeck = [...deck]
            processRemoveTemp(udpdatedDeck)
            setTimeout(() => setLoading(false), 100)
        } else if (addTemp.length > 0) {
            setLoading(true)
            let udpdatedDeck = [...deck]
            processAddTemp(udpdatedDeck)
            setTimeout(() => setLoading(false), 100)
        } 
    }

    const processAddTemp = (arr, replaceState=true) => {
        for (let i = 0; i < addTemp.length; ++i)
            arr.unshift(addTemp[i])
            
        setAddTemp([])
        if (replaceState)
            setDeck(arr)   
        else return arr;
    }

    const processRemoveTemp = (arr, replaceState=true) => {
        for(let i = 0; i < removeTemp.length; ++i)
            if (removeTemp[i].custom)
                arr.splice(arr.findIndex(card => card.id === removeTemp[i].id), 1, newCustomValue())
            else
                arr.splice(arr.findIndex(card => card.id === removeTemp[i].id), 1)

        setRemoveTemp([])
        if (replaceState)
            setDeck(arr)
        else return arr;
    }

    const addToMyValues = idx => {
        const card = deck[idx];

        if (myValues.length !== goal.numToKeep) {
            if (card?.custom) {
                if (card.front.length > 0) {
                    setValues([...myValues, card])
                    let arr = [...deck]
                    let customs = arr.filter(c => c.custom && c.front.length === 0)

                    if(customs.length === 1)
                        arr.splice(arr.findIndex(c => c.id === card.id), 1)
                    else
                        arr.splice(arr.findIndex(c => c.id === card.id), 1, newCustomValue())

                    processRemoveTemp(arr)
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

        if(removed.custom)
            processRemoveTemp(deck);
            
        // Check if the card is already in the deck
        if (removeTemp.findIndex(c => c.id === removed.id) !== -1) {
            let temp = [...removeTemp]
            temp.splice(temp.findIndex(c => c.id === removed.id), 1)
            setRemoveTemp(temp)
        } else
            setAddTemp([...addTemp, removed])
    }
    
    const openGoalInstructions = () => {
        setMenuOpen(false)
        setGoalModalOpen(true)
        Amplitude.logEvent("Opened Goal Instructions")
    }

    const openGameInstructions = () => {
        setMenuOpen(false)
        setInsModalOpen(true)
        Amplitude.logEvent("Opened Game Instructions")
    }

    const restartExperience = () => {
        Amplitude.logEvent("Restarted Experience")
        navigation.navigate('purpose')
    }
    
    // "My Values" button to move on to the next phase
    const renderNextButton = () => {
        return (
            <Button
                title={goal.nextInstruction}
                onPress={completePhase}
                buttonStyle={{ 
                    margin: 0, 
                    padding: 2, 
                    paddingLeft: 10, 
                    paddingRight: 10, 
                    backgroundColor: "#0883BF", 
                    borderRadius: 10, 
                    borderWidth: 0.5, 
                    borderColor: '#FFFFFF', 
                    marginRight: 5 
                }}
                titleStyle={{ 
                    fontSize: 14, 
                    fontFamily: 'lato'
                }}
            />
        )
    }

    // "My Values" counter for keeping track of current card counts
    const renderCurrentCounts = () => {
        return (
            <Text style={{ 
                textAlign: 'right',
                color: myValues.length === 0 ? "#0883BF" : colors.fontColor, 
                fontFamily: font.bold, 
                fontSize: 17, 
                marginRight: 20 
            }}>
                {myValues.length}/{goal.numToKeep}
            </Text>
        )
    }

    const renderMyValues = () => {
        return (
            <>
                <View style={styles.pileTitle}>
                    <View style={{ width: myValuesTitleWidth }} />
                    <Text style={styles.myValuesTitle}>{goal.id === goals.length - 1 ? "Primary Values" : "My Values"}</Text>


                    <Animatable.View key={`${myValues.length}/${goal.numToKeep}`} animation="tada" onLayout={ev => setMyValuesTitleWidth(ev.nativeEvent.layout.width)}>
                        {myValues.length !== goal.numToKeep ? renderCurrentCounts() : renderNextButton()}
                    </Animatable.View>

                </View>

                {/* "My Values" Card Pile */}
                <View style={{ flex: 1, alignItems: (goal.id === goals.length - 1 || myValues.length === 0) ? 'center' : 'flex-start' }}>

                    {/* Empty Pile */}
                    {myValues.length === 0 && (
                        <View style={{ flex: 1, justifyContent: 'center', margin: 10 }}>
                            <Animatable.Text animation="tada" style={styles.myValuesInstruction}>{goal.shortInstruction}</Animatable.Text>
                        </View>
                    )}

                    {/* Non Empty Pile */}
                    {myValues.length > 0 && (
                        <FlatList
                            horizontal
                            data={myValues}
                            ref={keepScroller}
                            showsHorizontalScrollIndicator={false}
                            style={{ height: smallCardHeight + 10 }}
                            keyExtractor={item => "my_stack_" + item.id}
                            scrollEnabled={myValues.length > 3 && scrollEnabled}
                            onContentSizeChange={() => keepScroller.current.scrollToEnd({ animated: true })}
                            renderItem={({ item }) => (
                                <CardStack
                                    verticalThreshold={50}
                                    disableLeftSwipe={true}
                                    horizontalSwipe={false}
                                    disableRightSwipe={true}
                                    disableBottomSwipe={true}
                                    style={styles.myValuesStack}
                                    onSwipe={() => setScrollEnabled(false)}
                                    onSwipeEnd={() => setScrollEnabled(true)}
                                    onSwipedTop={() => removeFromValues(item.id)}
                                    renderNoMoreCards={() => <View style={{ width: 110 }} />}
                                >
                                    <Animatable.View duration={500} animation='bounceIn' easing="linear">
                                        <ValueCard width={smallCardWidth} height={smallCardHeight} card={item} shadowOpacity={0} borderRadius={20} />
                                    </Animatable.View>
                                </CardStack>
                            )}
                        />
                    )}
                </View>
            </>
        )
    }

    return (
        <Provider>
            <View style={styles.container}>
                <View style={{ ...styles.title, paddingTop: insets.top + 5, paddingBottom: insets.top + 5}}>
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                        <TouchableOpacity onPress={goBack}>
                            <Icon  name="arrow-left" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.screenTitle}>
                        <Text style={styles.titleText}>{title}</Text>
                    </View>

                    {/* Menu */}
                    <View style={styles.menu}>
                        <TouchableOpacity onPress={() => setMenuOpen(true)}>
                            <Menu visible={menuOpen} onDismiss={() => setMenuOpen(false)} anchor={<Icon name="bars" size={25} color="#FFFFFF" />}>
                                <Menu.Item onPress={openGoalInstructions} title="Step Instructions" />
                                <Menu.Item onPress={openGameInstructions} title="Overall Instructions" />
                                <Divider />
                                <Menu.Item onPress={restartExperience} title="Restart Experience" />
                            </Menu>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* The Main deck in the middle */}
                <View style={styles.mainPile}>
                    {!loading && deck && (
                        Platform.OS === 'ios' ? (
                            // IOS Version with animation
                            <Animatable.View animation="bounceInDown" duration={1000} style={styles.content} key="mainPileDeck">
                                <CardStack
                                    duration={130}
                                    key={deck.length}
                                    secondCardZoom={0.85}
                                    style={styles.content}
                                    onSwipedAll={onSwipeAll}
                                    onSwipedBottom={addToMyValues}
                                    verticalThreshold={height / 4}
                                    horizontalThreshold={width / 4}
                                    renderNoMoreCards={() => <View />}
                                    loop={removeTemp.length === 0 && addTemp.length === 0}
                                    disableBottomSwipe={myValues.length === goal.numToKeep}
                                >
                                    {deck.map(card =>
                                        <ValueCard
                                            card={card}
                                            borderRadius={20}
                                            edit={editCustom}
                                            shadowOpacity={0.85}
                                            width={bigCardWidth}
                                            height={bigCardHeight}
                                            key={"card_" + card.id}
                                        />
                                    )}
                                </CardStack>
                            </Animatable.View>
                        ) : ( 
                            // Android Version with no animation - Fixes Swiping
                            <View style={styles.content} key="mainPileDeck">
                                <CardStack
                                    duration={130}
                                    key={deck.length}
                                    secondCardZoom={0.85}
                                    style={styles.content}
                                    onSwipedAll={onSwipeAll}
                                    onSwipedBottom={addToMyValues}
                                    verticalThreshold={height / 4}
                                    horizontalThreshold={width / 4}
                                    renderNoMoreCards={() => <View />}
                                    loop={removeTemp.length === 0 && addTemp.length === 0}
                                    disableBottomSwipe={myValues.length === goal.numToKeep}
                                >
                                    {deck.map(card =>
                                        <ValueCard
                                            card={card}
                                            edit={editCustom}
                                            shadowOpacity={0.85}
                                            width={bigCardWidth}
                                            height={bigCardHeight}
                                            key={"card_" + card.id}
                                        />
                                    )}
                                </CardStack>
                            </View> 
                        )
                    )}

                    {loading && (<ActivityIndicator size="large" color="#0883BF" style={{flex: 1}} />)}
                </View>

                {/* My Values area */}
                {Platform.OS === "ios" ? 
                    <View style={styles.myValues}>
                        {renderMyValues()}
                    </View> 
                : 
                    <KeyboardAvoidingView style={styles.myValues} behavior="height">
                        {renderMyValues()}
                    </KeyboardAvoidingView>
                }
               
                <SlideOverlay title={goal.title} visible={goalModalOpen} instructions={goal.instructions} close={() => setGoalModalOpen(false)} goal={true} />
                <SlideOverlay title="Instructions" visible={insModalOpen} instructions={game_instructions} close={() => setInsModalOpen(false)}/>

            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBgColors
    },
    screenTitle: {
        flex: 10, 
        borderRadius: 10, 
        height: 50,
        justifyContent: 'center'
    },
    myValuesTitle: {
        textAlign: 'center', 
        color: colors.fontColor, 
        fontFamily: font.bold, 
        fontSize: 20
    },
    myValuesStack: {
        alignItems: 'center', 
        width: smallCardWidth + 10, 
        marginTop: 5
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 15, 
        paddingLeft: 15
    },
    menu: {
        flex: 1, 
        alignItems: 'flex-end'
    },
    content: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        flex: Dimensions.get('screen').width < 350 ? 1/1.5 : 1/2,
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        backgroundColor: "#0883BF"
    },
    titleText: {
        color: colors.fontColor,
        textAlign: 'center',
        fontFamily: font.semibold,
        fontSize: Dimensions.get('screen').width < 350 ? 30 : 35,
        textAlignVertical: 'center'
    },
    pileTitle: {
        flexDirection: 'row', 
        justifyContent: "space-between",
        margin: 5,
        marginBottom: 0,
        backgroundColor: 'transparent'
    },
    myValuesInstruction: {
        fontSize: 16,
        fontFamily: font.regular,
        color: colors.fontColor,
        textAlign: 'center'
    },
    mainPile: {
        flex: 8,
        backgroundColor: '#8CC9E6'
    },
    myValues: {
        flex: 4,
        backgroundColor: '#0883BF',
        zIndex: -1,
    },
    scrollBtnContainer: {
        flex: 1, 
        alignItems: 'center', 
        alignSelf: 'center' 
    }
});