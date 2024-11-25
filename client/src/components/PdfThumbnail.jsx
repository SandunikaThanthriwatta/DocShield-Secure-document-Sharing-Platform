import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PdfThumbnail({ url }) {
  const canvasRef = useRef(null);
  const [state, setState] = useState('loading'); // loading | done | error

  useEffect(() => {
    if (!url) { setState('error'); return; }
    let cancelled = false;

    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(260 / viewport.width, 110 / viewport.height);
        const scaled = page.getViewport({ scale });

        canvas.width = scaled.width;
        canvas.height = scaled.height;

        await page.render({ canvasContext: canvas.getContext('2d'), viewport: scaled }).promise;
        if (!cancelled) setState('done');
      } catch (err) {
        console.error('PdfThumbnail error:', err);
        if (!cancelled) setState('error');
      }
    })();

    return () => { cancelled = true; };
  }, [url]);

  if (state === 'error') {
    return <PdfIcon sx={{ color: '#0d9488', fontSize: 32 }} />;
  }

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {state === 'loading' && <CircularProgress size={20} sx={{ color: '#0d9488' }} />}
      <canvas
        ref={canvasRef}
        style={{
          display: state === 'done' ? 'block' : 'none',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
  );
}
