# Building M1dn1ght

## Requirements

- Go 1.16 or higher
- Node.js (for development)
- Python 3.7 or higher

## Building the CLI Tool

```bash
go build -o m1dn1ght-cli main.go
```

## Running the Web Interface

Simply open `index.html` in a web browser:

```bash
open index.html
```

Or use a local development server:

```bash
python3 -m http.server 8000
```

Then navigate to `http://localhost:8000`

## Building the Complete Package

```bash
go build -o dist/m1dn1ght-cli main.go
cp index.html dist/
cp script.js dist/
cp style.css dist/
cp LICENSE dist/
```
