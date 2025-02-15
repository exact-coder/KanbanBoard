from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",  # React development server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/board")
def get_board():
    board_data = {
        'tasks': {
            'task-1': {'id': 'task-1', 'content': 'create vedio'},
            'task-2': {'id': 'task-2', 'content': 'edit vedio'},
            'task-3': {'id': 'task-3', 'content': 'publish vedio'},
            'task-4': {'id': 'task-4', 'content': 'task four'},
            'task-5': {'id': 'task-5', 'content': 'task five'},
            'task-6': {'id': 'task-6', 'content': 'task six'},
        },
        'columns': {
            'column-1': {
                'id': 'column-1',
                'title': 'To do',
                'taskIds': ['task-1','task-2']
            },
            'column-2': {
                'id': 'column-2',
                'title': 'Done',
                'taskIds': ['task-3','task-4']
            },
            'column-3': {
                'id': 'column-3',
                'title': 'Pending',
                'taskIds': ['task-5','task-6']
            },
        },
        'columnOrder': ['column-1', 'column-2','column-3']
    }
    return {'board': board_data}