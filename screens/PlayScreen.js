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
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import {  Menu, Divider, Provider } from 'react-native-paper';
import { game_instructions, phases } from '../Instructions';
import * as Amplitude from 'expo-analytics-amplitude';

const bigCardHeight = 400;
const bigCardWidth = 280;
const smallCardHeight = 170;
const smallCardWidth = 120;
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
    
    const newCustomValue = () => { return { id: Date.now(), custom: true, front: '', back: '', name: "Custom Value" } }

    React.useEffect(() => { 
        if (goal.id === 0) {
            Amplitude.logEvent("Visited Phase 1")
            setDeck([...cards, newCustomValue()])
        } 
        else if (goal.id === 1) 
            Amplitude.logEvent("Visited Phase 2")
        else if (goal.id === 2) 
            Amplitude.logEvent("Visited Phase 3")

        setGoalModalOpen(true)
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
        if(goal.id === goals.length - 1) 
            navigation.navigate('debrief', { chosenOnes: myValues })
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

            setTimeout(() => { 
                setDeck(keep)
                setValues([])
                setLoading(false)
            }, 300)
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
    
    const openGoalInstructions = () => {
        setMenuOpen(false)
        setGoalModalOpen(true)
    }

    const openGameInstructions = () => {
        setMenuOpen(false)
        setInsModalOpen(true)
    }

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.title}>
                    <LinearGradient colors={['rgba(8, 131, 191, 0.90)', 'rgba(8, 131, 191, 0.80)']} style={{ flex: 1, alignItems: 'center', flexDirection: 'row', paddingTop: insets.top + 5, paddingRight: 15, paddingLeft: 15, paddingBottom: insets.top + 5}}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <TouchableOpacity onPress={goBack}>
                                <Icon  name="arrow-left" size={25} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 10, alignItems: 'center', alignSelf: 'center'}}>
                            <Text style={styles.titleText}>{title}</Text>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => setMenuOpen(true)}>
                                <Menu visible={menuOpen} onDismiss={() => setMenuOpen(false)} anchor={<Icon name="bars" size={25} color="#FFFFFF" />}>
                                    <Menu.Item onPress={openGoalInstructions} title="View Current Goal" />
                                    <Menu.Item onPress={openGameInstructions} title="View Instructions" />
                                    <Divider />
                                    <Menu.Item onPress={() => navigation.navigate('purpose')} title="Restart Experience" />
                                </Menu>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.mainPile}>
                    {!loading && deck && (
                        <Animatable.View collapsable={true} animation="bounceInDown" duration={1000} style={styles.content} key="mainPileDeck">
                            <CardStack
                                duration={130}
                                key={deck.length}
                                secondCardZoom={0.85}
                                style={styles.content}
                                verticalThreshold={Dimensions.get('screen').height / 4}
                                onSwipedAll={onSwipeAll}
                                horizontalThreshold={Dimensions.get('screen').width / 4}
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
                        <Text style={{ textAlign: 'center', color: colors.fontColor, fontFamily: font.bold, fontSize: 20}}>{goal.id === goals.length - 1 ? "Primary Values" : "My Values"}</Text>
                        
                        <Animatable.View key={`${myValues.length}/${goal.numToKeep}`} animation="tada">
                            {myValues.length !== goal.numToKeep ? 
                                <Text style={{ textAlign: 'right', color: colors.fontColor, fontFamily: font.light, fontSize: 17 }}>
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
                                    style={{ alignItems: 'center', width: smallCardWidth + 10, marginTop: 5}}
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
                                    <Animatable.View duration={500} animation='bounceIn' easing="linear">
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

                <GoalOverlay title="Current Goal" visible={goalModalOpen} instructions={goal.instructions} close={() => setGoalModalOpen(false)} goal={true} />
                <GoalOverlay title="Game Instructions" visible={insModalOpen} instructions={game_instructions} close={() => setInsModalOpen(false)} goal={false} />

            </View>
        </Provider>
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
        position: 'relative',
        backgroundColor: '#0883BF',
        zIndex: -1
    },
    scrollBtnContainer: {
        flex: 1, 
        alignItems: 'center', 
        alignSelf: 'center' 
    }
});