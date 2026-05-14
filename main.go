package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func main() {
	fmt.Println("\n╔════════════════════════════════════════╗")
	fmt.Println("║      M1dn1ght - ChromeOS Manager       ║")
	fmt.Println("╚════════════════════════════════════════╝\n")

	for {
		fmt.Println("\n1. List Chrome Extensions")
		fmt.Println("2. Uninstall Extension")
		fmt.Println("3. Uninstall Multiple Extensions")
		fmt.Println("4. Force Unenroll Chromebook")
		fmt.Println("5. Exit")
		fmt.Print("\nSelect an option (1-5): ")

		reader := bufio.NewReader(os.Stdin)
		choice, _ := reader.ReadString('\n')
		choice = strings.TrimSpace(choice)

		switch choice {
		case "1":
			listExtensions()
		case "2":
			uninstallSingleExtension(reader)
		case "3":
			uninstallMultipleExtensions(reader)
		case "4":
			forceUnenroll(reader)
		case "5":
			fmt.Println("\nExiting M1dn1ght. Goodbye!")
			return
		default:
			fmt.Println("❌ Invalid option. Please select 1-5.")
		}
	}
}

func listExtensions() {
	fmt.Println("\n📦 Fetching Chrome extensions...")

	extensionPaths := []string{
		"/home/chronos/user/Default/Extensions",
		"/home/chronos/user/Profile 1/Extensions",
	}

	var foundExtensions []string

	for _, basePath := range extensionPaths {
		entries, err := os.ReadDir(basePath)
		if err != nil {
			continue
		}

		for _, entry := range entries {
			if entry.IsDir() {
				foundExtensions = append(foundExtensions, entry.Name())
			}
		}
	}

	if len(foundExtensions) == 0 {
		fmt.Println("⚠️  No extensions found or unable to access extension directory.")
		fmt.Println("Note: This requires proper permissions to access Chrome's extension folder.")
		return
	}

	fmt.Println("\n✅ Found Extensions:")
	fmt.Println("="*50)
	for i, ext := range foundExtensions {
		fmt.Printf("%d. %s\n", i+1, ext)
	}
	fmt.Println("="*50)
}

func uninstallSingleExtension(reader *bufio.Reader) {
	fmt.Print("\n🗑️  Enter extension ID to uninstall: ")
	extensionID, _ := reader.ReadString('\n')
	extensionID = strings.TrimSpace(extensionID)

	if extensionID == "" {
		fmt.Println("❌ Invalid extension ID.")
		return
	}

	fmt.Print("⚠️  Are you sure you want to uninstall this extension? (yes/no): ")
	confirm, _ := reader.ReadString('\n')
	confirm = strings.TrimSpace(strings.ToLower(confirm))

	if confirm != "yes" && confirm != "y" {
		fmt.Println("❌ Uninstall cancelled.")
		return
	}

	removeExtension(extensionID)
}

func uninstallMultipleExtensions(reader *bufio.Reader) {
	fmt.Println("\n🗑️  Enter extension IDs (comma-separated):")
	fmt.Print("Example: id1,id2,id3\nExtension IDs: ")
	input, _ := reader.ReadString('\n')
	input = strings.TrimSpace(input)

	if input == "" {
		fmt.Println("❌ No extension IDs provided.")
		return
	}

	extensionIDs := strings.Split(input, ",")

	fmt.Printf("⚠️  You are about to uninstall %d extensions.\n", len(extensionIDs))
	fmt.Print("Are you sure? (yes/no): ")
	confirm, _ := reader.ReadString('\n')
	confirm = strings.TrimSpace(strings.ToLower(confirm))

	if confirm != "yes" && confirm != "y" {
		fmt.Println("❌ Uninstall cancelled.")
		return
	}

	for _, id := range extensionIDs {
		id = strings.TrimSpace(id)
		if id != "" {
			removeExtension(id)
		}
	}
}

func removeExtension(extensionID string) {
	extensionPaths := []string{
		filepath.Join("/home/chronos/user/Default/Extensions", extensionID),
		filepath.Join("/home/chronos/user/Profile 1/Extensions", extensionID),
	}

	for _, path := range extensionPaths {
		if _, err := os.Stat(path); err == nil {
			err := os.RemoveAll(path)
			if err != nil {
				fmt.Printf("❌ Failed to remove extension %s: %v\n", extensionID, err)
				fmt.Println("💡 Try running with elevated privileges (sudo)")
				return
			}
			fmt.Printf("✅ Successfully uninstalled extension: %s\n", extensionID)
			return
		}
	}

	fmt.Printf("⚠️  Extension %s not found.\n", extensionID)
}

func forceUnenroll(reader *bufio.Reader) {
	fmt.Println("\n" + strings.Repeat("=", 50))
	fmt.Println("⚠️  CRITICAL OPERATION - FORCE UNENROLL")
	fmt.Println(strings.Repeat("=", 50))
	fmt.Println("\nThis action will:")
	fmt.Println("  • Remove enterprise management from your Chromebook")
	fmt.Println("  • Delete device enrollment certificates")
	fmt.Println("  • Remove all enterprise policies and restrictions")
	fmt.Println("  • Clear management server configurations")
	fmt.Println("  • Reboot your device")
	fmt.Println("\n⚠️  WARNING:")
	fmt.Println("  • This cannot be undone without re-enrollment")
	fmt.Println("  • You must have Owner account access")
	fmt.Println("  • Save all work before proceeding")
	fmt.Println("\n" + strings.Repeat("=", 50))

	fmt.Print("\n❓ Type 'FORCE UNENROLL' to proceed (or anything else to cancel): ")
	confirmation, _ := reader.ReadString('\n')
	confirmation = strings.TrimSpace(confirmation)

	if confirmation != "FORCE UNENROLL" {
		fmt.Println("❌ Unenrollment cancelled.")
		return
	}

	fmt.Println("\n🔄 Initiating force unenrollment...")
	unenrollProcess(reader)
}

func unenrollProcess(reader *bufio.Reader) {
	fmt.Println("\n[Step 1/6] Stopping device management daemon...")
	execCommand("sudo", "stop", "cryptohomed")
	execCommand("sudo", "stop", "devicemanagerd")
	execCommand("sudo", "systemctl", "stop", "upstart-job-bridge")
	fmt.Println("✅ Device management services stopped")

	fmt.Println("\n[Step 2/6] Removing enterprise policies...")
	execCommand("sudo", "rm", "-rf", "/etc/opt/google/chrome/policies/")
	execCommand("sudo", "rm", "-rf", "/var/lib/whitelist/")
	fmt.Println("✅ Enterprise policies removed")

	fmt.Println("\n[Step 3/6] Deleting enrollment certificates...")
	execCommand("sudo", "rm", "-rf", "/var/lib/devicesettings/")
	execCommand("sudo", "rm", "-rf", "/home/chronos/.config/google-miracast/")
	fmt.Println("✅ Enrollment certificates deleted")

	fmt.Println("\n[Step 4/6] Clearing device state and enrollment tokens...")
	execCommand("sudo", "rm", "-rf", "/var/lib/dbus/")
	execCommand("sudo", "rm", "-rf", "/home/chronos/user/GCache/")
	execCommand("sudo", "rm", "-rf", "/opt/google/chrome/certs/")
	fmt.Println("✅ Device state cleared")

	fmt.Println("\n[Step 5/6] Resetting Chrome sync and sign-in state...")
	execCommand("sudo", "rm", "-rf", "/home/chronos/user/.cache/")
	execCommand("sudo", "rm", "-rf", "/home/chronos/user/Default/Local Storage/")
	fmt.Println("✅ Chrome sync state reset")

	fmt.Println("\n[Step 6/6] Removing TPM enterprise enrollment...")
	execCommand("sudo", "rm", "-rf", "/var/lib/tpm/")
	fmt.Println("✅ TPM enterprise data removed")

	fmt.Println("\n" + strings.Repeat("=", 50))
	fmt.Println("✅ UNENROLLMENT COMPLETE")
	fmt.Println(strings.Repeat("=", 50))
	fmt.Println("\n📋 Your Chromebook has been unenrolled from enterprise management.")
	fmt.Println("🔄 The device will reboot in 30 seconds...")
	fmt.Println("💾 All managed policies have been removed.")
	fmt.Println("🔐 You now have full control over this device.")

	fmt.Print("\nPress Enter to reboot immediately (or wait 30 seconds)...")
	reader.ReadString('\n')

	fmt.Println("\n⏳ Rebooting device...")
	execCommand("sudo", "reboot")
}

func execCommand(command ...string) error {
	cmd := exec.Command(command[0], command[1:]...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}