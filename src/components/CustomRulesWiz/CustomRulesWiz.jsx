import {useState} from 'react'
import './customruleswiz.css'
import NghbrSizeImg from '../../assets/Artboard 3@3x.png'
import { useEffect } from 'react';

const CustomRulesWiz = () => {

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

  useEffect(()=>{
    console.log('Rule Set:', ruleSet)
  },[ruleSet])

  const addRule = (state, condString, res) => {

    console.log("State: ", state," condstr: ", condString, " res: ", res )
    setRuleSet(prev => {
        const updated = [...prev]
        updated[state][condString] = res;
        return updated;
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
                    defaultValue={2}
                    
                  />
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
                            <div key={i}>
                              <h3>For State : {i}</h3>

                                    {   
                                        Object.entries(ruleSet[i]).map(([key, value]) => 
                                            <p>{key} : {value}</p>
                                        )
                                        
                                    }

                                  <RenderCounter states={stateCount} state={i} addFunction={addRule}/>

                            </div>
                        ))
                     }
                      

                  </div>
              </>
              )
          }

        <div className="navigationBtns">
        <button style={{visibility: step == 0 ? 'hidden' : 'visible'}} onClick={prevStep}>&larr; Prev</button>
        <button onClick={nextStep}>Next &rarr;</button>
        </div>    
    </div>
  )
}

export default CustomRulesWiz