from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum,Float
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from schemas import FeedbackStatus
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, DateTime

Base = declarative_base()

# ✅ Users Table
class User(Base):
    __tablename__ = "users"

    adhar_no = Column(String(12), primary_key=True)
    name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    address = Column(Text, nullable=False)

# ✅ Departments Table
class Department(Base):
    __tablename__ = "departments"

    dept_id = Column(Integer, primary_key=True, autoincrement=True)
    dept_name = Column(String(100), nullable=False, unique=True)

# ✅ Admins Table
class Admin(Base):
    __tablename__ = "admins"

    admin_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(50), unique=True, nullable=False)  # 🔥 Added email field for authentication
    password = Column(String(255), nullable=False)
    dept_id = Column(Integer, ForeignKey("departments.dept_id", ondelete="CASCADE"), nullable=False)

# ✅ Feedback Table
class Feedback(Base):
    __tablename__ = "feedback"

    fed_id = Column(Integer, primary_key=True, autoincrement=True)
    status = Column(Enum(FeedbackStatus, native_enum=False), default=FeedbackStatus.Pending, nullable=False)
    feedback_description = Column(Text, nullable=False)
    fed_date = Column(DateTime, default=datetime.utcnow, nullable=False)  # ✅ Keeps track of submission time

    adhar_no = Column(String(12), ForeignKey("users.adhar_no", ondelete="CASCADE"), nullable=False)
    admin_id = Column(Integer, ForeignKey("admins.admin_id", ondelete="CASCADE"), nullable=False)
    dept_id = Column(Integer, ForeignKey("departments.dept_id", ondelete="CASCADE"), nullable=False)

    # 📍 Added location fields (for Google Maps)
    latitude = Column(Float, nullable=True)   # ✅ Stores GPS latitude
    longitude = Column(Float, nullable=True)  # ✅ Stores GPS longitude