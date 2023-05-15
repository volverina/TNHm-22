import * as faceapi from '../face/face-api.esm.js';

    let webcam, labelContainer;//,  optionsTinyFace;

    init();

    // Load the image model and setup the webcam
    async function init() {
	const modelPath = '../face/';
	await faceapi.nets.ssdMobilenetv1.load(modelPath);
	//optionsTinyFace = new faceapi.tinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

	await faceapi.nets.tinyFaceDetector.load(modelPath); 
	await faceapi.nets.ageGenderNet.load(modelPath);
	await faceapi.nets.faceLandmark68Net.load(modelPath);
	//await faceapi.nets.faceRecognitionNet.load(modelPath);
	await faceapi.nets.faceExpressionNet.load(modelPath);


        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

	let counter = 1;

	

    // run the webcam image through the image model
    async function predict() {
	counter++;

	if(counter % 10 == 0)
	{
		// predict can take in an image, video or canvas html element
		const prediction = await faceapi.detectSingleFace(webcam.canvas/*, optionsTinyFace*/).withFaceExpressions().withAgeAndGender();
		//console.log(prediction);
		if(prediction && prediction.age && prediction.genderProbability && prediction.gender && prediction.expressions)
		{
			labelContainer.innerHTML="Вік - " + Math.round(prediction.age) + " років<br>";
			labelContainer.innerHTML+="Gender - " + prediction.gender + " with probability of " + Math.round(prediction.genderProbability*100) + "<br>";
			labelContainer.innerHTML+="Neutral expression with probability " + Math.round(prediction.expressions["neutral"]*100) + "<br>";
			labelContainer.innerHTML+="Happy expression with probability " + Math.round(prediction.expressions["happy"]*100) + "<br>";
			labelContainer.innerHTML+="Neutral expression with probability " + Math.round(prediction.expressions["neutral"]*100) + "<br>";
			labelContainer.innerHTML+="Sad expression with probability " + Math.round(prediction.expressions["sad"]*100) + "<br>";
			labelContainer.innerHTML+="Angry expression with probability " + Math.round(prediction.expressions["angry"]*100) + "<br>";
			labelContainer.innerHTML+="Fearful expression with probability " + Math.round(prediction.expressions["fearful"]*100) + "<br>";
			labelContainer.innerHTML+="Disgusted expression with probability " + Math.round(prediction.expressions["disgusted"]*100) + "<br>";
			labelContainer.innerHTML+="Surprised expression with probability " + Math.round(prediction.expressions["surprised"]*100) + "<br>";
		}
	}
/*
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.innerHTML = classPrediction;
        }
*/
    }

