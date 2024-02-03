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
      {/* {content} */}
    </div>
  )
}


const Player = () => {

  // Settings
  const [gridSize, setGridSize] = useState(2);
  const [gap, setGap] = useState(0);
  const [cellWidth, setCellWidth] = useState(50);
  

  const screenRef = useRef(null)

  const [screenStyle, setScreenStyle] = useState({})

  // const cells = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]



  // Function to initialize the grid with random alive and dead cells
  const initializeGrid = () => {
    return Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => false) 
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

  const toggleCell = (row, col, e) => {

  
    console.log('ToggleCell Triggered:', row, col);
    
    const newGrid = grid.map((rowArray, rowIndex) =>
      rowArray.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? !cell : cell
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
    </div>
  )
}

export default Player