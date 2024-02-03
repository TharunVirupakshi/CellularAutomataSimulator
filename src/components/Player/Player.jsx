import {useRef, useEffect, useState} from 'react'
import './player.css'

// Cell component
const Cell = ({content, width}) => {

  const [cellStyle, setCellStyle] = useState({
    width: '30px', //default
  });
  useEffect(()=>{
    setCellStyle({
      width: width+'px',
    });
  }, [width])

  return(
    <div className='cell' style={cellStyle}>
      {/* {content} */}
    </div>
  )
}


const Player = () => {

  // Settings
  const [gridSize, setGridSize] = useState(10);
  const [gap, setGap] = useState(0);
  const [cellWidth, setCellWidth] = useState(40);
  

  const screenRef = useRef(null)

  const [screenStyle, setScreenStyle] = useState({})

  // const cells = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
 

  useEffect(() => {
    
    setScreenStyle({
      width: `${gridSize*cellWidth + gap*cellWidth}px`,
      gridTemplateColumns: `repeat(auto-fill, minmax(${cellWidth}px, 1fr))`
      // height: '800px'
    })
  }, [gridSize,cellWidth])

  useEffect(()=>{
    console.log(screenRef.current.clientHeight)
  },)

 

  // Function to initialize the grid with random alive and dead cells
  const initializeGrid = () => {
    return Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => 0) // Adjust the probability for alive cells
    );
  };
  const [grid, setGrid] = useState([]);

  const toggleCell = (row, col) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });
  };

  useEffect(() => {
    setGrid(initializeGrid())
  },[gridSize])
  
  useEffect(() => {
    console.log('State', grid)
  }, [grid])
  

  // Generate grid items based on grid state
  const gridItems = grid?.map((row, rowIndex) =>
  row.map((cell, colIndex) => (
    <Cell
      key={`${rowIndex}-${colIndex}`}
      className={`cell ${cell ? 'alive' : 'dead'}`}
      content={`${rowIndex}-${colIndex}`}
      width={cellWidth}
      onClick={() => toggleCell(rowIndex, colIndex)}
    />
  )))
    
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Check if the value is a valid integer
      const value = e.target.value;
      const isInteger = /^\d+$/.test(value);
      if(isInteger)
        setGridSize(value)
      else{
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
                gridItems.flat()
              }
            
          </div>
        </div>
        <label>No. of cells per row </label>
        <input type="text" onKeyDown={handleKeyDown}/>
    </div>
  )
}

export default Player