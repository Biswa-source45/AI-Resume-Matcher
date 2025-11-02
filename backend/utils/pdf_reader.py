import io
from typing import Optional
from PyPDF2 import PdfReader

def validate_pdf(file_content: bytes) -> bool:
    """Validate PDF content"""
    try:
        # Basic PDF signature check
        if len(file_content) < 4:
            return False
            
        # Check for %PDF header (case insensitive)
        header = file_content[0:4].lower()
        if not header.startswith(b'%pdf'):
            return False
            
        # Attempt to parse with PdfReader
        pdf_file = io.BytesIO(file_content)
        reader = PdfReader(pdf_file)
        return len(reader.pages) > 0
    except:
        return False

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF content"""
    try:
        pdf_file = io.BytesIO(file_content)
        reader = PdfReader(pdf_file)
        
        text_parts = []
        for page in reader.pages:
            try:
                page_text = page.extract_text() or ""
                if page_text.strip():
                    text_parts.append(page_text)
            except:
                continue
                
        return "\n".join(text_parts).strip()
    except Exception as e:
        raise ValueError(f"Failed to extract PDF text: {str(e)}")