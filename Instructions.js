export const game_instructions = [
    '1. Each value is represented by a digital card. Swipe left or right through the cards to view them. Tap a card to flip it over for a description.',
    '2. In 3 steps, the Values Experience will help you narrow your values down first to 10, then to 5 and then to your final 2 primary values. In each phase, you will select the values that mean the most to you by sliding them down into the area labeled "My Values".',
    '3. You can add your own values by customizing the blank card. Tap the "Custom Value" title to add your own value card. You can also tap the card to add a custom description.',
]

export const phases = [
    {
        id: 0,
        title: "First Step",
        nextInstruction: "Continue",
        numToKeep: 10,
        totalCards: 22,
        myValues: [],
        remainingDeck: [],
        shortInstruction: "Review the value cards and slide the top 10 that resonate the most with you to this area.",
        instructions: [
            `There are hundreds of values but on the screen are 22 common ones. We invite you now to review these plus any you want to add and identify 10 that resonate most with you by sliding them down into the "My Values" area.`,
            `Once you have filled the "My Values" area you can continue to the next step.`
        ]
    },
    {
        id: 1,
        title: "Second Step",
        nextInstruction: "Continue",
        numToKeep: 5,
        totalCards: 10,
        myValues: [],
        remainingDeck: [],
        shortInstruction: "Drilling deeper. What 5 values do you hold dear when living your life most fulfilled?",
        instructions: [
            `We are now going to drill deeper into your values. While all 10 of these values are important to you, what 5 values do you hold dear when living your life most fulfilled?`,
            `Once you have filled the "My Values" area you can continue to the next step.`
        ]
    },
    {
        id: 2,
        title: "Final Step",
        nextInstruction: "Finish",
        numToKeep: 2,
        totalCards: 5,
        myValues: [],
        remainingDeck: [],
        shortInstruction: "What 2 values do you feel you absolutely could not live without?",
        instructions: [
            `Of these 5 important values what 2 values do you feel you absolutely could not live without? When you are living at your best these would be the values that affect your decision making and actions the most. These are your Primary Values.`
        ]
    }
]