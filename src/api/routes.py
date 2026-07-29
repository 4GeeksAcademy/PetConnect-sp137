"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, Pet, Adoption, MedicalAppointment
from api.utils import APIException
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)

################# Pets #################


@api.route('/pets', methods=['GET'])
def get_pets():
    pets = Pet.query.order_by(Pet.id.asc()).all()
    results = [pet.serialize() for pet in pets]
    return jsonify(results), 200


@api.route('/pets/<int:pet_id>', methods=['GET'])
def get_single_pet(pet_id):
    pet = db.session.get(Pet, pet_id)

    if pet is None:
        raise APIException("Pet not found", status_code=404)

    return jsonify(pet.serialize()), 200


@api.route('/pets', methods=['POST'])
def create_pet():
    body = request.get_json()

    if not body:
        raise APIException("You must send a request body", status_code=400)
    if not body.get('name'):
        raise APIException("Pet name is required", status_code=400)

    user_id = int(body['idUser']) if body.get('idUser') else None
    shelter_id = int(body['idShelter']) if body.get('idShelter') else None
    breed_id = int(body['idBreed']) if body.get('idBreed') else None

    new_pet = Pet(
        user_id=user_id,
        shelter_id=shelter_id,
        breed_id=breed_id,
        name=body.get('name'),
        genre=body.get('genre'),
        birth_date=body.get('birthDate') if body.get('birthDate') else None,
        castrated=body.get('castrated', False),
        chip_number=body.get('chipNumber') if body.get('chipNumber') else None,
        color=body.get('color'),
        photo_url=body.get('photoUrl') if body.get('photoUrl') else None,
        size=body.get('size')
    )

    db.session.add(new_pet)
    db.session.commit()

    return jsonify({"message": "Pet created successfully", "pet": new_pet.serialize()}), 201


@api.route('/pets/<int:pet_id>', methods=['PUT'])
def update_pet(pet_id):
    body = request.get_json()
    pet = db.session.get(Pet, pet_id)

    if pet is None:
        raise APIException("Pet not found.", status_code=404)

    pet.name = body['name']
    pet.genre = body['genre']
    pet.color = body['color']
    pet.size = body['size']
    pet.castrated = body['castrated']
    pet.chip_number = body['chipNumber']
    pet.photo_url = body['photoUrl']
    pet.user_id = body['idUser']
    pet.shelter_id = body['idShelter']
    pet.breed_id = body['idBreed']
    pet.birth_date = body['birthDate']

    db.session.commit()

    return jsonify({"message": "Pet successfully updated", "pet": pet.serialize()}), 200


@api.route('/pets/<int:pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    pet = db.session.get(Pet, pet_id)

    if pet is None:
        raise APIException("Pet not found", status_code=404)

    db.session.delete(pet)
    db.session.commit()

    return jsonify({"message": "Pet successfully deleted"}), 200






################# Adoptions #################

@api.route('/adoptions', methods=['GET'])
def get_adoptions():
    adoptions = Adoption.query.order_by(Adoption.id.asc()).all()
    results = [adoption.serialize() for adoption in adoptions]
    return jsonify(results), 200


@api.route('/adoptions/<int:adoption_id>', methods=['GET'])
def get_single_adoption(adoption_id):
    adoption = db.session.get(Adoption, adoption_id)

    if adoption is None:
        raise APIException("Adoption not found", status_code=404)

    return jsonify(adoption.serialize()), 200


@api.route('/adoptions', methods=['POST'])
def create_adoption():
    body = request.get_json()

    if not body:
        raise APIException("You must send a request body", status_code=400)

    new_adoption = Adoption(
        user_id=int(body['idUser']),
        pet_id=int(body['idPet']),
        shelter_id=int(body['idShelter']),
        date=body.get('date'),
        state=body.get('state'),
        comment=body.get('comment')
    )

    db.session.add(new_adoption)
    db.session.commit()

    return jsonify({"message": "Adoption request created successfully", "adoption": new_adoption.serialize()}), 201


@api.route('/adoptions/<int:adoption_id>', methods=['PUT'])
def update_adoption(adoption_id):
    body = request.get_json()
    adoption = db.session.get(Adoption, adoption_id)

    if adoption is None:
        raise APIException("Adoption not found", status_code=404)

    if not body:
        raise APIException("You must send a request body", status_code=400)

    adoption.user_id = int(body['idUser'])
    adoption.pet_id = int(body['idPet'])
    adoption.shelter_id = int(body['idShelter'])
    adoption.date = body['date']
    adoption.state = body['state']
    adoption.comment = body['comment']

    db.session.commit()

    return jsonify({"message": "Adoption successfully updated", "adoption": adoption.serialize()}), 200





################# Medical Appointments #################

@api.route('/medical-appointments', methods=['GET'])
def get_medical_appointments():
    appointments = MedicalAppointment.query.order_by(MedicalAppointment.id.asc()).all()
    results = [appointment.serialize() for appointment in appointments]
    return jsonify(results), 200


@api.route('/medical-appointments/<int:appointment_id>', methods=['GET'])
def get_single_medical_appointment(appointment_id):
    appointment = db.session.get(MedicalAppointment, appointment_id)

    if appointment is None:
        raise APIException("Medical appointment not found", status_code=404)

    return jsonify(appointment.serialize()), 200


@api.route('/medical-appointments', methods=['POST'])
def create_medical_appointment():
    body = request.get_json()

    if not body:
        raise APIException("You must send a request body", status_code=400)

    new_appointment = MedicalAppointment(
        user_id=int(body['idUser']),
        pet_id=int(body['idPet']),
        shelter_id=int(body['idShelter']),
        appointment_date=body.get('appointmentDate'),
        reason=body.get('reason'),
        diagnosis=body.get('diagnosis'),
        treatment=body.get('treatment')
    )

    db.session.add(new_appointment)
    db.session.commit()

    return jsonify({"message": "Medical appointment created successfully", "appointment": new_appointment.serialize()}), 201


@api.route('/medical-appointments/<int:appointment_id>', methods=['PUT'])
def update_medical_appointment(appointment_id):
    body = request.get_json()
    appointment = db.session.get(MedicalAppointment, appointment_id)

    if appointment is None:
        raise APIException("Medical appointment not found", status_code=404)

    if not body:
        raise APIException("You must send a request body", status_code=400)

    appointment.user_id = int(body['idUser'])
    appointment.pet_id = int(body['idPet'])
    appointment.shelter_id = int(body['idShelter'])
    appointment.appointment_date = body['appointmentDate']
    appointment.reason = body['reason']
    appointment.diagnosis = body['diagnosis']
    appointment.treatment = body['treatment']

    db.session.commit()

    return jsonify({"message": "Medical appointment successfully updated", "appointment": appointment.serialize()}), 200