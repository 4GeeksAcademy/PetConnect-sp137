"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Breed, Pet, Shelter
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)
# Allow CORS requests to this API
CORS(api)

###############################################################################################################

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


@api.route('/pet-detail/<int:pet_id>', methods=['PUT'])
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
    return jsonify(response_body), 200


###############################################################################################################

# Obtener todos los users
@api.route('/user', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.serialize() for user in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


###############################################################################################################
# Obtener un user específico por ID
@api.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

###############################################################################################################

# Crear un nuevo user
@api.route('/user', methods=['POST'])
def create_user():
    try:
        body = request.get_json()

        # Validar campos requeridos
        if not body or not body.get('name') or not body.get('email'):
            return jsonify({"error": "name y email son requeridos"}), 400


        # Verificar si el email ya existe
        existing_user = User.query.filter_by(
            email=body.get('email')).first()
        if existing_user:
            return jsonify({"error": "El email ya está registrado"}), 400


        # Crear nuevo user
        new_user = User(
            name=body.get('name'),
            birthDate=body.get('birthDate'),
            email=body.get('email'),
            password=body.get('password'),
            legalDocument=body.get('legalDocument'),
            city=body.get('city'),
            pc=body.get('pc'),
            adress=body.get('adress')
            
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify(new_user.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

##############################################################################################################

# Editar/actualizar user
@api.route('/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        body = request.get_json()

        # Actualizar campos del user
        user.name = body.get('name', user.name)
        user.birthDate = body.get('birthDate', user.birthDate)
        user.email = body.get('email', user.email)
        user.password = body.get('password', user.password)
        user.legalDocument = body.get('legalDocument', user.legalDocument)
        user.city = body.get('city', user.city)
        user.pc = body.get('pc', user.pc)
        user.adress = body.get('adress', user.adress)
        
        db.session.commit()

        return jsonify(user.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


###############################################################################################################

# Eliminar un user
@api.route('/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        user = User.query.get(id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "Usuario eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

###############################################################################################################
###############################################################################################################

# Obtener todos los refugios
@api.route('/shelter', methods=['GET'])
def get_shelters():
    try:
        shelters = Shelter.query.all()
        return jsonify([shelter.serialize() for shelter in shelters]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


###############################################################################################################
# Obtener un refugio específico por ID
@api.route('/shelter/<int:shelter_id>', methods=['GET'])
def get_shelter(shelter_id):
    try:
        shelter = Shelter.query.get(shelter_id)
        if not shelter:
            return jsonify({"error": "Refugio no encontrado"}), 404
        return jsonify(shelter.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

###############################################################################################################

# Crear un nuevo refugio
@api.route('/shelter', methods=['POST'])
def create_shelter():
    try:
        body = request.get_json()

        # Validar campos requeridos
        if not body or not body.get('name') or not body.get('email'):
            return jsonify({"error": "name y email son requeridos"}), 400


        # Verificar si el email ya existe
        existing_shelter = Shelter.query.filter_by(
            email=body.get('email')).first()
        if existing_shelter:
            return jsonify({"error": "El email ya está registrado"}), 400


        # Crear nuevo refugio
        new_shelter = Shelter(
            name=body.get('name'),
            email=body.get('email'),
            city=body.get('city'),
            CIF=body.get('CIF'),
            adress=body.get('adress'),
            pc=body.get('pc'),
            iconUrl=body.get('iconUrl'),
            IBAN=body.get('IBAN')
        )

        db.session.add(new_shelter)
        db.session.commit()

        return jsonify(new_shelter.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

##############################################################################################################

# Editar/actualizar refugio
@api.route('/shelter/<int:shelter_id>', methods=['PUT'])
def update_shelter(shelter_id):
    try:
        shelter = Shelter.query.get(shelter_id)
        if not shelter:
            return jsonify({"error": "Refugio no encontrado"}), 404

        body = request.get_json()

        # Actualizar campos del refugio
        shelter.name = body.get('name', shelter.name)
        shelter.email = body.get('email', shelter.email)
        shelter.city = body.get('city', shelter.city)
        shelter.CIF = body.get('CIF', shelter.CIF)
        shelter.adress = body.get('adress', shelter.adress)
        shelter.pc = body.get('pc', shelter.pc)
        shelter.iconUrl = body.get('iconUrl', shelter.iconUrl)
        shelter.IBAN = body.get('IBAN', shelter.IBAN)

        db.session.commit()

        return jsonify(shelter.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


###############################################################################################################

# Eliminar un refugio
@api.route('/shelter/<int:id>', methods=['DELETE'])
def delete_shelter(id):
    try:
        shelter = Shelter.query.get(id)
        if not shelter:
            return jsonify({"error": "Refugio no encontrado"}), 404

        db.session.delete(shelter)
        db.session.commit()

        return jsonify({"message": "Refugio eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
# GET - Obtener todas las razas
@api.route('/breed', methods=['GET'])
def get_breeds():
    breeds = Breed.query.all()
    return jsonify([breed.serialize() for breed in breeds]), 200

###############################################################################################################
###############################################################################################################

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
