
export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;

  // 1. Handle Text Files (.txt, .md, .json)
  if (fileType === 'text/plain' || fileType === 'application/json' || file.name.endsWith('.md')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  // 2. Handle PDF Files
  if (fileType === 'application/pdf') {
    try {
      // Dynamic import to prevent main bundle crash if pdfjs fails to load initially
      const pdfjsLib = await import('pdfjs-dist');

      // Configure worker dynamically
      if (!(pdfjsLib as any).GlobalWorkerOptions.workerSrc) {
          (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Iterate through every page and extract text
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error("PDF Extraction Error:", error);
      throw new Error("Could not parse PDF. Please try a text file.");
    }
  }

  throw new Error("Unsupported file type. Please upload a PDF or TXT file.");
};
