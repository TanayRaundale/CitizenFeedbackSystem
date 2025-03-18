from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Admin, Department, User, Feedback, Base
from schemas import (
    AdminCreate, AdminResponse, DepartmentCreate, DepartmentResponse,
    UserCreate, UserResponse, LoginRequest, TokenResponse, FeedbackResponse, FeedbackCreate,FeedbackStatus
)
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS Configuration
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Database Initialization
Base.metadata.create_all(bind=engine)

# ✅ Secret Key for JWT
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ✅ OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ✅ Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ JWT Token Creation
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ✅ Get Current User from Token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        adhar_no: str = payload.get("sub")
        if not adhar_no:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
        user = db.query(User).filter(User.adhar_no == adhar_no).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# ✅ Get Current Admin from Token
def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = int(payload.get("sub"))
        if not admin_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
        admin = db.query(Admin).filter(Admin.admin_id == admin_id).first()
        if not admin:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin not found")
        
        return admin
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# ✅ Get Department ID from Name
def get_department_by_name(dept_name: str, db: Session):
    department = db.query(Department).filter(Department.dept_name == dept_name).first()
    if not department:
        raise HTTPException(status_code=400, detail="Invalid department name")
    return department.dept_id

# ✅ User Registration
@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.adhar_no == user.adhar_no).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# ✅ User Login
@app.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.adhar_no == login_data.adhar_no).first()
    if not user or user.password != login_data.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.adhar_no})
    return {"access_token": access_token, "token_type": "bearer"}

# ✅ Submit Feedback

# ✅ Fetch All Departments
@app.get("/departments", response_model=list[DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()


# ✅ Submit Feedback

@app.post("/submitfeedback")
def submit_feedback(feedback_data: FeedbackCreate, db: Session = Depends(get_db)):
    # Find the admin for the provided department
    admin = db.query(Admin).filter(Admin.dept_id == feedback_data.dept_id).first()

    if not admin:
        raise HTTPException(status_code=404, detail="No admin found for this department")

    new_feedback = Feedback(
        status=FeedbackStatus.Pending,
        adhar_no=feedback_data.adhar_no,
        dept_id=feedback_data.dept_id,
        feedback_description=feedback_data.feedback_description,
        admin_id=admin.admin_id  # Ensure admin_id is set
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return {"message": "Feedback submitted successfully", "feedback": new_feedback}


# ✅ Root Endpoint
@app.get("/")
def read_root():
    return {"message": "Citizen Feedback Management System"}