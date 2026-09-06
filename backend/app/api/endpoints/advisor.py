from fastapi import APIRouter, HTTPException, Depends
from app.schemas.agriculture import AdvisorChatRequest
from typing import Dict, Any

router = APIRouter(prefix="/advisor", tags=["KrishiMitra AI Advisor"])

def get_advisor_service():
    from app.main import advisor_service
    return advisor_service

@router.post("")
async def chat_advisor(req: AdvisorChatRequest, service=Depends(get_advisor_service)) -> Dict[str, Any]:
    try:
        return service.chat(
            message=req.message,
            context=req.context,
            language=req.language or "en"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Advisor assistant failed to process question.")
