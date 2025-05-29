FROM python:3.12-slim

WORKDIR  /app
COPY pyproject.toml poetry.lock README.md /app
RUN pip3 install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-directory --no-root

CMD ["poetry", "run", "start"]
EXPOSE 8000