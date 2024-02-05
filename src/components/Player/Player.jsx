import {useRef, useEffect, useState} from 'react'
import './player.css'

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
  const [gridSize, setGridSize] = useState(2);
  const [gap, setGap] = useState(0);
  const [cellWidth, setCellWidth] = useState(50);
  const states = [0,1];
  const TOT_STATES = states.length;

  const screenRef = useRef(null)

  const [screenStyle, setScreenStyle] = useState({})

  // const cells = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]



  // Function to initialize the grid with random alive and dead cells
  const initializeGrid = () => {
    return Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => 0) 
    );
  };
  const [grid, setGrid] = useState(()=>initializeGrid());
  
  
  useEffect(() => {
    
    setScreenStyle({
      width: `${gridSize*cellWidth + gap*cellWidth}px`,
      gridTemplateColumns: `repeat(auto-fill, minmax(${cellWidth}px, 1fr))`
      // height: '800px'
    })
  }, [gridSize,cellWidth])
  
  useEffect(() => {
    console.log('State', grid)
  }, [grid])

  useEffect(() => {
    setGrid(initializeGrid())
  },[gridSize])



  useEffect(()=>{
    console.log('Grid height: ',screenRef.current.clientHeight)
  },)
  
  

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

  const gridItems = grid?.map((row, rowIndex) =>
    row.map((cell, colIndex) => (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={`cell ${cell ? 'alive' : 'dead'}`}
        style={{ width: `${cellWidth}px` }}
        onClick={(e) => toggleCell(rowIndex, colIndex, e)}
      >
        {/* {`${rowIndex}-${colIndex}`} */}
      </div>

    )))
  
  //Calculate Neighbors LOGIC

  const countNgbhrs = (grid,nbors, r0, c0) => {
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
  }

  //Compute Next Boards LOGIC
  const computeNextGen = (states) => {
    const DEAD = 0;
    const ALIVE = 1;
    const nbors = new Array(states).fill(0);

    console.log('Computing next gen......');
    console.log('nbors[]: ', nbors);

    const nextGrid = grid.map((rowArray, row) =>
    rowArray.map((cell, col) => {
        nbors.fill(0); //init
        countNgbhrs(grid, nbors, row, col)
        console.log('nbrs counted for ',row,' ',col, ' is ', nbors);
        switch (cell) {
          case DEAD:
            if(nbors[ALIVE] == 3) 
              return ALIVE
            else
              return DEAD 
            break;
          
          case ALIVE:
            if(nbors[ALIVE] == 2 || nbors[ALIVE] == 3)
              return ALIVE
            else
              return DEAD     
        
          default:
            break;
        }
    }
    )

    );

    console.log('NEXT GEN: ', nextGrid)

    setGrid(nextGrid)

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


  return (
    <div className='playerBox'>
        <div className="player-screen-wrapper">
          <div className="player-screen" ref={screenRef} style={screenStyle} id='playerScreen'>
              {
                gridItems?.flat()
              }
            
          </div>
        </div>
        <label>No. of cells per row </label>
        <input type="text" onKeyDown={e => handleIntInputOnEnter(e, setGridSize)}/>
        <label> Cell width</label>
        <input type="text" onKeyDown={e => handleIntInputOnEnter(e, setCellWidth)}/>
        
        <button onClick={() => computeNextGen(TOT_STATES)} id='next-gen' style={{marginLeft: '20px'}}>NEXT GEN</button>
    </div>
  )
}

export default Player