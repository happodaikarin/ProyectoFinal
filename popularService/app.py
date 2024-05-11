from flask import Flask, jsonify
from flask_cors import CORS
from neo4j import GraphDatabase
from functools import lru_cache

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})  # Habilitar CORS para rutas que comiencen con /api/
# Configuración del driver de Neo4j
uri = "bolt://localhost:7687"
user = "neo4j"
password = "perr1toPari$"
driver = GraphDatabase.driver(uri, auth=(user, password))

@lru_cache(maxsize=32)  # Implementa caché para la función
def get_popular_products():
    query = """
    MATCH (p:Product)-[:BELONGS_TO]->(c:Category)
    OPTIONAL MATCH (p)<-[click:INTERACTED_WITH]-(userClick)
    OPTIONAL MATCH (p)<-[rate:RATED]-(userRate)
    OPTIONAL MATCH (p)<-[add:ADDED_TO_ORDER]-(userAdd)
    OPTIONAL MATCH (p)<-[place:ORDER_PLACED]-(userPlace)
    WITH p, c,
         COUNT(DISTINCT click) AS clicks,
         SUM(rate.score) AS ratingSum,
         COUNT(DISTINCT rate) AS ratingsCount,
         COUNT(DISTINCT add) AS adds,
         COUNT(DISTINCT place) AS orders,
         COUNT(DISTINCT click) + 3 * SUM(rate.score) + 5 * COUNT(DISTINCT add) + 4 * COUNT(DISTINCT place) AS PuntuacionTotal
    RETURN p.id AS idProducto, p.name AS nombreProducto, c.name AS categoria,
           ROUND(AVG(PuntuacionTotal), 2) AS puntuacionPromedio
    ORDER BY puntuacionPromedio DESC
    LIMIT 10
    """
    with driver.session() as session:
        result = session.run(query)
        return [{
            "idProducto": record["idProducto"],
            "nombreProducto": record["nombreProducto"],
            "categoria": record["categoria"],
            "puntuacionPromedio": record["puntuacionPromedio"]
        } for record in result]

@app.route('/api/popular-products')
def popular_products():
    try:
        products = get_popular_products()
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

##5002
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')