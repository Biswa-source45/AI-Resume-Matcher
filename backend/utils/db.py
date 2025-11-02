from typing import Optional, Dict, Any, List
import os
from supabase import create_client, Client
import uuid
from datetime import datetime

class SupabaseDB:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Supabase URL and Service Key are required")
        
        self.client: Client = create_client(self.supabase_url, self.supabase_key)
    
    async def save_resume_analysis(self, user_id: str, resume_title: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Save resume analysis to database"""
        
        data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "resume_title": resume_title,
            "summary_text": analysis.get("summary", ""),
            "job_roles": analysis.get("job_roles", []),
            "soft_skills": analysis.get("soft_skills", []),
            "technical_skills": analysis.get("technical_skills", []),
            "sentiment": analysis.get("sentiment", ""),
            "tone": analysis.get("tone", ""),
            "suggested_jobs": analysis.get("suggested_jobs", []),
            "improvement_areas": analysis.get("improvement_areas", []),
            "experience_level": analysis.get("experience_level", ""),
            "created_at": datetime.utcnow().isoformat()
        }
        
        try:
            response = self.client.table("resume_analysis").insert(data).execute()
            return data
        except Exception as e:
            raise ValueError(f"Error saving analysis: {str(e)}")
    
    async def get_user_analyses(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all resume analyses for a user"""
        
        try:
            response = self.client.table("resume_analysis")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("created_at", desc=True)\
                .execute()
            
            return response.data if response.data else []
        except Exception as e:
            raise ValueError(f"Error fetching analyses: {str(e)}")
    
    async def get_latest_analysis(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get the most recent analysis for a user"""
        
        try:
            analyses = await self.get_user_analyses(user_id)
            return analyses[0] if analyses else None
        except Exception as e:
            raise ValueError(f"Error fetching latest analysis: {str(e)}")
    
    async def delete_analysis(self, analysis_id: str, user_id: str) -> bool:
        """Delete a specific analysis"""
        
        try:
            response = self.client.table("resume_analysis")\
                .delete()\
                .eq("id", analysis_id)\
                .eq("user_id", user_id)\
                .execute()
            
            return len(response.data) > 0
        except Exception as e:
            raise ValueError(f"Error deleting analysis: {str(e)}")
    
    async def create_tables(self):
        """Create database tables if they don't exist"""
        
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS resume_analysis (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            resume_title TEXT,
            summary_text TEXT,
            job_roles JSONB DEFAULT '[]'::jsonb,
            soft_skills JSONB DEFAULT '[]'::jsonb,
            technical_skills JSONB DEFAULT '[]'::jsonb,
            sentiment TEXT,
            tone TEXT,
            suggested_jobs JSONB DEFAULT '[]'::jsonb,
            improvement_areas JSONB DEFAULT '[]'::jsonb,
            experience_level TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_resume_analysis_user_id 
        ON resume_analysis(user_id);
        
        CREATE INDEX IF NOT EXISTS idx_resume_analysis_created_at 
        ON resume_analysis(created_at DESC);
        """
        
        # Note: This SQL should be executed in Supabase SQL editor
        print("Please execute the following SQL in your Supabase SQL editor:")
        print(create_table_sql)