console.log("Hello world!")


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

// Returns a HTML element of a card with given suit and rank.
// suit should be a single character that is one of D,H,S,C
// rank should be a number 0-12, where 0 is ace up to 12 is king
function generateCardElement(suit, rank) {
    let card = document.createElement("div");
    card.className = "card w-32 h-48 border border-black bg-amber-100";

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
    return card
}

// Returns a HTML element containing a stack of cards
// cards is an array of 2-arrays [suit, rank]
function generateCardStack(cards) {
    let stack = document.createElement('div');
    stack.className = 'stack w-32 h-full border border-red-200 border-3';
    for (let i = 0; i < cards.length; i++) {
        let card = generateCardElement(...cards[i]);
        card.classList.add('absolute')
        card.style.top = `${80*i}px`
        card.style.zIndex = i
        stack.appendChild(card)
    }
    return stack
}

window.onload = () => {
    //const myCard = generateCardElement('D', '11')
    const cardlist = [['S','12'],['D','10'],['C','1'],['H','0']]
    document.getElementById('c').appendChild(generateCardStack(cardlist))
};