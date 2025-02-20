"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "@/components/ui/button";

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
  const [currentPage, setCurrentPage] = useState(pageNumber);

  useEffect(() => {
    setCurrentPage(pageNumber);
  }, [pageNumber]);

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (numPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[80vh] min-w-[50vw] min-h-[80vh] w-fit h-full">
        <DialogHeader>
          <DialogTitle>Document Viewer</DialogTitle>
          <DialogDescription>
            Page {currentPage} of {numPages}
          </DialogDescription>
        </DialogHeader>
        <div className="h-full flex flex-col items-center justify-between overflow-y-auto overflow-x-hidden">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex-1"
          >
            <Page
              pageNumber={currentPage}
              className="!bg-transparent mb-4"
              width={800}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              customTextRenderer={
                pageNumber === currentPage ? customTextRenderer : undefined
              }
            />
          </Document>
        </div>
        <div className="flex justify-center items-center gap-4 mt-auto pt-4">
          <Button
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {numPages}
          </span>
          <Button
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= (numPages || 1)}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
