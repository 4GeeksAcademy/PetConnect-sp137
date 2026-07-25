from flask_sqlalchemy import SQLAlchemy
from typing import Optional
from sqlalchemy import String, Boolean, Date, Integer
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


class Pet(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    shelter_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    breed_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    genre: Mapped[str] = mapped_column(String(20), nullable=False)
    birth_date: Mapped[Optional[Date]] = mapped_column(Date, nullable=True)
    castrated: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=False)
    chip_number: Mapped[Optional[str]] = mapped_column(
        String(50), nullable=True)
    color: Mapped[str] = mapped_column(String(30), nullable=False)
    photo_url: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True)
    size: Mapped[str] = mapped_column(String(20), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "idUser": self.user_id,
            "idShelter": self.shelter_id,
            "idBreed": self.breed_id,
            "name": self.name,
            "genre": self.genre,
            "birthDate": self.birth_date,
            "castrated": self.castrated,
            "chipNumber": self.chip_number,
            "color": self.color,
            "photoUrl": self.photo_url,
            "size": self.size
        }
