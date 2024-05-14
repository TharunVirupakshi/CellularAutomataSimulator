import React from 'react'
import './smallhelpbox.css'

import CtrlClickImg from '../../assets/1.gif'
import CtrlAltClickImg from '../../assets/2.gif'

const SmallHelpBox = ({seeMoreFunc, dontShowAgainFunc}) => {
  return (
    <div className="content smHelpBoxBody">

        <h2>Basic Controls</h2>
        <div className="container">
            <div className="sub-container">
            <h3>Click Mode</h3>
            <div className="imgContainer">
                <img src={CtrlClickImg} alt="ToggleModeImg" />   
            </div>
            <h3><span className='underline'>Ctrl + Click</span></h3>
            </div>
            <div className="sub-container">
            <h3>Brush Mode</h3>
            <div className="imgContainer">
                <img src={CtrlAltClickImg} alt="BrushModeImg" />   
            </div>
            <h3><span className='underline'>Ctrl + Alt + Mouseover</span></h3>
            </div>
        </div>
        
        <button onClick={seeMoreFunc}>See more</button> <br/>
        <button onClick={dontShowAgainFunc}>Do not show again</button>

    </div>
  )
}

export default SmallHelpBox