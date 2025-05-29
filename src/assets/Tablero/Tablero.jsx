import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Tablero.css";
import { initializeApp } from "firebase/app";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import ChatTab from "../componentes/JS/ChatTab";
import { db } from "./fireBaseInit.js";
import { onValue, ref, push } from "firebase/database";

const Tablero = () => {
  const containerRef = useRef(null);
  const parentRef = useRef(null);
  const boxRefs = useRef([]);
  const [snapToGrid, setSnapToGrid] = useState(40);
  const [mouseDownBox, setMouseDownBox] = useState(null);
  const canvasSize = 2000;
  const { id } = useParams();
  const { user, setUser } = useUser();
  const [userData, setUserData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const [selectedDice, setSelectedDice] = useState("d6");
  const [diceCount, setDiceCount] = useState(1);

  const handleSetChatInput = useCallback((value) => setChatInput(value), []);
  const handleSetChatMessages = useCallback((updater) => setChatMessages(updater), []);


const rollDice = () => {
  const sides = parseInt(selectedDice.slice(1));
  const rolls = Array.from({ length: diceCount }, () =>
    Math.floor(Math.random() * sides) + 1
  );
  const total = rolls.reduce((sum, val) => sum + val, 0);

  const userName = userData?.nombre || user?.nombre || "Jugador";

  const resultMessage = `${userName} lanzó ${diceCount}${selectedDice}: [${rolls.join(", ")}] Total: ${total}`;

  const message = {
    chatRoomId: id,
    mensaje: resultMessage,
    nombre: userName,
    timestamp: Date.now()
  };

  const newMessageRef = ref(db, `chatrooms/${id}/messages`);
  push(newMessageRef, message);
};


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
        setUser(prev => ({ ...prev, ...data.user }));
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!id) return;

    const messagesRef = ref(db, `chatrooms/${id}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setChatMessages([]);
        return;
      }
      const messagesArray = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
      setChatMessages(messagesArray);
    });

    return () => unsubscribe();
  }, [id]);

  const [leftMenuCollapsed, setLeftMenuCollapsed] = useState(true);
  const [rightMenuCollapsed, setRightMenuCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    updateGridClass();
  }, [snapToGrid]);

  const updateGridClass = () => {
    if (parentRef.current) {
      parentRef.current.className = `grid g`;
    }
  };

  const calculateSnapValue = () => {
    const snapToGridCount = Number.parseInt(snapToGrid, 10);
    const snapToGridPct = 100 / snapToGridCount;
    return Number.parseInt((snapToGridPct / 100) * canvasSize, 10);
  };

  const handleMouseDown = (index) => () => {
    setMouseDownBox(index);
  };

  const handleMouseUp = () => {
    setMouseDownBox(null);
  };

  const handleMouseMove = (event) => {
    if (mouseDownBox === null) return;

    const container = containerRef.current;
    const box = boxRefs.current[mouseDownBox];

    if (!container || !box) return;

    let clientX = event.clientX + container.scrollLeft;
    let clientY = event.clientY + container.scrollTop;

    const offsetLeft = container.getBoundingClientRect().left;
    const offsetTop = container.getBoundingClientRect().top;

    clientX = clientX - offsetLeft;
    clientY = clientY - offsetTop;

    const snapValue = calculateSnapValue();

    const snapedX = clientX - (clientX % snapValue);
    const snapedY = clientY - (clientY % snapValue);

    box.style.left = `${snapedX}px`;
    box.style.top = `${snapedY}px`;
  };

  const TabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <ChatTab
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={handleSetChatInput}
            userData={userData}
            chatRoomId={id}
          />
        );
      case 1:
        return (
          <div className="tab-content">
            <h3>Personajes</h3>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="tablero-container">
      <button className="collapse-button left-toggle-button" onClick={() => setLeftMenuCollapsed(!leftMenuCollapsed)}>
        {leftMenuCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <button className="collapse-button right-toggle-button" onClick={() => setRightMenuCollapsed(!rightMenuCollapsed)}>
        {rightMenuCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className={`left-menu ${leftMenuCollapsed ? "collapsed" : ""}`}>
        <div className="left-menu-content">
          <div className="left-menu-header">
            <h3>Dados</h3>
          </div>
          <div className="left-menu-buttons">
            <label>Tipo de dado:</label>
            <select value={selectedDice} onChange={(e) => setSelectedDice(e.target.value)}>
              {["d2", "d4", "d6", "d8", "d10", "d12", "d20"].map((die) => (
                <option key={die} value={die}>{die}</option>
              ))}
            </select>

            <label>Cantidad:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={diceCount}
              onChange={(e) => setDiceCount(parseInt(e.target.value))}
            />

            <button onClick={rollDice}>Lanzar</button>
          </div>
        </div>
      </div>

      <div className={`right-menu ${rightMenuCollapsed ? "collapsed" : ""}`}>
        <div className="right-menu-content">
          <div className="tabs-container">
            <div className={`tab ${activeTab === 0 ? "active" : ""}`} onClick={() => setActiveTab(0)}>
              <span>Chat</span>
            </div>
            <div className={`tab ${activeTab === 1 ? "active" : ""}`} onClick={() => setActiveTab(1)}>
              <span>Personajes</span>
            </div>
          </div>
          <div className="tab-content-container">
            <TabContent />
          </div>
        </div>
      </div>

      <div
        id="parentContainer"
        ref={parentRef}
        className="grid g"
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ position: "relative" }}
      >
        <div id="container" ref={containerRef} style={{ position: "relative" }}>
          {[
            { left: 250, top: 250 },
            { left: 350, top: 350 },
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
  );
};

export default Tablero;
