//recreate to be an app where a user can upload an image of their pet or child or special interest (in "folders" that will be come the radio buttons/imageTags) to and when the click the associated radio button, a random image with the appropriate tag shows up (for those of us who can't find any images of their babies when someone asks about them OR for those of us who miss our babies a whole lot when we're away form them. :'( I miss them rn, they're all right next to me. That's the hardest part of coding every day, spending less times with my babies <3))

import { petsData } from '/data.js';

const controlsContainer = document.getElementById('controls-container');

const radios = document.getElementsByClassName('radio');
const emotionRadios = document.getElementById('emotion-radios');
const checkboxes = document.getElementsByClassName('checkbox');
const checkboxesContainer = document.getElementById('checkboxes-container');

const gifsOnlyOption = document.getElementById('gifs-only-option');
const showAllOption = document.getElementById('show-all-option');

const addImgBtn = document.getElementById('add-img-btn');
const getImgBtn = document.getElementById('get-image-btn');

const memeModal = document.getElementById('image-modal');
const modalBackBtn = document.getElementById('image-modal-back-btn');
const modalTitle = document.getElementById('image-modal-title');
const memeModalInner = document.getElementById('image-image-modal-inner');
const petImgEls = document.getElementsByClassName('pet-img');
const imageModalCloseBtn = document.getElementById('image-modal-close-btn');
const uploadModalCloseBtn = document.getElementById('upload-modal-close-btn');

const uploadModal = document.getElementById('upload-modal');

renderEmotionsRadios(petsData);
emotionRadios.addEventListener('change', function(event) {
    highlightCheckedOption(event);
    disableBtn();
});

checkboxesContainer.addEventListener('change', function(event) {
    highlightCheckedBox(event);
});

addImgBtn.addEventListener('click', uploadPic);

getImgBtn.addEventListener('click', renderPet);
givePetId();

imageModalCloseBtn.addEventListener('click', closeModal);
uploadModalCloseBtn.addEventListener('click', closeModal);
document.addEventListener('click', closeModalOutsideClick);

//radio buttons
function highlightCheckedOption(event) {

    for (let radio of radios) {

        radio.classList.remove('highlight');
    }

    document.getElementById(event.target.id).parentElement.classList.add('highlight');

}

//checkbox buttons
function highlightCheckedBox(event) {

    if (document.getElementById(event.target.id).checked) {
        document.getElementById(event.target.id).parentElement.classList.add('highlight-checkbox');
    } else {
        document.getElementById(event.target.id).parentElement.classList.remove('highlight-checkbox');
    }

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

//allows the user to upload an image within a modal
function uploadPic() {
    uploadModal.style.display = 'flex';
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
    const selectedRadio = document.querySelector('input[type="radio"]:checked').value

    modalTitle.innerHTML = selectedRadio;

    if (showAllOption.checked) {

        memeModalInner.classList.add('images-gallary');
        memeModalInner.setAttribute('id', 'images-gallary');

        for (let pet of petObjects) {

            memeModalInner.innerHTML +=  `
                <img 
                    class="pet-img" 
                    id="${pet.id}"
                    src="./media/${pet.image}"
                    alt="${pet.alt}"
                    tags="${pet.imageTags}"
                    / >
                `;

        }

    } else {

        memeModalInner.innerHTML =  `
            <img 
                class="pet-img" 
                id="${singlePetObject.id}"
                src="./media/${singlePetObject.image}"
                alt="${singlePetObject.alt}"
                tags="${singlePetObject.imageTags}"
                / >
                <div class="pet-img-caption">${singlePetObject.caption}</div>
            `;

    }

    memeModal.style.display = 'flex';

    const imagesGallaryEl = document.getElementById('images-gallary');
// console.log(imagesGallaryEl)
    if (imagesGallaryEl) {
        imagesGallaryEl.addEventListener('click', function(event) {
            openImg(event);
        });
    } else {
        return;
    }

}

//hides all other image when multiple images are showing and one is selected
function openImg(event) {

    let selectedEl = document.getElementById(event.target.id);

    if (selectedEl.classList.contains('pet-img')) {
        for (let img of petImgEls) {
            img.style.display = 'none';
        }

        selectedEl.classList.add('full-img');
        selectedEl.style.display = 'flex';
    }

    modalBackBtn.style.display = 'flex';
    modalBackBtn.addEventListener('click', backToMultiplePetObjects);

}

//shows all images when multiple images enabled and back btn clicked
function backToMultiplePetObjects() {

    for (let img of petImgEls) {

        img.style.display = 'flex';
        img.classList.remove('full-img');

    }

    modalBackBtn.style.display = 'none';

}

//returns one pet object, by random if there is more than one match
function getSinglePetObject() {

    const petsArray = getMatchingPetsArray();

    if(petsArray.length === 1){

        return petsArray[0];

    }

    const randomNumber = Math.floor(Math.random() * petsArray.length);

    return petsArray[randomNumber];

}

//gives each pet image a unique id
function givePetId() {
    for (let i = 0; i < petsData.length; i++) {

            Object.assign(petsData[i], {id: i});

    }
    
}

//close modal by clicking outside the modal
function closeModalOutsideClick(event) {
    if ((memeModal.style.display === 'flex') && (event.target.id === '')) {

        memeModal.style.display = 'none';
        uploadModal.style.display = 'none';

        resetForm();
        clearModal();

    }

}

//close modal by clicking the x
function closeModal() {

    memeModal.style.display = 'none';
    uploadModal.style.display = 'none';

    resetForm();
    clearModal();

}

//resets form on modal close
function resetForm() {

    controlsContainer.reset();

    for (let radio of radios) {
        radio.classList.remove('highlight');
    }

    for (let checkbox of checkboxes) {
        checkbox.classList.remove('highlight-checkbox');
    }
    
}

//clears modal on modal close
function clearModal() {

        memeModalInner.classList.remove('images-gallary');
        memeModalInner.removeAttribute('id');
        memeModalInner.innerHTML = '';
        modalBackBtn.style.display = 'none';

}