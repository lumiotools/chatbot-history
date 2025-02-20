"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  pageNumber: number;
  snippet: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  pageNumber,
  snippet,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const customTextRenderer = (textItem: { str: string }) => {
    const { str } = textItem;
    if (!str) return str;

    if (str.includes("<mark>") || str === " ") {
      return str;
    } else if (snippet.toLowerCase().includes(str.toLowerCase())) {
      return `<mark>${str}</mark>`;
    }
    return str;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] min-w-[50vw] min-h-[50vh] w-fit h-full">
        <DialogHeader>
          <DialogTitle>Document Viewer</DialogTitle>
          <DialogDescription>
            Page {pageNumber} of {numPages}
          </DialogDescription>
        </DialogHeader>
        <div className="h-full flex justify-center overflow-y-auto">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            className="w-fit"
          >
            <Page
              className="!bg-transparent"
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              customTextRenderer={customTextRenderer}
            />
          </Document>
        </div>
      </DialogContent>
    </Dialog>
  );
};
