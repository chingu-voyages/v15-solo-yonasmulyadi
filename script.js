let cards = [1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13]
let totalCards = cards.length;
let cardSectionCounter = 1;
let leftIncrement = 0.9;
let cardLeftPosition = [29.6, 29.6];
let isPlayerOneTurn = true;
let isStayButtonClicked = false;
let isFoldButtonClicked = false;
let playersTotalScore = [0,0];
let playersTotalBet = [0,0];
let playersStayCounter = [2,2];
let formResponses = [];
formResponses[2] = 20;
const board = document.querySelector('.board');
const playerOneBoard = document.querySelector('.board__cards__one');
const playerTwoBoard = document.querySelector('.board__cards__two');
const deckCounter = document.querySelector('.deck__count span');
const hitButton = document.querySelector('.hit');
const stayButton = document.querySelector('.stay');
const foldButton = document.querySelector('.fold');
const backButton = document.querySelector('.back__button');
const registerForm = document.querySelector('.register');
const playerOneField = document.querySelector('#player_one');
const playerTwoField = document.querySelector('#player_two');
const playersCounterDOM = document.querySelectorAll('.stay__counter');
const betOptions = document.querySelectorAll('.bet__choice');
const registerSubmitButton = document.querySelector('.form__button');
const playerNames = document.querySelectorAll('.player__name');
const playerCapitals = document.querySelectorAll('.player__bet')
const facebookButton = document.querySelector('.facebook');
const linkedinButton = document.querySelector('.linkedIn');
const playerOneBetField = document.querySelector('#bet_one');
const playerTwoBetField = document.querySelector('#bet_two');

const changeCardPosition = (className) => {
    let card = document.querySelector(className)
    isPlayerOneTurn ? card.style.top = '6rem' : card.style.top = '35rem';
    if (isPlayerOneTurn)
    {
        card.classList.add('card__top');
        cardLeftPosition[0] += leftIncrement;
        card.style.left = cardLeftPosition[0].toString() + 'rem';
    }
    else
    {
        card.parentElement.classList.add('card__bottom');
        cardLeftPosition[1] += leftIncrement;
        card.style.left = cardLeftPosition[1].toString() + 'rem';
    }
    card.style.opacity = '1';
    card.style.visibility = 'visible';
}

const changePlayerIndicator = (boolean, sectionOne, sectionTwo) => {
    if (boolean) 
    {
        document.querySelector(sectionOne).style.cssText = 'color: #ba3c23; background: #fff; border-radius: 5px';
        document.querySelector(sectionTwo).style.cssText = 'color: #fff; background: none';
    }
    else 
    {
        document.querySelector(sectionOne).style.cssText = 'color: #fff; background: none';
        document.querySelector(sectionTwo).style.cssText = 'color: #ba3c23; background: #fff; border-radius: 5px';
    }  
}

const createCard = (sourceUrl, alternateText) => {
    let card = document.createElement('div');
    let image = document.createElement('img');
    card.classList.add("card");
    image.src = sourceUrl;
    image.alt = alternateText;
    card.appendChild(image);
    return card;
}

const createNotifOverlay = () => {
    const overlay = document.createElement('div');
    overlay.classList.add('notifOverlay');
    overlay.style.cssText = 'position: absolute; top: 0; bottom: 0; left: 0; right: 0; background-color: rgba(197, 192, 191, .85); opacity: 0;  z-index: 100; transition: all 1s ease-out;'
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10)
    document.querySelector('main').appendChild(overlay);
}

const createNotifModal = (paraText, buttonText, imageSrc, imageAlt, sectionClass, textClass, imgClass, buttonClass) => {
    const modalContainer = document.createElement('section');
    const winnerMessage = document.createElement('p');
    const winnerIcon = document.createElement('img');
    const winnerButton  = document.createElement('button');
    modalContainer.classList.add(sectionClass);
    winnerMessage.classList.add(textClass);
    winnerIcon.classList.add(imgClass);
    winnerButton.classList.add(buttonClass);
    winnerMessage.textContent = paraText;
    winnerIcon.src = imageSrc;
    winnerIcon.alt = imageAlt;
    winnerButton.textContent = buttonText;
    modalContainer.innerHTML += winnerIcon.outerHTML + winnerMessage.outerHTML + winnerButton.outerHTML;
    board.appendChild(modalContainer);
}

const displayErrorMessage = (number, section, textField, message) => {
    const errorMessage = document.createElement('p');
    errorMessage.classList.add(`error__message__${number}`)
    errorMessage.textContent = message;
    section.appendChild(errorMessage);
    textField.style.borderColor = '#ba362d';
    errorMessage.style.cssText = 'color: #ba362d; font-size: .7rem; position: absolute';
}

const reducePlayerBet = (index) => {
    if (isFoldButtonClicked)
    {
        playersTotalBet[index] -= (parseInt(formResponses[2])/2);
        playerCapitals[index].textContent = playersTotalBet[index];
    }
    else
    {
        playersTotalBet[index] -= parseInt(formResponses[2]);
        playerCapitals[index].textContent = playersTotalBet[index];
    }
}

const increasePlayerBet = (index) => {
    if (isFoldButtonClicked)
    {
        playersTotalBet[index] += (parseInt(formResponses[2])/2);
        playerCapitals[index].textContent = playersTotalBet[index];
    }
    else
    {
        playersTotalBet[index] += parseInt(formResponses[2]);
        playerCapitals[index].textContent = playersTotalBet[index];
    }
}

const displayWinnerModal = () => {
    if (playersStayCounter[0] === 0)
    {
        reducePlayerBet(0);
        increasePlayerBet(1);
        createNotifModal(`${formResponses[1]} wins this round!`,'continue...', "./assets/images/golden-winners-cup_1284-18399.jpg", "winner", "winner__modal", "winner__message", "winner__icon", "winner__button");
        createNotifOverlay();
        setTimeout(() => {
            resetRound();
        },10);
    }
    else if (playersStayCounter[1] === 0)
    {
        reducePlayerBet(1);
        increasePlayerBet(0);
        createNotifModal(`${formResponses[0]} wins this round!`,'continue...', "./assets/images/golden-winners-cup_1284-18399.jpg", "winner", "winner__modal", "winner__message", "winner__icon", "winner__button");
            createNotifOverlay();
            setTimeout(() => {
                resetRound();
            },10);
    }

    if (playersTotalScore[0] >= 21)
    {
        reducePlayerBet(0);
        increasePlayerBet(1);
        if (playersTotalBet[0] <= 0)
        {
            createNotifModal(`${formResponses[1]} wins the game!`,'back to main menu', "./assets/images/cards-icon.png", "winner", "winner__modal", "winner__message", "winner__icon", "final__button");
            createNotifOverlay();
            setTimeout(() => {
                resetRound();
            },10);
        }
        else
        {
            createNotifModal(`${formResponses[1]} wins this round!`,'continue...', "./assets/images/golden-winners-cup_1284-18399.jpg", "winner", "winner__modal", "winner__message", "winner__icon", "winner__button");
            createNotifOverlay();
            setTimeout(() => {
                resetRound();
            },10);
        }
    }
    else if (playersTotalScore[1] >= 21)
    {
        reducePlayerBet(1);
        increasePlayerBet(0);
        if (playersTotalBet[1] <= 0)
        {
            createNotifModal(`${formResponses[0]} wins the game!`,'back to main menu', "./assets/images/cards-icon.png", "winner", "winner__modal", "winner__message", "winner__icon", "final__button");
            createNotifOverlay();
            setTimeout(() => {
                resetRound();
            },10);
        }
        else
        {
            createNotifModal(`${formResponses[0]} wins this round!`,'continue...', "./assets/images/golden-winners-cup_1284-18399.jpg", "winner", "winner__modal", "winner__message", "winner__icon", "winner__button");
            createNotifOverlay();
            setTimeout(() => {
                resetRound();
            },10);
        }
    }
}

const getCard = (number) => {
    let card;
    switch(number) {
        case 1:
            card = createCard('./assets/images/AS.png','cards');
            break;
        case 2:
            card = createCard('./assets/images/2D.png','cards');
            break;
        case 3:
            card = createCard('./assets/images/3C.png','cards');
            break;
        case 4:
            card = createCard('./assets/images/4H.png','cards');
            break;
        case 5:
            card = createCard('./assets/images/5S.png','cards');
            break;
        case 6:
            card = createCard('./assets/images/6D.png','cards');
            break;
        case 7:
            card = createCard('./assets/images/7C.png','cards');
            break;
        case 8:
            card = createCard('./assets/images/8S.png','cards');
            break;
        case 9:
            card = createCard('./assets/images/9D.png','cards');
            break;
        case 10:
            card = createCard('./assets/images/10H.png','cards');
            break;
        case 11:
            card = createCard('./assets/images/JC.png','cards');
            break;
        case 12:
            card = createCard('./assets/images/QD.png','cards');
            break;
        case 13:
            card = createCard('./assets/images/KH.png','cards');
            break;
        default:
            card = createCard('./assets/images/2D.png','cards');
            break;
    }
    playerTwoBoard.appendChild(card);
}

const recordResponses = (event, index) => {
    formResponses[index] = event.target.value;
}

const resetRoundValue = () => {
    playersTotalScore = [0,0];
    cardSectionCounter = 1;
    playersStayCounter = [2,2];
    cardLeftPosition = [29.6, 29.6];
    isPlayerOneTurn = true;
    isStayButtonClicked = false;
    const cardsInDisplay = document.querySelectorAll('.card');
    for (el of cardsInDisplay)
    {
        playerTwoBoard.removeChild(el);
    }
    cards = [1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13]; 
}

const resetRound = () => {
    const winnerModal = document.querySelector('.winner__modal');
    const notificationOverlay = document.querySelector('.notifOverlay');
    winnerModal.style.cssText = 'opacity:1; transform:translateY(0)';
    if (document.querySelector('.winner__button'))
    {
        const winnerButton = document.querySelector(`.winner__button`);
        winnerButton.addEventListener('click', () => {
            resetRoundValue();
            winnerModal.style.cssText = 'opacity:0; transform:translateY(-5rem)';
            notificationOverlay.style.cssText = 'opacity:0; z-index: -100';
            setTimeout(()=> {
                board.removeChild(winnerModal);
                document.querySelector('main').removeChild(notificationOverlay)
            },1000)
            setTimeout(() => {
                changePlayerIndicator(isPlayerOneTurn,'.board__cards__one p', '.board__cards__two p');
                deckCounter.innerHTML = totalCards;
                updateScore(0);
            }, 10)
        })  
    } 
    else if (document.querySelector('.surrender__button'))
    {
        const surrenderButton = document.querySelector(`.surrender__button`);
        surrenderButton.addEventListener('click', () => {
            resetRoundValue();
            winnerModal.style.cssText = 'opacity:0; transform:translateY(-5rem)';
            notificationOverlay.style.cssText = 'opacity:0; z-index: -100';
            setTimeout(()=> {
                board.removeChild(winnerModal);
                document.querySelector('main').removeChild(notificationOverlay)
            },1000)
            setTimeout(() => {
                changePlayerIndicator(isPlayerOneTurn,'.board__cards__one p', '.board__cards__two p');
                deckCounter.innerHTML = totalCards;
                updateScore(0);
            }, 10)
        })  
    } 
    else if (document.querySelector('.final__button'))
    {
        const winnerButton = document.querySelector('.final__button');
        winnerButton.addEventListener('click', () => {
            window.location.reload();
        })
    }
    for (el of playersCounterDOM)
    {
        el.textContent = '2';
    }
}

const resetErrorMessage = () => {
    if (formResponses[0])
    {
        if (document.querySelector('.error__message__1'))
        {
            document.querySelector('.form__player1').removeChild(document.querySelector('.error__message__1'));
            playerOneField.style.borderColor = 'rgb(185, 181, 181)';
        }
        else {
            playerOneField.style.borderColor = 'rgb(185, 181, 181)';
        }
    }
    if (formResponses[1])
    {
        if (document.querySelector('.error__message__2'))
        {
            document.querySelector('.form__player2').removeChild(document.querySelector('.error__message__2'));
            playerTwoField.style.borderColor = 'rgb(185, 181, 181)';
        }
        else {
            playerOneField.style.borderColor = 'rgb(185, 181, 181)';
        }
    }
    if (formResponses[3])
    {
        if (document.querySelector('.error__message__3'))
        {
            document.querySelector('.betting__form1').removeChild(document.querySelector('.error__message__3'));
            playerOneBetField.style.borderColor = 'rgb(185, 181, 181)';
        }
        else {
            playerOneField.style.borderColor = 'rgb(185, 181, 181)';
        }
    }
    if (formResponses[4]) 
    {
        if (document.querySelector('.error__message__4'))
        {
            document.querySelector('.betting__form2').removeChild(document.querySelector('.error__message__4'));
            playerTwoBetField.style.borderColor = 'rgb(185, 181, 181)';
        }
        else {
            playerOneField.style.borderColor = 'rgb(185, 181, 181)';
        }
    }
}

const updateAllCounter = () => {
    let nullCounter = 0;
    for (el of cards)
    {
        if (el === null)
        {
            nullCounter += 1;
        }
    }
    deckCounter.innerHTML = totalCards - nullCounter;
    cardSectionCounter += 1;
    isPlayerOneTurn ? isPlayerOneTurn = false : isPlayerOneTurn = true;
}

const updateScore = (increment) => {
    isPlayerOneTurn ? playersTotalScore[0] += increment : playersTotalScore[1] += increment;
    playerOneBoard.querySelector('.board__score').innerHTML =  playersTotalScore[0];
    playerTwoBoard.querySelector('.board__score').innerHTML = playersTotalScore[1];
}

//Event listeners
hitButton.addEventListener('click', () => {
    let cardIndex;
    let cardValue;
    let cardOfType = `.card:nth-of-type(${cardSectionCounter}) img`;
    isStayButtonClicked = false;
    do
    {
        cardIndex = Math.floor(Math.random() * 52);
        cardValue = cards[cardIndex];
    }
    while (cardValue === null)
    updateScore(cardValue)
    getCard(cards[cardIndex]);
    cards[cardIndex] = null; 
    setTimeout(() => {
        changeCardPosition(cardOfType)
    },10);
    setTimeout(() => {
        updateAllCounter();
        changePlayerIndicator(isPlayerOneTurn,'.board__cards__one p', '.board__cards__two p');
        displayWinnerModal();
    },20)
})

stayButton.addEventListener('click', () => {
    if (isPlayerOneTurn) 
    {
        playersStayCounter[0] -= 1;
        playersCounterDOM[0].textContent = playersStayCounter[0];
        displayWinnerModal();
    }
    else 
    {
        playersStayCounter[1] -= 1;
        playersCounterDOM[1].textContent = playersStayCounter[1];
        displayWinnerModal();
    }
    isPlayerOneTurn ? isPlayerOneTurn = false : isPlayerOneTurn = true;
    changePlayerIndicator(isPlayerOneTurn,'.board__cards__one p', '.board__cards__two p');
})

foldButton.addEventListener('click', () => {
    if (isPlayerOneTurn) 
    {
        isFoldButtonClicked = true;
        createNotifModal(`${formResponses[0]} surrender! ${formResponses[1]} wins the round!`,'continue..', "./assets/images/👻-Hantu-Apple.png", "winner", "winner__modal", "winner__message", "winner__icon", "surrender__button");
        createNotifOverlay();
        resetRound();
        increasePlayerBet(1);
        isFoldButtonClicked = false;
    }
    else 
    {
        isFoldButtonClicked = true;
        createNotifModal(`${formResponses[1]} surrender! ${formResponses[0]} wins the round!`,'continue..', "./assets/images/👻-Hantu-Apple.png", "winner", "winner__modal", "winner__message", "winner__icon", "surrender__button");
        createNotifOverlay();
        resetRound();
        increasePlayerBet(0);
        isFoldButtonClicked = false;
    }
})

backButton.addEventListener('click', () => {
    window.location.reload();
})

window.addEventListener('load', () => {
    registerForm.style.cssText = 'opacity: 1; transform: translateY(0)';
})

playerOneField.addEventListener('change', () => {
    recordResponses(event, 0);
})

playerTwoField.addEventListener('change', () => {
    recordResponses(event, 1);
})

for (el of betOptions)
{
    el.addEventListener('change', () => {
        recordResponses(event, 2)
    })
}

playerOneBetField.addEventListener('change', () => {
    recordResponses(event, 3);
})

playerTwoBetField.addEventListener('change', () => {
    recordResponses(event, 4);
})

registerForm.querySelector(".register__form").addEventListener('submit', (event) => {
    event.preventDefault();
    resetErrorMessage();
    if ((!formResponses[0] && !formResponses[1]) && (!formResponses[3] && !formResponses[4]))
    {  
        if ((!document.querySelector('.error__message__1') && !document.querySelector('.error__message__2')) && (!document.querySelector('.error__message__3') && !document.querySelector('.error__message__4')))
        {
            displayErrorMessage(1,document.querySelector('.form__player1'), playerOneField, `field cannot be blank`);
            displayErrorMessage(2,document.querySelector('.form__player2'), playerTwoField, `field cannot be blank`);
            displayErrorMessage(3,document.querySelector('.betting__form1'), playerOneBetField, `field cannot be blank`);
            displayErrorMessage(4,document.querySelector('.betting__form2'), playerTwoBetField, `field cannot be blank`);
        }    
    }
    else if (formResponses[0] && ((!formResponses[1] && !formResponses[3]) && !formResponses[4]))
    {
        if ((!document.querySelector('.error__message__2') && !document.querySelector('.error__message__3')) && (!document.querySelector('.error__message__4')))
        {
            displayErrorMessage(2,document.querySelector('.form__player2'), playerTwoField, `field cannot be blank`);
            displayErrorMessage(3,document.querySelector('.betting__form1'), playerOneBetField, `field cannot be blank`);
            displayErrorMessage(4,document.querySelector('.betting__form2'), playerTwoBetField, `field cannot be blank`);
        }    
    }
    else if (formResponses[1] && ((!formResponses[0] && !formResponses[3]) && !formResponses[4]))
    {
        if ((!document.querySelector('.error__message__1') && !document.querySelector('.error__message__3')) && (!document.querySelector('.error__message__4')))
        {
            displayErrorMessage(1,document.querySelector('.form__player1'), playerOneField, `field cannot be blank`);
            displayErrorMessage(3,document.querySelector('.betting__form1'), playerOneBetField, `field cannot be blank`);
            displayErrorMessage(4,document.querySelector('.betting__form2'), playerTwoBetField, `field cannot be blank`);
        }    
    }
    else if (formResponses[3] && ((!formResponses[0] && !formResponses[1]) && !formResponses[4]))
    {
        if ((!document.querySelector('.error__message__1') && !document.querySelector('.error__message__2')) && (!document.querySelector('.error__message__4')))
        {
            displayErrorMessage(1,document.querySelector('.form__player1'), playerOneField, `field cannot be blank`);
            displayErrorMessage(2,document.querySelector('.form__player2'), playerTwoField, `field cannot be blank`);
            displayErrorMessage(4,document.querySelector('.betting__form2'), playerTwoBetField, `field cannot be blank`);
        }    
    }
    else if (formResponses[4] && ((!formResponses[0] && !formResponses[1]) && !formResponses[3]))
    {
        if ((!document.querySelector('.error__message__1') && !document.querySelector('.error__message__2')) && (!document.querySelector('.error__message__3')))
        {
            displayErrorMessage(1,document.querySelector('.form__player1'), playerOneField, `field cannot be blank`);
            displayErrorMessage(2,document.querySelector('.form__player2'), playerTwoField, `field cannot be blank`);
            displayErrorMessage(3,document.querySelector('.betting__form1'), playerOneBetField, `field cannot be blank`);
        }    
    }
    else if ((formResponses[0] && formResponses[1]) && (!formResponses[3] && !formResponses[4]))
    {
        if (!document.querySelector('.error__message__3') && !document.querySelector('.error__message__4'))
        {
            displayErrorMessage(1,document.querySelector('.betting__form1'), playerOneBetField, `field cannot be blank`);
            displayErrorMessage(2,document.querySelector('.betting__form2'), playerTwoBetField, `field cannot be blank`);
        }    
    }
    else if ((formResponses[1] && formResponses[3]) && (!formResponses[0] && !formResponses[4]))
    {
        if (!document.querySelector('.error__message__1') && !document.querySelector('.error__message__4'))
        {
            displayErrorMessage(1,document.querySelector('.form__player1'), playerOneField, `field cannot be blank`);
            displayErrorMessage(4,document.querySelector('.betting__form2'), playerTwoBetField, `field cannot be blank`);
        }    
    }
    else if ((formResponses[3] && formResponses[4]) && (!formResponses[0] && !formResponses[1]))
    {
        if (!document.querySelector('.error__message__1') && !document.querySelector('.error__message__2'))
        {
            displayErrorMessage(1,document.querySelector('.form__player1'), playerOneField, `field cannot be blank`);
            displayErrorMessage(2,document.querySelector('.form__player2'), playerTwoField, `field cannot be blank`);
        }    
    }
    else if ((formResponses[0] && formResponses[4]) && (!formResponses[1] && !formResponses[3]))
    {
        if (!document.querySelector('.error__message__2') && !document.querySelector('.error__message__3'))
        {
            displayErrorMessage(2,document.querySelector('.form__player2'), playerTwoField, `field cannot be blank`);
            displayErrorMessage(3,document.querySelector('.betting__form1'), playerOneBetField, `field cannot be blank`);
        }    
    }
    else if ((formResponses[0] && formResponses[3]) && (!formResponses[1] && !formResponses[4]))
    {
        if (!document.querySelector('.error__message__2') && !document.querySelector('.error__message__4'))
        {
            displayErrorMessage(2,document.querySelector('.form__player2'), playerTwoField, `field cannot be blank`);
            displayErrorMessage(4,document.querySelector('.betting__form2'), playerTwoBetField, `field cannot be blank`);
        }    
    }
    else if ((formResponses[1] && formResponses[4]) && (!formResponses[0] && !formResponses[3]))
    {
        if (!document.querySelector('.error__message__1') && !document.querySelector('.error__message__3'))
        {
            displayErrorMessage(1,document.querySelector('.form__player1'), playerOneField, `field cannot be blank`);
            displayErrorMessage(3,document.querySelector('.betting__form1'), playerOneBetField, `field cannot be blank`);
        }    
    }
    else if (!formResponses[0] && ((formResponses[1] && formResponses[3]) && formResponses[4]))
    {
        if (!document.querySelector('.error__message__1'))
        {
            displayErrorMessage(1,document.querySelector('.form__player1'), playerOneField, `field cannot be blank`);
        } 
    }  
    else if (!formResponses[1] && ((formResponses[0] && formResponses[3]) && formResponses[4]))
    {
        if (!document.querySelector('.error__message__2'))
        {
            displayErrorMessage(2,document.querySelector('.form__player2'), playerTwoField, `field cannot be blank`);
        }
    }
    else if (!formResponses[3] && ((formResponses[0] && formResponses[1]) && formResponses[4]))
    {
        if (!document.querySelector('.error__message__3'))
        {
            displayErrorMessage(3,document.querySelector('.betting__form1'), playerOneBetField, `field cannot be blank`);
        }
    }
    else if (!formResponses[4] && ((formResponses[0] && formResponses[1]) && formResponses[3]))
    {
        if (!document.querySelector('.error__message__4'))
        {
            displayErrorMessage(4,document.querySelector('.betting__form2'), playerTwoBetField, `field cannot be blank`);
        }
    }
    else
    {        
        playerNames[0].textContent = formResponses[0];
        playerNames[1].textContent = formResponses[1];
        if (isNaN(parseInt(formResponses[3])))  
        {
            if (isNaN(parseInt(formResponses[4])))
            {
                displayErrorMessage(3,document.querySelector('.betting__form1'), playerOneBetField, `Please enter only numbers`);
                displayErrorMessage(4,document.querySelector('.betting__form2'), playerTwoBetField, `Please enter only numbers`);
            }
            else
            {
                displayErrorMessage(3,document.querySelector('.betting__form1'), playerOneBetField, `Please enter only numbers`);
            }
        }
        else if(isNaN(parseInt(formResponses[4])))
        {
            displayErrorMessage(4,document.querySelector('.betting__form2'), playerTwoBetField, `Please enter only numbers`);
        }
        else
        {
            if (formResponses[3] < 100)
            {
                if (formResponses[4] < 100)
                {
                    displayErrorMessage(3,document.querySelector('.betting__form1'), playerOneBetField, `please bet at least 100$`);
                    displayErrorMessage(4,document.querySelector('.betting__form2'), playerTwoBetField, `please bet at least 100$`);
                }
                else
                {
                    displayErrorMessage(3,document.querySelector('.betting__form1'), playerTwoBetField, `please bet at least 100$`);
                }
            }
            else if (formResponses[4] < 100)
            {
                displayErrorMessage(4,document.querySelector('.betting__form2'), playerTwoBetField, `please bet at least 100$`);
            }
            else 
            {
                playersTotalBet[0] = parseInt(formResponses[3]);
                playersTotalBet[1] = parseInt(formResponses[4]);
                playerCapitals[0].textContent = playersTotalBet[0];
                playerCapitals[1].textContent = playersTotalBet[1];
                registerForm.style.opacity = 0;
                document.querySelector('.overlay').style.cssText =  'z-index: -100';
                document.querySelector('.overlay').style.transform = 'translateX(-100rem)';
            }
        }
    }
})

//Code which run individually without event listeners

changePlayerIndicator(isPlayerOneTurn,'.board__cards__one p', '.board__cards__two p');
deckCounter.innerHTML = totalCards;
updateScore(0);

