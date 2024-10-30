import React, { useRef, useState } from "react";
import Draggable from "react-draggable"; // Importer la bibliothèque pour le glisser-déposer
import "./App.css";

const shapes = ["circle", "square", "triangle", "hexagon"];
const colorOptions = [
  { label: "Rouge", value: "#FF5733" },
  { label: "Vert", value: "#33FF57" },
  { label: "Bleu", value: "#3357FF" },
  { label: "Jaune", value: "#F1C40F" },
  { label: "Violet", value: "#8E44AD" },
  { label: "Orange", value: "#E67E22" },
  { label: "Vert clair", value: "#2ECC71" },
  { label: "Bleu clair", value: "#3498DB" },
  { label: "Rouge foncé", value: "#C0392B" },
  { label: "Orange foncé", value: "#D35400" },
];

function App() {
  const [image, setImage] = useState(null);
  const [elements, setElements] = useState([]);
  const [shape, setShape] = useState(shapes[0]);
  const [color, setColor] = useState(colorOptions[0].value);
  const [label, setLabel] = useState(""); // État pour le label de l'élément
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImage(imgUrl);
    }
  };

  const addElement = () => {
    const newElement = {
      id: Date.now(),
      shape,
      color,
      label,
      x: 100,
      y: 100,
    };
    setElements((prev) => [...prev, newElement]);
    setLabel(""); // Réinitialiser le label après l'ajout
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner l'image de la carte
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }

    // Dessiner les éléments
    elements.forEach((element) => {
      // Dessiner le label au-dessus de l'élément
      ctx.fillStyle = "#000"; // Couleur du texte
      ctx.font = "16px Arial";
      ctx.fillText(element.label, element.x - 20, element.y - 10); // Position du label

      // Dessiner l'élément
      ctx.fillStyle = element.color;

      // Taille réduite
      const size = 10; // Taille des éléments divisée par 2 (20/2)

      switch (element.shape) {
        case "circle":
          ctx.beginPath();
          ctx.arc(element.x, element.y, size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "square":
          ctx.fillRect(element.x - size, element.y - size, size * 2, size * 2);
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(element.x, element.y - size);
          ctx.lineTo(element.x - size, element.y + size);
          ctx.lineTo(element.x + size, element.y + size);
          ctx.closePath();
          ctx.fill();
          break;
        case "hexagon":
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            ctx.lineTo(
              element.x + size * 2 * Math.cos((i * 2 * Math.PI) / 6),
              element.y + size * 2 * Math.sin((i * 2 * Math.PI) / 6)
            );
          }
          ctx.closePath();
          ctx.fill();
          break;
        default:
          break;
      }
    });
  };

  const handleDrag = (e, data, id) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? { ...el, x: el.x + data.deltaX, y: el.y + data.deltaY }
          : el
      )
    );
  };

  const removeElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  return (
    <div className="App">
      <input type="file" accept="image/png" onChange={handleImageChange} />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseUp={drawCanvas}
      />
      <div>
        <label>
          Forme :
          <select onChange={(e) => setShape(e.target.value)} value={shape}>
            {shapes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Couleur :
          <select onChange={(e) => setColor(e.target.value)} value={color}>
            {colorOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Label :
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Entrez un label"
          />
        </label>
        <button onClick={addElement}>Ajouter un élément</button>
      </div>
      {elements.map((element) => (
        <Draggable
          key={element.id}
          onStop={(e, data) => handleDrag(e, data, element.id)}
        >
          <div
            style={{
              position: "absolute",
              left: element.x,
              top: element.y,
              cursor: "move",
            }}
          >
            <div
              style={{
                width: 20, // Taille réduite pour le rendu visuel
                height: 20, // Taille réduite pour le rendu visuel
                backgroundColor: element.color,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: element.shape === "circle" ? "50%" : "0%",
                clipPath:
                  element.shape === "triangle"
                    ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                    : element.shape === "hexagon"
                    ? "polygon(50% 0%, 0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%)"
                    : "none",
              }}
            />
            <button
              onClick={() => removeElement(element.id)}
              style={{
                position: "absolute",
                top: -20,
                left: 10,
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                padding: "5px",
                fontSize: "12px",
              }}
            >
              {element.label} {/* Utiliser le label de l'élément comme texte du bouton */}
            </button>
          </div>
        </Draggable>
      ))}
    </div>
  );
}

export default App;
