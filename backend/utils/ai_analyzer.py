from typing import Dict, List, Any
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.messages import SystemMessage, HumanMessage
import json
import re

class ResumeAnalyzer:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite",
            google_api_key=self.api_key,
            temperature=0.3,
            max_output_tokens=2048
        )
    
    def analyze_resume(self, resume_text: str) -> Dict[str, Any]:
        """Analyze resume text using Google Gemini"""
        
        system_prompt = """You are an expert resume analyzer and career advisor. 
        Analyze the following resume text and provide structured insights in JSON format.
        
        Return a JSON object with these fields:
        {
            "summary": "A concise 2-3 sentence summary of the candidate's experience and key strengths",
            "job_roles": ["List of 3-5 suggested job roles that match the candidate's experience"],
            "soft_skills": ["List of 5-7 key soft skills demonstrated in the resume"],
            "technical_skills": ["List of technical skills and technologies mentioned"],
            "sentiment": "Overall sentiment of the resume (Positive/Neutral/Needs Improvement)",
            "tone": "Professional tone assessment (Formal/Conversational/Mixed)",
            "suggested_jobs": ["List of 3-5 specific job titles the candidate should apply for"],
            "improvement_areas": ["List of 2-3 areas where the resume could be improved"],
            "experience_level": "Estimated experience level (Entry/Mid/Senior/Executive)"
        }
        
        Be specific, professional, and constructive in your analysis.
        Focus on extracting real, meaningful information from the resume text provided.
        If certain information is not available in the resume, provide reasonable defaults based on context."""
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Please analyze this resume:\n\n{resume_text}")
        ]
        
        try:
            response = self.llm.invoke(messages)
            content = response.content
            
            # Try to parse JSON from the response
            try:
                json_match = re.search(r'\{[\s\S]*\}', content)
                if json_match:
                    json_str = json_match.group()
                    analysis = json.loads(json_str)
                    
                    # check all required fields are present with defaults
                    defaults = {
                        "summary": "Professional with diverse skills and experience.",
                        "job_roles": ["Software Engineer", "Project Manager", "Data Analyst"],
                        "soft_skills": ["Communication", "Teamwork", "Problem-solving", "Leadership"],
                        "technical_skills": ["Various technologies"],
                        "sentiment": "Positive",
                        "tone": "Professional",
                        "suggested_jobs": ["Software Developer", "Technical Lead"],
                        "improvement_areas": ["Add more specific achievements", "Include quantifiable results"],
                        "experience_level": "Mid"
                    }
                    
                  
                    for key, default_value in defaults.items():
                        if key not in analysis or not analysis[key]:
                            analysis[key] = default_value
                    
                    return analysis
                else:
                    return self._create_structured_response(content)
                    
            except json.JSONDecodeError:
                return self._create_structured_response(content)
                
        except Exception as e:
            raise ValueError(f"Error analyzing resume: {str(e)}")
    
    def _create_structured_response(self, text: str) -> Dict[str, Any]:
        """Create a structured response when JSON parsing fails"""
        
        # Extract key information from the text response
        # Simple keyword extraction for demonstration
        
        skills = []
        if "python" in text.lower():
            skills.append("Python")
        if "javascript" in text.lower():
            skills.append("JavaScript")
        if "leadership" in text.lower():
            skills.append("Leadership")
        if "communication" in text.lower():
            skills.append("Communication")
            
        return {
            "summary": text.split('.')[0] + "." if '.' in text else "Experienced professional with diverse background.",
            "job_roles": ["Software Engineer", "Project Manager", "Team Lead"],
            "soft_skills": ["Communication", "Leadership", "Problem-solving", "Teamwork"],
            "technical_skills": skills if skills else ["Various technologies"],
            "sentiment": "Positive",
            "tone": "Professional",
            "suggested_jobs": ["Software Developer", "Technical Lead", "Product Manager"],
            "improvement_areas": ["Add more specific achievements", "Include quantifiable results"],
            "experience_level": "Mid"
        }
    
    def chat_with_context(self, resume_summary: str, user_message: str) -> str:
        """Generate chat response using resume context"""
        
        system_prompt = f"""You are a friendly and knowledgeable AI career assistant. 
        You have access to the user's resume summary and should provide helpful, 
        personalized career advice and insights.
        
        Resume Context:
        {resume_summary}
        
        Be encouraging, specific, and provide actionable advice when possible.
        Keep responses concise but informative. Focus on providing genuine career guidance
        based on the user's actual resume content and question."""
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_message)
        ]
        
        try:
            response = self.llm.invoke(messages)
            return response.content
        except Exception as e:
            return "I apologize, but I'm having trouble processing your request right now. Please try again later."