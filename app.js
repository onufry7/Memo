let cardsArray
let whichGame

const menuItems = document.querySelectorAll('.menuItem img')
const gridDisplay = document.querySelector('main')
const resultDisplay = document.querySelector('#result')
const approachDisplay = document.querySelector('#approach')
const cardsWon = []
let selectCards = []
let selectCardIds = []
let approach = 0
let lock = false;


function createBoard()
{
    for(let i = 0; i < cardsArray.length; i++)
    {
        const card = document.createElement('img')
        card.classList.add('card')
        card.setAttribute('src', 'img/'+whichGame+'/0.png')
        card.setAttribute('data-id', i)
        card.addEventListener('click', flipCard)
        gridDisplay.appendChild(card)
    }
}



function checkMatch()
{
    const cards = document.querySelectorAll('main > img.card')

    if(selectCards[0] == selectCards[1])
    {
        selectCardIds.forEach(cardId => {
            cards[cardId].style.opacity = 0
        })

        cardsWon.push(selectCards)
    }
    else
    {
        selectCardIds.forEach(cardId => {
            cards[cardId].setAttribute('src', 'img/'+whichGame+'/0.png')
            cards[cardId].addEventListener('click', flipCard)
            cards[cardId].addEventListener('click', flipCard)
            cards[cardId].classList.remove('cardActive')
        })
    }

    approachDisplay.textContent = ++approach
    resultDisplay.textContent = cardsWon.length
    selectCards = []
    selectCardIds = []
    lock = false

    if(cardsWon.length == cardsArray.length/2)
    {
        const esterEgg1 = (whichGame === 'pokemon') ? 'catch' : 'found'
        gridDisplay.innerHTML = '<p class="endGame">Congratulations You '+esterEgg1+' them all!<br><br><a href="index.html">New Game</a></p>'
    }
}


function flipCard()
{
    if (lock) return false
    
    let cardId = this.getAttribute('data-id')

    selectCards.push(cardsArray[cardId].name)
    selectCardIds.push(cardId)

    this.setAttribute('src', cardsArray[cardId].img)
    this.removeEventListener('click', flipCard)
    this.classList.add('cardActive')

    if(selectCards.length === 2)
    {
        lock = true
        setTimeout(checkMatch, 1000)
    }
}



async function runGame()
{
    whichGame = this.getAttribute('alt').toLowerCase()

    const grid = this.nextElementSibling.innerText.slice(1,-1).split("x")
    let gridCol = grid[0]
    let gridRow = grid[1]
    let gridWidth = gridCol*125+gridCol*10
    let gridHeight = gridRow*125+gridRow*10

    let response = await fetch("./jsons/"+whichGame+".json")
    let data = await response.json()
    cardsArray = data.cards

    cardsArray.sort(() => 0.5 - Math.random())

    gridDisplay.innerHTML = ''
    gridDisplay.style.maxWidth = gridWidth+'px'
    gridDisplay.style.minHeight = gridHeight+'px'
    createBoard()
}


menuItems.forEach(item => {
    item.addEventListener('click', runGame)
})

