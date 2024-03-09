import {useRef, useEffect, useState, useCallback} from 'react'
import './player.css'
import worker_script from "./computeWorker.js";
import { glider } from './gliderState';
import RLE from './rle';

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
  const states = [0,1];
  const TOT_STATES = states.length;
  const NGHBRHOOD_SIZE = 8;

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
      // height: '800px'
    })
    // setScreenStyle({
    //   width: `${50*cellWidth + gap*cellWidth}px`,
    //   gridTemplateColumns: `repeat(auto-fill, minmax(${cellWidth}px, 1fr))`
    //   // height: '800px'
    // })
  }, [gridSize,cellWidth])
  
  useEffect(() => {
    // console.log('State', grid)
  }, [grid])

  // useEffect(() => {
  //   setGrid(initializeGrid(gridSize))
  // },[gridSize])

  const handleGridSizeChange = (newSize) => {
    // const offset = newSize > gridSize ? (newSize - gridSize - 1) : newSize < gridSize ? -(gridSize - newSize - 1): gridSize;
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
    console.log("[MAIN] Msg from worker: ", ev.data);
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




  

  // useEffect(()=>{
  //   console.log('Grid height: ',screenRef.current.clientHeight)
  // },)
  

  const toggleState = (state, states) => {
    const index = ((states.indexOf(state)) + 1) % states.length;
    // console.log('ToggleState states: ', states, ' index: ', index);
    
    return states[index]
  }

  //When you use the functional form of setGrid, 
  //React may batch multiple state updates together, and this can 
  //result in unexpected behavior when you toggle the cell state. 
  //If the updates are batched, the newGrid inside the function may not reflect the latest state of the grid.
  // const toggleCell = (row, col, e) => {
  //   console.log('ToggleCell Triggered:', row, col);
    
  //   setGrid((prevGrid) => {
  //     const newGrid = [...prevGrid];
  //     console.log('State before ',newGrid);
  //     if(newGrid[row][col]){
  //       newGrid[row][col] = false;
  //     }else{
  //       newGrid[row][col] = true; 
  //     }
  //     // newGrid[row][col] = !newGrid[row][col];
  //     console.log('State updated ',newGrid);
  //     return newGrid;
  //   });
  // };

  const toggleCell = (row, col) => {
    // console.log('ToggleCell Triggered:', row, col);
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
    (row, col) => {
      if (isDrawing) {
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
      className={`cell ${cell ? 'alive' : 'dead'}`}
      style={{ width: `${cellWidth}px` }}
      onClick={(e) => toggleCell(rowIndex, colIndex, e)}
      onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
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

  const GOL = [
    {
      "53": 1,  //GOL
      // "71": 1,
      // "34": 1,
      // "44": 1,
      "default": 0
    },
    {
      "62": 1,
      "53": 1, //GOL
      // "44": 1, 
      "default": 0
    },
  ]

 

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
      if (worker) {
        worker.postMessage({ action: 'STOP' });
      }
    } else {
      const msg = {
        action: "START",
        payload: {
          states,
          grid,
          gridSize,
          ngbrhood_size : NGHBRHOOD_SIZE,
          rules : GOL,
          delay: speed
        }
      }
      // If currently stopped, start the interval
      if (worker) {
        worker.postMessage(msg); // Adjust the interval time as needed
      }
    }

    // Toggle the state
    setIsPlaying(!isPlaying);
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


  const handleMouseDown = () => {
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleReset = () => {
    setGrid(initializeGrid(gridSize))
  }

  return (
    <div className='playerBox'>
        {/* <h2>Cellular Automata</h2> */}
         <div className="load-pattern-container">
     
          <textarea type="text" placeholder='Load a pattern' onChange={e => setRleText(e.target.value)}></textarea>
          <button onClick={handleParsing}>Load</button>
          <div className="dimensions-container">
          {/* <label htmlFor="dimX">Dimensions</label> */}
          <input type="number" name='dimX' placeholder='width of the pattern' onChange={e => setPatternDim(prevDim => ({...prevDim ,x: e.target.value}))}/>
          <input type="number" name='dimY' placeholder='height of the pattern' onChange={e => setPatternDim(prevDim => ({...prevDim ,y: e.target.value}))}/>
          </div>
          
        </div>
        <div className="player-screen-wrapper">
          <div 
            className="player-screen" 
            ref={screenRef} 
            style={screenStyle} 
            id='playerScreen'
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
              {
                gridItems?.flat()
              }
            
          </div>
        </div>
        <label>No. of cells per row </label>
        <input 
          type="number" 
          onKeyDown={e => handleIntInputOnEnter(e, handleGridSizeChange)}
          style={{marginRight: '20px'}}
          />
        <button onClick={()=>handleGridSizeChange(parseInt(gridSize) - 2)} style={{marginRight: '10px'}}>-</button>
        <button onClick={()=>handleGridSizeChange(parseInt(gridSize) + 2)} style={{marginRight: '5px'}}>+</button>
        
        
        <label> Cell width </label>
        <input type="text" onKeyDown={e => handleIntInputOnEnter(e, setCellWidth)} style={{marginRight: '20px'}}/>

        <button onClick={()=>setCellWidth(prev => parseInt(prev) - 5)} style={{marginRight: '10px'}}>-</button>
        <button onClick={()=>setCellWidth(prev => parseInt(prev) + 5)} style={{marginRight: '5px'}}>+</button>
        
        <button onClick={handleComputeNextGen} id='next-gen' style={{marginLeft: '20px'}}>NEXT GEN</button>
        <label> Interval in ms</label>
        <input type="text" onKeyDown={e => handleIntInputOnEnter(e, setSpeed)}/>
        <button onClick={handlePlayButtonClick} id='play' style={{marginLeft: '20px'}}>{isPlaying ? 'STOP' : 'PLAY'}</button>
        <button onClick={handleReset} id='play' style={{marginLeft: '20px'}}>RESET</button>
        
       
        
    </div>
  )
}

export default Player