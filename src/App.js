import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import "./App.css";

function App() {
  const [manipulatedPdfUrl, setManipulatedPdfUrl] = useState(null);
  const [manipulatedPdfBytes, setManipulatedPdfBytes] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async function (event) {
        const arrayBuffer = event.target.result;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        manipulatePdf(pdfDoc);
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const manipulatePdf = async (pdfDoc) => {
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const { height } = page.getSize();

      const scaleFactor = 0.5;
      page.scaleContent(scaleFactor, scaleFactor);

      page.translateContent(0, height * 0.5);
    });

    const manipulatedPdfBytes = await pdfDoc.save();
    const manipulatedPdfBlob = new Blob([manipulatedPdfBytes], {
      type: "application/pdf",
    });
    const manipulatedPdfUrl = URL.createObjectURL(manipulatedPdfBlob);
    setManipulatedPdfUrl(manipulatedPdfUrl);
    setManipulatedPdfBytes(manipulatedPdfBytes);
  };
  const handleDownload = () => {
    if (manipulatedPdfBytes) {
      const blob = new Blob([manipulatedPdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "mousa_pdf_minimized.pdf";
      link.click();
    }
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: "#999999",
        height: "fit-content",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: "30px",
      }}
    >
      <h1 style={{ color: "white", textAlign: "center" }}>
        Mousa Shtiwi PDF Minimizer
      </h1>
      <label
        htmlFor="pdf_load"
        style={{
          width: "300px",
          height: "50px",
          border: "none",
          borderRadius: "10px",
          margin: "10px",
          backgroundColor: "#222222",
          color: "white",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Upload PDF File
      </label>
      <input
        id="pdf_load"
        style={{
          backgroundColor: "blue",
          color: "white",
          margin: "10px",
          display: "none",
        }}
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
      />
      {manipulatedPdfUrl && (
        <div>
          <iframe
            src={manipulatedPdfUrl}
            title="Manipulated PDF"
            width="300"
            height="400"
          ></iframe>
          <br />
          <button
            style={{
              width: "300px",
              height: "50px",
              border: "none",
              margin: "10px",
              borderRadius: "10px",
              backgroundColor: "#222222",
              color: "white",
              cursor: "pointer",
            }}
            onClick={handleDownload}
          >
            Download Edited PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
