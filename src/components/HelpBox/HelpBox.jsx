import React from 'react'

import './helpbox.css'
const HelpBox = () => {
  return (
    <div class="content">
        <h1>Help</h1>
        <p>Welcome to our Cellular Automata Simulator! Here's everything you need to know to get started and explore all the cool features of our simulator.</p>
        
        <div className="sidenote">
        <p><strong>Note:</strong> Press the <span className='underline'>Enter key</span> after making changes in text/input fields to apply the changes.</p>
        </div>
     
      
        <h2>1. Grid Manipulation</h2>
        <ul>
            <li><strong>Move the Grid:</strong> Click and drag the grid to position it anywhere on the screen. Arrange it to your liking for the best simulation view.</li>
            <li><strong>Resize the Grid:</strong> Increase the grid size in the control panel to fit your needs. More cells mean more space for exciting patterns!</li>
        </ul>

        <h2>2. Cell Control</h2>
        <ul>
        <li><strong>Toggle Cell State:</strong> Use <span class="underline">Ctrl + click</span> to toggle cell states.</li>
        <li><strong>Brush Mode (Bulk Editing):</strong> Use <span class="underline">Ctrl + Alt</span> to brush over the cells.</li>
        <li><strong>Adjust Cell Size:</strong> Adjust the cell width to make cells bigger or smaller. Find the perfect size for clear visibility and detail.</li>
        </ul>

        <h2>3. Simulation Settings</h2>
        <ul>
            <li><strong>Set Simulation Speed:</strong> Control the simulation speed by specifying the time interval in milliseconds. Observe the evolution of patterns at your desired pace.</li>
        </ul>

        <h2>4. Simulation Controls</h2>
        <ul>
            <li><strong>Play or Pause:</strong> Start or stop the simulation with the play button. Observe patterns in action or take a break anytime.</li>
            <li><strong>Step by Step:</strong> Click "Next Gen" to advance the simulation one generation at a time. Dive deep into the evolution of cellular automata.</li>
            <li><strong>Load External Patterns:</strong> Want to explore complex patterns? Copy the RLE string of a pattern from <a target="_blank" href='https://conwaylife.com'>conwaylife.com</a>, paste it into our "Load Pattern" section, choose an appropriate grid size, and click "Load". Watch the imported pattern come to life in our simulator!</li>
        </ul>

        <h2>Tips for Exploration</h2>
        <ul>
            <li>Experiment with different settings to uncover fascinating patterns and behaviors.</li>
            <li>Use the "Load Pattern" feature to import intricate designs and explore their evolution.</li>
            <li>Reset the grid anytime to start fresh with new experiments.</li>
        </ul>

        <p>Enjoy discovering the mesmerizing world of cellular automata with our interactive simulator!</p>
    </div>
  )
}

export default HelpBox