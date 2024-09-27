Instructions to get the site up and running (locally)

~ Reinstalling virtual environment
`rm -rf env`
`python -m venv env`
`source env/scripts/activate`
`pip install -r requirements.txt`

~ MySQL
First, Adjust database settings in backend/backend/settings.py and create schema in sql workbench
You may also have to delete any "initial.py" files in "\backend\api\migrations"
`cd backend`
`pip install mysqlclient`
`python manage.py makemigrations`
`python manage.py migrate`
`python manage.py runserver`

~ Frontend
`cd frontend`
`npm install vite`
`npm run dev`
