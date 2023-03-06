from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///photographers.db'
db = SQLAlchemy(app)
CORS(app)

class Photographer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(2), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone_number': self.phone_number,
            'city': self.city,
            'state': self.state
        }

@app.route('/photographers', methods=['POST'])
def add_photographer():
    data = request.json
    photographer = Photographer(name=data['name'], email=data['email'], phone_number=data['phone_number'], city=data['city'], state=data['state'])
    db.session.add(photographer)
    db.session.commit()
    return jsonify({'message': 'Photographer added successfully'}), 200

@app.route('/photographers', methods=['GET'])
def get_photographers():
    photographers = Photographer.query.all()
    photographers_dict = [photographer.to_dict() for photographer in photographers]
    return jsonify({'photographers': photographers_dict}), 200

if __name__ == '__main__':
    app.run(debug=True)
