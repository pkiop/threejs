import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
function App() {
  const onSaveAs = (uri, filename) => {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = uri;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  };

  const onCapture = () => {
    html2canvas(document.getElementById('div')).then((canvas) => {
      onSaveAs(canvas.toDataURL('image/png'), 'image-dounload.png');
    });
  };

  return (
    <div>
      <div id='div'>
        <div>하이하이</div>
      </div>
      <button onClick={onCapture}>click</button>
    </div>
  );
}

export default App;
