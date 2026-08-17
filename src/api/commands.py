
import click
from datetime import date

from api.models import db, User, Shelter, Pet, Breed


"""
In this file, you can add as many commands as you want using the
@app.cli.command decorator.

Flask commands are useful for running tasks outside of the API
but still in integration with your database.
"""


def setup_commands(app):

    # =========================================================
    # INSERT TEST USERS
    # =========================================================

    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        print("Creating test users")

        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True

            db.session.add(user)
            db.session.commit()

            print("User:", user.email, "created.")

        print("All test users created")

    # =========================================================
    # INSERT PET CONNECT TEST DATA
    # =========================================================

    @app.cli.command("insert-test-data")
    def insert_test_data():

        print("Creating Pet Connect test data...")

        # =====================================================
        # BREEDS
        # =====================================================

        breeds_data = [
            "Labrador Retriever",
            "Golden Retriever",
            "Pastor Alemán",
            "Beagle"
        ]

        breeds = {}

        for breed_name in breeds_data:

            breed = Breed.query.filter_by(
                breedName=breed_name
            ).first()

            if not breed:
                breed = Breed(
                    breedName=breed_name
                )

                db.session.add(breed)
                db.session.flush()

                print(f"Breed created: {breed_name}")

            else:
                print(f"Breed already exists: {breed_name}")

            breeds[breed_name] = breed

        # =====================================================
        # SHELTERS
        # =====================================================

        shelters_data = [
            {
                "name": "Patitas Felices",
                "email": "patitasfelices@petconnect.com",
                "password": "123456",
                "city": "Madrid",
                "cif": "B12345678",
                "address": "Calle de Alcalá 100",
                "pc": "28009",
                "icon_url": None,
                "iban": None
            },
            {
                "name": "Refugio Esperanza",
                "email": "refugioesperanza@petconnect.com",
                "password": "123456",
                "city": "Madrid",
                "cif": "B23456789",
                "address": "Calle Toledo 50",
                "pc": "28005",
                "icon_url": None,
                "iban": None
            },
            {
                "name": "Amigos de 4 Patas",
                "email": "amigos4patas@petconnect.com",
                "password": "123456",
                "city": "Madrid",
                "cif": "B34567890",
                "address": "Calle Bravo Murillo 80",
                "pc": "28020",
                "icon_url": None,
                "iban": None
            }
        ]

        shelters = {}

        for data in shelters_data:

            # Search by CIF because it is UNIQUE
            shelter = Shelter.query.filter_by(
                cif=data["cif"]
            ).first()

            if not shelter:

                shelter = Shelter(**data)

                db.session.add(shelter)
                db.session.flush()

                print(
                    f"Shelter created: {data['name']}"
                )

            else:

                print(
                    f"Shelter already exists: {shelter.name}"
                )

            shelters[data["name"]] = shelter

        # =====================================================
        # PETS
        # =====================================================

        pets_data = [
            {
                "name": "Ares",
                "shelter": "Patitas Felices",
                "breed": "Labrador Retriever",
                "genre": "male",
                "birth_date": date(2022, 5, 10),
                "castrated": True,
                "chip_number": "CHIP000001",
                "color": "Crema",
                "photo_url": None,
                "size": "medium"
            },
            {
                "name": "Luna",
                "shelter": "Patitas Felices",
                "breed": "Golden Retriever",
                "genre": "female",
                "birth_date": date(2021, 8, 15),
                "castrated": True,
                "chip_number": "CHIP000002",
                "color": "Dorado",
                "photo_url": None,
                "size": "large"
            },
            {
                "name": "Max",
                "shelter": "Refugio Esperanza",
                "breed": "Pastor Alemán",
                "genre": "male",
                "birth_date": date(2020, 3, 20),
                "castrated": True,
                "chip_number": "CHIP000003",
                "color": "Negro y marrón",
                "photo_url": None,
                "size": "large"
            },
            {
                "name": "Toby",
                "shelter": "Amigos de 4 Patas",
                "breed": "Beagle",
                "genre": "male",
                "birth_date": date(2023, 1, 12),
                "castrated": False,
                "chip_number": "CHIP000004",
                "color": "Tricolor",
                "photo_url": None,
                "size": "medium"
            }
        ]

        for data in pets_data:

            shelter = shelters[data["shelter"]]
            breed = breeds[data["breed"]]

            # Search by name + shelter
            pet = Pet.query.filter_by(
                name=data["name"],
                shelter_id=shelter.id
            ).first()

            if not pet:

                pet = Pet(
                    user_id=None,
                    shelter_id=shelter.id,
                    breed_id=breed.id,
                    name=data["name"],
                    genre=data["genre"],
                    birth_date=data["birth_date"],
                    castrated=data["castrated"],
                    chip_number=data["chip_number"],
                    color=data["color"],
                    photo_url=data["photo_url"],
                    size=data["size"]
                )

                db.session.add(pet)

                print(
                    f"Pet created: {data['name']} "
                    f"({data['shelter']})"
                )

            else:

                print(
                    f"Pet already exists: {data['name']} "
                    f"({data['shelter']})"
                )

        # =====================================================
        # SAVE EVERYTHING
        # =====================================================

        db.session.commit()

        print("================================")
        print("Pet Connect test data completed!")
        print("================================")
