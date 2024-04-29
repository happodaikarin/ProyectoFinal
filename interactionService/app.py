from flask import Flask, request, jsonify
from flask_cors import CORS
from neo4j import GraphDatabase
from neo4j.exceptions import Neo4jError
from datetime import datetime


app = Flask(__name__)
CORS(app)

# Configuración de la conexión a la base de datos Neo4j
uri = "bolt://localhost:7687"
user = "neo4j"
password = "perr1toPari$"

# Función para inicializar la conexión a la base de datos Neo4j
def get_db_driver():
    return GraphDatabase.driver(uri, auth=(user, password))


@app.route('/interactions', methods=['POST'])
def save_interaction():
    data = request.get_json()
    user_id = data.get('userId')
    user_nickname = data.get('userNickname')
    product_id = data.get('productId')
    product_name = data.get('productName')
    product_category = data.get('productCategory')
    timestamp = datetime.now().timestamp()

    try:
        with get_db_driver().session() as session:
            session.write_transaction(create_interaction, user_id, user_nickname, product_id, product_name, product_category, timestamp)
        return jsonify({"message": "Interacción guardada correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_interaction(tx, user_id, user_nickname, product_id, product_name, product_category, timestamp):
    query = """
    MERGE (u:User {id: $user_id})
    ON CREATE SET u.nickname = $user_nickname
    MERGE (p:Product {id: $product_id})
    ON CREATE SET p.name = $product_name
    MERGE (c:Category {name: $product_category})
    MERGE (p)-[:BELONGS_TO]->(c)
    MERGE (u)-[r:INTERACTED_WITH]->(p)
    ON CREATE SET r.count = 1, r.timestamp = $timestamp
    ON MATCH SET r.count = r.count + 1, r.timestamp = $timestamp
    """
    tx.run(query, {
        'user_id': user_id,
        'user_nickname': user_nickname,
        'product_id': product_id,
        'product_name': product_name,
        'product_category': product_category,
        'timestamp': timestamp
    })


@app.route('/interactions/category', methods=['POST'])
def save_category_interaction():
    data = request.get_json()
    user_id = data.get('userId')
    user_nickname = data.get('userNickname')
    category = data.get('category')
    timestamp = datetime.now().timestamp()  # Obtiene el timestamp actual


    try:
        with get_db_driver().session() as session:
            session.write_transaction(create_category_interaction, user_id, user_nickname, category,timestamp)
        return jsonify({"message": "Interacción de categoría guardada correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_category_interaction(tx, user_id, user_nickname, category, timestamp):
    query = """
    MERGE (u:User {id: $user_id})
    ON CREATE SET u.nickname = $user_nickname
    ON MATCH SET u.nickname = $user_nickname
    MERGE (c:Category {name: $category})
    MERGE (u)-[r:INTERACTED_WITH]->(c)
    ON CREATE SET r.count = 1, r.timestamp = $timestamp
    ON MATCH SET r.count = r.count + 1, r.timestamp = $timestamp
    """
    tx.run(query, {
        'user_id': user_id,
        'user_nickname': user_nickname,
        'category': category,
        'timestamp': timestamp
    })


@app.route('/ratings', methods=['POST'])
def save_rating():
    data = request.get_json()
    user_id = data.get('userId')
    user_nickname = data.get('userNickname')
    product_id = data.get('productId')
    product_name = data.get('productName')  # Obtener el nombre del producto
    product_category = data.get('productCategory')
    rating = data.get('rating')
    timestamp = datetime.now().timestamp()  # Obtiene el timestamp actual
    try:
        with get_db_driver().session() as session:
            session.write_transaction(create_rating_interaction, user_id, user_nickname, product_id, product_name,product_category ,rating, timestamp)  # Pasar también el nombre del producto
        return jsonify({"message": "Calificación guardada correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def create_rating_interaction(tx, user_id, user_nickname, product_id, product_name,product_category, rating, timestamp):
    query = (
    "MERGE (u:User {id: $user_id}) "
    "ON CREATE SET u.nickname = $user_nickname "
    "ON MATCH SET u.nickname = $user_nickname "
    "MERGE (c:Category {name: $product_category}) "
    "MERGE (p:Product {id: $product_id}) "
    "ON CREATE SET p.name = $product_name, p.category = $product_category "
    "ON MATCH SET p.name = COALESCE($product_name, p.name), p.category = COALESCE($product_category, p.category) "
    "MERGE (p)-[:BELONGS_TO]->(c) "
    "MERGE (u)-[:RATED {score: $rating, timestamp: $timestamp}]->(p)"
)


    parameters = {
        'user_id': user_id,
        'user_nickname': user_nickname,
        'product_id': product_id,
        'product_name': product_name,
        'product_category': product_category,
        'rating': rating,
        'timestamp': timestamp

    }
    tx.run(query, parameters)

@app.route('/add-to-order', methods=['POST'])
def add_to_order():
    data = request.get_json()
    try:
        with get_db_driver().session() as session:
            session.write_transaction(create_add_to_order_interaction, data['userId'], data['product_id'])
        return jsonify({"message": "Producto añadido a la lista de pedidos"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_add_to_order_interaction(tx, user_id, product_id):
    timestamp = datetime.now().timestamp()
    query = """
    MATCH (u:User {id: $user_id})
    MATCH (p:Product {id: $product_id})
    MERGE (u)-[r:ADDED_TO_ORDER]->(p)
    ON CREATE SET r.count = 1, r.timestamp = $timestamp
    ON MATCH SET r.count = r.count + 1, r.timestamp = $timestamp
    """
    tx.run(query, user_id=user_id, product_id=product_id, timestamp=timestamp)



@app.route('/order_placed', methods=['POST'])
def order_placed():
    data = request.get_json()
    try:
        with get_db_driver().session() as session:
            session.write_transaction(create_order_placed, data['userId'], data['product_id'])
        return jsonify({"message": "Order placed successfully"}), 200
    except Exception as e:
        app.logger.error(f"Failed to place order: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
def create_order_placed(tx, user_id, product_id):
    timestamp = datetime.now().timestamp()
    query = """
    MATCH (u:User {id: $user_id}), (p:Product {id: $product_id})
    MERGE (u)-[orderPlaced:ORDER_PLACED]->(p)
    ON CREATE SET orderPlaced.count = 1, orderPlaced.timestamp = $timestamp
    ON MATCH SET orderPlaced.count = orderPlaced.count + 1, orderPlaced.timestamp = $timestamp
    """
    tx.run(query, user_id=user_id, product_id=product_id, timestamp=timestamp)

#5001

if __name__ == '__main__':
    app.run(debug=True)
