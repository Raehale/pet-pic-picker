//recreate to be an app where a user can upload an image of their pet or child or special interest (in "folders" that will be come the radio buttons/imageTags) to and when the click the associated radio button, a random image with the appropriate tag shows up (for those of us who can't find any images of their babies when someone asks about them OR for those of us who miss our babies a whole lot when we're away form them. :'( I miss them rn, they're all right next to me. That's the hardest part of coding every day, spending less times with my babies <3))

import { petsData } from '/data.js';

const controlsContainer = document.getElementById('controls-container');

const radios = document.getElementsByClassName('radio');
const emotionRadios = document.getElementById('emotion-radios');

const gifsOnlyOption = document.getElementById('gifs-only-option');
const showAllOption = document.getElementById('show-all-option');

const getImgBtn = document.getElementById('get-image-btn');

const memeModal = document.getElementById('meme-modal');
const memeModalInner = document.getElementById('meme-modal-inner');
const memeModalCloseBtn = document.getElementById('meme-modal-close-btn');

renderEmotionsRadios(petsData);
emotionRadios.addEventListener('change', function(event) {
    highlightCheckedOption(event);
    disableBtn();
});

getImgBtn.addEventListener('click', renderPet);
givePetId();

memeModalCloseBtn.addEventListener('click', closeModal);
document.addEventListener('click', closeModalOutsideClick);

//radio buttons
function highlightCheckedOption(event) {
        
    for (let radio of radios) {
        
        radio.classList.remove('highlight');
    }
    
    document.getElementById(event.target.id).parentElement.classList.add('highlight');
}

//creates a list item for every unique emotion key
function renderEmotionsRadios(pets) {
        
    let radioItems = ``;
    let emotions = getEmotionsArray(pets);
    
    for (let emotion of emotions) {
        
        radioItems += `
        <div class="radio">
            <label for="${emotion}">${emotion}</label>
            <input
                type="radio"
                id="${emotion}"
                value="${emotion}"
                name="emotions"
            / >
        </div>`;
        
    }
    
    emotionRadios.innerHTML = radioItems;
    
}

//gets the list of matching objects (pets) with the chosen list item (emotion)
function getMatchingPetsArray() {
    if(document.querySelector('input[type="radio"]:checked')){
        
        const selectedEmotion = document.querySelector('input[type="radio"]:checked').value;
        const isGif = gifsOnlyOption.checked;  
        
        const matchingPetsArray = petsData.filter( function(pet) {
            
            //if the user selected GIFs only, it will only return objects (pet) with a key (isGift) of true
            if(isGif) {
                return pet.imageTags.includes(selectedEmotion) && pet.isGif;
            }
            
            return pet.imageTags.includes(selectedEmotion);
                    
        });
        
        return matchingPetsArray;
    }  
}

//returns an array (pets) of the unique values (emotions)
function getEmotionsArray(pets) {
    
    const emotionsArray = [];
    
    for (let pet of pets) {
        for (let emotion of pet.imageTags){
            if (!emotionsArray.includes(emotion)) {
                
                emotionsArray.push(emotion);
                
            }
        }
    }
    
    return emotionsArray;
}

//enables or disables Get Image button
function disableBtn() {
    if(document.querySelector('input[type="radio"]:checked')){
            
            getImgBtn.removeAttribute('disabled');
            return;
            
    }
    
    getImgBtn.addAttribute('disabled');
    
}

//places image in modal
function renderPet() {
    const singlePetObject = getSinglePetObject();
    const petObjects = getMatchingPetsArray();
        
    if (showAllOption.checked) {
        
        memeModalInner.classList.add('images-gallary');
        
        for (let pet of petObjects) {
                                    
            memeModalInner.innerHTML +=  `
                <img 
                    class="pet-img" 
                    id="${pet.id}"
                    src="./media/${pet.image}"
                    alt="${pet.alt}"
                    / >
                `;
            
        }

    } else {
        
        memeModalInner.innerHTML =  `;
            <img 
                class="pet-img" 
                id="${singlePetObject.id}"
                src="./media/${singlePetObject.image}"
                alt="${singlePetObject.alt}"
                / >
            `;
                
    }
    
    memeModal.style.display = 'flex';
    
}

//returns one pet object, by random if there is more than one match
function getSinglePetObject() {
    
    const petsArray = getMatchingPetsArray();
    
    if(petsArray.length === 1){
        
        return petsArray[0];
        
    }
    
    const randomNumber = Math.floor(Math.random() * petsArray.length);
    
    console.log(petsArray[randomNumber])
    return petsArray[randomNumber];
    
}

//gives each pet image a unique id
function givePetId() {
    for (let i = 0; i < petsData.length; i++) {
        
            Object.assign(petsData[i], {id: i});
            
    }
    
}

//close modal by clicking outside the modal
function closeModalOutsideClick(e) {
    if ((memeModal.style.display === 'flex') && (e.target.id === '')) {
        
        memeModal.style.display = 'none';
        
        resetForm();
        clearInnerModal();
        
    }
    
}

//close modal by clicking the x
function closeModal() {
    
    memeModal.style.display = 'none';
    
    resetForm();
    clearInnerModal();
    
}

//resets form on modal close
function resetForm() {
    
    // controlsContainer.reset();
    
}

//clears inner modal on modal close
function clearInnerModal() {
    
        memeModalInner.classList.remove('images-gallary');
        memeModalInner.innerHTML = '';
        
}