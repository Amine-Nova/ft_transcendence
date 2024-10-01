FROM python:3.8-slim

COPY ./requirements.txt /

ENV PYTHONUNBUFFERED 1

ENV PYTHONDONTWRITEBYTECODE 1

RUN mkdir -p /project

COPY ./script.sh /

COPY project /project

WORKDIR /project

RUN chmod +x /script.sh

EXPOSE 8000

RUN python -m venv .env

RUN echo "source .env/bin/activate" >> ~/.bashrc

RUN pip install --upgrade pip

RUN pip install -r /requirements.txt

CMD ["bash", "/script.sh"]
