```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of browser: Request body in the format "{"content": <value>, "date": <value>}"
    server-->>browser: {"message":"note created"}
    deactivate server
```
