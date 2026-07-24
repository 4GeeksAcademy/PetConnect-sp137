"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Breed
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# GET - Obtener todas las razas
@api.route('/breed', methods=['GET'])
def get_breeds():
    breeds = Breed.query.all()
    return jsonify([breed.serialize() for breed in breeds]), 200


# GET - Obtener una raza por ID

@api.route('/breed/<int:breed_id>', methods=['GET'])
def get_breed(breed_id):
    breed = Breed.query.get(breed_id)

    if breed is None:
        return jsonify({"message": "Breed not found"}), 404

    return jsonify(breed.serialize()), 200


# POST - Crear una raza

@api.route('/breed', methods=['POST'])
def create_breed():
    body = request.get_json()

    if "breedName" not in body:
        return jsonify({"message": "breedName is required"}), 400

    new_breed = Breed(
        breedName=body["breedName"]
    )

    db.session.add(new_breed)
    db.session.commit()

    return jsonify(new_breed.serialize()), 201


# PUT - Actualizar una raza

@api.route('/breed/<int:breed_id>', methods=['PUT'])
def update_breed(breed_id):
    breed = Breed.query.get(breed_id)

    if breed is None:
        return jsonify({"message": "Breed not found"}), 404

    body = request.get_json()

    breed.breedName = body.get("breedName", breed.breedName)

    db.session.commit()

    return jsonify(breed.serialize()), 200


# DELETE - Eliminar una raza

@api.route('/breed/<int:breed_id>', methods=['DELETE'])
def delete_breed(breed_id):
    breed = Breed.query.get(breed_id)

    if breed is None:
        return jsonify({"message": "Breed not found"}), 404

    db.session.delete(breed)
    db.session.commit()

    return jsonify({"message": "Breed deleted successfully"}), 200
