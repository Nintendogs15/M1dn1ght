# Building M1dn1ght

This guide explains how to build M1dn1ght from source for different ChromeOS architectures.

## Prerequisites

- Go 1.21 or higher installed
- Git for cloning the repository
- For cross-compilation, no additional tools needed

## Building for Your Architecture

### Quick Build (Default Architecture)

```bash
git clone https://github.com/Nintendogs15/M1dn1ght.git
cd M1dn1ght
go build -o M1dn1ght main.go
chmod +x M1dn1ght
```

### Cross-Platform Builds

#### Intel Chromebooks (x86_64)
```bash
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o M1dn1ght-amd64 main.go
```

#### ARM64 Chromebooks
```bash
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o M1dn1ght-arm64 main.go
```

#### ARMv7 Chromebooks
```bash
CGO_ENABLED=0 GOOS=linux GOARCH=arm go build -o M1dn1ght-arm main.go
```

## Determining Your Chromebook's Architecture

Open Terminal on your Chromebook and run:

```bash
uname -m
```

Output meanings:
- `x86_64` → Use amd64 binary
- `aarch64` → Use arm64 binary
- `armv7l` → Use arm binary

## Optimized Release Build

For a smaller binary with optimizations:

```bash
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o M1dn1ght main.go
```

Flags explanation:
- `-s` : Omit symbol table
- `-w` : Omit debugging information
- Reduces binary size by ~30-50%

## Testing the Build

After building, test that it runs:

```bash
./M1dn1ght
```

You should see the M1dn1ght menu.

## Troubleshooting

### "Command not found: go"
- Go is not installed. Download from https://go.dev/dl/

### "permission denied"
```bash
chmod +x M1dn1ght
```

### Cross-compilation not working
- Ensure `CGO_ENABLED=0` is set
- Check Go version with `go version`

## Building in Continuous Integration

See `.github/workflows/` for CI/CD build examples.