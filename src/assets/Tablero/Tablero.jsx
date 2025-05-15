import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Layers, Settings, Box, Move } from "lucide-react"
import "./Tablero.css"

const Tablero = () => {
  const containerRef = useRef(null)
  const parentRef = useRef(null)
  const boxRefs = useRef([])
  const [snapToGrid, setSnapToGrid] = useState(40)
  const [mouseDownBox, setMouseDownBox] = useState(null)
  const canvasSize = 2000

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
          <div className="tab-content">
            <h3>Layers</h3>
            <div className="layer-item">
              <span>Box 1</span>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="layer-item">
              <span>Box 2</span>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="divider"></div>
            <button className="tab-button">Add Layer</button>
          </div>
        )
      case 1:
        return (
          <div className="tab-content">
            <h3>Settings</h3>
            <div className="setting-item">
              <label>Grid Size:</label>
              <select value={snapToGrid} onChange={(e) => setSnapToGrid(Number.parseInt(e.target.value))}>
                <option value="20">20x20</option>
                <option value="40">40x40</option>
                <option value="60">60x60</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Show Grid:</label>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="tab-content">
            <h3>Properties</h3>
            {mouseDownBox !== null ? (
              <div>
                <div className="property-item">
                  <label>Width:</label>
                  <input type="number" defaultValue="100" />
                </div>
                <div className="property-item">
                  <label>Height:</label>
                  <input type="number" defaultValue="100" />
                </div>
                <div className="property-item">
                  <label>Color:</label>
                  <input type="color" defaultValue="#ff0000" />
                </div>
              </div>
            ) : (
              <p>Select an element to edit properties</p>
            )}
          </div>
        )
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
            <h3>Tools</h3>
          </div>
          <div className="left-menu-buttons">
            <button className="left-menu-button" title="Select">
              <Move size={18} />
            </button>
            <button className="left-menu-button" title="Add Box">
              <Box size={18} />
            </button>
            <button className="left-menu-button" title="Layers">
              <Layers size={18} />
            </button>
            <button className="left-menu-button" title="Settings">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Menú Derecho */}
      <div className={`right-menu ${rightMenuCollapsed ? "collapsed" : ""}`}>
        <div className="right-menu-content">
          <div className="tabs-container">
            <div className={`tab ${activeTab === 0 ? "active" : ""}`} onClick={() => setActiveTab(0)}>
              <Layers size={16} />
              <span>Layers</span>
            </div>
            <div className={`tab ${activeTab === 1 ? "active" : ""}`} onClick={() => setActiveTab(1)}>
              <Settings size={16} />
              <span>Settings</span>
            </div>
            <div className={`tab ${activeTab === 2 ? "active" : ""}`} onClick={() => setActiveTab(2)}>
              <Box size={16} />
              <span>Properties</span>
            </div>
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
