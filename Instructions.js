export const game_instructions = [
    'Each value is represented by a digital card. Swipe left or right through the cards and tap a card to toggle more detailed descriptions.',
    'For values which resonate most with you slide them down into the area labeled "My Values". You can return cards for consideration by sliding them out of the area. Once you’ve filled the area a "Continue" button will appear to progress to the next activity',
    'The values cards include a customizable blank card. Touch the "Custom Value" title to add your own value card. You can also tap the card to add custom description.',
]

export const phases = [
    {
        id: 0,
        numToKeep: 10,
        totalCards: 22,
        myValues: [],
        remainingDeck: [],
        instructions: [
            `There are hundreds of values. On the following screen are 22 common ones. We invite you now to review these plus any you want to add and identify 10 that resonate most with you by sliding them down into the "My Values" area.`,
            `Once you have filled the "My Values" area you can continue to the next phase.`
        ]
    },
    {
        id: 1,
        numToKeep: 5,
        totalCards: 10,
        myValues: [],
        remainingDeck: [],
        instructions: [
            `We are now going to drill deeper into your values. While all 10 of these values are important to you, what 5 values do you hold dear when living your life most fulfilled?`,
            `Once you have filled the "My Values" area you can continue to the next phase.`
        ]
    },
    {
        id: 2,
        numToKeep: 2,
        totalCards: 5,
        myValues: [],
        remainingDeck: [],
        instructions: [
            `Of these 5 important values what 2 values do you feel you absolutely could not live without? When you are living at your best these would be the values that affect your decision making and actions the most. These are your Primary Values.`
        ]
    }
]