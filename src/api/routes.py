"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, Pet, Breed
from api.utils import APIException
from flask_cors import CORS

api = Blueprint('api', __name__)
# Allow CORS requests to this API
CORS(api)


@api.route('/pets', methods=['GET'])
def get_pets():
    pets = Pet.query.all()
    results = [pet.serialize() for pet in pets]
    return jsonify(results), 200


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

    if 'name' in body:
        pet.name = body['name']
    if 'genre' in body:
        pet.genre = body['genre']
    if 'color' in body:
        pet.color = body['color']
    if 'size' in body:
        pet.size = body['size']
    if 'castrated' in body:
        pet.castrated = body['castrated']
    if 'chipNumber' in body:
        pet.chip_number = body['chipNumber']
    if 'photoUrl' in body:
        pet.photo_url = body['photoUrl']
    if 'idUser' in body:
        pet.user_id = body['idUser']
    if 'idShelter' in body:
        pet.shelter_id = body['idShelter']
    if 'idBreed' in body:
        pet.breed_id = body['idBreed']
    if 'birthDate' in body:
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
