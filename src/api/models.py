from flask_sqlalchemy import SQLAlchemy
from typing import Optional, List
from sqlalchemy import String, Boolean, Date, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from sqlalchemy import String, Boolean, Date, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    legal_document: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False)
    address: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    birth_date: Mapped[Optional[Date]] = mapped_column(Date, nullable=True)
    pc: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)

    pets: Mapped[List["Pet"]] = relationship("Pet", back_populates="owner")
    appointments: Mapped[List["MedicalAppointment"]] = relationship(
        "MedicalAppointment", back_populates="user")
    adoptions: Mapped[List["Adoption"]] = relationship(
        "Adoption", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "legalDocument": self.legal_document,
            "address": self.address,
            "email": self.email,
            "birthDate": self.birth_date.strftime('%Y-%m-%d') if self.birth_date else None,
            "pc": self.pc,
            "city": self.city
        }


class Breed(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    breedName: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False)

    pets: Mapped[List["Pet"]] = relationship("Pet", back_populates="breed")

    def serialize(self):
        return {
            "id": self.id,
            "breedName": self.breedName
        }


class Shelter(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    cif: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    address: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    creation_date: Mapped[Optional[Date]] = mapped_column(Date, nullable=True)
    pc: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    icon_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    iban: Mapped[Optional[str]] = mapped_column(String(34), nullable=True)

    pets: Mapped[List["Pet"]] = relationship("Pet", back_populates="shelter")
    adoptions: Mapped[List["Adoption"]] = relationship(
        "Adoption", back_populates="shelter")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "city": self.city,
            "cif": self.cif,
            "address": self.address,
            "email": self.email,
            "creationDate": self.creation_date.strftime('%Y-%m-%d') if self.creation_date else None,
            "pc": self.pc,
            "iconUrl": self.icon_url,
            "iban": self.iban
        }


class Pet(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey('user.id'), nullable=True)
    shelter_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey('shelter.id'), nullable=True)
    breed_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey('breed.id'), nullable=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey('user.id'), nullable=True)
    shelter_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey('shelter.id'), nullable=True)
    breed_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey('breed.id'), nullable=True)
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

    owner: Mapped[Optional["User"]] = relationship(
        "User", back_populates="pets")
    breed: Mapped[Optional["Breed"]] = relationship(
        "Breed", back_populates="pets")
    shelter: Mapped[Optional["Shelter"]] = relationship(
        "Shelter", back_populates="pets")
    appointments: Mapped[List["MedicalAppointment"]] = relationship(
        "MedicalAppointment", back_populates="pet")
    adoptions: Mapped[List["Adoption"]] = relationship(
        "Adoption", back_populates="pet")

    def serialize(self):
        return {
            "id": self.id,
            "idUser": self.user_id,
            "idShelter": self.shelter_id,
            "idBreed": self.breed_id,
            "name": self.name,
            "genre": self.genre,
            "birthDate": self.birth_date.strftime('%Y-%m-%d') if self.birth_date else None,
            "castrated": self.castrated,
            "chipNumber": self.chip_number,
            "color": self.color,
            "photoUrl": self.photo_url,
            "size": self.size
        }


class Veterinarian(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    address: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    pc: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    icon_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    iban: Mapped[Optional[str]] = mapped_column(String(34), nullable=True)
    schedule: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    appointments: Mapped[List["MedicalAppointment"]] = relationship(
        "MedicalAppointment", back_populates="veterinarian")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "city": self.city,
            "address": self.address,
            "email": self.email,
            "pc": self.pc,
            "iconUrl": self.icon_url,
            "iban": self.iban,
            "schedule": self.schedule
        }


class Adoption(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('user.id'), nullable=False)
    pet_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('pet.id'), nullable=False)
    shelter_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('shelter.id'), nullable=False)
    date: Mapped[Date] = mapped_column(Date, nullable=False)
    state: Mapped[str] = mapped_column(String(50), nullable=False)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="adoptions")
    pet: Mapped["Pet"] = relationship("Pet", back_populates="adoptions")
    shelter: Mapped["Shelter"] = relationship(
        "Shelter", back_populates="adoptions")

    def serialize(self):
        return {
            "id": self.id,
            "idUser": self.user_id,
            "idPet": self.pet_id,
            "idShelter": self.shelter_id,
            "date": self.date.strftime('%Y-%m-%d') if self.date else None,
            "state": self.state,
            "comment": self.comment
        }


class MedicalAppointment(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('user.id'), nullable=False)
    pet_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('pet.id'), nullable=False)
    veterinarian_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('veterinarian.id'), nullable=False)
    date: Mapped[Date] = mapped_column(Date, nullable=False)
    hour: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    comments: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="appointments")
    pet: Mapped["Pet"] = relationship("Pet", back_populates="appointments")
    veterinarian: Mapped["Veterinarian"] = relationship(
        "Veterinarian", back_populates="appointments")

    def serialize(self):
        return {
            "id": self.id,
            "idUser": self.user_id,
            "idPet": self.pet_id,
            "idVeterinarian": self.veterinarian_id,
            "date": self.date.strftime('%Y-%m-%d') if self.date else None,
            "hour": self.hour,
            "comments": self.comments
        }
