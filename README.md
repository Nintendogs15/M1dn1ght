# M1dn1ght

A standalone Go-based application for managing ChromeOS systems. M1dn1ght allows you to uninstall Chrome extensions and force unenroll enterprise-managed Chromebooks from your organization's management console.

## Features

✨ **Chrome Extension Management**
- List all installed Chrome extensions
- Uninstall individual extensions
- Remove multiple extensions at once
- Real-time extension status checking

🔐 **Enterprise Unenrollment**
- Force unenroll Chromebooks from enterprise management
- Bypass MDM (Mobile Device Management) restrictions
- Complete device reset to consumer mode
- Automatic cleanup of managed policies

⚡ **Lightweight & Standalone**
- Single executable binary - no dependencies
- Works directly on ChromeOS without additional installations
- Runs in ChromeOS Linux container
- Fast and efficient performance

## Requirements

- ChromeOS device (Version 80+)
- Linux container enabled on your Chromebook
- Administrator/Owner account access

## Installation

### Option 1: Download Pre-built Binary
1. Go to the [Releases](https://github.com/Nintendogs15/M1dn1ght/releases) page
2. Download the latest `M1dn1ght` binary for your ChromeOS architecture
3. Make it executable: `chmod +x M1dn1ght`
4. Run: `./M1dn1ght`

### Option 2: Build from Source

**Requirements:**
- Go 1.21 or higher

**Steps:**
```bash
git clone https://github.com/Nintendogs15/M1dn1ght.git
cd M1dn1ght
go build -o M1dn1ght main.go
chmod +x M1dn1ght
./M1dn1ght
```

## Usage

### Running the Application

```bash
./M1dn1ght
```

The application will present an interactive menu:

```
╔════════════════════════════════════════╗
║         M1dn1ght - ChromeOS Manager   ║
╚════════════════════════════════════════╝

1. List Chrome Extensions
2. Uninstall Extension
3. Uninstall Multiple Extensions
4. Force Unenroll Chromebook
5. Exit

Select an option (1-5):
```

### Examples

**List all extensions:**
```
Select option 1
```

**Uninstall a single extension:**
```
Select option 2
Enter extension ID: bmnlcjabgnpnenekpadlanbbkooimhnj
```

**Force unenroll from enterprise:**
```
Select option 4
Confirm unenrollment (yes/no): yes
```

## How It Works

### Extension Management
- Queries the ChromeOS extension system API
- Reads extension metadata from system storage
- Removes extension files and configurations
- Clears extension-related policies

### Force Unenrollment Process
1. Stops ChromeOS device management daemon
2. Removes enterprise policies and configuration
3. Deletes device enrollment certificates
4. Clears MDM authentication tokens
5. Resets device to consumer/personal mode
6. Optionally performs factory reset

## ⚠️ Important Notes

### Before Using
- **This tool is designed for personal use only**
- Only run this on your own Chromebook or with explicit permission
- Unenrollment is irreversible without re-enrollment through your IT administrator
- Back up important data before unenrolling
- Some data may be lost during the unenrollment process

### Risks
- Enterprise software/policies will be removed
- VPN configurations may be deleted
- Certificate pinning will be reset
- DLP (Data Loss Prevention) restrictions will be lifted
- Admin-enforced security policies will be removed

### After Unenrollment
- Device will reboot automatically
- You'll have full control over the Chromebook
- Enterprise monitoring will cease
- You can install any extensions or applications

## Technical Details

### Architecture
- Written in Go for maximum performance and portability
- Uses ChromeOS system APIs for extension management
- Directly interfaces with ChromeOS policy and daemon systems
- Runs with elevated privileges to access system-level functions

### Supported Platforms
- Intel-based Chromebooks (x86_64)
- ARM-based Chromebooks (arm64, armv7)
- ChromeOS versions 80+

### System Calls
- Interacts with: `/etc/lsb-release`, `/opt/google/chrome/extensions/`
- Manages: ChromeOS Device Management Service
- Modifies: Enterprise policies, device certificates, enrollment state

## Troubleshooting

### "Permission Denied" Error
- Make sure file has execute permissions: `chmod +x M1dn1ght`
- Run with elevated privileges if needed

### Extension Not Found
- Ensure extension ID is correct
- Check extension is installed before attempting removal

### Unenrollment Failed
- Ensure you have owner account access
- Disable cloud sync before unenrolling
- Check that Linux container has proper permissions

### Device Won't Boot After Unenrollment
- Force shutdown and restart
- If still issues, perform manual factory reset using Recovery Mode (Ctrl+Alt+Shift+R)

## Building for Different Architectures

```bash
# For Intel Chromebooks
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o M1dn1ght-amd64 main.go

# For ARM Chromebooks
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o M1dn1ght-arm64 main.go

# For ARMv7 Chromebooks
CGO_ENABLED=0 GOOS=linux GOARCH=arm go build -o M1dn1ght-arm main.go
```

## Disclaimer

This tool is provided "as-is" for personal use. The developer assumes no responsibility for:
- Data loss or corruption
- Device malfunction
- Violation of enterprise policies or agreements
- Legal consequences of unenrolling managed devices

**Always ensure you have the right to unenroll any device before using this tool.**

## License

MIT License - See LICENSE file for details

## Support

For issues, feature requests, or questions:
- Open an [Issue](https://github.com/Nintendogs15/M1dn1ght/issues)
- Check existing issues for solutions
- Review the troubleshooting section above

## Disclaimer for Enterprise Users

If you are using a Chromebook provided by your organization:
- **Do not use this tool** if you don't have explicit permission
- Unauthorized unenrollment may violate your employment agreement
- Your IT department may have legitimate security and compliance reasons for enrollment
- Unenrolling could expose your organization to security risks

---

**M1dn1ght** - Take control of your Chromebook.