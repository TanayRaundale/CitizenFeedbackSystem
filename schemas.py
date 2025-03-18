from pydantic import BaseModel
from enum import Enum

# ✅ Enum for Feedback Status


class FeedbackStatus(str, Enum):
    Pending = "Pending"
    Resolved = "Resolved"
    InProgress = "In Progress"  # Correct the key and value to match MySQL


# ✅ Feedback Schema
class FeedbackCreate(BaseModel):

    dept_id: int
    adhar_no: int  # 🔥 Corrected from dept_name to dept_id
    feedback_description: str  

class FeedbackResponse(BaseModel):
    fed_id: int
    status: FeedbackStatus
    admin_id: int
    dept_id: int
    adhar_no: str  # 🔥 Added missing field
    feedback_description: str  

    class Config:
        from_attributes = True

# ✅ User Schema
class UserCreate(BaseModel):
    adhar_no: str
    name: str
    email: str
    password: str
    address: str

class UserResponse(BaseModel):
    adhar_no: str
    name: str
    email: str
    address: str

    class Config:
        from_attributes = True

# ✅ Admin Schema
class AdminCreate(BaseModel):
    password: str
    dept_id: int

class AdminResponse(BaseModel):
    admin_id: int
    dept_id: int

    class Config:
        from_attributes = True

# ✅ Department Schema
class DepartmentCreate(BaseModel):
    dept_name: str

class DepartmentResponse(BaseModel):
    dept_id: int
    dept_name: str

    class Config:
        from_attributes = True

# ✅ Login Request
class LoginRequest(BaseModel):
    adhar_no: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

