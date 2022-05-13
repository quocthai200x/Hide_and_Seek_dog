import React, { useEffect, useState, useRef } from 'react'
import './DogPlayground.css'
import dog_barking from "../assets/dog_barking.mp3";

const heightW = window.innerHeight;
const widthW = window.innerWidth;

function DogPlaygroundScreen() {
    const [yDog, setyDog] = useState(Math.random(0, heightW));
    const [xDog, setxDog] = useState(Math.random(0, widthW));
    const [score, setScore] = useState(0)
    const [humanPosition, sethumanPosition] = useState({ x: 0, y: 0 });
    const [barkingSignal, setBarkingSignal] = useState(0);
    const humanSize = 50;
    const dogRef = useRef();
    const barkingSound = new Audio(dog_barking);
    const dogSize = { width: 75, height: 75 }
  

    // }, [])


    useEffect(() => {
        setUpMouseListener();
        initDogPosition();
        let loopBarking = loopBarkingDog();
        return () => {
            clearInterval(loopBarking);
        }
    }, [])



    // useEffect(() => {

    // }, [humanPosition])

    let initDogPosition = () => {

        let x = Math.floor(Math.random() * widthW);
        let y = Math.floor(Math.random() * heightW);

        //boundary for x
        if (x < 0) x = 0;
        if (x > widthW - dogSize.width) {
            //1.2 tránh viền
            x = widthW - 1.2 * dogSize.width;
        }
        //boundary for y
        if (y < 0) y = 0;
        if (y > heightW - dogSize.height) {
            y = heightW - 1.2 * dogSize.height;
        }
        setxDog(x);
        setyDog(y)
    }

    let loopBarkingDog = () => {
        let loopBarking = setInterval(() => {
            setBarkingSignal(prev => prev + 1);

        }, 2000)
        return loopBarking
    }
    useEffect(() => {
        barkingDog();
    }, [barkingSignal])
    

    let barkingDog = () => {
        let dogPosition = getPositionAtCenter(dogRef.current);
        console.log(humanPosition)
        let distance = Math.hypot(dogPosition.x - humanPosition.x, dogPosition.y - humanPosition.y);
        let higestDistance = Math.hypot(0 - widthW, 0 - heightW);
        let distanceRatio = Math.sqrt(distance / higestDistance);
        let volumn = (1 - distanceRatio);
        console.log(volumn)
        barkingSound.volume = volumn;
        barkingSound.play();
    }

    function getPositionAtCenter(element) {
        const { top, left, width, height } = element.getBoundingClientRect();
        return {
            x: left + width / 2,
            y: top + height / 2
        };
    }

    let setUpMouseListener = () => {
        document.addEventListener('mousemove', (e) => {
            // console.log(e.pageX);
            sethumanPosition({ x: e.pageX, y: e.pageY });
        });

    }

    let clickOnPlayground = () => {
        let isTrue = isMouseInsideDog()

        if (isTrue) {
            setScore(score + 1);
            initDogPosition();
        } else {
            dogMoveRoutine();
        }
    }

    let isMouseInsideDog = () => {
        let dogEle = dogRef.current.getBoundingClientRect();

        return (dogEle.x < humanPosition.x
            && dogEle.x + dogEle.width > humanPosition.x
            && dogEle.y < humanPosition.y
            && dogEle.y + dogEle.height > humanPosition.y)
    }


    let calculateDogPosition = () => {
        let x = xDog + Math.floor(Math.random() * (400 - 100) + 100);
        let y = yDog + Math.floor(Math.random() * (400 - 100) + 100);
        //boundary for x
        if (x < 0) x = 0;
        if (x > widthW - dogSize.width) {
            //1.2 tránh viền
            x = widthW - 1.2 * dogSize.width;
        }
        //boundary for y
        if (y < 0) y = 0;
        if (y > heightW - dogSize.height) {
            y = heightW - 1.2 * dogSize.height;
        }


        return { x: x, y: y }
    }
    let dogMoveRoutine = () => {
        let position = calculateDogPosition()
        setxDog(position.x);
        setyDog(position.y);
    }

    return (
        <div id='playground' onClick={() => clickOnPlayground()}>
            <div id='dog' ref={dogRef} style={{
                position: "absolute",
                left: `${xDog}px`,
                top: `${yDog}px`,
                width: `${dogSize.width}px`,
                height: `${dogSize.height}px`

            }}></div>
            <div id='human' style={{
                position: "absolute",
                width: `${humanSize}px`,
                height: `${humanSize}px`,
                left: `${humanPosition.x - humanSize / 2}px`,
                top: `${humanPosition.y - humanSize / 2}px`,
            }}></div>
            <div id='score'>
                Score: {score}
            </div>

        </div>
    )
}

export default DogPlaygroundScreen