import { useState, useEffect } from 'react'
import Modal from 'react-modal'


import './App.css'
import { Player } from './components'
import AboutBox from './components/AboutBox/AboutBox'
import HelpBox from './components/HelpBox/HelpBox'
import Navbar from './components/Navbar/Navbar'

function App() {

  const [aboutModal, setAboutModal] = useState(false)
  const [helpModal, setHelpModal] = useState(false)


  function openAboutModal() {
    setAboutModal(true);
  
  }

  function openHelpModal(){
    setHelpModal(true)

  }

  const closeAboutModal = () => {
    setAboutModal(false);
  };

  function closeHelpModal() {
    setHelpModal(false)
  }

  useEffect(() => {
    Modal.setAppElement('#root'); // Replace '#root' with your main app element ID or selector
  }, []);

  return (
    <>
      <Navbar aboutFunction={openAboutModal} helpFunction={openHelpModal}/> 
      <Player openHelpBox={openHelpModal}/>
      <Modal
        isOpen={aboutModal}
        onRequestClose={closeAboutModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
       <div className="modal-content">
          <button className="close-button" onClick={closeAboutModal}>
            <span aria-hidden="true">&times;</span>
          </button>
          <AboutBox />
        </div>
      </Modal>
      <Modal
        isOpen={helpModal}
        onRequestClose={closeHelpModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
       <div className="modal-content">
          <button className="close-button" onClick={closeHelpModal}>
            <span aria-hidden="true">&times;</span>
          </button>
          <HelpBox />
        </div>
      </Modal>
    </>
  )
}

export default App
