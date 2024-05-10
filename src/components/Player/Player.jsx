import {useRef, useEffect, useState, useCallback} from 'react'
import './player.css'
import worker_script from "./computeWorker.js";
import { glider } from './gliderState';
import RLE from './rle';
import Draggable from 'react-draggable';
import Modal from 'react-modal'
import CustomRulesWiz from '../CustomRulesWiz/CustomRulesWiz';
// Cell component
const Cell = ({content, width, classes, onClickFunction}) => {

  const [cellStyle, setCellStyle] = useState({
    width: '30px', //default
  });
  useEffect(()=>{
    setCellStyle({
      width: width+'px',
    });
  }, [width])

  const handleClick = (event) => {
    event.preventDefault()
    // Prevent event propagation
    event.stopPropagation();
    // Call the provided onClickFunction
    onClickFunction();
  };

  return(
    <div className={'cell ' + classes} style={cellStyle} onClick={handleClick}>
      {content}
    </div>
  )
}



const Player = () => {

  

  // Settings
  const [gridSize, setGridSize] = useState(2);    //51 for Glider
  const [gap, setGap] = useState(0);
  const [cellWidth, setCellWidth] = useState(50);
  const [speed, setSpeed] = useState(500);
  const [states, setStates] = useState([0,1]);
  const TOT_STATES = states.length;
  const NGHBRHOOD_SIZE = 8;

  //Rules
  const GOL = {
    rules : [
    {
      "53": 1,  
      "default": 0
    },
    {
      "62": 1,
      "53": 1,
      "default": 0
    },
    ],
    stateColors : ['transparent', '#c2c2c2']
  }
  
  const SEEDS = {
    rules : [
      {
        "62": 1, // If a cell is off and has exactly 2 neighbors that are on, it becomes on
        "default": 0 // Default rule: if none of the specific rules apply, stay off
      },
      {
        "default": 0 
      }
    ],
    stateColors : ['transparent', '#c2c2c2'] 
  }

  const BRAINS_BRAIN = {
    rules : [
      {
        // Rules for state 0 (Off)
        "026": 1, // If a cell is off and has exactly 2 neighbors that are on, it becomes on
        "125": 1,
        "224": 1,
        "323": 1,
        "422": 1,
        "521": 1,
        "620": 1,
        "default": 0 // Default rule: if none of the specific rules apply, stay off
      },
      {
        // Rules for state 1 (On)
        "default": 2 // Any cell that is on will transition to dying in the next step
      },
      {
        // Rules for state 2 (Dying)
        "default": 0 // Any cell that is dying will transition to off in the next step
      }
    ],
    stateColors : ['transparent', '#c2c2c2', '#ff5757'] 
  }

 
  
  const [ruleSet, setRuleSet] = useState(GOL.rules)
  const [colors, setColors] = useState(GOL.stateColors)

  const [preset, setPreset] = useState('GameOfLife')


  const applyNewRuleSet = (rules, colorSet) => {
    if (rules && Object.keys(rules).length > 0) {
      
      setRuleSet(rules);
      const newStateArray = Array.from({ length : rules.length }, (_, index) => index);
      console.log('New States:', newStateArray)
      setStates(newStateArray);
      alert('New Rules applied!')
      console.log('New rule set applied:', rules);
      setColors(colorSet)
      setRuleModal(false)
    } else {
      alert('Invalid Rules')
      console.log('No valid rules provided.', rules); 
    }
  };

  const handlePresetChange = (preset) => {
    switch(preset){
      case 'GOL' : setRuleSet(GOL.rules)
                   setColors(GOL.stateColors)
                   setStates([0,1])
                   setPreset('GameOfLife')
                   alert('Game of Life rule set applied!')
                   break;
      case 'SEEDS' : setRuleSet(SEEDS.rules)
                            setColors(SEEDS.stateColors)
                            setStates([0,1])
                            setPreset('Seeds')
                            alert('Seeds rule set applied!')
                            break;
      case 'BRAINS_BRAIN' : setRuleSet(BRAINS_BRAIN.rules)
                            setColors(BRAINS_BRAIN.stateColors)
                            setStates([0,1,2])
                            setPreset('Brain\'sBrain')
                            alert('Brain\'s Brain rule set applied!')
                            break;
      default : break; 
    }
  }

  // useEffect(()=>{
  //   console.log('Preset : ', preset)

  // },[preset])

  const screenRef = useRef(null)

  const [screenStyle, setScreenStyle] = useState({})
  // const [playOn, setPlayOn] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false);
  // const cells = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]

  const [worker, setWorker] = useState(null)

  const [isDrawing, setIsDrawing] = useState(false);
  const [rleText, setRleText] = useState('')
  const [patternDim, setPatternDim] = useState({x: 0, y: 0})
  const [pattern, setPattern] = useState(null)


  const handleParsing = () => {
    const rle = new RLE()
    const parsedPattern = rle.parse(rleText);

  // Specify the desired size
  const SIZE = gridSize; // Change this to your desired size

  // Initialize a new pattern of SIZE x SIZE with all values set to 0
  const newPattern = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

  // Copy values from the parsed pattern to the new pattern
  for (let i = 0; i < Math.min(parsedPattern.length, SIZE); i++) {
    for (let j = 0; j < Math.min(parsedPattern[i].length, SIZE); j++) {
      newPattern[i][j] = parsedPattern[i][j];
    }
  }

  const newGrid = initializeGridState(newPattern)
  setGrid(newGrid)

  console.log('Parsed Pattern: ', newPattern);
  }




  // Function to initialize the grid with dead cells
  const initializeGrid = (gridSize) => {
    return Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => 0) 
    );
  };

  const initializeGridState = (state) => {
    return Array.from(state)
  }



  const [grid, setGrid] = useState(()=>initializeGrid(gridSize));
  // const [grid, setGrid] = useState(()=>initializeGridState(glider)); //enable for glider
  
  // set screen style
  useEffect(() => {
    
    setScreenStyle({
      width: `${gridSize*cellWidth + gap*cellWidth}px`,
      gridTemplateColumns: `repeat(auto-fill, minmax(${cellWidth}px, 1fr))`
    })
  }, [gridSize,cellWidth])
  
  // useEffect(() => {
  //   console.log('State', grid)
  // }, [grid])



  const handleGridSizeChange = (newSize) => {
    
    const newOddSize = newSize % 2 === 1 ? newSize : (parseInt(newSize) + 1)
    const offset = Math.floor((newOddSize - gridSize) / 2);

    // console.log('Calculated offset: ', offset, ' for size ', newOddSize)

    const newGrid = initializeGrid(newOddSize)
    grid?.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
        const r = Math.max(rowIndex + offset, 0)
        const c = Math.max(colIndex + offset, 0)
        if (newGrid[r] && newGrid[r][c] !== undefined) {
          newGrid[r][c] = cell;
        }
    }))
    console.log('gridddddddd', grid)
    setGrid(newGrid)
    setGridSize(newOddSize)

  }


  

  // Worker Thread

  const handleWorkerMessage = useCallback((ev) => {
    // console.log("[MAIN] Msg from worker: ", ev.data);
    const { action, res } = ev.data;
  
    if (action === "COMPUTE" || action === "PLAYING") {
      setGrid((prevGrid) => res);
    }
  }, [setGrid]);


  useEffect(()=>{
    const worker = new Worker(worker_script)
    worker.onmessage = handleWorkerMessage

    setWorker(worker)
    
    return () => {
      worker.terminate()
    }
  },[handleWorkerMessage])



  const toggleState = (state, states) => {
    const index = ((states.indexOf(state)) + 1) % states.length;
    // console.log('ToggleState states: ', states, ' index: ', index);
    
    return states[index]
  }


  const toggleCell = (row, col, e) => {
    // console.log('ToggleCell Triggered:', row, col);
    if(!(e.ctrlKey || e.metaKey)) return;
    const newGrid = grid.map((rowArray, rowIndex) =>
      rowArray.map((cell, colIndex) =>{
        // console.log('CurState: ', cell, ' NewState: ', toggleState(cell, states));
        return rowIndex === row && colIndex === col ? toggleState(cell, states) : cell
      }
      )
    );
    setGrid(newGrid);
    
  };




  const handleMouseOver = useCallback(
    (row, col, e) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey){
        const newGrid = [...grid];
        newGrid[row][col] = toggleState(newGrid[row][col], states);
        setGrid(newGrid);
      }
    },
    [grid, isDrawing]
  );
  




  const gridItems = grid?.map((row, rowIndex) =>
  row.map((cell, colIndex) => (
    <div
      key={`${rowIndex}-${colIndex}`}
      className={`cell`}
      style={{ width: `${cellWidth}px` , backgroundColor : colors[cell]}}
      onClick={(e) => toggleCell(rowIndex, colIndex, e)}
      onMouseOver={(e) => handleMouseOver(rowIndex, colIndex, e)}
    >
      {/* {`${rowIndex}-${colIndex}`} */}
    </div>

  )))

  
  
  
  //Calculate Neighbors LOGIC

  const countNgbhrs = (grid,gridSize,nbors, r0, c0, n) => {
    // nbors.fill(0)
    for(let r1=-1; r1<=1; ++r1){
      for(let c1=-1; c1<= 1; ++c1){
        if(r1!=0 || c1!=0){
          const r = r0 + r1;
          const c = c0 + c1;

          if(r >= 0 && r < gridSize && c >= 0 && c < gridSize){
            nbors[grid[r][c]]++
            // console.log('nbrs counted for ',r0,' ',c0, ' is ', nbors);
          }
        }
      }
    }
    // To account for dead cells outside the grid border
    let sum = nbors.reduce((accumulator, cuurentVal) => accumulator + cuurentVal, 0);
    while(sum<n){
      nbors[0]++
      sum = nbors.reduce((accumulator, cuurentVal) => accumulator + cuurentVal, 0); 
    }
  }


 




  //Compute Next Boards LOGIC
  const computeNextGen = (states, callBck, rules, ngbrhood_size, gridSize) => {
    // const DEAD = 0;
    // const ALIVE = 1;
    const nbors = new Array(states).fill(0);

    callBck((prevGrid) => {
      console.log('Computing next gen......');
      // console.log('nbors[]: ', nbors);
  
      const nextGrid = prevGrid.map((rowArray, row) =>
        rowArray.map((cell, col) => {
          nbors.fill(0); //init
          countNgbhrs(prevGrid, gridSize,nbors, row, col, ngbrhood_size);
          console.log('nbrs counted for ', row, ' ', col, ' is ', nbors);
          const trans = rules[cell]
          let newCell = trans[nbors.join("")];

          if(newCell === undefined)
            newCell = trans["default"]
           
          return newCell
          
        })
      );
  
      console.log('NEXT GEN: ', nextGrid);
  
      return nextGrid;
    });

  }
  //Compute next gen on worker Thread
  const handleComputeNextGen = async() => {
    const msg = {
      action: "COMPUTE_NEXT_GEN",
      payload: {
        states,
        grid,
        gridSize,
        ngbrhood_size : NGHBRHOOD_SIZE,
        rules : GOL
      }
    }
    worker.postMessage(msg)
  };

  

  

  // Function to handle the "play" button click
  const handlePlayButtonClick = () => {


    if (isPlaying) {
      // If currently playing, stop the interval
      // If currently playing, stop the worker thread
      console.log('Stopping Worker Thread');
      if (worker) {
        worker.postMessage({ action: 'STOP' });
      }
    } else {
      console.log('Starting Worker Thread')
      const msg = {
        action: "START",
        payload: {
          states,
          grid,
          gridSize,
          ngbrhood_size : NGHBRHOOD_SIZE,
          rules : ruleSet ?? GOL,
          delay: speed
        }
      }
      // If currently stopped, start the interval
      if (worker) {
        worker.postMessage(msg); // Adjust the interval time as needed
      }
    }

    // Toggle the state
    setIsPlaying(prev => !prev);
  }


  const handleIntInputOnEnter = (e, callbckFunc) => {
    // e.preventDefault();
    if (e.key === 'Enter') {
      // Check if the value is a valid integer
      const value = e.target.value;
      const isInteger = /^\d+$/.test(value);
      if(isInteger)
        callbckFunc(value)
      else{
        alert('Enter integer!')
        console.log('ENTER INTEGER!!')
      }
      // console.log(e.target.value)
    }
  };


  const handleSpeedChange = (value) => {
    
  }



  const handleReset = () => {
    setGrid(initializeGrid(gridSize))
  }

  const [disableDrag, setDisableDrag] = useState(false)
  const playButtonRef = useRef(null);


  const handleKeyDown =useCallback((e) => {
    console.log("Key pressed:", e.metaKey)
    console.log("Key pressed:", e.altKey)
    if((e.metaKey || e.ctrlKey) && e.altKey) 
    setIsDrawing(true)
    setDisableDrag(true); // Disable dragging when CMD/Ctrl key is pressed
  });

  const handleKeyUp = useCallback((e) => {
    
    if (!e.metaKey && !e.ctrlKey) {
      setIsDrawing(false)
      setDisableDrag(false); // Re-enable dragging when CMD/Ctrl key is released
    } 
  });

 

  const calculateMiddlePosition = () => {
    // Get the width and height of the screen
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate middle position for x and y coordinates
    // const middleX = Math.floor(screenWidth / 2); // Middle of the screen width
    const middleY = Math.floor(screenHeight / 2); // Middle of the screen height

    return { x: 0, y: middleY - 100 };
};

  const middlePosition = calculateMiddlePosition()


  const [ruleModal, setRuleModal] = useState(false)





  return (
  <>
  
    <div className='playerBox'>
        {/* <h2>Cellular Automata</h2> */}
        
        <div className="controlPanel">

          <div className="basicControlsBox ">

            <div className="cntrlEleWrapper">

              <div className="cntrlElement">
                <label >Load pattern</label>
                <textarea rows={3} cols={20} type="text" placeholder='Load a pattern' onChange={e => setRleText(e.target.value)}></textarea>
                <button onClick={handleParsing}>Load</button>
              </div>
            </div>
          

            <div className="cntrlEleWrapper">

              <div className="cntrlElement">
                <label >Rules</label>
                <div>
                  <select id="ruleset" name="ruleset" onChange={e => handlePresetChange(e.target.value)}>
                    <option value="GOL">GameOfLife</option>
                    <option value="SEEDS">Seeds</option>  
                    <option value="BRAINS_BRAIN">Brain's Brain</option>  
                  </select>

            
                  <p style={{textAlign : "center", margin: 0 }}>OR</p>
                  <div className='btnsContainer'>
            
                    <button onClick={() => setRuleModal(true)}>Custom Rule</button>
                    <Modal
                      isOpen={ruleModal}
                      onRequestClose={() => setRuleModal(false)}
                      className="modal"
                      overlayClassName="modal-overlay"
                    >
                      <div className="modal-content">
                        <button className="close-button" onClick={() => setRuleModal(false)}>
                          <span aria-hidden="true">&times;</span>
                        </button>
                        <CustomRulesWiz saveNewRuleSet={applyNewRuleSet}/>
                      </div>
                    </Modal>

                  </div>
                </div>
              </div>
            </div>
            <div className="cntrlEleWrapper">

              <div className="cntrlElement ">
                <label>Grid size</label>
                <div>
                  <input
                    type="number"
                    onKeyDown={e => handleIntInputOnEnter(e, handleGridSizeChange)}
                    placeholder="Press enter after typing"
                  />
                  <div className='btnsContainer'>

                    <button onClick={() => handleGridSizeChange(parseInt(gridSize) - 2)}>-</button>
                    <button onClick={() => handleGridSizeChange(parseInt(gridSize) + 2)}>+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="cntrlEleWrapper">

              <div className="cntrlElement">
                <label> Cell width </label>
                <div>
                  <input type="text" onKeyDown={e => handleIntInputOnEnter(e, setCellWidth)} placeholder="Press enter after typing"/>
                  <div className='btnsContainer'>

                <button onClick={() => setCellWidth(prev => parseInt(prev) - 5)}>-</button>
                <button onClick={() => setCellWidth(prev => parseInt(prev) + 5)}>+</button>

              </div>
            </div>
          </div>
          </div>

          <div className="cntrlEleWrapper">

          <div className="cntrlElement">
            <label> Current Speed: {speed}ms</label>
            <div>
              <input type="text" onKeyDown={e => handleIntInputOnEnter(e, setSpeed)}  placeholder="Press enter after typing"/>
              <div className='btnsContainer'>
                <button onClick={() => setSpeed(prev => Math.max(prev - 100, 0))}>-</button>
                <button onClick={() => setSpeed(prev => prev + 100)}>+</button>
              </div>
            </div>
          </div> 
          </div>
          <div className="cntrlEleWrapper">
          <div className="cntrlElement simBtns ">

            <button onClick={handleComputeNextGen} id='next-gen' >NEXT GEN</button>
            <button ref={playButtonRef} onClick={handlePlayButtonClick} id='play' >{isPlaying ? 'STOP' : 'PLAY'}</button>
            <button onClick={handleReset} id='play'>RESET</button>
    
          </div>
          </div>

        </div>
       
          
        
        </div>
        <div className="player-screen-wrapper" >
        <Draggable disabled={disableDrag} defaultPosition={middlePosition}   >
          <div 
            className="player-screen" 
            ref={screenRef} 
            style={screenStyle} 
            id='playerScreen'
            onKeyDown={e => handleKeyDown(e)}
            onKeyUp={e => handleKeyUp(e)}
            
          >
              {
                gridItems?.flat()
              }
            
          </div>
          </Draggable>
        </div>
        
        
    </div>
    </>
  )
}

export default Player