// -------------------------*********commands*********-----------------------------------------
// npm install
// npm install -g expo-cli
// npx expo install react-dom react-native-web
// npx expo start
// ------------------------------------------------------------------------
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// --------------------------------------------------------------------------------------------------------------------------------------------------------


// 
import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, Image, StyleSheet, Platform, Alert } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

// Dummy in-memory user store
const users = [];

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

/* -------------------------- Screens -------------------------- */

function HomeScreen({ navigation }) {
return ( <View style={styles.center}> <Text style={styles.title}>Welcome to the App</Text>
<Button title="Go to Login" onPress={() => navigation.navigate("ProfileStack", { screen: "Login" })} /> </View>
);
}

function LoginScreen({ navigation }) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errors, setErrors] = useState({});

const validate = () => {
const e = {};
if (!email.includes("@") || !email.includes(".com")) e.email = "Email must contain @ and .com";
if ((password || "").length < 6) e.password = "Password must be at least 6 characters";
setErrors(e);
return Object.keys(e).length === 0;
};

const onSubmit = () => {
if (!validate()) return;

const user = users.find(u => u.email === email && u.password === password);
if (user) {
  Alert.alert("Login Successful!");
  navigation.navigate("Profile", { email });
} else {
  Alert.alert("Invalid credentials!");
}

};

return ( <View style={styles.form}> <Text style={styles.label}>Email</Text>
<TextInput
placeholder="[user@example.com](mailto:user@example.com)"
autoCapitalize="none"
keyboardType="email-address"
value={email}
onChangeText={(t) => { setEmail(t); setErrors(p => ({ ...p, email: undefined })); }}
style={styles.input}
/>
{errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

  <Text style={styles.label}>Password</Text>
  <TextInput
    placeholder="password"
    secureTextEntry
    value={password}
    onChangeText={(t) => { setPassword(t); setErrors(p => ({ ...p, password: undefined })); }}
    style={styles.input}
  />
  {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

  <View style={{ marginTop: 12 }}>
    <Button title="Login" onPress={onSubmit} />
  </View>

  <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
    <Text style={styles.link}>Go to Signup</Text>
  </TouchableOpacity>
</View>

);
}

function SignupScreen({ navigation }) {
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errors, setErrors] = useState({});

const validate = () => {
const e = {};
if (!fullName.trim()) e.fullName = "Full name is required";
if (!email.includes("@") || !email.includes(".com")) e.email = "Email must contain @ and .com";
if ((password || "").length < 6) e.password = "Password must be at least 6 characters";
setErrors(e);
return Object.keys(e).length === 0;
};

const onSubmit = () => {
if (!validate()) return;

if (users.find(u => u.email === email)) {
  Alert.alert("User already exists!");
  return;
}
users.push({ fullName, email, password });
Alert.alert("Signup Successful!");
navigation.navigate("Login");


};

return ( <View style={styles.form}> <Text style={styles.label}>Full Name</Text>
<TextInput style={styles.input} value={fullName} onChangeText={t => { setFullName(t); setErrors(p => ({ ...p, fullName: undefined })); }} />
{errors.fullName ? <Text style={styles.error}>{errors.fullName}</Text> : null}

  <Text style={styles.label}>Email</Text>
  <TextInput autoCapitalize="none" keyboardType="email-address" style={styles.input} value={email} onChangeText={t => { setEmail(t); setErrors(p => ({ ...p, email: undefined })); }} />
  {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

  <Text style={styles.label}>Password</Text>
  <TextInput secureTextEntry style={styles.input} value={password} onChangeText={t => { setPassword(t); setErrors(p => ({ ...p, password: undefined })); }} />
  {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

  <View style={{ marginTop: 12 }}>
    <Button title="Signup" onPress={onSubmit} />
  </View>
</View>


);
}

function ProfileScreen({ route }) {
const email = route?.params?.email || "No email provided";
const [imageUri, setImageUri] = useState(null);

useEffect(() => {
(async () => {
if (Platform.OS !== "web") {
const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
if (status !== "granted") console.warn("Permission to access media library is required!");
}
})();
}, []);

const pickImage = async () => {
const result = await ImagePicker.launchImageLibraryAsync({
mediaTypes: ImagePicker.MediaTypeOptions.Images,
allowsEditing: true,
aspect: [1, 1],
quality: 0.7,
});
if (!result.canceled) {
const uri = result.uri ?? result.assets?.[0]?.uri;
if (uri) setImageUri(uri);
}
};

return ( <View style={styles.center}> <Text style={styles.title}>Profile</Text> <Text>Email: {email}</Text>

  <View style={{ alignItems: "center", marginVertical: 12 }}>
    {imageUri ? <Image source={{ uri: imageUri }} style={{ width: 120, height: 120, borderRadius: 60 }} /> :
      <View style={styles.avatarPlaceholder}><Ionicons name="person" size={48} /></View>}
    <Button title="Change Avatar" onPress={pickImage} />
  </View>
</View>


);
}

function SettingsScreen() {
return ( <View style={styles.center}> <Text style={styles.title}>Settings Page</Text> </View>
);
}

/* -------------------------- Navigation -------------------------- */

function ProfileStackNavigator() {
return (
<Stack.Navigator initialRouteName="Login">
<Stack.Screen name="Profile" component={ProfileScreen} />
<Stack.Screen name="Login" component={LoginScreen} />
<Stack.Screen name="Signup" component={SignupScreen} />
</Stack.Navigator>
);
}

function BottomTabsNavigator() {
return (
<Tab.Navigator screenOptions={({ route }) => ({
headerShown: false,
tabBarIcon: ({ size }) => <Ionicons name={route.name === "ProfileTab" ? "person-outline" : "home-outline"} size={size} />
})}>
<Tab.Screen name="Home" component={HomeScreen} />
<Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: "Profile" }} />
</Tab.Navigator>
);
}

function CustomDrawerContent(props) {
const { navigation } = props;
return (
<DrawerContentScrollView {...props}>
<DrawerItem label="Dashboard" onPress={() => navigation.navigate("Dashboard")} />
<DrawerItem label="Settings" onPress={() => navigation.navigate("Settings")} />
<DrawerItem label="Logout" onPress={() => navigation.reset({ index: 0, routes: [{ name: "Dashboard", params: { screen: "Home" } }] })} /> </DrawerContentScrollView>
);
}

/* -------------------------- App -------------------------- */

export default function App() {
return ( <NavigationContainer theme={DefaultTheme}>
<Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
<Drawer.Screen name="Dashboard" component={BottomTabsNavigator} options={{ headerShown: false }} />
<Drawer.Screen name="Settings" component={SettingsScreen} />
</Drawer.Navigator> </NavigationContainer>
);
}

/* -------------------------- Styles -------------------------- */
const styles = StyleSheet.create({
center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
title: { fontSize: 20, fontWeight: "600" },
form: { flex: 1, padding: 16, backgroundColor: "#fff" },
label: { marginTop: 8, marginBottom: 6 },
input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 6 },
error: { color: "red", marginTop: 4 },
link: { color: "blue", marginTop: 12, textAlign: "center" },
avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, justifyContent: "center", alignItems: "center", backgroundColor: "#eee" },
});
