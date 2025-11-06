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
