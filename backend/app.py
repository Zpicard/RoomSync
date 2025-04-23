from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///roommate_app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    chores = db.relationship('Chore', backref='assignee', lazy=True)
    guest_events = db.relationship('GuestEvent', backref='host', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)

class Chore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    frequency = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    completed = db.Column(db.Boolean, default=False)
    last_completed = db.Column(db.DateTime, nullable=True)

class GuestEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(20), nullable=False)
    guests = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'info', 'success', 'warning', 'error'
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        username=data['username'],
        password=data['password'],  # In production, hash the password
        email=data['email']
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.password == data['password']:  # In production, verify hashed password
        access_token = create_access_token(identity=user.id)
        return jsonify({'token': access_token}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/chores', methods=['GET'])
@jwt_required()
def get_chores():
    user_id = get_jwt_identity()
    chores = Chore.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': chore.id,
        'name': chore.name,
        'frequency': chore.frequency,
        'completed': chore.completed,
        'last_completed': chore.last_completed.isoformat() if chore.last_completed else None
    } for chore in chores]), 200

@app.route('/api/chores', methods=['POST'])
@jwt_required()
def create_chore():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    chore = Chore(
        name=data['name'],
        frequency=data['frequency'],
        user_id=user_id
    )
    
    db.session.add(chore)
    db.session.commit()
    
    return jsonify({'message': 'Chore created successfully', 'id': chore.id}), 201

@app.route('/api/chores/<int:chore_id>', methods=['PUT'])
@jwt_required()
def update_chore(chore_id):
    user_id = get_jwt_identity()
    chore = Chore.query.filter_by(id=chore_id, user_id=user_id).first()
    
    if not chore:
        return jsonify({'error': 'Chore not found'}), 404
    
    data = request.get_json()
    chore.completed = data.get('completed', chore.completed)
    chore.last_completed = datetime.utcnow() if chore.completed else None
    
    db.session.commit()
    return jsonify({'message': 'Chore updated successfully'}), 200

@app.route('/api/guests', methods=['GET'])
@jwt_required()
def get_guest_events():
    user_id = get_jwt_identity()
    events = GuestEvent.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': event.id,
        'title': event.title,
        'date': event.date.isoformat(),
        'time': event.time,
        'guests': event.guests,
        'notes': event.notes
    } for event in events]), 200

@app.route('/api/guests', methods=['POST'])
@jwt_required()
def create_guest_event():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    event = GuestEvent(
        title=data['title'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        time=data['time'],
        guests=data['guests'],
        notes=data.get('notes'),
        user_id=user_id
    )
    
    db.session.add(event)
    db.session.commit()
    
    return jsonify({'message': 'Guest event created successfully', 'id': event.id}), 201

@app.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id, read=False).all()
    return jsonify([{
        'id': notif.id,
        'message': notif.message,
        'type': notif.type,
        'created_at': notif.created_at.isoformat()
    } for notif in notifications]), 200

@app.route('/api/notifications/<int:notif_id>', methods=['PUT'])
@jwt_required()
def mark_notification_read(notif_id):
    user_id = get_jwt_identity()
    notification = Notification.query.filter_by(id=notif_id, user_id=user_id).first()
    
    if not notification:
        return jsonify({'error': 'Notification not found'}), 404
    
    notification.read = True
    db.session.commit()
    
    return jsonify({'message': 'Notification marked as read'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True) 