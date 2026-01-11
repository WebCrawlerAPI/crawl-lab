import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

export function handlePdf(req, res) {
  const pdfPath = join(__dirname, '../../public/files/pdf/sample.pdf');
  res.sendFile(pdfPath, (err) => {
    if (err) {
      res.status(404).type('text/plain').send('PDF file not found. Please upload a PDF file to public/files/pdf/sample.pdf and try again. This endpoint is designed to serve a PDF file for testing scraper handling of binary content. PDF files are common document formats that scrapers may encounter when extracting data from documentation repositories or document archives.');
    }
  });
}

export function handleSimplePdf(req, res) {
  const pdfPath = join(__dirname, '../../public/files/pdf/sample.pdf');
  res.sendFile(pdfPath, (err) => {
    if (err) {
      res.status(404).type('text/plain').send('PDF file not found. Please upload a PDF file to public/files/pdf/sample.pdf and try again. This endpoint serves the same PDF content as /pdf. Having multiple paths to the same content tests if your scraper can handle duplicate content served from different URLs. This is a common scenario on websites where the same document might be accessible through multiple paths.');
    }
  });
}

export function handleImagePng(req, res) {
  const imagePath = join(__dirname, '../../public/images/sample.png');
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).type('text/plain').send('Image file not found. Please upload a PNG image to public/images/sample.png and try again. This endpoint is designed to serve an image file for testing scraper handling of image content. Images are common media types that scrapers may encounter when extracting data from image galleries, product pages, or media archives. Your scraper should be able to handle binary image content appropriately, whether it extracts metadata, processes the image, or skips it based on your requirements.');
    }
  });
}
