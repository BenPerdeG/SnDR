import React, { useEffect, useRef, useState } from 'react';
import './TableroOld.css';

const Tablero = () => {
  const containerRef = useRef(null);
  const parentRef = useRef(null);
  const boxRefs = useRef([]);
  const [snapToGrid, setSnapToGrid] = useState(40);
  const [mouseDownBox, setMouseDownBox] = useState(null);
  const canvasSize = 2000; 

  useEffect(() => {
    updateGridClass();
  }, [snapToGrid]);

  const updateGridClass = () => {
    if (parentRef.current) {
      parentRef.current.className = `grid g`;
    }
  };

  const calculateSnapValue = () => {
    const snapToGridCount = parseInt(snapToGrid, 10);
    const snapToGridPct = 100 / snapToGridCount;
    return parseInt((snapToGridPct / 100) * canvasSize, 10);
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

  return (
    <div>

      <div
        id="parentContainer"
        ref={parentRef}
        className={`grid g`}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ position: 'relative' }}
      >
        <div id="container" ref={containerRef} style={{ position: 'relative' }}>
          {[{ left: 0, top: 0 }, { left: 100, top: 100 }].map((pos, i) => (
            <div
              key={i}
              className="box"
              ref={(el) => (boxRefs.current[i] = el)}
              onMouseDown={handleMouseDown(i)}
              style={{
                position: 'absolute',
                left: `${pos.left}px`,
                top: `${pos.top}px`,
                cursor: mouseDownBox === i ? 'pointer' : 'inherit',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tablero;
