import React from "react";

const TestPage = () => {
  return (
    <div style={{ 
      padding: "20px", 
      background: "white", 
      minHeight: "100vh",
      color: "black" 
    }}>
      <h1>Página de Prueba</h1>
      <p>Si puedes ver esto, el routing funciona correctamente.</p>
      <div style={{ 
        background: "#f0f0f0", 
        padding: "10px", 
        marginTop: "20px",
        border: "1px solid #ccc"
      }}>
        Contenido de prueba
      </div>
    </div>
  );
};

export default TestPage;
