    let webcam, labelContainer, detector;

    init();

    // Load the image model and setup the webcam
    async function init() {

	const model = handPoseDetection.SupportedModels.MediaPipeHands;
	const detectorConfig = {
	  runtime: 'mediapipe', // or 'tfjs',
	  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
	  modelType: 'lite'
	}
	detector = await handPoseDetection.createDetector(model, detectorConfig);	

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
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

	const skipCount = 5;
	let frameCount = 0;

    // run the webcam image through the image model
    async function predict() {
	if(frameCount % skipCount == 0)
	{
		const hands = await detector.estimateHands(webcam.canvas);
		//console.log(hands);

		if(hands.length == 0)
			labelContainer.innerHTML = "Не бачу рук";
		else
		{
			if(hands[0].handedness == "Left")
				labelContainer.innerHTML = "Бачу ліву руку<br><br>";
			else
				labelContainer.innerHTML = "Бачу праву руку<br><br>";

			for(let i=0;i<hands[0].keypoints.length;i++)
				labelContainer.innerHTML += hands[0].keypoints[i].name + 
					": (" + Math.round(hands[0].keypoints[i].x) +
					", " +Math.round(hands[0].keypoints[i].y) + ")<br>";
		}
	}

        // predict can take in an image, video or canvas html element
	/*
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.innerHTML = classPrediction;
        }
	*/
	frameCount++;
    }

