import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Layers, Settings, Box, Move } from "lucide-react"
import "./Tablero.css"
import { initializeApp } from "firebase/app";
import { useParams } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import ChatTab from "../componentes/JS/ChatTab"; 


const Tablero = () => {
  const containerRef = useRef(null)
  const parentRef = useRef(null)
  const boxRefs = useRef([])
  const [snapToGrid, setSnapToGrid] = useState(40)
  const [mouseDownBox, setMouseDownBox] = useState(null)
  const canvasSize = 2000
  const { id } = useParams()
  const { user, setUser } = useUser();
  const [userData, setUserData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const handleSetChatInput = useCallback((value) => setChatInput(value), []);
  const handleSetChatMessages = useCallback((updater) => setChatMessages(updater), []);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://sndr.42web.io/inc/userData.php', {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
  
        if (!response.ok || !data.success) throw new Error(data.message || `Error ${response.status}`);
  
        setUserData(data.user);
        setIsPrivate(data.user.private || false);
        setUser(prev => ({ ...prev, ...data.user }));
  
        // <- asegúrate de que esto tampoco esté causando loops
      } catch (error) {
        setError(error.message);
        if (error.message.includes('autorizado')) handleLogout();
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []); 
  

  const firebaseConfig = {
    apiKey: "AIzaSyDyerHDixc74S5J8N0HZ2f24Ka1zenTSlc",
    authDomain: "sndr-6f63a.firebaseapp.com",
    projectId: "sndr-6f63a",
    storageBucket: "sndr-6f63a.firebasestorage.app",
    messagingSenderId: "216451953397",
    appId: "1:216451953397:web:82b40246d509628e8e0bbc"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // States for menu management
  const [leftMenuCollapsed, setLeftMenuCollapsed] = useState(true)
  const [rightMenuCollapsed, setRightMenuCollapsed] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    updateGridClass()
  }, [snapToGrid])

  const updateGridClass = () => {
    if (parentRef.current) {
      parentRef.current.className = `grid g`
    }
  }

  const calculateSnapValue = () => {
    const snapToGridCount = Number.parseInt(snapToGrid, 10)
    const snapToGridPct = 100 / snapToGridCount
    return Number.parseInt((snapToGridPct / 100) * canvasSize, 10)
  }

  const handleMouseDown = (index) => () => {
    setMouseDownBox(index)
  }

  const handleMouseUp = () => {
    setMouseDownBox(null)
  }

  const handleMouseMove = (event) => {
    if (mouseDownBox === null) return

    const container = containerRef.current
    const box = boxRefs.current[mouseDownBox]

    if (!container || !box) return

    let clientX = event.clientX + container.scrollLeft
    let clientY = event.clientY + container.scrollTop

    const offsetLeft = container.getBoundingClientRect().left
    const offsetTop = container.getBoundingClientRect().top

    clientX = clientX - offsetLeft
    clientY = clientY - offsetTop

    const snapValue = calculateSnapValue()

    const snapedX = clientX - (clientX % snapValue)
    const snapedY = clientY - (clientY % snapValue)

    box.style.left = `${snapedX}px`
    box.style.top = `${snapedY}px`
  }

  // Tab content components
  const TabContent = () => {
    switch (activeTab) {
      case 0:
        return (
        
      <ChatTab
      chatMessages={chatMessages}
      chatInput={chatInput}
      setChatInput={handleSetChatInput}
      setChatMessages={handleSetChatMessages}
      userData={userData}
    />
        )
      case 1:
        return (
          <div className="tab-content">
            <h3>Personajes</h3>
            
          </div>
        )
      // case 2:
      //   return (
      //     <div className="tab-content">
      //       <h3>Properties</h3>
      //       {mouseDownBox !== null ? (
      //         <div>
      //           <div className="property-item">
      //             <label>Width:</label>
      //             <input type="number" defaultValue="100" />
      //           </div>
      //           <div className="property-item">
      //             <label>Height:</label>
      //             <input type="number" defaultValue="100" />
      //           </div>
      //           <div className="property-item">
      //             <label>Color:</label>
      //             <input type="color" defaultValue="#ff0000" />
      //           </div>
      //         </div>
      //       ) : (
      //         <p>Select an element to edit properties</p>
      //       )}
      //     </div>
      //   )
      default:
        return null
    }
  }

  return (
    <div className="tablero-container">
      {/* Botones de colapso/expansión fuera de los menús */}
      <button className="collapse-button left-toggle-button" onClick={() => setLeftMenuCollapsed(!leftMenuCollapsed)}>
        {leftMenuCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <button
        className="collapse-button right-toggle-button"
        onClick={() => setRightMenuCollapsed(!rightMenuCollapsed)}
      >
        {rightMenuCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Menú Izquierdo */}
      <div className={`left-menu ${leftMenuCollapsed ? "collapsed" : ""}`}>
        <div className="left-menu-content">
          <div className="left-menu-header">
            <h3>Dados</h3>
          </div>
          <div className="left-menu-buttons">
            
            
          </div>
        </div>
      </div>

      {/* Menú Derecho */}
      <div className={`right-menu ${rightMenuCollapsed ? "collapsed" : ""}`}>
        <div className="right-menu-content">
          <div className="tabs-container">
            <div className={`tab ${activeTab === 0 ? "active" : ""}`} onClick={() => setActiveTab(0)}>
              
              <span>Chat</span>
            </div>
            <div className={`tab ${activeTab === 1 ? "active" : ""}`} onClick={() => setActiveTab(1)}>
              
              <span>Personajes</span>
            </div>
            {/* <div className={`tab ${activeTab === 2 ? "active" : ""}`} onClick={() => setActiveTab(2)}>
             
              <span>Properties</span>
            </div> */}
          </div>

          <div className="tab-content-container">
            <TabContent />
          </div>
        </div>
      </div>

      {/* Tablero */}
      <div
        id="parentContainer"
        ref={parentRef}
        className={`grid g`}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ position: "relative" }}
      >
        <div id="container" ref={containerRef} style={{ position: "relative" }}>
          {[
            { left: 0, top: 0 },
            { left: 100, top: 100 },
          ].map((pos, i) => (
            <div
              key={i}
              className="box"
              ref={(el) => (boxRefs.current[i] = el)}
              onMouseDown={handleMouseDown(i)}
              style={{
                position: "absolute",
                left: `${pos.left}px`,
                top: `${pos.top}px`,
                cursor: mouseDownBox === i ? "grabbing" : "grab",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tablero
