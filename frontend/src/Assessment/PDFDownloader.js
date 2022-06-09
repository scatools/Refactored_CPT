import React from 'react';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Dropdown } from 'react-bootstrap';
import { FaFilePdf } from 'react-icons/fa';

const PDFDownloader = ({rootElementId , downloadFileName}) => {

    const downloadPDFDocument = () => {
        const input = document.getElementById(rootElementId);

        html2canvas(input)
            .then((canvas) => {                
                const pdf = new jsPDF({orientation: 'portrait', format: 'letter'});
                const imgData = canvas.toDataURL('image/png');
                const imgProps= pdf.getImageProperties(imgData);
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const pdfWidth = pageWidth;
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                const totalPDFPages = Math.ceil(pdfHeight/pageHeight)-1;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                for (var i = 1; i <= totalPDFPages; i++) { 
                    pdf.addPage("letter", "portrait");
                    pdf.addImage(imgData, 'PNG', 0, -(pageHeight*i),pdfWidth,pdfHeight);
                }

                pdf.save(`${downloadFileName}.pdf`);
            });
    }

    return <Dropdown.Item variant="dark" onClick={downloadPDFDocument}> <FaFilePdf /> &nbsp; Download as PDF</Dropdown.Item>

}

export default PDFDownloader;