const birthday_array = ["1 -- Vanessa", "2 -- Sailing", "3 -- Karaoke", "4 -- Cats", "5 -- Being a US citizen", "6 -- Paella", "7 -- Watermelon Seeds", "8 -- Dancing with The Birds", "9 -- McSleeperson", "10 -- Arabic", "11 -- Amsterdam", "12 -- Legos", "13 -- Fountain Pens", "14 -- Hiking", "15 -- Design", "16 -- Battlestar Galactica", "17 -- Business School", "18 -- Being Cool", "19 -- Shorts", "20 -- Passing Math Tests", "21 -- Mentoring LGBTQIA Youth", "22 -- Palm Springs", "23 -- Voting", "24 -- Paddlingboarding", "25 -- Going to the Symphony", "26 – Captain's Hats", "27 -- The Kite", "28 -- Paw Fluff", "29 -- Obama", "30 -- The Gay Babadook", "31 -- Cooking", "32 -- Elliot the Cat", "33 -- The Art of Eyvind Earle", "34 -- No More Burning Man", "35 -- Boba", "36 -- Stationary", "37 -- Mansaf", "38 -- Tang", "39 -- Public Speaking", "40 – Broadway Musicals", "41 -- Cheese", "42 -- Buffalo Sauce", "43 -- Cher", "44 -- Disneyland", "45 -- Trying to make bowls", "46 -- Being a Ham", "47 -- Puns", "48 -- Cat meme", "49 -- The Band M83", "50 -- Music of Brahams", "51 -- Space Jam", "52 -- Eating in Movie Theaters", "53 -- Madonna", "54 -- Container Store", "55 -- Ukuleles", "56 – “New Phone Who Dis”", "57 -- Chucho", "58 -- The Holidays", "59 -- Rotterdam", "60 -- Tuca and Bertie", "61 -- Mass Effect", "62 -- The Movie Airplane", "63 -- Lilo & Stitch", "64 -- Gin and tonics", "65—The Dunes Book Series", "66 -- Synthesizers", "67 -- Podcast: Throwing Shade", "68 -- Merengues", "69 -- Teddy Bears", "70 -- Chicken Strips", "71 -- American Corner (diner in Jeddah)", "72 -- Mod FM", "73 -- Laura Benanti", "74 -- Carla Gugino", "75 – Spanish with Duolingo"]

let working_array = []

let used_array = []

function init() {
    const txtOutput = document.getElementById("bingo")
    const verifyOutput = document.getElementById("verify")
    verifyOutput.innerHTML = ''
    txtOutput.innerHTML = ''
    working_array.length = 0 // Clear contents
    used_array.length = 0
    working_array.push.apply(working_array, birthday_array)  // Append new contents
}

function new_item() {
    // get random array item index
    const item_number = Math.floor(Math.random() * working_array.length)

    // push text to div
    const txtOutput = document.getElementById("bingo")
    txtOutput.innerHTML = working_array[item_number]

    // add item to beginning of used_array
    used_array.unshift(working_array[item_number])

    // remove item from first array
    working_array.splice(item_number, 1)
}

function go_back() {
    const txtOutput = document.getElementById("bingo")
    txtOutput.innerHTML = used_array[1]
}

function verify() {
    const verifyOutput = document.getElementById("verify")
    new_text = used_array.join('<br>')
    verifyOutput.innerHTML = new_text
}
