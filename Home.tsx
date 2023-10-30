import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { HomeScreenProps } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home: React.FC<HomeScreenProps> = (props) => {
  const API_URL = "http://192.168.1.116:3000";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const validateEmail = (email: string) => {
    const regex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    // regex for password validation must be more than 6 chars
    const regex = new RegExp(/^.{6,}$/);
    return regex.test(password);
  };

  // if logged in, move to tasks page
  React.useEffect(() => {
    AsyncStorage.getItem("userId").then((userId) => {
      if (userId) {
        props.navigation.navigate("Tasks");
      }
    });
  }, []);

  const handleLogin = async () => {
    // handle login using the api
    try {
      await fetch(API_URL + "/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }).then((response) => {
        if (response.status === 200) {
          // get the userId from the response
          response.json().then(async (data) => {
            AsyncStorage.setItem("userId", data.id);
            // code to move to other page
            props.navigation.navigate("Tasks");
          });
        } else {
          console.log(response.status);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Welcome to Todoey</Text>
      <Text style={styles.descriptionText}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex
        necessitatibus nihil, maxime dolorem nemo similique tempore, sed, dicta
        totam ut placeat! Ipsum necessitatibus corporis quod veritatis, culpa
        quam quasi cumque!
      </Text>
      <View style={{ flexDirection: "column" }}>
        <TextInput
          style={
            isEmailValid ? styles.textInputStyle : styles.textInputStyleError
          }
          placeholder="Enter your email"
          placeholderTextColor="#000"
          value={email}
          inputMode="email"
          id="emailTextInput"
          onChangeText={(text) => setEmail(text)}
          onBlur={() => {
            setIsEmailValid(validateEmail(email));
          }}
        ></TextInput>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={
            isPasswordValid ? styles.textInputStyle : styles.textInputStyleError
          }
          placeholder="Enter your password"
          placeholderTextColor="#000"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onBlur={() => {
            setIsPasswordValid(validatePassword(password));
          }}
        ></TextInput>
      </View>
      <TouchableOpacity
        onPress={handleLogin}
        style={styles.button}
        disabled={!isPasswordValid || !isEmailValid}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ color: "#000", paddingTop: 20 }}>
          Don't have an account?{" "}
          <Pressable
            onPress={() => {
              console.log("Pressed");
              // code to move to other page
              props.navigation.navigate("Register");
            }}
          >
            <Text style={{ color: "blue", paddingTop: 20 }}>Sign Up</Text>
          </Pressable>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 20,

    justifyContent: "center",
  },
  titleText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#000",
  },
  descriptionText: {
    fontSize: 20,
    fontWeight: "normal",
    color: "#000",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "black",
    width: 100,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  textInputStyle: {
    borderWidth: 1,
    borderRadius: 50,
    height: 50,
    width: 250,
    borderColor: "#000",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  textInputStyleError: {
    borderWidth: 1,
    borderRadius: 50,
    height: 50,
    width: 250,
    borderColor: "red",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
});

export default Home;
