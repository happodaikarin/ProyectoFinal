import requests
from faker import Faker
import random
import numpy as np

fake = Faker()

# Genera 100 usuarios ficticios y almacénalos
usuarios = [{'userId': fake.uuid4(), 'userNickname': fake.user_name()} for _ in range(30)]


productos = [
    {"productId": "21", "productName": "Espresso Doble", "productCategory": "Bebidas Calientes"},
    {"productId": "22", "productName": "Café Campesino", "productCategory": "Bebidas Calientes"},
    {"productId": "23", "productName": "Café Americano", "productCategory": "Bebidas Calientes"},
    {"productId": "24", "productName": "Café Irlandés", "productCategory": "Bebidas Calientes"},
    {"productId": "25", "productName": "Capuccino", "productCategory": "Bebidas Calientes"},
    {"productId": "26", "productName": "Capuccino Caramelo", "productCategory": "Bebidas Calientes"},
    {"productId": "27", "productName": "Mocaccino", "productCategory": "Bebidas Calientes"},
    {"productId": "28", "productName": "Mocaccino Oreo", "productCategory": "Bebidas Calientes"},
    {"productId": "29", "productName": "Latte", "productCategory": "Bebidas Calientes"},
    {"productId": "30", "productName": "Carajillo", "productCategory": "Bebidas Calientes"},
    {"productId": "31", "productName": "Milo Caliente", "productCategory": "Bebidas Calientes"},
    {"productId": "32", "productName": "Aromatica (Frutos Rojos - Natural)", "productCategory": "Bebidas Calientes"},
    {"productId": "33", "productName": "Granizado de Café", "productCategory": "Bebidas Frias"},
    {"productId": "34", "productName": "Nevados (Café, Mocca, Oreo, Milo, Café Caramelo)", "productCategory": "Bebidas Frias"},
    {"productId": "35", "productName": "Malteada de Vainilla", "productCategory": "Bebidas Frias"},
    {"productId": "36", "productName": "Café Frozen", "productCategory": "Bebidas Frias"},
    {"productId": "39", "productName": "Sodas Italianas (Maracuyá, Mora, Lulo)", "productCategory": "Bebidas Frias"},
    {"productId": "40", "productName": "Sodas (Bretaña, Ginger, Coca-Cola)", "productCategory": "Bebidas Frias"},
    {"productId": "65", "productName": "Helado con Baileys", "productCategory": "Postres"},
    {"productId": "66", "productName": "Torta de Chocoláte", "productCategory": "Postres"},
    {"productId": "67", "productName": "Affogato", "productCategory": "Postres"},
    {"productId": "70", "productName": "BLACK STOUT BEER & COFFEE COMPANY", "productCategory": "Cervezas"},
    {"productId": "71", "productName": "RED IPA BEER & COFFEE COMPANY", "productCategory": "Cervezas"},
    {"productId": "75", "productName": "Martini", "productCategory": "Cócteles"},
    {"productId": "76", "productName": "Margarita", "productCategory": "Cócteles"},
    {"productId": "77", "productName": "Whisky Sour", "productCategory": "Cócteles"},
    {"productId": "78", "productName": "Cabeza de Jabalí", "productCategory": "Cócteles"},
    {"productId": "79", "productName": "Cocaína Rusa", "productCategory": "Cócteles"},
    {"productId": "80", "productName": "Tequila Sunrise", "productCategory": "Cócteles"},
    {"productId": "81", "productName": "Mojito (Cubano, Kiwi)", "productCategory": "Cócteles"},
    {"productId": "82", "productName": "Orgasmo", "productCategory": "Cócteles"},
    {"productId": "83", "productName": "Cosmopolitan", "productCategory": "Cócteles"},
    {"productId": "84", "productName": "Agave Cremoso", "productCategory": "Cócteles"},
    {"productId": "85", "productName": "Caipiriña", "productCategory": "Cócteles"},
    {"productId": "86", "productName": "Gin and Tonic", "productCategory": "Cócteles"},
    {"productId": "87", "productName": "Costillas BBQ", "productCategory": "Comidas"},
    {"productId": "88", "productName": "Alas BBQ", "productCategory": "Comidas"},
    {"productId": "89", "productName": "Papas Rock", "productCategory": "Comidas"},
    {"productId": "90", "productName": "Ranchipapa", "productCategory": "Comidas"},
    {"productId": "91", "productName": "Sandwich Bcc", "productCategory": "Comidas"},
    {"productId": "92", "productName": "Escandinava OL", "productCategory": "Cervezas"},
    {"productId": "93", "productName": "Escandinava Mono Nuñez", "productCategory": "Cervezas"},
    {"productId": "94", "productName": "ESCANDINAVA FREYA", "productCategory": "Cervezas"},
    {"productId": "95", "productName": "ESCANDINAVA HIDROMIEL", "productCategory": "Cervezas"},
    {"productId": "96", "productName": "BBC CHAPINERO", "productCategory": "Cervezas"},
    {"productId": "97", "productName": "BBC MONSERRATE", "productCategory": "Cervezas"},
    {"productId": "98", "productName": "BBC CAJICÁ", "productCategory": "Cervezas"},
    {"productId": "99", "productName": "BBC LAGER", "productCategory": "Cervezas"},
    {"productId": "100", "productName": "3 CORDILLERA BLANCA", "productCategory": "Cervezas"},
    {"productId": "101", "productName": "3 CORDILLERA NEGRA", "productCategory": "Cervezas"},
    {"productId": "102", "productName": "3 CORDILLERA MULATA", "productCategory": "Cervezas"},
    {"productId": "103", "productName": "3 CORDILLERA ROSADA", "productCategory": "Cervezas"},
    {"productId": "104", "productName": "3 CORDILLERA MESTIZA", "productCategory": "Cervezas"},
    {"productId": "105", "productName": "ANTAÑO IZZY", "productCategory": "Cervezas"},
    {"productId": "106", "productName": "ANTAÑO LÍRICA", "productCategory": "Cervezas"},
    {"productId": "107", "productName": "CASILDA", "productCategory": "Cervezas"},
    {"productId": "108", "productName": "MANGOZADERA", "productCategory": "Cervezas"},
    {"productId": "109", "productName": "ANTAÑO MARIA", "productCategory": "Cervezas"},
    {"productId": "110", "productName": "HOLY - ROJA MAGDALENA", "productCategory": "Cervezas"},
    {"productId": "111", "productName": "GINGER HONEY", "productCategory": "Cervezas"},
    {"productId": "112", "productName": "HOLY - MANGO", "productCategory": "Cervezas"},
    {"productId": "113", "productName": "HOLY - JAMAICA", "productCategory": "Cervezas"},
    {"productId": "114", "productName": "HOLY - SUMMER ALE", "productCategory": "Cervezas"},
    {"productId": "115", "productName": "HOLY - YOLANDA", "productCategory": "Cervezas"},
    {"productId": "116", "productName": "HEFEWEIZEN", "productCategory": "Cervezas"},
    {"productId": "117", "productName": "HOLY - INDIA PALE ALE", "productCategory": "Cervezas"},
    {"productId": "118", "productName": "HOLY - BROWN HONEY ALE", "productCategory": "Cervezas"},
    {"productId": "119", "productName": "GULDEN DRAAK (BÉLGICA)", "productCategory": "Cervezas"},
    {"productId": "120", "productName": "BUDWEISER (EE.UU)", "productCategory": "Cervezas"},
    {"productId": "121", "productName": "CORONA (MÉXICO)", "productCategory": "Cervezas"},
    {"productId": "122", "productName": "HEINEKEN (HOLANDA)", "productCategory": "Cervezas"},
    {"productId": "123", "productName": "SMIRNOFF ICE (RUSIA)", "productCategory": "Cervezas"},
    {"productId": "124", "productName": "STELLA ARTOIS (BÉLGICA)", "productCategory": "Cervezas"},
    {"productId": "125", "productName": "WEIDMANN SUPER-STRONG (ALEMANIA)", "productCategory": "Cervezas"},
    {"productId": "126", "productName": "DELIRIUM (BÉLGICA)", "productCategory": "Cervezas"},
    {"productId": "127", "productName": "ADNAMS INNOVATION IPA", "productCategory": "Cervezas"},
    {"productId": "128", "productName": "ERDINGER (ALEMANIA)", "productCategory": "Cervezas"},
    {"productId": "129", "productName": "CHIMAY", "productCategory": "Cervezas"},
    {"productId": "130", "productName": "PERONI", "productCategory": "Cervezas"},
    {"productId": "131", "productName": "GROLSH", "productCategory": "Cervezas"},
    {"productId": "132", "productName": "ESTRELLA DE GALICIA(ESPAÑA)", "productCategory": "Cervezas"},
    {"productId": "133", "productName": "Hamburguesa", "productCategory": "Comidas"},
    {"productId": "134", "productName": "Club Colombia Dorada", "productCategory": "Cervezas"},
    {"productId": "135", "productName": "Club Colombia Negra", "productCategory": "Cervezas"},
    {"productId": "136", "productName": "Club Colombia Roja", "productCategory": "Cervezas"},
    {"productId": "137", "productName": "Hakuna Beer El Jefe", "productCategory": "Cervezas"},
    {"productId": "138", "productName": "Hakuna Beer La India", "productCategory": "Cervezas"},
    {"productId": "139", "productName": "Hakuna Noctámbula", "productCategory": "Cervezas"},
    {"productId": "140", "productName": "Hakuna Marinera", "productCategory": "Cervezas"},
    {"productId": "141", "productName": "Hakuna Melosa", "productCategory": "Cervezas"},
    {"productId": "142", "productName": "Laguna Azul", "productCategory": "Cócteles"},
    {"productId": "143", "productName": "Sandwich De Pollo", "productCategory": "Comidas"},
    {"productId": "144", "productName": "Aguila Light", "productCategory": "Cervezas"},
    {"productId": "146", "productName": "Poker", "productCategory": "Cervezas"},
    {"productId": "147", "productName": "Granizado de Mocca", "productCategory": "Bebidas Frias"},
    {"productId": "148", "productName": "Granizado de Milo", "productCategory": "Bebidas Frias"},
    {"productId": "149", "productName": "Granizado de Oreo", "productCategory": "Bebidas Frias"},
    {"productId": "150", "productName": "Malteada de Café", "productCategory": "Bebidas Frias"},
    {"productId": "151", "productName": "Malteada de Oreo", "productCategory": "Bebidas Frias"},
    {"productId": "152", "productName": "Malteada de Milo", "productCategory": "Bebidas Frias"},
    {"productId": "153", "productName": "Limonada Natural", "productCategory": "Bebidas Frias"},
    {"productId": "154", "productName": "Limonada de Coco", "productCategory": "Bebidas Frias"},
    {"productId": "155", "productName": "Limonada de Café", "productCategory": "Bebidas Frias"},
    {"productId": "156", "productName": "Limonada Cerezada", "productCategory": "Bebidas Frias"},
    {"productId": "157", "productName": "Frappé Maracuya", "productCategory": "Bebidas Frias"},
    {"productId": "158", "productName": "Frappé de Frutos Rojos", "productCategory": "Bebidas Frias"},
    {"productId": "159", "productName": "Choripan", "productCategory": "Comidas"},
    {"productId": "160", "productName": "Patacones Rock", "productCategory": "Comidas"},
    {"productId": "161", "productName": "Escandinava Maracuya", "productCategory": "Cervezas"},
    {"productId": "162", "productName": "Limonada de Mango Biche", "productCategory": "Bebidas Frias"},
    {"productId": "163", "productName": "vino gato negro", "productCategory": "Vinos"},
    {"productId": "166", "productName": "vino azul", "productCategory": "Vinos"},
    {"productId": "167", "productName": "cannabis beer", "productCategory": "Cervezas"}
]

cervezas = [
    {"productId": "101", "productName": "3 CORDILLERA NEGRA", "productCategory": "Cervezas"},
    {"productId": "135", "productName": "Club Colombia Negra", "productCategory": "Cervezas"},
    {"productId": "139", "productName": "Hakuna Noctámbula", "productCategory": "Cervezas"},
    {"productId": "137", "productName": "Hakuna Beer El Jefe", "productCategory": "Cervezas"},
    {"productId": "115", "productName": "HOLY - YOLANDA", "productCategory": "Cervezas"},
    {"productId": "107", "productName": "CASILDA", "productCategory": "Cervezas"},
    {"productId": "70", "productName": "BLACK STOUT BEER & COFFEE COMPANY", "productCategory": "Cervezas"},
    {"productId": "66", "productName": "Torta de Chocoláte", "productCategory": "Postres"},
    {"productId": "102", "productName": "3 CORDILLERA MULATA", "productCategory": "Cervezas"},
    {"productId": "140", "productName": "Hakuna Marinera", "productCategory": "Cervezas"},
    {"productId": "136", "productName": "Club Colombia Roja", "productCategory": "Cervezas"},
    {"productId": "95", "productName": "ESCANDINAVA HIDROMIEL", "productCategory": "Cervezas"},
    {"productId": "110", "productName": "HOLY - ROJA MAGDALENA", "productCategory": "Cervezas"},
    {"productId": "106", "productName": "ANTAÑO LÍRICA", "productCategory": "Cervezas"},
    {"productId": "71", "productName": "RED IPA BEER & COFFEE COMPANY", "productCategory": "Cervezas"},
   ]


cervezas_hidromiel=[
    {"productId": "92", "productName": "Escandinava OL", "productCategory": "Cervezas"},
    {"productId": "93", "productName": "Escandinava Mono Nuñez", "productCategory": "Cervezas"},
    {"productId": "94", "productName": "ESCANDINAVA FREYA", "productCategory": "Cervezas"},
    {"productId": "95", "productName": "ESCANDINAVA HIDROMIEL", "productCategory": "Cervezas"},
]


# Funciones de interacción con el servidor
def post_interaction(user, product, url):
    interaction_data = {
        'userId': user['userId'],
        'userNickname': user['userNickname'],
        'productId': product['productId'],
        'productName': product['productName'],
        'productCategory': product['productCategory']
    }
    response = requests.post(f"{url}/interactions", json=interaction_data)
    return response.status_code

def post_rating(user, product, rating, url):
    rating_data = {
        'userId': user['userId'],
        'userNickname': user['userNickname'],
        'productId': product['productId'],
        'productName': product['productName'],
        'productCategory': product['productCategory'],
        'rating': rating
    }
    response = requests.post(f"{url}/ratings", json=rating_data)
    return response.status_code

def add_to_order(user, product, url):
    order_data = {
        'userId': user['userId'],
        'product_id': product['productId']
    }
    response = requests.post(f"{url}/add-to-order", json=order_data)
    return response.status_code

def place_order(user, product, url):
    order_data = {
        'userId': user['userId'],
        'product_id': product['productId']
    }
    response = requests.post(f"{url}/order_placed", json=order_data)
    return response.status_code

# Ejecuta la simulación
url = "http://localhost:5001"  # Asegúrate que es el puerto correcto
n_interactions = 1000

for _ in range(n_interactions):
    user = random.choice(usuarios)
    product = random.choice(cervezas_hidromiel)
    interaction_type = np.random.choice(['click', 'rate', 'add', 'place'], p=[0.4, 0.3, 0.2, 0.1])  # Ajusta las probabilidades si es necesario
    
    if interaction_type == 'click':
        print(post_interaction(user, product, url))
    elif interaction_type == 'rate':
        print(post_rating(user, product, random.randint(1, 5), url))
    elif interaction_type == 'add':
        print(add_to_order(user, product, url))
    elif interaction_type == 'place':
        print(place_order(user, product, url))
