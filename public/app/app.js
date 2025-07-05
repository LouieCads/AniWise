import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

const getApiUrl = () =>
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.254.169:3000";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to AniWise!</Text>
      <Text style={styles.subtitle}>
        Ang all-in-one na app para sa pagsasaka
      </Text>

      <Link href="/sign-up" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Simulan</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/sign-in" asChild>
        <TouchableOpacity>
          <Text style={styles.link}>May account ka na? Mag sign-in</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  button: { padding: 16, backgroundColor: "#87BE42", borderRadius: 10 },
  buttonText: { color: "#fff" },
  link: { marginTop: 20, color: "#4CAF50" },
});
