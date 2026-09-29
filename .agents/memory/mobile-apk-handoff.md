---
name: Android APK handoff
description: Current workspace supports Expo Go Android preview but has no local Android SDK/Gradle toolchain for producing an APK binary.
---

The native Expo app is the primary Android surface, but this workspace does not include an Android SDK or Gradle toolchain. Replit's Expo Launch flow is for iOS submission, so an APK needs a separate Android build pipeline.

**Why:** The user explicitly wants an APK, while the managed Expo workflow only provides a QR preview and the container lacks Android build tools.

**How to apply:** Keep the mobile app buildable and previewable here; do not claim an APK was produced unless a real Android build artifact exists.