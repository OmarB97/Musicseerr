from fastapi import FastAPI
from fastapi.testclient import TestClient

from static_server import mount_frontend


def test_mobile_logo_icon_is_served_as_png():
    app = FastAPI()
    mount_frontend(app)

    response = TestClient(app).get("/logo_icon.png")

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("image/png")
    assert response.content.startswith(b"\x89PNG")
