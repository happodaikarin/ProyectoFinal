from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS
import re
import unicodedata
import spacy

app = Flask(__name__)
CORS(app, resources={r"/search*": {"origins": "*"}})  # Configura CORS para permitir todas las origines en la ruta de búsqueda

# Configuración de la conexión a MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'happosai'
app.config['MYSQL_PASSWORD'] = 'perr1toPari$'
app.config['MYSQL_DB'] = 'product_db'


mysql = MySQL(app)

# Cargar el modelo de spaCy
nlp = spacy.load("es_core_news_sm")

def normalize_text(text):
    # Normalizar el texto removiendo diacríticos (tildes) y puntuación
    text = unicodedata.normalize('NFD', text)
    text = text.encode('ascii', 'ignore').decode("utf-8")
    text = re.sub(r'[^\w\s]', '', text)
    # Convertir a minúsculas y lematizar
    doc = nlp(text.lower())
    # Filtrar por lemas y eliminar stopwords y puntuación
    lemmas = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct]
    return " ".join(lemmas)


def search_in_product(query_lemmas, product_text):
    product_tokens = set(product_text.split())
    query_tokens = set(query_lemmas.split())
    return query_tokens.issubset(product_tokens)

# Usar esta función en el bucle donde se filtran los productos

@app.route('/search')
def search():
    query = request.args.get('q', '')
    query_lemmas = normalize_text(query)  # Solo obten lemas para la consulta

    if query:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, name, price, category, description, image_url FROM product")
        products = cur.fetchall()
        cur.close()

        matched_products = []
        for product in products:
            product_text = normalize_text(' '.join([product[1], product[3], product[4]]))
            if search_in_product(query_lemmas, product_text):
                matched_products.append(product)

        result = [{'id': prod[0], 'name': prod[1], 'price': prod[2], 'category': prod[3], 'description': prod[4], 'image_url': prod[5]} for prod in matched_products]
    else:
        result = []
    return jsonify(result)


#5005
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')