from pydantic import BaseModel
from enum import Enum
from datetime import datetime
# ✅ Enum for Feedback Status
class FeedbackStatus(str, Enum):
    Pending = "Pending"
    Resolved = "Resolved"
    InProgress = "InProgress"  # Correct the key and value to match MySQL

# ✅ Feedback Schema
class FeedbackCreate(BaseModel):
    dept_name: str
    adhar_no: str  # Changed adhar_no to str for consistency
    feedback_description: str
    latitude: float  # Latitude is now required
    longitude: float  # Longitude is now required


class FeedbackResponse(BaseModel):
    fed_id: int
    status: FeedbackStatus
    admin_id: int
    dept_id: int
    adhar_no: str  # ✅ Ensures Aadhar number is included
    feedback_description: str  
    fed_date: datetime  # ✅ Keeps track of submission date
    latitude: float  # 📍 Mandatory Latitude
    longitude: float  # 📍 Mandatory Longitude

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
    email: str  # 🔥 Added email field for admin authentication
    password: str
    dept_id: int

class AdminResponse(BaseModel):
    admin_id: int
    dept_id: int  # 🔥 Keeping dept_id so admins can filter feedback
    email: str  # 🔥 Added email field to response

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

# ✅ Login Requests
class LoginRequest(BaseModel):
    adhar_no: str
    password: str

class AdminLoginRequest(BaseModel):  # 🔥 Separate schema for admin login
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
