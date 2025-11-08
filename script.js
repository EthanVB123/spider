console.log("Hello world!")
let stacks = []
const cardGap = 5; // vh; gap between cards in same stack
// Returns a random integer between the two bounds.
// Input: two bounds. Output: a random integer.
function randint(lowerInclusive, upperExclusive) {
    return Math.floor(lowerInclusive + Math.random()*(upperExclusive-lowerInclusive))
}

// Returns a fairly randomised shuffle of a list. (Fisher-Yates algorithm)
// Input: the list. Output: a list of the same length, with randomised order. Note that this is an inplace shuffle so the original list is changed.
function shuffle(items) {
    for (let i = 0; i < items.length; i++) {
        let randomIndex = randint(i, items.length)
        let temp = items[i]
        items[i] = items[randomIndex]
        items[randomIndex] = temp
    }
    return items
}

// Returns the order of n standard decks of cards shuffled together.
// Format: 52n-array of 3-arrays [suit, rank, copy] where suit is a 1-character string in 'DSCH' and rank is int 0-12 where 0 is ace and 12 is king and copy = 0 or 1 (for uniqueness)
function shuffleDecksOfCards(numDecks) {
    let output = []
    let suits = ['D','H','C','S']
    for (let copy = 0; copy < numDecks; copy++) {
        for (let rank = 0; rank < 13; rank++) {
            suits.forEach((suit) => {output.push([suit, rank, copy])})
        }
    }
    return shuffle(output)
}
// Returns a HTML element of a card with given suit, rank, and copy.
// suit should be a single character that is one of D,H,S,C
// rank should be a number 0-12, where 0 is ace up to 12 is king
// copy should be 0 or 1
function generateCardElement(suit, rank, copy) {
    let card = document.createElement("div");
    card.className = "card w-[8vw] h-48 border border-black bg-amber-100";

    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
    const rankString = ranks[rank]
    let suit_unicode;
    switch (suit) {
        case 'D':
            suit_unicode = "&diams;"
            card.classList.add('text-red-500')
            break;
        case 'H':
            suit_unicode = "&hearts;"
            card.classList.add('text-red-500')
            break;
        case 'C':
            suit_unicode = "&clubs;"
            break;
        case 'S':
            suit_unicode = "&spades;"
            break;
        default:
            suit_unicode = "X";
            break;
    }

    card.innerHTML = `<div class="h-20 w-full text-2xl">${rankString}${suit_unicode}</div><div class="w-full text-center text-5xl">${suit_unicode}</div>`
    card.id = `card-${copy}${suit}${rank}`
    return card
}

// Returns a HTML element containing a stack of cards
// cards is an array of 2-arrays [suit, rank]
function generateCardStack(cards) {
    let stack = document.createElement('div');
    stack.className = 'stack w-full h-full';
    for (let i = 0; i < cards.length; i++) {
        let card = generateCardElement(...cards[i]);
        card.classList.add('absolute')
        card.style.top = `${cardGap*i}vh`
        card.style.zIndex = i
        stack.appendChild(card)
    }
    return stack
}

function splitStack(event) {
    let heldStack = document.getElementById('heldStack')
    if (heldStack.childElementCount > 0) {
        console.log("already holding cards!")
        return null
    }
    if (event.target.id.substring(0,4) == 'card') {
        cardClicked = event.target
    } else if (event.target.parentElement.id.substring(0,4) == 'card') {
        cardClicked = event.target.parentElement
    } else {
        console.log('No card clicked. Aborting')
        return null
    }
    let cardArrayClicked = [cardClicked.id[6],parseInt(cardClicked.id.substring(7)),parseInt(cardClicked.id[5])]
    let locationClicked = cardClicked.parentElement.parentElement // the location object
    let stackClicked = stacks[locationClicked.id.substring(9)]
    const indexClicked = stackClicked.findIndex(
        (item) => item.every((value, index) => value === cardArrayClicked[index])
    );
    console.log(indexClicked)

    for (let i = indexClicked; i < stackClicked.length; i++) {
        heldStack.appendChild(document.getElementById(`card-${stackClicked[i][2]}${stackClicked[i][0]}${stackClicked[i][1]}`))
    }
    stacks[locationClicked.id.substring(9)] = stackClicked.slice(0, indexClicked)
    orderStack(heldStack)
    return heldStack
}

function moveStack(event) {
    document.getElementById('heldStack').style.top = `${event.clientY}px`
    document.getElementById('heldStack').style.left = `${event.clientX}px`
}

// Correctly format the children of stackElement to ensure the cards are in the correct order with no unsightly gaps.
function orderStack(stackElement) {
    for (const [index, child] of Array.from(stackElement.children).entries()) {
        child.style.top = `${cardGap*index}vh`
        child.style.zIndex = index
    }
}

function dropStack(event) {
    dropLocation = event.target
    if (dropLocation == null || dropLocation.id == 'game') {
        console.log('No stack clicked')
        return null
    }
    while (!dropLocation.classList.contains('stack-location')) {
        dropLocation = dropLocation.parentElement
        if (dropLocation.tagName == 'html') {
            console.log('No stack clicked')
            return null
        }
    }
    stackLocationDropped = dropLocation.id.substring(9)
    stackDroppedOnto = dropLocation.children[0] // TODO allow drop onto empty stack
    for (const child of stackDroppedOnto.children) {
        console.log(`${child.id}`)
    }
    // TODO verify legal drop
    cardsToDrop = Array.from(document.getElementById('heldStack').children)
    console.log(cardsToDrop)
    for (const card of cardsToDrop) {
        stackDroppedOnto.appendChild(card)
    }
    // TODO update stacks
    orderStack(stackDroppedOnto)
    return stackDroppedOnto
}

window.onload = () => {
    //const myCard = generateCardElement('D', '11')
    const mainGameObject = document.getElementById('game')
    const stackSizes = [6,6,6,6,5,5,5,5,5,5] // starting arrangement of how many cards are in each column
    const cards = shuffleDecksOfCards(2) // shuffle and distribute the cards
    let cardsDealt = 0 //how many cards have already been dealt
    // create the playing columns and fill them with cards
    for (let i = 0; i < stackSizes.length; i++) {
        stackLocation = document.createElement('div')
        stackLocation.className = 'h-full w-[8vw] flex-none gap-[1vw] stack-location'
        stackLocation.id = `location-${i}`
        const cardsToDeal = cards.slice(cardsDealt, cardsDealt+stackSizes[i])
        cardsDealt += stackSizes[i]
        stackLocation.appendChild(generateCardStack(cardsToDeal))
        stacks.push(cardsToDeal)
        mainGameObject.appendChild(stackLocation)
    }

    document.addEventListener('mousedown', splitStack)
    document.addEventListener('mousemove', moveStack)
    document.addEventListener('mouseup', dropStack)
};