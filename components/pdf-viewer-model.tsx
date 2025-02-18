import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  pageNumber: number;
}

export function PdfViewerModal({
  isOpen,
  onClose,
  pdfUrl,
  pageNumber,
}: PdfViewerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] h-full flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Source Document - Page {pageNumber}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1">
          <iframe
            src={`${pdfUrl}#page=${pageNumber}`}
            title={`PDF Page ${pageNumber}`}
            className="w-full h-full border-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
