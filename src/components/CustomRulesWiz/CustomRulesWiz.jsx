import {useState} from 'react'
import './customruleswiz.css'
import NghbrSizeImg from '../../assets/Artboard 3@3x.png'
import { useEffect } from 'react';

const CustomRulesWiz = ({saveNewRuleSet}) => {

    const [step, setStep] = useState(0);
    const [stateCount, setStateCount] = useState(2);

    
    const nextStep = () => {
        setStep(step => Math.min(step + 1, 3));
    };

    const prevStep = () => {
        setStep(step => Math.max(step - 1, 0));
    };

    const handleStateCountChange = (val) => {
        const value = parseInt(val)
        if (value < 2 || value > 10) {
            alert('Please select the states in range 2 - 10')
            return;
        }
        setStateCount(value)
        if (colors.length < value) {
            const diff = value - colors.length;
            const newColors = [...colors]; // Create a copy of the existing colors array
        
            // Add 'transparent' for the additional states
            for (let i = 0; i < diff; i++) {
              newColors.push('transparent');
            }
        
            // Update the colors state with the new array
            setColors(newColors);
          } else if (colors.length > value) {
            // If the new stateCount is less than the current colors array length, trim the array
            const newColors = colors.slice(0, value);
            setColors(newColors);
          }

        
        

    }


    // Render counters based on stateCount
  const RenderCounter = ({states, state, addFunction}) => {


    const [rule, setRule] = useState(Array.from({length : states + 1}).fill(0))

    // useEffect(()=>{
    //     console.log(`Rule state for : ${state}`,rule)
    // },[rule])

    const handleInputChange = (s, val) => {
        const value = parseInt(val)
        if(value < 0){
            alert('No negative states!')
            return;
        }
        if(s == states && value > (states - 1)){
            alert(`Cannot exceed the set limit : ${states - 1}`)
            return; 
        }    
        setRule(prev => {
            const updatedRule = [...prev]
            updatedRule[s] = value
            return updatedRule  
        })
    }

    const parseAndAdd = () => {
        // Extract condition values and resultant state value from ruleArray
        const conditions = rule.slice(0, -1); // All values except the last one
        const sum = conditions.reduce((partialSum, a) => partialSum + a, 0)
        if(sum < 8){
            alert(`Invalid Rule. Total neighbours defined is ${sum} < 8. Define states for all 8 neighbours!`)
            return;
        }else if(sum > 8){
            alert(`Invalid Rule. Total neighbours defined is ${sum} > 8. Define states for only 8 neighbours!`)
            return;
        }
        
        const res = rule[rule.length - 1]; // Last value is the resultant state

        const condString = conditions.join('');

        addFunction(state, condString, res)
    }


    return(
        <div className="ruleDefiner">
        <div className="headerTitle">
        <span>State : </span><span>Neighbours : </span>
        </div>

        {  
            Array.from({length : states}).map((_, index) => (
                <div className="counter" key={index}>
                <label>{index}</label>
                <input
                    type="number"
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    value={rule[index]}
                />
                </div>
                )
            )

        }
            <span> : </span>
            <div className="counter">
                <label>Resultant State</label>
                <input
                    type='number'
                    onChange={(e) => handleInputChange(states, e.target.value)}
                    value={rule[rule.length - 1]}
                />
            </div>

        <button onClick={parseAndAdd}>Add Rule</button>

        </div> 

    )
  };

  const [ruleSet, setRuleSet] = useState([
    {
      "default": 0
    },
    {
      "default": 0
    },
  ])


  
  const addRule = (state, condString, res) => {

    if(res < 0){
        alert('No negative states!')
        return;
    }
    if(res > (stateCount - 1)){
        alert(`Cannot exceed the set limit : ${stateCount - 1}`)
        return; 
    }
      

    console.log("State: ", state," condstr: ", condString, " res: ", res )
    setRuleSet(prev => {
        const updated = [...prev]
        updated[state] = {
            ...updated[state],
            [condString] : res
        }
        // console.log('Updated : ', updated)
        return updated;
    })
  }

  const [colors, setColors] = useState(['transparent', '#c2c2c2'])

  const handleColorChange = (state, colorCode) => {
    setColors(prev => {
        const updated = [...prev]
        updated[state] = colorCode
        return updated
    })
  }
  useEffect(()=>{
    const newRules = Array.from({length:stateCount}).fill({"default" : 0})
    setRuleSet(newRules)
  },[stateCount])

  useEffect(()=>{
    console.log('Rule Set:', ruleSet)
    console.log('Color Set:', colors)
  },[ruleSet, colors])

 const [isEdit, setIsEdit] = useState(Array.from({length : stateCount}).fill(false))

 const handleEdit = (i) => {
    setIsEdit(prev => {
        const updated = [...prev]
        updated[i] = !updated[i]
        return updated
        }
    )
 }

 const handleDel = (i, key) => {
    setRuleSet(prev => {
        const updated = [...prev]
        delete updated[i][key]
        return updated
    })
 }

  return (
    <div className='content' style={{width: '100%'}}>
          {
              step == 0 && (<>
                  <h1>Welcome to the Custom Rule Wizard</h1>
                  <p>
                      Explore the fascinating world of cellular automaton by creating custom rules for state transitions. This wizard will guide you through the process of setting up rules for a cellular automaton with multiple states.
                  </p>
              </>
              )
          }
          {
              step == 1 && (<>
                  <h2>States</h2>
                  <p>
                    Begin by selecting the number of states for your cellular automaton. Choose between 2 to 10 states to define the complexity of your automaton.
                  </p>


                 <div className="settingsForm">
                  <input 
                    placeholder='Enter number of states' 
                    type='number'
                          onChange={e => handleStateCountChange(e.target.value)}
                          value={stateCount}

                      />
                  </div>
                
                          <h3>State Colors</h3>
                          <p>Select colors for each state:</p>
                          <div className="colorSelection">
                              {Array.from({length : stateCount}).map((_, index) => (
                                  <div key={index} className="colorOption">
                                      <label htmlFor={`stateColor${index}`}>State {index} Color:</label>
                                      <input
                                          style={{cursor : 'pointer'}}
                                          type="color"
                                          id={`stateColor${index}`}
                                          onChange={e => handleColorChange(index, e.target.value)}
                                          value={colors[index] === 'transparent' ? "#000000" : colors[index]}
                                      />
                                  </div>
                              ))}
                          </div>
                  
              </>
              )
          }
          {
              step == 2 && (<>
                  <h2>Rules for Each State</h2>
                  <p>
                      In this step, you'll set up rules for each state. Define conditions that determine how each state transitions based on its neighbors.
                  </p>
                  <div className="infoSection-RImage">

                      <div className="info">
                          <h3>Understanding Neighborhood Size in Cellular Automaton</h3>
                          <p>
                              In cellular automaton simulations, the neighborhood size refers to the number of neighboring cells considered when determining the state transitions of a given cell. The default neighborhood size in many cellular automaton models, including the widely known Game of Life, is 8. This means each cell interacts with its surrounding eight neighboring cells.
                          </p>
                          <ul>
                            <li>N - Neighbour Cell</li>
                            <li>Cell in the center is the cell of interest</li>
                          </ul>
                          <div className="sidenote">
                              <p><span style={{fontWeight: 'bold'}}>Note : </span>
                                  The neighborhood size is fixed and cannot be changed from the default setting of 8
                              </p>
                          </div>
                      </div>
                    <div className="imgContainer">
                        <img src={NghbrSizeImg} alt="" />
                    </div>
                  </div>
                


                  <div className="settingsForm">
                    <h2>Let's begin!</h2>

                     {
                        Array.from({ length: stateCount }).map((_, i) => (
                            <div key={i} className="settingsForEach">
                              <h3>For State : {i}</h3>

                                <div className="rulesContainer">

                                    {   
                                        Object.entries(ruleSet[i]).map(([key, value]) => 
                                            {
                                               return key === 'default' ?
                                                   
                                                       <div className='blockText'>{key} : {value} {isEdit[i] &&
                                                           <div className="counter" key={i}>

                                                               <input
                                                                   type="number"
                                                                   onChange={(e) => addRule(i, 'default', parseInt(e.target.value))}
                                                                   value={value}
                                                               />
                                                           </div>}
                                                           <span className='editBtn' onClick={e => handleEdit(i)}>{isEdit[i] ? "Done" : "Edit"} </span>
                                                        </div>
                                                   
                                                 : 
                                                    <div className='blockText'>{key} : {value} <span className='editBtn delBtn' onClick={e => handleDel(i, key)}>Del</span></div>

                                            }
                                           
                                        )
                                        
                                    }
                                </div>

                                  <RenderCounter states={stateCount} state={i} addFunction={addRule}/>
                            
                            </div>
                        ))
                     }
                      

                  </div>
              </>
              )
          }
          {
            step == 3 && (
                <>
                <h2>Confirm changes?</h2>
                  <p>
                    You're about to save your changes. Click "Apply" to apply the changes, or go back to review and make any necessary adjustments.
                  </p>
                  <div className="applyBtnContainer">
                    <button className='applyBtn' onClick={() => saveNewRuleSet(ruleSet, colors)}>Apply</button>
                  </div>
                  

                </>
            )
          }

        <div className="navigationBtns">
        <button style={{visibility: step <= 0 ? 'hidden' : 'visible'}} onClick={prevStep}>&larr; Prev</button>
        <button style={{visibility: step >= 3 ? 'hidden' : 'visible'}} onClick={nextStep}>Next &rarr;</button>
        </div>    
    </div>
  )
}

export default CustomRulesWiz