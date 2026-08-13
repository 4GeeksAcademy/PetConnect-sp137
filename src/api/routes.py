"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from google import genai
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Breed, Pet, Shelter, Adoption, MedicalAppointment, Veterinarian, AdminUser
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import requests
from datetime import datetime

api = Blueprint('api', __name__)


@api.route('/loginUser', methods=['POST'])
def login_user():
    body = request.get_json()

    user = User.query.filter_by(email=body.get('email')).first()

    if not user or user.password != body.get('password'):
        return jsonify({"error": "Incorrect user or password."}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "user": user.serialize()}), 200


@api.route('/adminUserLogin', methods=['POST'])
def login_adminUser():
    body = request.get_json()

    adminUser = AdminUser.query.filter_by(email=body.get('email')).first()

    if not adminUser or adminUser.password != body.get('password'):
        return jsonify({"error": "Incorrect admin user or password."}), 401

    access_token = create_access_token(identity=str(adminUser.id))
    return jsonify({"access_token": access_token, "adminUser": adminUser.serialize()}), 200


@api.route('/loginVeterinarian', methods=['POST'])
def login_veterinarian():
    body = request.get_json()

    if not body:
        return jsonify({"message": "Request body is required"}), 400

    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    veterinarian = Veterinarian.query.filter_by(email=email).first()

    if not veterinarian or veterinarian.password != password:
        return jsonify({"message": "Incorrect email or password"}), 401

    access_token = create_access_token(identity=str(veterinarian.id))

    return jsonify({
        "access_token": access_token,
        "veterinarian": veterinarian.serialize()
    }), 200


@api.route('/veterinarian/profile', methods=['GET'])
@jwt_required()
def get_veterinarian_profile():

    veterinarian_id = get_jwt_identity()

    veterinarian = db.session.get(Veterinarian, int(veterinarian_id))

    if veterinarian is None:
        return jsonify({"message": "Veterinarian not found"}), 404

    return jsonify(veterinarian.serialize()), 200


@api.route('/veterinarian/profile', methods=['PUT'])
@jwt_required()
def update_veterinarian_profile():

    veterinarian_id = get_jwt_identity()

    veterinarian = db.session.get(Veterinarian, int(veterinarian_id))

    if veterinarian is None:
        return jsonify({"message": "Veterinarian not found"}), 404

    body = request.get_json()

    veterinarian.name = body.get("name", veterinarian.name)
    veterinarian.password = body.get("password", veterinarian.password)
    veterinarian.city = body.get("city", veterinarian.city)
    veterinarian.address = body.get("address", veterinarian.address)
    veterinarian.email = body.get("email", veterinarian.email)
    veterinarian.pc = body.get("pc", veterinarian.pc)
    veterinarian.icon_url = body.get("iconUrl", veterinarian.icon_url)
    veterinarian.iban = body.get("iban", veterinarian.iban)
    veterinarian.schedule = body.get("schedule", veterinarian.schedule)

    db.session.commit()

    return jsonify(veterinarian.serialize()), 200


@api.route('/veterinarian/appointments/<int:appointment_id>/approve', methods=['PUT'])
@jwt_required()
def approve_appointment(appointment_id):

    veterinarian_id = get_jwt_identity()

    appointment = db.session.get(MedicalAppointment, appointment_id)

    if appointment is None:
        raise APIException("Medical appointment not found", status_code=404)

    # Opcional: comprobar que la cita pertenece a este veterinario
    if appointment.veterinarian_id != int(veterinarian_id):
        return jsonify({"message": "Unauthorized"}), 403

    appointment.state = "approved"

    db.session.commit()

    return jsonify({
        "message": "Appointment approved successfully",
        "appointment": appointment.serialize()
    }), 200


@api.route('/veterinarian/appointments/<int:appointment_id>/reject', methods=['PUT'])
@jwt_required()
def reject_appointment(appointment_id):

    veterinarian_id = get_jwt_identity()

    appointment = db.session.get(MedicalAppointment, appointment_id)

    if appointment is None:
        raise APIException("Medical appointment not found", status_code=404)

    if appointment.veterinarian_id != int(veterinarian_id):
        return jsonify({"message": "Unauthorized"}), 403

    appointment.state = "rejected"

    db.session.commit()

    return jsonify({
        "message": "Appointment rejected successfully",
        "appointment": appointment.serialize()
    }), 200


################# Pets #################


@api.route('/pets', methods=['GET'])
def get_pets():
    shelter_id = request.args.get('shelter_id')
    pets_query = Pet.query
    if shelter_id:
        try:
            pets_query = pets_query.filter(Pet.shelter_id == int(shelter_id))
        except ValueError:
            raise APIException("Invalid shelter_id", status_code=400)

    pets = pets_query.order_by(Pet.id.asc()).all()
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

    user_id = int(body['user_id']) if body.get('user_id') else None
    shelter_id = int(body['shelter_id']) if body.get('shelter_id') else None
    breed_id = int(body['breed_id']) if body.get('breed_id') else None

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
    body = request.get_json(silent=True) or {}
    pet = db.session.get(Pet, pet_id)

    if pet is None:
        raise APIException("Pet not found.", status_code=404)

    pet.name = body.get('name', pet.name)
    pet.genre = body.get('genre', pet.genre)
    pet.color = body.get('color', pet.color)
    pet.size = body.get('size', pet.size)
    pet.castrated = body.get('castrated', pet.castrated)
    pet.chip_number = body.get('chipNumber', pet.chip_number)
    pet.photo_url = body.get('photoUrl', pet.photo_url)

    try:
        if body.get('user_id') not in (None, '', False):
            pet.user_id = int(body['user_id'])
        else:
            pet.user_id = None
        if body.get('shelter_id') not in (None, '', False):
            pet.shelter_id = int(body['shelter_id'])
        else:
            pet.shelter_id = None
        if body.get('breed_id') not in (None, '', False):
            pet.breed_id = int(body['breed_id'])
        else:
            pet.breed_id = None
    except (TypeError, ValueError):
        pet.user_id = None
        pet.shelter_id = None
        pet.breed_id = None

    birth_date = body.get('birthDate')
    if birth_date:
        if isinstance(birth_date, str):
            try:
                pet.birth_date = datetime.strptime(
                    birth_date, "%Y-%m-%d").date()
            except ValueError:
                pet.birth_date = None
        else:
            pet.birth_date = birth_date
    else:
        pet.birth_date = None

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

        new_user = User(
            name=body.get('name'),
            birth_date=body.get('birthDate') if body.get(
                'birthDate') else None,
            email=body.get('email'),
            password=body.get('password') or "",
            legal_document=body.get('legalDocument'),
            city=body.get('city') or "",
            pc=body.get('pc'),
            photo_url=body.get('photo_url'),
            address=body.get('adress') or ""

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

        user.name = body.get('name', user.name)
        user.birth_date = body.get('birthDate', user.birth_date)
        user.email = body.get('email', user.email)
        user.password = body.get('password', user.password)
        user.legal_document = body.get('legalDocument', user.legal_document)
        user.city = body.get('city', user.city)
        user.pc = body.get('pc', user.pc)
        user.address = body.get('adress', user.address)
        user.photo_url = body.get('photo_url', user.photo_url)

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
        if not body or not body.get('name') or not body.get('email') or not body.get('password') or not body.get('address'):
            return jsonify({"error": "name, email, password y address son requeridos"}), 400

        # Verificar si el email ya existe
        existing_shelter = Shelter.query.filter_by(
            email=body.get('email')).first()
        if existing_shelter:
            return jsonify({"error": "El email ya está registrado"}), 400

        # Crear nuevo refugio
        new_shelter = Shelter(
            name=body.get('name'),
            password=body.get('password'),
            email=body.get('email'),
            city=body.get('city'),
            cif=body.get('cif'),
            address=body.get('address'),
            pc=body.get('pc'),
            icon_url=body.get('iconUrl'),
            iban=body.get('iban')
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
        shelter.password = body.get('password', shelter.password)
        shelter.city = body.get('city', shelter.city)
        shelter.cif = body.get('cif', shelter.cif)
        shelter.address = body.get('address', shelter.address)
        shelter.pc = body.get('pc', shelter.pc)
        shelter.icon_url = body.get('iconUrl', shelter.icon_url)
        shelter.iban = body.get('iban', shelter.iban)

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


@api.route("/shelterLogin", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # De nuevo verifico que no hayan campos vacios
    if not email or not password:
        return jsonify({"msg": "Se requiere un Email o password"}), 400

    shelter = db.session.execute(db.select(Shelter).where(
        Shelter.email == email, Shelter.password == password)).scalar_one_or_none()

    if shelter is None:
        return jsonify({"msg": "Email o Password incorrecto"}), 400

    # Cuando user y pass son correctas. no hay conflictos:
    access_token = create_access_token(
        identity=str(shelter.id))  # token creado
    return jsonify(access_token=access_token, shelter=shelter.serialize()), 200

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

############ Breeds Api ############


@api.route('/dog-breeds', methods=['GET'])
def get_dog_breeds():
    response = requests.get("https://dog.ceo/api/breeds/list/all")

    if response.status_code != 200:
        return jsonify({"message": "Error getting dog breeds"}), 500

    data = response.json()

    return jsonify(data), 200


@api.route('/dog-breeds/<path:breed>/image', methods=['GET'])
def get_dog_breed_image(breed):

    response = requests.get(
        f"https://dog.ceo/api/breed/{breed}/images/random"
    )

    if response.status_code != 200:
        return jsonify({"message": "Breed not found"}), 404

    data = response.json()

    return jsonify({
        "breed": breed,
        "image": data["message"]
    }), 200

################# Adoptions #################


@api.route('/adoptions', methods=['GET'])
def get_adoptions():
    shelter_id = request.args.get('shelter_id')
    adoptions_query = Adoption.query
    if shelter_id:
        try:
            adoptions_query = adoptions_query.filter(
                Adoption.shelter_id == int(shelter_id))
        except ValueError:
            raise APIException("Invalid shelter_id", status_code=400)

    adoptions = adoptions_query.order_by(Adoption.id.asc()).all()
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
        user_id=int(body['user_id']),
        pet_id=int(body['pet_id']),
        shelter_id=int(body['shelter_id']),
        date=body.get('date'),
        state=body.get('state'),
        comment=body.get('comment')
    )

    db.session.add(new_adoption)
    db.session.commit()

    return jsonify({"message": "Adoption request created successfully", "adoption": new_adoption.serialize()}), 201


@api.route('/adoptions/<int:adoption_id>', methods=['DELETE'])
def delete_adoption(adoption_id):
    adoption = db.session.get(Adoption, adoption_id)

    if adoption is None:
        raise APIException("Adoption not found", status_code=404)

    db.session.delete(adoption)
    db.session.commit()

    return jsonify({"message": "Adoption successfully deleted"}), 200


@api.route('/adoptions/<int:adoption_id>', methods=['PUT'])
def update_adoption(adoption_id):
    body = request.get_json()
    adoption = db.session.get(Adoption, adoption_id)

    if adoption is None:
        raise APIException("Adoption not found", status_code=404)

    if not body:
        raise APIException("You must send a request body", status_code=400)

    adoption.user_id = int(body['user_id'])
    adoption.pet_id = int(body['pet_id'])
    adoption.shelter_id = int(body['shelter_id'])
    adoption.date = body['date']
    adoption.state = body['state']
    adoption.comment = body['comment']

    db.session.commit()

    return jsonify({"message": "Adoption successfully updated", "adoption": adoption.serialize()}), 200


################# Medical Appointments #################

@api.route('/medical-appointments', methods=['GET'])
def get_medical_appointments():
    appointments = MedicalAppointment.query.order_by(
        MedicalAppointment.id.asc()).all()
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
        user_id=int(body['user_id']),
        pet_id=int(body['pet_id']),
        veterinarian_id=int(body['veterinarian_id']),
        date=body.get('date'),
        hour=body.get('hour'),
        comments=body.get('comments')
    )

    db.session.add(new_appointment)
    db.session.commit()

    return jsonify({"message": "Medical appointment created successfully", "appointment": new_appointment.serialize()}), 201


@api.route('/medical-appointments/<int:medapp_id>', methods=['DELETE'])
def delete_medapp(medapp_id):
    medapp = db.session.get(MedicalAppointment, medapp_id)

    if medapp is None:
        raise APIException("Medical Appointment not found", status_code=404)

    db.session.delete(medapp)
    db.session.commit()

    return jsonify({"message": "Medical Appointment successfully deleted"}), 200


@api.route('/medical-appointments/<int:appointment_id>', methods=['PUT'])
def update_medical_appointment(appointment_id):
    body = request.get_json()
    appointment = db.session.get(MedicalAppointment, appointment_id)

    if appointment is None:
        raise APIException("Medical appointment not found", status_code=404)

    if not body:
        raise APIException("You must send a request body", status_code=400)

    appointment.user_id = int(body['user_id'])
    appointment.pet_id = int(body['pet_id'])
    appointment.veterinarian_id = int(body['veterinarian_id'])
    appointment.date = body['date']
    appointment.hour = body['hour']
    appointment.comments = body['comments']

    db.session.commit()

    return jsonify({"message": "Medical appointment successfully updated", "appointment": appointment.serialize()}), 200


################# Veterinarian #################

@api.route('/veterinarians', methods=['GET'])
def get_veterinarians():
    veterinarians = Veterinarian.query.order_by(
        Veterinarian.id.asc()).all()
    results = [veterinarian.serialize() for veterinarian in veterinarians]
    return jsonify(results), 200


@api.route('/veterinarians/<int:veterinarian_id>', methods=['GET'])
def get_veterinarian(veterinarian_id):
    veterinarian = Veterinarian.query.get(veterinarian_id)

    if veterinarian is None:
        return jsonify({"message": "Veterinarian not found"}), 404

    return jsonify(veterinarian.serialize()), 200


@api.route('/veterinarians', methods=['POST'])
def create_veterinarian():
    body = request.get_json()

    if not body:
        return jsonify({"message": "Request body is required"}), 400

    required_fields = ["name", "password", "city", "address", "email"]

    for field in required_fields:
        if not body.get(field):
            return jsonify({"message": f"{field} is required"}), 400

    new_veterinarian = Veterinarian(
        name=body["name"],
        password=body["password"],
        city=body["city"],
        address=body["address"],
        email=body["email"],
        pc=body.get("pc"),
        icon_url=body.get("iconUrl"),
        iban=body.get("iban"),
        schedule=body.get("schedule")
    )

    db.session.add(new_veterinarian)
    db.session.commit()

    return jsonify(new_veterinarian.serialize()), 201


@api.route('/veterinarians/<int:veterinarian_id>', methods=['PUT'])
def update_veterinarian(veterinarian_id):
    veterinarian = Veterinarian.query.get(veterinarian_id)

    if veterinarian is None:
        return jsonify({"message": "Veterinarian not found"}), 404

    body = request.get_json()

    veterinarian.name = body.get("name", veterinarian.name)
    veterinarian.password = body.get("password", veterinarian.password)
    veterinarian.city = body.get("city", veterinarian.city)
    veterinarian.address = body.get("address", veterinarian.address)
    veterinarian.email = body.get("email", veterinarian.email)
    veterinarian.pc = body.get("pc", veterinarian.pc)
    veterinarian.icon_url = body.get("iconUrl", veterinarian.icon_url)
    veterinarian.iban = body.get("iban", veterinarian.iban)
    veterinarian.schedule = body.get("schedule", veterinarian.schedule)

    db.session.commit()

    return jsonify(veterinarian.serialize()), 200


@api.route('/veterinarians/<int:veterinarian_id>', methods=['DELETE'])
def delete_veterinarian(veterinarian_id):
    veterinarian = Veterinarian.query.get(veterinarian_id)

    if veterinarian is None:
        return jsonify({"message": "Veterinarian not found"}), 404

    db.session.delete(veterinarian)
    db.session.commit()

    return jsonify({"message": "Veterinarian deleted successfully"}), 200


@api.route('/veterinarian/appointments', methods=['GET'])
@jwt_required()
def get_veterinarian_appointments():

    veterinarian_id = int(get_jwt_identity())

    appointments = MedicalAppointment.query.filter_by(
        veterinarian_id=veterinarian_id
    ).order_by(MedicalAppointment.date.asc()).all()

    return jsonify(
        [appointment.serialize() for appointment in appointments]
    ), 200


@api.route('/pets/available-for-adoption', methods=['GET'])
def get_available_pets():
    pets = Pet.query.filter(Pet.user_id.is_(
        None), Pet.shelter_id.isnot(None)).all()

    result = []
    for pet in pets:
        pet_data = pet.serialize()
        if pet.shelter:
            pet_data["shelter"] = pet.shelter.serialize()
        else:
            pet_data["shelter"] = None

        if pet.breed:
            pet_data["breed"] = pet.breed.serialize()
        else:
            pet_data["breed"] = None
        result.append(pet_data)

    return jsonify(result), 200


@api.route('/pet-recommendation', methods=['POST'])
def pet_recommendation():
    body = request.get_json()
    if not body or not body.get('prompt'):
        return jsonify({"error": "Prompt is required"}), 400

    user_prompt = body.get('prompt')

    try:
        client = genai.Client()

        system_instruction = (
            "You are an expert veterinarian and professional animal behaviorist. "
            "Your goal is to help users find the ideal pet and exact breed that best matches their personality, daily routine, activity level, and living space."
            "Provide warm, well-structured, and realistic recommendations."
        )

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=user_prompt,
            config={
                "system_instruction": system_instruction,
            }
        )

        return jsonify({"recommendation": response.text}), 200

    except Exception as e:
        print("Error generating pet recommendation:", str(e))
        return jsonify({"error": "Failed to generate recommendation from AI service"}), 500
