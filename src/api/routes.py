"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Shelter
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

###############################################################################################################

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

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
