// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/hvarC0hiT/";

let model, webcam, labelContainer, maxPredictions;
const progBar = document.getElementById("prog-bar-cont");
// Get the modal
var modal = document.getElementById("myModal");

async function startWebcam(){
    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(375, 375, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    webcam.update();
}

startWebcam(); 

// Load the image model and setup the webcam
document.getElementById("myBtn").addEventListener("click", async () => {
    modal.style.display = "block";
    progBar.style.display = "block";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    progBar.classList.add("active");
    await predict();
});

async function loop() {
    webcam.update(); // update the webcam frame
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    console.log('fish');
    const delay = new Promise(r => setTimeout(r, 3000));
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    await delay;
    progBar.style.display = "none";
    let sexuality = '';
    let highestProbability = 0;
    labelContainer.innerHTML = "Boring Details: ";
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(2) + "%";
        labelContainer.innerHTML += classPrediction;
        if(sexuality == ''){
            sexuality = prediction[i].className;
            highestProbability = prediction[i].probability;
        }
        else if(prediction[i].probability >= highestProbability){
            highestProbability = prediction[i].probability;
            sexuality = prediction[i].className;
        }
    }
    labelContainer.style.display = "block";
    console.log(sexuality);
    let sexualityDiv = document.getElementById(sexuality);
    sexualityDiv.style.display = "block";
    playAudio(sexuality);
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    hideAllElements();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    hideAllElements();
  }
}

function hideAllElements(){
    modal.style.display = "none";
    labelContainer.style.display = "none";
    progBar.classList.remove("active");
    document.getElementById("Gay").style.display = "none";
    document.getElementById("Straight").style.display = "none";
    document.getElementById("Bisexual").style.display = "none";
}

function playAudio(sexuality){
    console.log(sexuality)
    var audio = document.getElementById(sexuality + 'Audio');
    audio.currentTime = 0; // Rewind to the start
    audio.play();
}
