from flask import Flask, jsonify, request
from neo4j import GraphDatabase
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})  # Habilitar CORS para rutas que comiencen con /api/
uri = "bolt://localhost:7687"
user = "neo4j"
password = "perr1toPari$"
driver = GraphDatabase.driver(uri, auth=(user, password))

##calculo de frecuencia

'''
def get_recommendations(user_id):
    try:
        with driver.session() as session:
            cypher_query = """
            MATCH (target:User {id: $user_id})
            MATCH (target)-[r:INTERACTED_WITH|RATED|ADDED_TO_ORDER|ORDER_PLACED]->(p:Product)
            WITH target, p, 
                CASE TYPE(r)
                WHEN 'RATED' THEN r.score
                WHEN 'ORDER_PLACED' THEN 4
                WHEN 'ADDED_TO_ORDER' THEN 3
                WHEN 'INTERACTED_WITH' THEN 1
                ELSE 0
                END as interactionWeight
            MATCH (p)<-[r2:INTERACTED_WITH|RATED|ADDED_TO_ORDER|ORDER_PLACED]-(other:User)
            WHERE other <> target
            WITH target, other, SUM(interactionWeight) as similarity
          
            ORDER BY similarity DESC
            LIMIT 10
            
            MATCH (other)-[r3:INTERACTED_WITH|RATED|ADDED_TO_ORDER|ORDER_PLACED]->(recommendation:Product)
            WHERE NOT (target)-[:INTERACTED_WITH|RATED|ADDED_TO_ORDER|ORDER_PLACED]->(recommendation)
           
             WITH recommendation, COUNT(*) as frequency
            WITH COLLECT({recommendation: recommendation.id, frequency: frequency}) AS recommendations, SUM(frequency) AS totalFrequency
            UNWIND recommendations AS rec
            RETURN rec.recommendation AS RecommendationID, rec.frequency AS Frequency, TOFLOAT(rec.frequency) / totalFrequency * 100 AS Percentage
            ORDER BY rec.frequency DESC
            LIMIT 10
            """
            result = session.run(cypher_query, user_id=user_id)
            recommendations = [{"RecommendationID": record["RecommendationID"], "Frequency": record["Frequency"], "Percentage": record["Percentage"]} for record in result]
            return recommendations
    except Exception as e:
        print(f"Error fetching recommendations: {str(e)}")
        return None  # Devuelve None o un mensaje de error específico si es necesario

'''

##correlacion de pearson
def get_recommendations(user_id):
    try:
        with driver.session() as session:
            cypher_query = """
            MATCH (target:User {id: $user_id})
            MATCH (target)-[r:INTERACTED_WITH|RATED|ADDED_TO_ORDER|ORDER_PLACED]->(p:Product)
            WITH target, p, 
                CASE TYPE(r)
                    WHEN 'RATED' THEN r.score
                    WHEN 'ORDER_PLACED' THEN 4
                    WHEN 'ADDED_TO_ORDER' THEN 3
                    WHEN 'INTERACTED_WITH' THEN 1
                    ELSE 0
                END as targetInteractionWeight

            MATCH (p)<-[r2:INTERACTED_WITH|RATED|ADDED_TO_ORDER|ORDER_PLACED]-(other:User)
            WHERE other <> target
            WITH target, other, p, targetInteractionWeight,
                CASE TYPE(r2)
                    WHEN 'RATED' THEN r2.score
                    WHEN 'ORDER_PLACED' THEN 4
                    WHEN 'ADDED_TO_ORDER' THEN 3
                    WHEN 'INTERACTED_WITH' THEN 1
                    ELSE 0
                END as otherInteractionWeight

            WITH target, other, p, 
                SUM(targetInteractionWeight * otherInteractionWeight) AS similarity
            ORDER BY similarity DESC
            LIMIT 10

            MATCH (other)-[r3:INTERACTED_WITH|RATED|ADDED_TO_ORDER|ORDER_PLACED]->(recommendation:Product)
            WHERE NOT (target)-[:INTERACTED_WITH|RATED|ADDED_TO_ORDER|ORDER_PLACED]->(recommendation)
            WITH recommendation, COUNT(*) AS frequency
            WITH COLLECT({recommendationId: recommendation.id, recommendationName: recommendation.name, frequency: frequency}) AS recommendations, SUM(frequency) AS totalFrequency
            UNWIND recommendations AS rec
            RETURN rec.recommendationId AS RecommendationID, rec.recommendationName AS RecommendationName, rec.frequency AS Frequency, TOFLOAT(rec.frequency) / totalFrequency * 100 AS Percentage
            ORDER BY rec.frequency DESC
            LIMIT 10
            """
            result = session.run(cypher_query, user_id=user_id)
            recommendations = [{"RecommendationID": record["RecommendationID"], "Frequency": record["Frequency"], "Percentage": record["Percentage"]} for record in result]
            return recommendations
    except Exception as e:
        print(f"Error fetching recommendations: {str(e)}")
        return None  # Devuelve None o un mensaje de error específico si es necesario




@app.route('/api/recommendations', methods=['GET'])
def recommendations():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "user_id parameter is required"}), 400
    results = get_recommendations(user_id)
    if results is None:
        return jsonify({"error": "Failed to fetch recommendations"}), 500
    return jsonify(results)

#5009
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')