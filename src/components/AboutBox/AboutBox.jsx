import React from 'react'

import './aboutbox.css'

const AboutBox = () => {
  return (
    <div className='content'>
       
        <h1>What is Cellular Automata?</h1>
        <p>
            <a target='_blank' href="https://en.wikipedia.org/wiki/Cellular_automaton">Cellular automata</a> (CA) are like virtual worlds where each cell follows simple rules to create fascinating patterns and behaviors.
            Imagine a grid filled with cells, where each cell can be in a specific state, like 'alive' or 'dead', and they change their state over time based on their neighbors.
        </p>

        <h2>How It Works</h2>
        <ol>
            <li><strong>Grid of Cells:</strong> Picture a board divided into squares, with each square representing a cell. These cells can be thought of as tiny entities that interact with each other.</li>
            <li><strong>States and Changes:</strong> Each cell has a state, like 'on' or 'off'. As time progresses, the state of each cell can change based on rules that look at the states of neighboring cells.</li>
            <li><strong>Neighborhood Influence:</strong> A cell's fate might depend on what its neighboring cells are doing. Some cells might 'turn on' if they have many 'on' neighbors, while others might 'turn off' if they're isolated.</li>
        </ol>

        <h2>Where You See It</h2>
        <p>
            Cellular automata show up in many places:
        </p>
        <ul>
            <li><strong>Games:</strong> Games like Conway's Game of Life use cellular automata to create evolving patterns that mimic life.</li>
            <li><strong>Science:</strong> Scientists use CA to model real-world processes like how fluids move or how animal populations change over time.</li>
            <li><strong>Art:</strong> Artists use CA to generate intricate and beautiful patterns that seem to emerge from simple rules.</li>
        </ul>

        <h2>Famous Examples</h2>
        <ul>
            <li><a target='_blank' href='https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'><strong>Conway's Game of Life:</strong></a> Perhaps the most famous CA, where cells live or die based on how many neighbors they have. (Default mode in our simulator)</li>
            <li><strong>Minecraft World Generation:</strong> Minecraft uses procedural generation techniques similar to cellular automata to create its blocky, expansive worlds. <a target='_blank' href="https://youtu.be/YyVAaJqYAfE?t=1085">Detailed video on YouTube</a></li>
            <li><strong>Elementary Cellular Automaton:</strong> A simpler version where each cell follows basic rules, yet can create complex patterns.</li>
        </ul>

        <h2>Why It's Cool</h2>
        <p>
            Cellular automata are amazing because they show us that simple rules can lead to incredibly complex behaviors. They're like digital petri dishes where you can watch patterns evolve and change, revealing surprising insights into the nature of systems.
        </p>

        <h1>Our Project</h1>
        <p>
            In our project, we dive into the world of cellular automata to explore these mesmerizing patterns. We invite you to experiment with different rules and settings, creating your own digital universe where simple rules spark astonishing complexity.
        </p>
    

    </div>
  )
}

export default AboutBox