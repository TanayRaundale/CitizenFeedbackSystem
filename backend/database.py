from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://4KKHVVuq2TTFZEE.root:kH2k71Tlw26fF20L@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/citizenFeedback?ssl_ca=ca.pem"


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
