import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.convo_id = self.scope['url_route']['kwargs']['convo_id']
        self.room_group_name = f'chat_{self.convo_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        if text_data is None:
            return
        data = json.loads(text_data)
        messageID = data.get('messageID')
        convo = data.get('convo')
        sender = data.get('sender')
        message = data.get('message')

        response = {
            'messageID': messageID,
            'convo': convo,
            'sender': sender,
            'message': message,
            'status': 'sent'
        }

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.message',
                'message': json.dumps(response)
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=event['message'])