const landmarks = {
    "Elliott Tower": [42.673611, -83.215833],
    "Kresge Library": [42.6727, -83.2158],
    "O'Rena (Athletic Center)": [42.6740, -83.2132],
    "Meadow Brook Hall": [42.6722, -83.2015],
    "Engineering Center": [42.6719, -83.2149]
};

const map = L.map('map').setView([42.6727, -83.2158], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

let activeInput = 'latitude';
let currentMarker = null;

function appendNumber(number) {
    const latitudeInput = document.getElementById('latitude-input');
    const longitudeInput = document.getElementById('longitude-input');

    if (activeInput === 'latitude') {
        latitudeInput.value += number;
    } else {
        longitudeInput.value += number;
    }
}

function clearInput() {
    const latitudeInput = document.getElementById('latitude-input');
    const longitudeInput = document.getElementById('longitude-input');

    latitudeInput.value = '';
    longitudeInput.value = '';
}

function backspace() {
    const latitudeInput = document.getElementById('latitude-input');
    const longitudeInput = document.getElementById('longitude-input');

    if (activeInput === 'latitude') {
        latitudeInput.value = latitudeInput.value.slice(0, -1);
    } else {
        longitudeInput.value = longitudeInput.value.slice(0, -1);
    }
}

document.getElementById('latitude-input').addEventListener('focus', () => {
    activeInput = 'latitude';
});

document.getElementById('longitude-input').addEventListener('focus', () => {
    activeInput = 'longitude';
});

function locateCoordinates() {
    const latitudeInput = document.getElementById('latitude-input').value;
    const longitudeInput = document.getElementById('longitude-input').value;
    const inputCoords = [parseFloat(latitudeInput), parseFloat(longitudeInput)];

    if (!isNaN(inputCoords[0]) && !isNaN(inputCoords[1])) {
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }
        map.setView(inputCoords, 16);
        currentMarker = L.marker(inputCoords).addTo(map).bindPopup("Guess the Landmark!").openPopup();
        showLandmarkOptions(inputCoords);
    } else {
        alert("Please enter valid coordinates.");
        clearInput();
        if (currentMarker) {
            map.removeLayer(currentMarker);
            currentMarker = null;
        }
    }
}

function showLandmarkOptions(inputCoords) {
    const controls = document.querySelector('.controls');
    let landmarkSelectDiv = document.querySelector('#landmark-select-div');
    
    if (!landmarkSelectDiv) {
        landmarkSelectDiv = document.createElement('div');
        landmarkSelectDiv.setAttribute('id', 'landmark-select-div');

        const landmarkLabel = document.createElement('label');
        landmarkLabel.setAttribute('for', 'landmark-select');
        landmarkLabel.textContent = 'Select a Landmark:';

        const landmarkSelect = document.createElement('select');
        landmarkSelect.setAttribute('id', 'landmark-select');
        landmarkSelect.className = 'select';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '--Choose a landmark--';
        landmarkSelect.appendChild(defaultOption);

        for (const landmark in landmarks) {
            const option = document.createElement('option');
            option.value = landmark;
            option.textContent = landmark;
            landmarkSelect.appendChild(option);
        }

        const checkButton = document.createElement('button');
        checkButton.textContent = 'Check Landmark';
        checkButton.onclick = () => checkLandmark(inputCoords);

        landmarkSelectDiv.appendChild(landmarkLabel);
        landmarkSelectDiv.appendChild(landmarkSelect);
        landmarkSelectDiv.appendChild(checkButton);
        controls.appendChild(landmarkSelectDiv);
    } else {
        landmarkSelectDiv.querySelector('button').onclick = () => checkLandmark(inputCoords);
    }
}

function checkLandmark(inputCoords) {
    const selectedLandmark = document.getElementById('landmark-select').value;

    if (selectedLandmark && landmarks[selectedLandmark]) {
        const correctCoords = landmarks[selectedLandmark];

        if (inputCoords[0] === correctCoords[0] && inputCoords[1] === correctCoords[1]) {
            currentMarker.bindPopup(`${selectedLandmark} (Correct!)`).openPopup();
        } else {
            alert("Incorrect landmark. Try again.");
            clearInput();
            if (currentMarker) {
                map.removeLayer(currentMarker);
                currentMarker = null;
            }
        }
    } else {
        alert("Please select a landmark.");
    }
}
