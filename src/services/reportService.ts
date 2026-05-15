import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { SearchResult } from "../types";

export const reportService = {
  generatePDF: async (result: SearchResult) => {
    const doc = new jsPDF() as any;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(22);
    doc.text("GlobalSearch AI - Detailed Report", 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Query: ${result.query}`, 14, 30);
    doc.text(`Date: ${new Date(result.timestamp).toLocaleString()}`, 14, 38);

    // Summary
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Executive Summary", 14, 50);
    
    doc.setFontSize(11);
    const splitSummary = doc.splitTextToSize(result.summary, pageWidth - 28);
    doc.text(splitSummary, 14, 60);

    let currentY = 60 + (splitSummary.length * 5) + 10;

    // Key points
    if (result.analysis?.keyPoints?.length) {
      doc.setFontSize(16);
      doc.text("Key Analytical Insights", 14, currentY);
      currentY += 10;
      
      doc.setFontSize(11);
      result.analysis.keyPoints.forEach((point, index) => {
        const splitPoint = doc.splitTextToSize(`• ${point}`, pageWidth - 28);
        doc.text(splitPoint, 14, currentY);
        currentY += (splitPoint.length * 5) + 2;
        
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
      });
    }

    // Sources
    if (result.groundingChunks?.length) {
      currentY += 10;
      doc.setFontSize(16);
      doc.text("Top Verification Sources", 14, currentY);
      currentY += 10;

      const sourceData = result.groundingChunks.map(chunk => [chunk.title, chunk.uri]);
      doc.autoTable({
        startY: currentY,
        head: [['Source Title', 'Link']],
        body: sourceData,
        theme: 'striped',
        headStyles: { fillColor: [40, 40, 40] }
      });
    }

    doc.save(`GlobalSearch_Report_${result.query.replace(/\s+/g, '_')}.pdf`);
  },

  exportJSON: (result: SearchResult) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `GlobalSearch_${result.query}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
};
