from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class Shelter(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    city: Mapped[str] = mapped_column(String(120), nullable=True)
    CIF: Mapped[str] = mapped_column(String(50), nullable=True)
    adress: Mapped[str] = mapped_column(String(200), nullable=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    creationDate: Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False)
    pc: Mapped[str] = mapped_column(String(20), nullable=True)
    iconUrl: Mapped[str] = mapped_column(String(255), nullable=True)
    IBAN: Mapped[str] = mapped_column(String(34), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "city": self.city,
            "CIF": self.CIF,
            "adress": self.adress,
            "email": self.email,
            "creationDate": self.creationDate.isoformat() if self.creationDate else None,
            "pc": self.pc,
            "iconUrl": self.iconUrl,
            "IBAN": self.IBAN,
        }
